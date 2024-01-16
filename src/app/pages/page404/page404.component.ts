import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { LocalStorageServiceInterface } from 'src/app/core/interfaces/localstorage.service.interface';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { LocalServiceConst } from 'src/app/shared/const/local-service.const';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css'],
})
export class Page404Component implements OnInit {
  localService: LocalStorageServiceInterface;

  constructor(private readonly kcService: KeycloakService) {
    this.localService = new LocalstorageService();
  }

  ngOnInit() {}

  onClickLogout() {
    this.kcService.logout(environment.baseUrl);
    this.localService.removeData(LocalServiceConst.USER_INFO);
  }
}
