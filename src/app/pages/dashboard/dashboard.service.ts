import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResult } from 'src/app/core/dto/http-result.dto';
import { PersonalInformationDTO } from 'src/app/core/dto/personal-information-dto';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { AhiSummaryScoreDTO } from './dto/ahi-summary-score.dto';
import { AircraftDetailHilDTO } from './dto/aircraft-detail-hil.dto';
import { AircraftScoreDTO } from './dto/aircraft-score.dto';
import { AircraftTypeDTO } from './dto/aircraft-type.dto';
import { AircraftDTO } from './dto/aircraft.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';
import { APURecordDTO } from './dto/showMoreHil.dto';

export interface ElasticRecordResponse {
  record: {
    apuRecord: APURecordDTO[];
 };
}


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

  // getAircraftDashboardByIndex(
  //   aircraftRequest?: DataRequest
  // ): Observable<HttpResult<PaginationResultDTO<AircraftDTO>>> {
  //   return this.get(
  //     `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/api/dashboard/aircraft`,
  //     aircraftRequest
  //   );
  // }

  getCardData(
    paginationData: ImsPaginationDTO,
    aircraftTypeId?: number
  ): Observable<HttpResult<AircraftDTO[]>> {
    let queryParams = {};

    if (aircraftTypeId) {
      queryParams = {
        page: paginationData.page,
        size: paginationData.size,
        type_id: aircraftTypeId,
      };
    } else {
      queryParams = {
        page: paginationData.page,
        size: paginationData.size,
      };
    }

    return this.http.get<HttpResult<AircraftDTO[]>>(
      `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ims`,
      { params: queryParams }
    );
  }

  getAircraftType(): Observable<HttpResult<AircraftTypeDTO[]>> {
    return this.http.get<HttpResult<AircraftTypeDTO[]>>(
      `${environment.host.ahi.url}/v1/ims/aircraft/type`
    );
  }

  getAircraftScore(acReg: string): Observable<HttpResult<AircraftScoreDTO>> {
    const params = new HttpParams().set('aircraftRegistration', acReg);

    return this.http.get<HttpResult<AircraftScoreDTO>>(
      `${environment.host.ahi.url}/ahi/_search-last`,
      { params: params }
    );
  }

  getAhiSummaryScore(): Observable<HttpResult<AhiSummaryScoreDTO>> {
    return this.http.get<HttpResult<AhiSummaryScoreDTO>>(
      `${environment.host.ahi.url}/ahi/_amount`
    );
  }

  // getAircraftScore(acReg: string): Observable<HttpResult<AircraftScoreDTO>> {
  //   const params = new HttpParams().set('aircraftRegistration', acReg);

  //   return this.http.get<HttpResult<AircraftScoreDTO>>(
  //     `${environment.host.ahi.url}/ahi/_index?total=60`,
  //     { params: params }
  //   );
  // }

  // Detail Hil = see more Hil on ModalDetail dashboard card
  // TODO: add param csName customerName=GA
  getApu(
    aircraftRegristration: string
  ): Observable<HttpResult<ElasticRecordResponse>> {
    return this.http.get<HttpResult<ElasticRecordResponse>>(
      `${environment.host.ahi.url}/ahi/_filter?aircraftRegistration=${aircraftRegristration}`
    );
  }

  // Detail Hil Dashboard
  getDetailAicraft(
    aircraftRegristration: string
  ): Observable<HttpResult<AircraftDetailHilDTO[]>> {
    return this.http.get<HttpResult<AircraftDetailHilDTO[]>>(
      `${environment.host.ahi.url}/v1/hil/status/${aircraftRegristration}?size=25`
    );
  }

  // Average Health
  getAverageHealt(): Observable<HttpResult<number>> {
    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_average`
    );
  }

  // Average Persen
  getAveragePersen(): Observable<HttpResult<number>> {
    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_percent`
    );
  }

  // Diverence
  getDifference(): Observable<HttpResult<number>> {
    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_difference`
    );
  }

}
