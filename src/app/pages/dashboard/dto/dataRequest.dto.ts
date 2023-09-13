export interface DataRequest {
  page?: number;
  perPage?: number;
  orderColumn?: string;
  orderBy?: 'asc' | 'ASC' | 'desc' | 'DESC';
  searchTerm?: string;
  personalNumber?: string;

}
