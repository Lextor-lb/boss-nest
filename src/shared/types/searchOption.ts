export type SearchOption = {
  page: number;
  limit: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
};