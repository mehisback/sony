import { Routes } from '@angular/router';
import { AuthGuardService } from '../Utility/auth-guard.service';

export const ProductionRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: []
  }
];