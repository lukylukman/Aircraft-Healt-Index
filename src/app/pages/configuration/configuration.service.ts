import { Injectable } from '@angular/core';
import { LoggerService } from '../../core/services/logger.service';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { Observable, map } from 'rxjs';
import { HttpResponseDTO, HttpResult } from 'src/app/core/dto/http-result.dto';
import { environment } from 'src/environments/environment';
import { SetConfigDTO } from '../dashboard/dto/setConfig.dto';
import { PostUploadConfigDTO } from '../dashboard/dto/postUploadConfig.dto';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends HttpService {
  logger: LoggerService;

constructor(
    httpClient: HttpClient,
    private readonly userSoeService: UserSoeService
  ) {
    super(httpClient);
    this.logger = new LoggerService(ConfigurationService.name);
  }

  // get CustomerName
  getCustomerName(): Observable<HttpResult<[]>> {
    return this.http.get<HttpResult<[]>>(
      `${environment.host.ahi.url}/ahi-config/customerName`
    );
  }

  // get Config Value Data 
  getConfigData(
    customerName: string
  ): Observable<HttpResult<SetConfigDTO[]>> {
    return this.http.get<HttpResult<SetConfigDTO[]>>(
      `${environment.host.ahi.url}/ahi-config/${customerName}`
    );
  }

  //  restore Config Value
   restoreConfigValue(customerName: string): Observable<HttpResult<any>> {
    const url = `${environment.host.ahi.url}/ahi-config/restore`;
    const params = { customerName };

    return this.http.patch<HttpResult<any>>(url, null, { params });
  }

  // Update Config Weight
  updateConfigWeight(uniqueId: string, configValue: number): Observable<HttpResponseDTO<any>> {
    return this.http.patch<HttpResponseDTO<any>>(
      `${environment.host.ahi.url}/ahi-config?uniqueId=${uniqueId}&configValue=${configValue}`,
      {}
    );
  }

  // Add New customer
  createNewCustomer(customerName: string): Observable<HttpResponseDTO<any>> {
    const url = `${environment.host.ahi.url}/ahi-config`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<HttpResponseDTO<any>>(url, { customerName }, { headers });
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
  
}
