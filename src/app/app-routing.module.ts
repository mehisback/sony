import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: './dashboards/dashboard.module#DashboardModule'
      },
      {
        path: 'starter',
        loadChildren: './starter/starter.module#StarterModule'
      },
      {
        path: 'sales',
        loadChildren: './sales/sales.module#SalesModule'
      },
      {
        path: 'purchases',
        loadChildren: './purchases/purchases.module#PurchasesModule'
      },
      {
        path: 'warehouse',
        loadChildren: './warehouse/warehouse.module#WarehouseModule'
      },
      {
        path: 'finance',
        loadChildren: './finance/finance.module#FinanceModule'
      },
      {
        path: 'retail',
        loadChildren: './retail/retail.module#RetailModule'
      },
      {
        path: 'administrator',
        loadChildren: './administrator/administrator.module#AdministratorModule'
      },
      {
        path: 'production',
        loadChildren: './production/production.module#ProductionModule'
      },
      {
        path: 'ecommerce',
        loadChildren: './ecommerce/ecommerce.module#EcommerceModule'
      },
      {
        path: 'integration',
        loadChildren: './integration/integration.module#IntegrationModule'
      }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren:
          './authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule {}
