export interface HttpResult<T> {
  message: string;
  data: T;
}

export interface PaginationResult<T> extends HttpResult<T> {
  meta: {
    currentPage: number;
    nextPage: string;
    prevPage: string;
  };
}
