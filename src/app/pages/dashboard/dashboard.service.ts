import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpResponseDTO, HttpResult } from 'src/app/core/dto/http-result.dto';
import { PersonalInformationDTO } from 'src/app/core/dto/personal-information-dto';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { AhiSummaryScoreDTO } from './dto/ahi-summary-score.dto';
import { AircraftScoreDTO } from './dto/aircraft-score.dto';
import { AircraftDTO } from './dto/aircraft.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';
import { PostUploadConfigDTO } from './dto/postUploadConfig.dto';

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

  updateDataConfiguration(formData: FormData): Observable<number> {
    const req = new HttpRequest(
      'POST',
      `${environment.host.ahi.url}/ahi/_upload`,
      formData,
      {
        reportProgress: true,
      }
    );
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const totalBytes = event.total?.valueOf() || 1;
          return Math.round((100 * event.loaded) / totalBytes);
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as HttpResponseDTO<PostUploadConfigDTO>;
          // Handle the response as needed
        }
        return 0;
      })
    );
  }

  // getAircraftScore(acReg: string): Observable<HttpResult<AircraftScoreDTO>> {
  //   const params = new HttpParams().set('aircraftRegistration', acReg);

  //   return this.http.get<HttpResult<AircraftScoreDTO>>(
  //     `${environment.host.ahi.url}/ahi/_search-last`,
  //     { params: params }
  //   );
  // }

  getAhiSummaryScore(): Observable<HttpResult<AhiSummaryScoreDTO>> {
    return this.http.get<HttpResult<AhiSummaryScoreDTO>>(
      `${environment.host.ahi.url}/ahi/_amount`
    );
  }

  getAircraftScore(acReg: string): Observable<HttpResult<AircraftScoreDTO>> {
    const params = new HttpParams().set('aircraftRegistration', acReg);

    return this.http.get<HttpResult<AircraftScoreDTO>>(
      `${environment.host.ahi.url}/ahi/_index?total=60`,
      { params: params }
    );
  }
}
