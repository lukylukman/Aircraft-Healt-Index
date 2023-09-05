import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/providers/http/http.service';
import { environment } from 'src/environments/environment';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from './localstorage.service';
import { LoggerService } from './logger.service';

@Injectable()
export class MediaService extends HttpService {
  logger: LoggerService;
  localService: LocalStorageServiceInterface;

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.localService = new LocalstorageService();
    this.logger = new LoggerService(MediaService.name);
  }

  showMedia(fileName: string): string {
    const req: Observable<Blob> = this.get(
      environment.mediaApiManagement + '/preview/' + fileName
    );

    let imageData: string = '';

    req.subscribe((data: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageData = reader.result as string;
      };
      reader.readAsDataURL(data);
    });

    return imageData;
  }
}
