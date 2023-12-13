export interface ImsPaginationDTO {
  page: number;
  size: number;
  endDate?: string;
  customer?: string;
  aircraftTypeId?: string;
  // type_id?: number;
}
