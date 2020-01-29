import { Routes } from '@angular/router';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { LazadaOrderListComponent } from './lazada-order-list/lazada-order-list.component';
import { LazadaOrderDetailsComponent } from './lazada-order-details/lazada-order-details.component';
import { LazadaAuthComponent } from './lazada-auth/lazada-auth.component';
import { WooOrderListComponent } from './woo-order-list/woo-order-list.component';
import { WooOrderDetailsComponent } from './woo-order-details/woo-order-details.component';
import { ShopifyOrderListComponent } from './shopify-order-list/shopify-order-list.component';
import { SetupComponent } from './setup/setup.component';

export const IntegrationRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'lazada-order-list',
        component: LazadaOrderListComponent,
        data: {
          title: 'Lazada Orders',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Lazada Orders' }
          ]
        }
      },
      {
        path: 'lazada-order-details',
        component: LazadaOrderDetailsComponent,
        data: {
          title: 'Lazada Orders Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Order List', url: '/integration/lazada-order-list' },
            { title: 'Orders Details' }
          ]
        }
      },
      {
        path: 'lazada-auth',
        component: LazadaAuthComponent,
        data: {
          title: 'Lazada Auth',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Lazada Auth' }
          ]
        }
      },
      {
        path: 'woo-order-list',
        component: WooOrderListComponent,
        data: {
          title: 'Woocommerce Orders',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Woocommerce Orders' }
          ]
        }
      },
      {
        path: 'woo-order-details',
        component: WooOrderDetailsComponent,
        data: {
          title: 'Woocommerce Orders Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Order List', url: '/integration/woo-order-list' },
            { title: 'Orders Details' }
          ]
        }
      },
      {
        path: 'shopify-order-list',
        component: ShopifyOrderListComponent,
        data: {
          title: 'Shopify Orders',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Shopify Orders' }
          ]
        }
      },
      {
        path: 'setup',
        component: SetupComponent,
        data: {
          title: 'Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Setup' }
          ]
        }
      }
    ]
  }
];