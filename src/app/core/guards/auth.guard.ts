import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { LocalServiceConst } from 'src/app/shared/const/local-service.const';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from '../services/localstorage.service';
import { LoggerService } from '../services/logger.service';
import { UserSoeService } from '../services/user.soe.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild {
  logger: LoggerService;
  localservice: LocalStorageServiceInterface;
  userSoeService: UserSoeService;

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private readonly httpClient: HttpClient
  ) {
    super(router, keycloak);
    this.userSoeService = new UserSoeService(this.httpClient);
    this.localservice = new LocalstorageService();
    this.logger = new LoggerService(AuthGuard.name);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isAccessAllowed(childRoute, state);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      this.userSoeService.removeUserInfoFromCache();
      await this.keycloak.login();
    }

    if (!this.userSoeService.getPersonalInformationFromCache()) {
      const userProfile = await this.keycloak.loadUserProfile(true);

      const result = await this.userSoeService.getUserInfo(
        userProfile.username
      );

      this.localservice.saveData(
        LocalServiceConst.USER_INFO,
        JSON.stringify(result)
      );

      location.reload();
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // this.userService
    //   .getData({GET_SOE_PERSONAL_INFO: {personalNumber: userProfile.username! }}, 'GET_SOE_PERSONAL_INFO')
    //   .valueChanges
    //   .subscribe((value) => {
    //     this.localservice.saveData('USER_INFO', JSON.stringify(value.data.personalInfo));
    //   });

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
