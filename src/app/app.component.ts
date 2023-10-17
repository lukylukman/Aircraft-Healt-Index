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

    if (this.userRoles.includes('admin')) {
      // Jika admin, maka dapat mengakses "home" dan "configuration"
      this.router.navigate(['/home']);
    } else if (this.userRoles.includes('user')) {
      // Jika pengguna, hanya dapat mengakses "home"
      this.router.navigate(['/home']);
    } else if (this.userRoles.includes('customer_ga')) {
      this.router.navigate(['/dashboard']);
    } else if (this.userRoles.includes('customer_citilink')) {
      this.router.navigate(['/dashboard']);
    } else {
      // Page404
    }

    // console.log('Role =>', this.userRoles);
  }
}
