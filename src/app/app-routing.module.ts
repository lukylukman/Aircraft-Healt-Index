import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    data: {
      title: 'Home',
      roles: [],
    },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    data: {
      title: 'Dashboard',
      roles: [],
    },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'configuration',
    data: {
      title: 'Configuration',
      roles: ['admin'],
    },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/configuration/configuration.module').then(
        (m) => m.ConfigurationModule
      ),
  },
  {
    path: 'page404',
    data: {
      title: '404 page',
      roles: ['admin'],
    },
    loadChildren: () =>
      import('./pages/page404/page404.module').then(
        (m) => m.Page404Module
      ),
  },
  // Atur halaman 404 dengan wildcard path '**'
  {
    path: '**',
    redirectTo: 'page404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
