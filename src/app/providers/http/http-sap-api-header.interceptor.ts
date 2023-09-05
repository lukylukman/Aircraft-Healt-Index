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
export class HttpSapApiHeader implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.startsWith(environment.sapApiUrl);

    if (isApiRequest) {
      request = request.clone({
        setHeaders: {
          'x-api-key': environment.sapApiKey,
        },
      });
    }

    return next.handle(request);
  }
}
