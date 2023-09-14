import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResult } from 'src/app/core/dto/http-result.dto';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { PersonalInformationDTO } from 'src/app/core/dto/personal-information-dto';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { AircraftDTO } from './dto/aircraft.dto';
import { DataRequest } from './dto/dataRequest.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends HttpService {
  logger: LoggerService;
  private personalInformation: PersonalInformationDTO;

  constructor(
    httpClient: HttpClient,
    private readonly userSoeService: UserSoeService
  ) {
    super(httpClient);
    this.logger = new LoggerService(DashboardService.name);
    this.personalInformation =
      this.userSoeService.getPersonalInformationFromCache()!;
  }

  getAircraftDashboardByIndex(
    aircraftRequest?: DataRequest
  ): Observable<HttpResult<PaginationResultDTO<AircraftDTO>>> {
    return this.get(
      `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/api/dashboard/aircraft`,
      aircraftRequest
    );
  }

  getAircraftDetailByIndex(
    aircraftRequest?: DataRequest
  ): Observable<HttpResult<PaginationResultDTO<AircraftDTO>>> {
    return this.get(
      `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/api/dashboard/aircraft`,
      aircraftRequest
    );
  }

  getCardData(
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<AircraftDTO[]>> {
    const params = new HttpParams()
      .set('page', paginationData.page)
      .set('size', paginationData.size);

    return this.http.get<HttpResult<AircraftDTO[]>>(
      `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ims`,
      { params: params }
    );
  }
}
