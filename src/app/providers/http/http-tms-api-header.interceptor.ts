import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpTmsApiHeader implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isTmsRequest = request.url.startsWith(environment.apiUrl);

    if (isTmsRequest) {
      request = request.clone({
        setHeaders: {
          'x-api-key': environment.tmsApiKey,
        },
      });
    }

    return next.handle(request);
  }
}
