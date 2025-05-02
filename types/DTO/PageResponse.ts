export interface PageResponse<T> {
  total: number;
  page: number;
  pages: number;
  items: T;
}
