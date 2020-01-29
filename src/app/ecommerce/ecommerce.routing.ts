import { Routes } from '@angular/router';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SetupComponent } from './setup/setup.component';

export const EcommerceRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Dashboard', url: '/ecommerce/dashboard' }
          ]
        }
      },
      {
        path: 'setup',
        component: SetupComponent,
        data: {
          title: 'Setup',
          urls: [
            { title: 'Setup', url: '/ecommerce/setup' }
          ]
        }
      }
    ]
  }
];