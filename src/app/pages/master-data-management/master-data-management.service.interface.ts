import { Observable } from 'rxjs';
import { StatusDTO, StoreDTO, UnitDTO } from './dto/master-data-manaement.dto';

export interface MasterDataManagementServiceInterface {
  getAllStatus(): Observable<StatusDTO[]>;
  getAllUnit(): Observable<UnitDTO[]>;
  getAllStore(): Observable<StoreDTO[]>;

}
