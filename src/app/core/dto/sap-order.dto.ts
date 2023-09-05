export interface SAPOrderDTO {
  orderId: string;
  orderType: string;
  plant: string;
  functionLoc: string;
  equipment: string;
  serialNumber: string;
  sortField: string;
  wbsElem: string;
  revision: string;
  revisionText: string;
  sysStatus: string;
  userStatus: string;
  shortText: string;
  notificationNumber: string;
  materialExternal: string;
  customerCode: string;
  customer: string;
  longText?: string;
}
