import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    protected readonly keycloak: KeycloakService,
    private router: Router
  ) {}
  userRoles: string[] = [];
  title = 'ahi-angular';

  ngOnInit(): void {
    this.userRoles = this.keycloak.getUserRoles();

    if (this.userRoles.includes('user')) {
      this.router.navigate(['/home']);
    } else if (this.userRoles.includes('admin')) {
      this.router.navigate(['/configuration']);
    }

    // console.log('Role =>', this.userRoles);
  }
}
