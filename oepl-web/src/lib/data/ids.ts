/** 새 레코드 — DB insert 시 자동 번호 부여 */
export const NEW_ID = 0;

export function isNewId(id: number): boolean {
  return id === NEW_ID;
}

/** 시드 데이터용 순차 ID */
export function createSeedIdFactory(start = 1) {
  let n = start - 1;
  return () => ++n;
}

/** localStorage용 — 기존 목록에서 다음 번호 */
export function nextLocalId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}
