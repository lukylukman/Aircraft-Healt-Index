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
export class HttpSoeApiHeader implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.startsWith(environment.soeApiUrl);

    if (isApiRequest) {
      request = request.clone({
        setHeaders: {
          'x-api-key': environment.soeApiKey,
        },
      });
    }

    return next.handle(request);
  }
}
