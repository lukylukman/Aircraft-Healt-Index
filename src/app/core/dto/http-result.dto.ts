export interface HttpResult<T> {
  message: string;
  data: T;
}

export interface HttpResponseDTO<T> {
  message: string;
  headers: any;
  body: T;
}
