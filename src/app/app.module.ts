import 'flowbite';

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  CoreModule,
  KeycloakAngularModule,
  KeycloakBearerInterceptor,
  KeycloakService,
} from 'keycloak-angular';
import { HeroIconModule, allIcons } from 'ng-heroicon';
import { DateFnsModule } from 'ngx-date-fns';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInnovationUtilsHeader } from './providers/http/http-innovation-utils-header.interceptor';
import { LoadingInterceptor } from './providers/http/http-loading.interceptor';
import { HttpSapApiHeader } from './providers/http/http-sap-api-header.interceptor';
import { HttpSoeApiHeader } from './providers/http/http-soe-api-header.interceptor';
import { HttpAhiApiHeader } from './providers/http/http-ahi-api-header.interceptor';
import { LoadingService } from './shared/reuseable-ui-components/loading/service/loading.service';
import { SharedModule } from './shared/shared.module';
import { LayoutAdminComponent } from './shared/layout/layout-admin/layout-admin.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak
      .init({
        config: {
          url: environment.keycloakUrl,
          realm: environment.realm,
          clientId: environment.keycloakClientId,
        },
        loadUserProfileAtStartUp: true,
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        bearerExcludedUrls: ['assets/', 'home/home/borrowing-list'],
        initOptions: {
          // onLoad: 'login-required',
          // checkLoginIframe: false,
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html',
        },
        // shouldUpdateToken: (request) => {
        //   return !request.headers.get('token-update') === false;
        // },
      })
      .then(async (authenticated) => {
        // console.log('Authtenticated => ', authenticated);
        if (!authenticated) {
          // window.location.reload();
        }
      });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    KeycloakAngularModule,
    CoreModule,
    SharedModule,
    KeycloakAngularModule,
    ToastrModule.forRoot(),
    DateFnsModule.forRoot(),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    HeroIconModule.forRoot(
      { ...allIcons },
      {
        defaultHostDisplay: 'inlineBlock', // default 'none'
        attachDefaultDimensionsIfNoneFound: true, //
      }
    ),
  ],
  providers: [
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAhiApiHeader,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSapApiHeader,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSoeApiHeader,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInnovationUtilsHeader,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
