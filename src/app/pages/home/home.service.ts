import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { HomeServiceInterface } from './home.service.interface';

@Injectable()
export class HomeService extends HttpService implements HomeServiceInterface {
  logger: LoggerService;
  private url: string = environment.apiUrl;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.logger = new LoggerService(HomeService.name);
  }
}
