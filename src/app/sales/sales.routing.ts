import { Routes } from '@angular/router';
import { SalesorderListComponent } from './salesorder-list/salesorder-list.component';
import { SalesorderDetailsComponent } from './salesorder-details/salesorder-details.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { SalesreturnListComponent } from './salesreturn-list/salesreturn-list.component';
import { SalesreturnDetailsComponent } from './salesreturn-details/salesreturn-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { SalesQuoteListComponent } from './sales-quote-list/sales-quote-list.component';
import { SalesQuoteDetailsComponent } from './sales-quote-details/sales-quote-details.component';
import { CustomerGroupSetupComponent } from './customer-group-setup/customer-group-setup.component';
import { ManageSalesListComponent } from './manage-sales-list/manage-sales-list.component';

export const SalesRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'salesorder-list',
        component: SalesorderListComponent,
        data: {
          title: 'Sales Order List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Order List' }
          ]
        }
      },
      {
        path: 'salesorder-details',
        component: SalesorderDetailsComponent,
        data: {
          title: 'Sales order Detail',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Order List', url: '/sales/salesorder-list' },
            { title: 'Sales order Detail' }
          ]
        }
      },
      {
        path: 'customer-list',
        component: CustomerListComponent,
        data: {
          title: 'Customer List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Customer List' }
          ]
        }
      },
      {
        path: 'customer-details',
        component: CustomerDetailsComponent,
        data: {
          title: 'Customer Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Customer List', url: '/sales/customer-list' },
            { title: 'Customer Details' }
          ]
        }
      },
      {
        path: 'salesreturn-list',
        component: SalesreturnListComponent,
        data: {
          title: 'Sales Return List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Return List' }
          ]
        }
      },
      {
        path: 'salesreturn-details',
        component: SalesreturnDetailsComponent,
        data: {
          title: 'Sales Return Detail',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Return List', url: '/sales/salesorder-list' },
            { title: 'Sales Return Detail' }
          ]
        }
      },
      {
        path: 'sales-quote-list',
        component: SalesQuoteListComponent,
        data: {
          title: 'Sales Quote List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Quote List' }
          ]
        }
      },
      {
        path: 'sales-quote-details',
        component: SalesQuoteDetailsComponent,
        data: {
          title: 'Sales Quote Detail',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Quote List', url: '/sales/sales-quote-list' },
            { title: 'Sales Quote Detail' }
          ]
        }
      },
      {
        path: 'customer-group-setup',
        component: CustomerGroupSetupComponent,
        data: {
          title: 'Customer Group Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Customer Group Setup' }
          ]
        }
      },
      {
        path: 'manage-sales-list',
        component: ManageSalesListComponent,
        data: {
          title: 'Manage Sales Orders',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Manage Sales Orders' }
          ]
        }
      }
    ]
  }
];