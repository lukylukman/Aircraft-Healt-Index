import { Injectable } from '@angular/core';
import { HttpResult } from 'src/app/core/dto/http-result.dto';
import { AircraftDTO } from './dto/aircraft.dto';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { Observable } from 'rxjs';
import { DataRequest } from './dto/dataRequest.dto';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { environment } from 'src/environments/environment';
import { LoggerService } from 'src/app/core/services/logger.service';
import { HttpClient } from '@angular/common/http';
import { PersonalInformationDTO } from 'src/app/core/dto/personal-information-dto';
import { HttpService } from 'src/app/providers/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpService {
  logger: LoggerService;
  private personalInformation: PersonalInformationDTO;

  constructor(httpClient: HttpClient, private readonly userSoeService: UserSoeService,) {
    super(httpClient);
    this.logger = new LoggerService(DashboardService.name);
    this.personalInformation =
      this.userSoeService.getPersonalInformationFromCache()!;
  }

  // getAircraftDashboardByPersonalNumber(
  //   aircraftRequest?: DataRequest,
  // ): Observable<HttpResult<PaginationResultDTO<AircraftDTO>>> {
  //   return this.get(
  //     `${environment.host.digisign.url}/${environment.host.digisign.apiVersion}/api/dashboard/aircraft`,
  //     aircraftRequest,
  //   );
  // }

  // getAircraftDetailByUniqueId(
  //   aircraftRequest?: DataRequest,
  // ): Observable<HttpResult<PaginationResultDTO<AircraftDTO>>> {
  //   return this.get(
  //     `${environment.host.digisign.url}/${environment.host.digisign.apiVersion}/api/dashboard/aircraft`,
  //     aircraftRequest,
  //   );
  // }

   getCardData(): Observable<AircraftDTO[]> {
    return this.http.get<AircraftDTO[]>('http://localhost:3000/cardData');
  }
}
