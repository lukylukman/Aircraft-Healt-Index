// admin.guard.ts
import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements OnInit {
  constructor(
    protected readonly keycloak: KeycloakService,
    private router: Router
  ) {}
  userRoles: string[] = [];

  ngOnInit(): void {
    this.userRoles = this.keycloak.getUserRoles();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.userRoles.includes('admin')) {
      return true;
    } else {
      // Redirect ke halaman lain atau tampilkan pesan kesalahan
      this.router.navigate(['/home']);
      return false;
    }
  }
}
