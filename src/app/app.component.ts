import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(protected readonly keycloak: KeycloakService) {}
  userRoles: string[] = [];
  title = 'ahi-angular';

  ngOnInit(): void {
    this.userRoles = this.keycloak.getUserRoles();
    console.log('Role =>', this.userRoles);
  }
}
