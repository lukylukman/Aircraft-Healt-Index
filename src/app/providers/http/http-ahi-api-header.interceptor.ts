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
export class HttpAhiApiHeader implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isahiRequest = request.url.startsWith(environment.apiUrl);

    if (isahiRequest) {
      request = request.clone({
        setHeaders: {
          'x-api-key': environment.host.ahi.header.xApiKey,
        },
      });
    }

    return next.handle(request);
  }
}
