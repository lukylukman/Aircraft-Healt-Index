import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.4s', style({ opacity: 0 }))]),
    ]),
    trigger('scaleAnimation', [
      state(
        'true',
        style({
          transform: 'scale(1.10)', // Scale to 105%
        })
      ),
      state(
        'false',
        style({
          transform: 'scale(1)', // Default scale (100%)
        })
      ),
      transition('false => true', animate('200ms ease-out')),
      transition('true => false', animate('200ms ease-out')),
    ]),
  ],
})
export class ConfigurationComponent implements OnInit {
  constructor(private readonly keycloakService: KeycloakService) {}

  ngOnInit() {}

  @Confirmable({
    title: 'Logout Confirmation',
    html: 'Are you sure you want to logout?',
    icon: 'question',
  })
  doLogout(): void {
    this.clearStorage();
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
