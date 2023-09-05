import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { SAPOrderDTO } from '../dto/sap-order.dto';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from './localstorage.service';
import { LoggerService } from './logger.service';

@Injectable()
export class SAPService extends HttpService {
  logger: LoggerService;
  localService: LocalStorageServiceInterface;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.localService = new LocalstorageService();
    this.logger = new LoggerService(SAPService.name);
  }

  async getOrderInfo(orderNumber: string): Promise<SAPOrderDTO> {
    const request = this.get(
      environment.sapApiUrl + '/v1/api/rest/order/' + orderNumber,
      {}
    );

    const response = await lastValueFrom(request);

    if (!response) {
      return null;
    }

    const results = response['data'] as SAPOrderDTO;

    return results;
  }
}
