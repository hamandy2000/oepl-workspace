"use client";

/** 사이트 콘텐츠 전역 상태 Context — 조회·저장·삭제 */

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
import { formatNewsPostDate, normalizePublication } from "@/lib/content/display";
import { emptyContent } from "@/lib/data/seed";
import {
  applyMemberRecord,
  removeMemberFromGroups,
} from "@/lib/data/mappers";
import {
  fetchSiteContent,
  persistLocalContent,
  persistProfessorLocal,
} from "@/lib/data/repository";
import { adminContentMutate } from "@/lib/admin/client-api";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface ContentContextValue {
  content: SiteContent;
  ready: boolean;
  saving: boolean;
  upsertNews: (item: NewsItem) => Promise<NewsItem>;
  deleteNews: (id: number) => Promise<void>;
  upsertPublication: (item: Publication) => Promise<void>;
  deletePublication: (id: number) => Promise<void>;
  upsertGallery: (item: GalleryItem) => Promise<GalleryItem>;
  deleteGallery: (id: number) => Promise<void>;
  upsertPatent: (item: Patent) => Promise<void>;
  deletePatent: (id: number) => Promise<void>;
  updateProfessor: (professor: Professor) => void;
  upsertMember: (item: MemberRecord) => Promise<MemberRecord>;
  deleteMember: (id: number) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(emptyContent);
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
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const useAdminApi = isSupabaseConfigured();

  const updateProfessor = useCallback((professor: Professor) => {
    setContent((prev) => {
      const next = { ...prev, members: { ...prev.members, professor } };
      persistProfessorLocal(professor);
      if (!useAdminApi) {
        persistLocalContent(next);
      }
      return next;
    });
  }, []);

  const upsertNews = useCallback(async (item: NewsItem): Promise<NewsItem> => {
    const draftItem = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draftItem.id);

    if (useAdminApi) {
      setSaving(true);
      try {
        const saved = await adminContentMutate<NewsItem>("upsertNews", draftItem);
        const full: NewsItem = {
          ...saved,
          date: saved.date?.trim() || draftItem.date?.trim() || formatNewsPostDate(),
          createdAt: saved.createdAt ?? draftItem.createdAt,
          photos: draftItem.photos ?? [],
          files: draftItem.files ?? [],
        };
        setContent((p) => ({
          ...p,
          news: p.news.some((n) => n.id === full.id)
            ? p.news.map((n) => (n.id === full.id ? full : n))
            : [full, ...p.news.filter((n) => n.id !== NEW_ID)],
        }));
        return full;
      } catch (err) {
        console.error("[ContentContext] persist failed", err);
        alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
        throw err;
      } finally {
        setSaving(false);
      }
    }

    let saved!: NewsItem;
    setContent((prev) => {
      const exists = !isNew && prev.news.some((n) => n.id === draftItem.id);
      saved = isNew
        ? {
            ...draftItem,
            id: nextLocalId(prev.news),
            date: draftItem.date.trim() || formatNewsPostDate(),
            createdAt: draftItem.createdAt ?? new Date().toISOString(),
          }
        : draftItem;
      const news = exists
        ? prev.news.map((n) => (n.id === saved.id ? saved : n))
        : [saved, ...prev.news.filter((n) => n.id !== NEW_ID)];
      const next = { ...prev, news };
      persistLocalContent(next);
      return next;
    });
    return saved;
  }, []);

  const deleteNews = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, news: prev.news.filter((n) => n.id !== id) };
      if (useAdminApi) {
        void runPersist(async () => {
          await adminContentMutate("deleteNews", id);
        });
      } else {
        persistLocalContent(next);
      }
      return next;
    });
  }, [runPersist]);

  const upsertPublication = useCallback(async (item: Publication) => {
    const draft = normalizePublication({ ...item, id: item.id || NEW_ID });
    const isNew = isNewId(draft.id);

    setContent((prev) => {
      const exists = !isNew && prev.publications.some((p) => p.id === draft.id);
      const publications = exists
        ? prev.publications.map((p) => (p.id === draft.id ? draft : p))
        : [draft, ...prev.publications];
      const next = { ...prev, publications };

      if (useAdminApi) {
        void runPersist(async () => {
          const saved = await adminContentMutate<Publication>("upsertPublication", draft);
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
      if (useAdminApi) void runPersist(async () => {
        await adminContentMutate("deletePublication", id);
      });
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const upsertGallery = useCallback(async (item: GalleryItem): Promise<GalleryItem> => {
    const draftItem = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draftItem.id);

    if (useAdminApi) {
      setSaving(true);
      try {
        const saved = await adminContentMutate<GalleryItem>("upsertGallery", draftItem);
        const full: GalleryItem = {
          ...saved,
          photoUrl: draftItem.photoUrl,
        };
        setContent((p) => ({
          ...p,
          gallery: p.gallery.some((g) => g.id === full.id)
            ? p.gallery.map((g) => (g.id === full.id ? full : g))
            : [full, ...p.gallery.filter((g) => g.id !== NEW_ID)],
        }));
        return full;
      } catch (err) {
        console.error("[ContentContext] persist failed", err);
        alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
        throw err;
      } finally {
        setSaving(false);
      }
    }

    let saved!: GalleryItem;
    setContent((prev) => {
      const exists = !isNew && prev.gallery.some((g) => g.id === draftItem.id);
      saved = isNew ? { ...draftItem, id: nextLocalId(prev.gallery) } : draftItem;
      const gallery = exists
        ? prev.gallery.map((g) => (g.id === saved.id ? saved : g))
        : [saved, ...prev.gallery.filter((g) => g.id !== NEW_ID)];
      const next = { ...prev, gallery };
      persistLocalContent(next);
      return next;
    });
    return saved;
  }, []);

  const deleteGallery = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, gallery: prev.gallery.filter((g) => g.id !== id) };
      if (useAdminApi) void runPersist(async () => {
        await adminContentMutate("deleteGallery", id);
      });
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

      if (useAdminApi) {
        void runPersist(async () => {
          const saved = await adminContentMutate<Patent>("upsertPatent", draft);
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
      if (useAdminApi) void runPersist(async () => {
        await adminContentMutate("deletePatent", id);
      });
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const upsertMember = useCallback(async (item: MemberRecord): Promise<MemberRecord> => {
    const draftItem = { ...item, id: item.id || NEW_ID };
    const isNew = isNewId(draftItem.id);

    if (useAdminApi) {
      setSaving(true);
      try {
        const saved = await adminContentMutate<MemberRecord>("upsertMember", draftItem);
        setContent((p) => ({
          ...p,
          members: applyMemberRecord(
            removeMemberFromGroups(p.members, isNew ? NEW_ID : saved.id),
            saved
          ),
        }));
        return saved;
      } catch (err) {
        console.error("[ContentContext] persist failed", err);
        alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
        throw err;
      } finally {
        setSaving(false);
      }
    }

    let saved!: MemberRecord;
    setContent((prev) => {
      const all = [
        ...prev.members.postdocs,
        ...prev.members.gradStudents,
        ...prev.members.phdAlumni,
        ...prev.members.msAlumni,
      ];
      saved = isNew
        ? { ...draftItem, id: nextLocalId(all), createdAt: new Date().toISOString() }
        : draftItem;
      const next = {
        ...prev,
        members: applyMemberRecord(removeMemberFromGroups(prev.members, draftItem.id), saved),
      };
      persistLocalContent(next);
      return next;
    });
    return saved;
  }, []);

  const deleteMember = useCallback(async (id: number) => {
    setContent((prev) => {
      const next = { ...prev, members: removeMemberFromGroups(prev.members, id) };
      if (useAdminApi) void runPersist(async () => {
        await adminContentMutate("deleteMember", id);
      });
      else persistLocalContent(next);
      return next;
    });
  }, [runPersist]);

  const value = useMemo(
    () => ({
      content,
      ready,
      saving,
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
