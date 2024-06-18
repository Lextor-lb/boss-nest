export interface SearchOption {
  page: number;
  limit: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
