export interface StoreDTO {
  idStore?: number;
  store: string;
  address: string;
  unit?: string;
}

export interface StoreInsertDTO {
  idStore?: number;
  store: string;
  address: string;
  unit: string[];
}

export interface StatusDTO {
  idStatus?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  status: string;
}

export interface UnitDTO {
  id?: number;
  unit: string;
  storeId?: number;
}
