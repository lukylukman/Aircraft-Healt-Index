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
import { AircraftDTO, AircraftDTO2 } from './dto/aircraft.dto';
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

  // Aircraft list Dashboard Card
  getCardData(
    paginationData: ImsPaginationDTO,
    sortDate: string,
    customer: string,
    aircraftTypeId?: number
  ): Observable<HttpResult<AircraftDTO2[]>> {
    const queryParams: any = {
      page: paginationData.page,
      size: paginationData.size
    };

    if (sortDate) {
      queryParams.endDate = sortDate;
    }

    if (customer) {
      queryParams.customer = customer;
    }

    if (aircraftTypeId) {
      queryParams.type_id = aircraftTypeId;
    }

    return this.http.get<HttpResult<AircraftDTO2[]>>(
      `${environment.host.ahi.url}/ahi/_cards`,
      { params: queryParams }
    );
  }

  // filter for Aircraft Type 
  getAircraftType(): Observable<HttpResult<AircraftTypeDTO[]>> {
    return this.http.get<HttpResult<AircraftTypeDTO[]>>(
      `${environment.host.ahi.url}/v1/ims/aircraft/type`
    );
  }

  
  // Summary of = Score, Green, Yellow, Red, healt, percentage, & difference 
  getAhiSummaryScore(sortDate?: string, customer?: string): Observable<HttpResult<AhiSummaryScoreDTO>> {
    const queryParams: any = {};

    if (sortDate) {
      queryParams.endDate = sortDate;
    }

    if (customer) {
      queryParams.customer = customer;
    }

    return this.http.get<HttpResult<AhiSummaryScoreDTO>>(
      `${environment.host.ahi.url}/ahi/_amount`,
      { params: queryParams }
    );
  }

  // Detail APU
  getApu(aircraftRegistration: string, sortDate?: string): Observable<HttpResult<ElasticRecordResponse>> {
    let params = new HttpParams().set('aircraftRegistration', aircraftRegistration);

    if (sortDate) {
      params = params.set('endDate', sortDate);
    }

    return this.http.get<HttpResult<ElasticRecordResponse>>(
      `${environment.host.ahi.url}/ahi/_filter`,
      { params: params }
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

  // Average Healt
  getAverageHealt(sortDate?: string, customer?: string): Observable<HttpResult<number>> {
    const queryParams: any = {};

    if (sortDate) {
      queryParams.endDate = sortDate;
    }

    if (customer) {
      queryParams.customer = customer;
    }

    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_average`,
      { params: queryParams }
    );
  }

  // Average Persen
  getAveragePersen(sortDate?: string, customer?: string): Observable<HttpResult<number>> {
    const queryParams: any = {};

    if (sortDate) {
      queryParams.endDate = sortDate;
    }

    if (customer) {
      queryParams.customer = customer;
    }

    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_percent`,
      { params: queryParams }
    );
  }

  // Difference
  getDifference(sortDate?: string, customer?: string): Observable<HttpResult<number>> {
    const queryParams: any = {};

    if (sortDate) {
      queryParams.endDate = sortDate;
    }

    if (customer) {
      queryParams.customer = customer;
    }

    return this.http.get<HttpResult<number>>(
      `${environment.host.ahi.url}/ahi/_difference`,
      { params: queryParams }
    );
  }

  // getAircraftScore(acReg: string): Observable<HttpResult<AircraftScoreDTO>> {
  //   const params = new HttpParams().set('aircraftRegistration', acReg);

  //   return this.http.get<HttpResult<AircraftScoreDTO>>(
  //     `${environment.host.ahi.url}/ahi/_index?total=60`,
  //     { params: params }
  //   );
  // }

  // getAircraftScore(acReg: string, aircraftDate?: string): Observable<HttpResult<AircraftScoreDTO>> {
  //   let params = new HttpParams().set('aircraftRegistration', acReg);

  //   if (aircraftDate) {
  //     params = params.set('endDate', aircraftDate);
  //   }

  //   return this.http.get<HttpResult<AircraftScoreDTO>>(
  //     `${environment.host.ahi.url}/ahi/_search-last`,
  //     { params: params }
  //   );
  // }

}
