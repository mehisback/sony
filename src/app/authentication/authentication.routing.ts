import { Routes } from '@angular/router';

import { NotFoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';
import { SetupComponent } from './setup/setup.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotFoundComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'setup',
        component: SetupComponent
      }
    ]
  }
];
