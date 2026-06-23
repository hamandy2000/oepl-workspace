"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  GalleryItem,
  MemberRecord,
  NewsItem,
  Patent,
  Professor,
  Publication,
  SiteContent,
} from "@/types/content";
import { NEW_ID, isNewId, nextLocalId } from "@/lib/data/ids";
import { seedContent } from "@/lib/data/seed";
import {
  applyMemberRecord,
  removeMemberFromGroups,
} from "@/lib/data/mappers";
import {
  fetchSiteContent,
  persistGallery,
  persistLocalContent,
  persistMember,
  persistNews,
  persistPatent,
  persistProfessorLocal,
  persistPublication,
  removeGallery,
  removeMember,
  removeNews,
  removePatent,
  removePublication,
  seedDatabase,
} from "@/lib/data/repository";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface ContentContextValue {
  content: SiteContent;
  ready: boolean;
  saving: boolean;
  resetToSeed: () => Promise<void>;
  upsertNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  upsertPublication: (item: Publication) => Promise<void>;
  deletePublication: (id: number) => Promise<void>;
  upsertGallery: (item: GalleryItem) => Promise<void>;
  deleteGallery: (id: number) => Promise<void>;
  upsertPatent: (item: Patent) => Promise<void>;
  deletePatent: (id: number) => Promise<void>;
  updateProfessor: (professor: Professor) => void;
  upsertMember: (item: MemberRecord) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(seedContent);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteContent()
      .then(setContent)
      .finally(() => setReady(true));
  }, []);

  const runPersist = useCallback(async (fn: () => Promise<void>) => {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    try {
      await fn();
    } catch (err) {
      console.error("[ContentContext] persist failed", err);
      alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }, []);

  const resetToSeed = useCallback(async () => {
    const next = structuredClone(seedContent);
    setContent(next);
    setSaving(true);
    try {
      await seedDatabase(next);
      if (!isSupabaseConfigured()) persistLocalContent(next);
      else persistProfessorLocal(next.members.professor);
    } catch (err) {
      console.error("[ContentContext] seed failed", err);
      alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }, []);

  const updateProfessor = useCallback((professor: Professor) => {
    setContent((prev) => {
      const next = { ...prev, members: { ...prev.members, professor } };
      persistProfessorLocal(professor);
      if (!isSupabaseConfigured()) {
        persistLocalContent(next);
      }
      return next;
    });
  }, []);

  const upsertNews = useCallback(async (item: NewsItem) => {
    const draft = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      const exists = !isNew && prev.news.some((n) => n.id === draft.id);
      const news = exists
        ? prev.news.map((n) => (n.id === draft.id ? draft : n))
        : [draft, ...prev.news];
      const next = { ...prev, news };

      if (isSupabaseConfigured()) {
        void runPersist(async () => {
          const saved = await persistNews(draft);
          setContent((p) => ({
            ...p,
            news: isNew
              ? p.news.map((n) => (n.id === NEW_ID ? saved : n))
              : p.news.map((n) => (n.id === saved.id ? saved : n)),
          }));
        });
      } else {
        const saved = isNew ? { ...draft, id: nextLocalId(prev.news) } : draft;
        const local = {
          ...next,
          news: isNew
            ? next.news.map((n) => (n.id === NEW_ID ? saved : n))
            : next.news.map((n) => (n.id === saved.id ? saved : n)),
        };
        persistLocalContent(local);
        return local;
      }
      return next;
    });
  }, [runPersist]);

  const deleteNews = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, news: prev.news.filter((n) => n.id !== id) };
      if (isSupabaseConfigured()) {
        void runPersist(() => removeNews(id));
      } else {
        persistLocalContent(next);
      }
      return next;
    });
  }, [runPersist]);

  const upsertPublication = useCallback(async (item: Publication) => {
    const draft = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      const exists = !isNew && prev.publications.some((p) => p.id === draft.id);
      const publications = exists
        ? prev.publications.map((p) => (p.id === draft.id ? draft : p))
        : [draft, ...prev.publications];
      const next = { ...prev, publications };

      if (isSupabaseConfigured()) {
        void runPersist(async () => {
          const saved = await persistPublication(draft);
          setContent((p) => ({
            ...p,
            publications: isNew
              ? p.publications.map((x) => (x.id === NEW_ID ? saved : x))
              : p.publications.map((x) => (x.id === saved.id ? saved : x)),
          }));
        });
      } else {
        const saved = isNew ? { ...draft, id: nextLocalId(prev.publications) } : draft;
        const local = {
          ...next,
          publications: isNew
            ? next.publications.map((x) => (x.id === NEW_ID ? saved : x))
            : next.publications.map((x) => (x.id === saved.id ? saved : x)),
        };
        persistLocalContent(local);
        return local;
      }
      return next;
    });
  }, [runPersist]);

  const deletePublication = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, publications: prev.publications.filter((p) => p.id !== id) };
      if (isSupabaseConfigured()) void runPersist(() => removePublication(id));
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const upsertGallery = useCallback(async (item: GalleryItem) => {
    const draft = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      const exists = !isNew && prev.gallery.some((g) => g.id === draft.id);
      const gallery = exists
        ? prev.gallery.map((g) => (g.id === draft.id ? draft : g))
        : [draft, ...prev.gallery];
      const next = { ...prev, gallery };

      if (isSupabaseConfigured()) {
        void runPersist(async () => {
          const saved = await persistGallery(draft);
          setContent((p) => ({
            ...p,
            gallery: isNew
              ? p.gallery.map((g) => (g.id === NEW_ID ? saved : g))
              : p.gallery.map((g) => (g.id === saved.id ? saved : g)),
          }));
        });
      } else {
        const saved = isNew ? { ...draft, id: nextLocalId(prev.gallery) } : draft;
        const local = {
          ...next,
          gallery: isNew
            ? next.gallery.map((g) => (g.id === NEW_ID ? saved : g))
            : next.gallery.map((g) => (g.id === saved.id ? saved : g)),
        };
        persistLocalContent(local);
        return local;
      }
      return next;
    });
  }, [runPersist]);

  const deleteGallery = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, gallery: prev.gallery.filter((g) => g.id !== id) };
      if (isSupabaseConfigured()) void runPersist(() => removeGallery(id));
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const upsertPatent = useCallback(async (item: Patent) => {
    const draft = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      const exists = !isNew && prev.patents.some((p) => p.id === draft.id);
      const patents = exists
        ? prev.patents.map((p) => (p.id === draft.id ? draft : p))
        : [draft, ...prev.patents];
      const next = { ...prev, patents };

      if (isSupabaseConfigured()) {
        void runPersist(async () => {
          const saved = await persistPatent(draft);
          setContent((p) => ({
            ...p,
            patents: isNew
              ? p.patents.map((x) => (x.id === NEW_ID ? saved : x))
              : p.patents.map((x) => (x.id === saved.id ? saved : x)),
          }));
        });
      } else {
        const saved = isNew ? { ...draft, id: nextLocalId(prev.patents) } : draft;
        const local = {
          ...next,
          patents: isNew
            ? next.patents.map((x) => (x.id === NEW_ID ? saved : x))
            : next.patents.map((x) => (x.id === saved.id ? saved : x)),
        };
        persistLocalContent(local);
        return local;
      }
      return next;
    });
  }, [runPersist]);

  const deletePatent = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, patents: prev.patents.filter((p) => p.id !== id) };
      if (isSupabaseConfigured()) void runPersist(() => removePatent(id));
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const upsertMember = useCallback(async (item: MemberRecord) => {
    const draft = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      let next = { ...prev, members: applyMemberRecord(prev.members, draft) };

      if (isSupabaseConfigured()) {
        void runPersist(async () => {
          const saved = await persistMember(draft);
          setContent((p) => ({
            ...p,
            members: applyMemberRecord(
              removeMemberFromGroups(p.members, isNew ? NEW_ID : saved.id),
              saved
            ),
          }));
        });
      } else {
        const all = [
          ...prev.members.postdocs,
          ...prev.members.gradStudents,
          ...prev.members.phdAlumni,
          ...prev.members.msAlumni,
        ];
        const saved = isNew ? { ...draft, id: nextLocalId(all) } : draft;
        next = { ...prev, members: applyMemberRecord(removeMemberFromGroups(prev.members, draft.id), saved) };
        persistLocalContent(next);
      }
      return next;
    });
  }, [runPersist]);

  const deleteMember = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, members: removeMemberFromGroups(prev.members, id) };
      if (isSupabaseConfigured()) void runPersist(() => removeMember(id));
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const value = useMemo(
    () => ({
      content,
      ready,
      saving,
      resetToSeed,
      upsertNews,
      deleteNews,
      upsertPublication,
      deletePublication,
      upsertGallery,
      deleteGallery,
      upsertPatent,
      deletePatent,
      updateProfessor,
      upsertMember,
      deleteMember,
    }),
    [
      content,
      ready,
      saving,
      resetToSeed,
      upsertNews,
      deleteNews,
      upsertPublication,
      deletePublication,
      upsertGallery,
      deleteGallery,
      upsertPatent,
      deletePatent,
      updateProfessor,
      upsertMember,
      deleteMember,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
