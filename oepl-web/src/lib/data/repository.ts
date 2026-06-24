import type {

  GalleryItem,

  MemberRecord,

  NewsItem,

  Patent,

  Professor,

  Publication,

  ResearcherMember,

  SiteContent,

  AlumniMember,

} from "@/types/content";

import { isNewId } from "@/lib/data/ids";

import { loadContent, loadProfessor, saveContent, saveProfessorLocal, seedContent } from "@/lib/data/seed";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

import { buildMemberGroupsFromRows } from "@/lib/content/members";

import {

  galleryFromRow,

  galleryToRow,

  memberRecordFromRow,

  memberRecordToRow,

  newsFromRow,

  newsToRow,

  patentFromRow,

  patentToRow,

  publicationFromRow,

  publicationToRow,

} from "@/lib/data/mappers";

import {

  attachNewsMedia,

  removeNewsMedia,

} from "@/lib/data/media-sync";

import { removeGalleryPhoto } from "@/lib/supabase/content-media";



function supabase() {

  return createClient();

}



async function upsertEntity<T extends { id: number }>(
  table: string,
  item: T,
  toRow: (item: T, updating: boolean) => Record<string, unknown>,
  fromRow: (row: Record<string, unknown>) => T
): Promise<T> {
  if (isNewId(item.id)) {
    const { data, error } = await supabase().from(table).insert(toRow(item, false)).select().single();
    if (error) throw new Error(error.message);
    return fromRow(data as Record<string, unknown>);
  }
  const { data, error } = await supabase().from(table).upsert(toRow(item, true)).select().single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}



export async function fetchSiteContent(): Promise<SiteContent> {

  const professor = loadProfessor();



  if (!isSupabaseConfigured()) {

    const local = loadContent();

    return { ...local, members: { ...local.members, professor } };

  }



  try {

    const sb = supabase();



    const [newsRes, publicationsRes, galleryRes, patentsRes, membersRes, newsPhotosRes, newsFilesRes] = await Promise.all([

      sb.from("news").select("*").order("created_at", { ascending: false }),

      sb.from("publications").select("*").order("published_at", { ascending: false }),

      sb.from("gallery").select("*").order("created_at", { ascending: false }),

      sb.from("patents").select("*").order("created_at", { ascending: false }),

      sb.from("members").select("*").order("created_at", { ascending: true }),

      sb.from("news_photos").select("*").order("sort_order"),

      sb.from("news_file").select("*").order("sort_order"),

    ]);



    const errors = [

      newsRes.error,

      publicationsRes.error,

      galleryRes.error,

      patentsRes.error,

      membersRes.error,

    ].filter(Boolean);



    if (errors.length > 0) {

      console.error("[fetchSiteContent]", errors.map((e) => e!.message).join("; "));

      return { ...seedContent, members: { ...seedContent.members, professor } };

    }



    const memberGroups = buildMemberGroupsFromRows(membersRes.data ?? []);



    const hasAnyData =

      (newsRes.data?.length ?? 0) > 0 ||

      (publicationsRes.data?.length ?? 0) > 0 ||

      (galleryRes.data?.length ?? 0) > 0 ||

      (patentsRes.data?.length ?? 0) > 0 ||

      (membersRes.data?.length ?? 0) > 0;



    if (!hasAnyData) {

      return { ...seedContent, members: { ...seedContent.members, professor } };

    }



    return {

      news: attachNewsMedia(

        (newsRes.data ?? []).map(newsFromRow),

        newsPhotosRes.error ? [] : (newsPhotosRes.data ?? []),

        newsFilesRes.error ? [] : (newsFilesRes.data ?? [])

      ),

      publications: (publicationsRes.data ?? []).map(publicationFromRow),

      gallery: (galleryRes.data ?? []).map(galleryFromRow),

      patents: (patentsRes.data ?? []).map(patentFromRow),

      members: {

        professor,

        postdocs: memberGroups.postdocs as ResearcherMember[],

        gradStudents: memberGroups.gradStudents as ResearcherMember[],

        phdAlumni: memberGroups.phdAlumni as AlumniMember[],

        msAlumni: memberGroups.msAlumni as AlumniMember[],

      },

    };

  } catch (err) {

    console.error("[fetchSiteContent]", err);

    return { ...seedContent, members: { ...seedContent.members, professor } };

  }

}



export function persistProfessorLocal(professor: Professor): void {

  saveProfessorLocal(professor);

}



export async function persistNews(item: NewsItem): Promise<NewsItem> {

  if (!isSupabaseConfigured()) return item;

  return upsertEntity("news", item, newsToRow, newsFromRow);

}



export async function removeNews(id: number): Promise<void> {

  if (!isSupabaseConfigured()) return;

  await removeNewsMedia(id);

  const { error } = await supabase().from("news").delete().eq("id", id);

  if (error) throw new Error(error.message);

}



export async function persistPublication(item: Publication): Promise<Publication> {

  if (!isSupabaseConfigured()) return item;

  return upsertEntity("publications", item, publicationToRow, publicationFromRow);

}



export async function removePublication(id: number): Promise<void> {

  if (!isSupabaseConfigured()) return;

  const { error } = await supabase().from("publications").delete().eq("id", id);

  if (error) throw new Error(error.message);

}



export async function persistGallery(item: GalleryItem): Promise<GalleryItem> {

  if (!isSupabaseConfigured()) return item;

  return upsertEntity("gallery", item, galleryToRow, galleryFromRow);

}



export async function removeGallery(id: number): Promise<void> {

  if (!isSupabaseConfigured()) return;

  await removeGalleryPhoto(id);

  const { error } = await supabase().from("gallery").delete().eq("id", id);

  if (error) throw new Error(error.message);

}



export async function persistPatent(item: Patent): Promise<Patent> {

  if (!isSupabaseConfigured()) return item;

  return upsertEntity("patents", item, patentToRow, patentFromRow);

}



export async function removePatent(id: number): Promise<void> {

  if (!isSupabaseConfigured()) return;

  const { error } = await supabase().from("patents").delete().eq("id", id);

  if (error) throw new Error(error.message);

}



export async function persistMember(item: MemberRecord): Promise<MemberRecord> {

  if (!isSupabaseConfigured()) return item;

  return upsertEntity("members", item, memberRecordToRow, memberRecordFromRow);

}



export async function removeMember(id: number): Promise<void> {

  if (!isSupabaseConfigured()) return;

  const { error } = await supabase().from("members").delete().eq("id", id);

  if (error) throw new Error(error.message);

}



export function persistLocalContent(content: SiteContent): void {

  saveContent(content);

  saveProfessorLocal(content.members.professor);

}


