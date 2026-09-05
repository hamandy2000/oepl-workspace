/** 스토리지 버킷 이름과 업로드 용량 제한 상수 */

export const NEWS_PHOTOS_BUCKET = "news-photos";
export const GALLERY_PHOTOS_BUCKET = "gallery-photos";
export const NEWS_FILES_BUCKET = "news-files";
export const MEMBER_PHOTOS_BUCKET = "member-photos";

/** Unified image upload limit (member, gallery, news photos) */
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_MAX_MB = 5;

/** News attachment upload limit (PDF, PPT, etc.) */
export const ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
export const ATTACHMENT_MAX_MB = 25;
