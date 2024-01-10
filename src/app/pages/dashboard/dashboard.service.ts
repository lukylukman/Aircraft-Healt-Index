import { HttpClient, HttpParams } from '@angular/common/http';
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
import { AircraftTypeDTO } from './dto/aircraft-type.dto';
import { AircraftDTO2 } from './dto/aircraft.dto';
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
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<AircraftDTO2[]>> {
    let queryParams = new HttpParams();

    for (const key in paginationData) {
      if (
        paginationData[key as keyof ImsPaginationDTO] !== null &&
        paginationData[key as keyof ImsPaginationDTO] !== undefined &&
        paginationData[key as keyof ImsPaginationDTO] !== ''
      ) {
        queryParams = queryParams.set(
          key,
          paginationData[key as keyof ImsPaginationDTO]
        );
      }
    }

    const url = `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_cards`;
    const options = { params: queryParams };

    return this.http.get<HttpResult<AircraftDTO2[]>>(url, options);
  }

  // filter for Aircraft Type
  getAircraftType(): Observable<HttpResult<AircraftTypeDTO[]>> {
    return this.http.get<HttpResult<AircraftTypeDTO[]>>(
      `${environment.host.ahi.url}/v1/ims/aircraft/fleet`
    );
  }

  // Summary of = Score, Green, Yellow, Red, healt, percentage, & difference
  getAhiSummaryScore(
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<AhiSummaryScoreDTO>> {
    let queryParams = new HttpParams();

    for (const key in paginationData) {
      if (
        paginationData[key as keyof ImsPaginationDTO] !== null &&
        paginationData[key as keyof ImsPaginationDTO] !== undefined &&
        paginationData[key as keyof ImsPaginationDTO] !== ''
      ) {
        queryParams = queryParams.set(
          key,
          paginationData[key as keyof ImsPaginationDTO]
        );
      }
    }

    const url = `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_amount`;
    const options = { params: queryParams };

    return this.http.get<HttpResult<AhiSummaryScoreDTO>>(url, options);
  }

  // Detail APU
  getApu(
    aircraftRegistration: string,
    sortDate?: string
  ): Observable<HttpResult<ElasticRecordResponse>> {
    let params = new HttpParams().set(
      'aircraftRegistration',
      aircraftRegistration
    );

    if (sortDate) {
      params = params.set('endDate', sortDate);
    }

    return this.http.get<HttpResult<ElasticRecordResponse>>(
      `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_filter`,
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
  getAverageHealt(
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<number>> {
    let queryParams = new HttpParams();

    for (const key in paginationData) {
      if (
        paginationData[key as keyof ImsPaginationDTO] !== null &&
        paginationData[key as keyof ImsPaginationDTO] !== undefined &&
        paginationData[key as keyof ImsPaginationDTO] !== ''
      ) {
        queryParams = queryParams.set(
          key,
          paginationData[key as keyof ImsPaginationDTO]
        );
      }
    }

    const url = `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_average`;
    const options = { params: queryParams };

    return this.http.get<HttpResult<number>>(url, options);
  }

  // Average Persen
  getAveragePersen(
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<number>> {
    let queryParams = new HttpParams();

    for (const key in paginationData) {
      if (
        paginationData[key as keyof ImsPaginationDTO] !== null &&
        paginationData[key as keyof ImsPaginationDTO] !== undefined &&
        paginationData[key as keyof ImsPaginationDTO] !== ''
      ) {
        queryParams = queryParams.set(
          key,
          paginationData[key as keyof ImsPaginationDTO]
        );
      }
    }

    const url = `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_percent`;
    const options = { params: queryParams };

    return this.http.get<HttpResult<number>>(url, options);
  }

  // Difference
  getDifference(
    paginationData: ImsPaginationDTO
  ): Observable<HttpResult<number>> {
    let queryParams = new HttpParams();

    for (const key in paginationData) {
      if (
        paginationData[key as keyof ImsPaginationDTO] !== null &&
        paginationData[key as keyof ImsPaginationDTO] !== undefined &&
        paginationData[key as keyof ImsPaginationDTO] !== ''
      ) {
        queryParams = queryParams.set(
          key,
          paginationData[key as keyof ImsPaginationDTO]
        );
      }
    }

    const url = `${environment.host.ahi.url}/${environment.host.ahi.apiVersion}/ahi/_difference`;
    const options = { params: queryParams };

    return this.http.get<HttpResult<number>>(url, options);
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
