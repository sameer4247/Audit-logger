export interface PaginationCursor {
  id: string;
}

export interface PaginatedResult {
  items: any;
  nextCursor?: string;
  hasMore: boolean;
}

export function decodeCursor(cursor?: string): PaginationCursor | null {
  if (!cursor) return null;
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch {
    return null;
  }
}

export function encodeCursor(cursor: PaginationCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

export function createPaginatedResult(
  items: any,
  limit: number,
  idKey: string
) :PaginatedResult {
  const hasMore = items.length > limit;
  const result = items.slice(0, limit);
  
  const nextCursor = hasMore && result.length > 0
    ? encodeCursor({ id: String(result[result.length - 1][idKey]) })
    : undefined;
  return {
    items: result,
    nextCursor,
    hasMore
  };
}
