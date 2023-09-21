export interface HttpResult<T> {
  message: string;
  data: T;
}

export interface HttpResponseDTO<T> {
  message: string;
  headers: any;
  body: T;
}

export interface HttpResultCustome<T> {
  message: string;
  data: T;
  meta: {
    indexName: string;
    status: string;
  };
  time: string;
}
