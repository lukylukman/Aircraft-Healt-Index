import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { StatusDTO, StoreDTO, StoreInsertDTO, UnitDTO } from './dto/master-data-manaement.dto';
import { MasterDataManagementServiceInterface } from './master-data-management.service.interface';

@Injectable()
export class MasterDataManagementService
  extends HttpService
  implements MasterDataManagementServiceInterface {
  logger: LoggerService;

  private url: string = environment.apiUrl;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.logger = new LoggerService(MasterDataManagementService.name);
  }

  getAllStatus(): Observable<StatusDTO[]> {
    return this.get(this.url + '/v1/status');
  }

  getAllStore(): Observable<StoreDTO[]> {
    return this.get(this.url + '/v1/store');
  }

  getAllUnit(): Observable<UnitDTO[]> {
    return this.get(this.url + '/v1/store-unit');
  }

  insertStore(store: StoreInsertDTO): Observable<StoreDTO> {
    return this.post(this.url + '/v1/store', store);
  }

  updateStore(store: StoreInsertDTO): Observable<StoreDTO> {
    return this.put(this.url + '/v1/store', store.idStore, store);
  }

  deleteStore(store: StoreDTO): Observable<StoreDTO> {
    return this.delete(this.url + '/v1/store', store.idStore);
  }
}
