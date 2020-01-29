import { Routes } from '@angular/router';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { Dashboard1Component } from './dashboard1/dashboard1.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'dashboard1',
        component: Dashboard1Component,
        data: {
          title: '',
          urls: [
          ]
        }
      }
    ]
  }
];