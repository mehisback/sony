import { Routes } from '@angular/router';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsDetailsComponent } from './items-details/items-details.component';
import { PurchaseorderlistComponent } from './purchaseorderlist/purchaseorderlist.component';
import { PurchaseorderComponent } from './purchaseorder/purchaseorder.component';
import { PurchasereturnListComponent } from './purchasereturn-list/purchasereturn-list.component';
import { PurchasereturnDetailsComponent } from './purchasereturn-details/purchasereturn-details.component';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { ItemSetupComponent } from './item-setup/item-setup.component';
import { ServiceItemListComponent } from './service-item-list/service-item-list.component';
import { ServiceItemDetailsComponent } from './service-item-details/service-item-details.component';
import { VendorTypeSetupComponent } from './vendor-type-setup/vendor-type-setup.component';
import { PurchaseQuoteListComponent } from './purchase-quote-list/purchase-quote-list.component';
import { PurchaseQuoteDetailsComponent } from './purchase-quote-details/purchase-quote-details.component';
import { ManagePurchaseListComponent } from './manage-purchase-list/manage-purchase-list.component';

export const PurchasesRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'items-list',
        component: ItemsListComponent,
        data: {
          title: 'Item List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Item List' }
          ]
        }
      },
      {
        path: 'items-details',
        component: ItemsDetailsComponent,
        data: {
          title: 'Item Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Item List', url: '/purchases/items-list' },
            { title: 'Item Details' }
          ]
        }
      },
      {
        path: 'purchaseorderlist',
        component: PurchaseorderlistComponent,
        data: {
          title: 'PO List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'PO List', url: '/purchases/purchaseorderlist' }
          ]
        }
      },
      {
        path: 'purchaseorder',
        component: PurchaseorderComponent,
        data: {
          title: 'Purchase Order Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'PO List', url: '/purchases/purchaseorderlist' },
            { title: 'PO Details' }
          ]
        }
      },
      {
        path: 'purchasereturn-list',
        component: PurchasereturnListComponent,
        data: {
          title: 'Purchase Return List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Return List' }
          ]
        }
      },
      {
        path: 'purchasereturn-details',
        component: PurchasereturnDetailsComponent,
        data: {
          title: 'Purchase Return Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Return Details', url: '/purchases/purchasereturn-list' },
            { title: 'Purchase Return Details' }
          ]
        }
      },
      {
        path: 'vendorlist',
        component: VendorlistComponent,
        data: {
          title: 'Vendor List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Vendor List' }
          ]
        }
      },
      {
        path: 'vendor-details',
        component: VendorDetailsComponent,
        data: {
          title: 'Vendor Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Vendor List', url: '/purchases/vendorlist' },
            { title: 'Vendor Details' }
          ]
        }
      },
      {
        path: 'item-setup',
        component: ItemSetupComponent,
        data: {
          title: 'Item Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Item Setup' }
          ]
        }
      },
      {
        path: 'service-item-list',
        component: ServiceItemListComponent,
        data: {
          title: 'Service Item List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'ServiceItem List' }
          ]
        }
      },
      {
        path: 'service-item-details',
        component: ServiceItemDetailsComponent,
        data: {
          title: 'Service Item Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Service Item List', url: '/purchases/service-item-list' },
            { title: 'Service Item Details' }
          ]
        }
      },
      {
        path: 'vendor-type-setup',
        component: VendorTypeSetupComponent,
        data: {
          title: 'Vendor Type Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Vendor Type Setup' }
          ]
        }
      }, {
        path: 'purchase-quote-list',
        component: PurchaseQuoteListComponent,
        data: {
          title: 'Puchase Quote List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Puchase Quote List' }
          ]
        }
      }, {
        path: 'purchase-quote-details',
        component: PurchaseQuoteDetailsComponent,
        data: {
          title: 'Puchase Quote Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Puchase Quote List', url: '/purchases/purchase-quote-list' },
            { title: 'Puchase Quote Details' }
          ]
        }
      },
      {
        path: 'manage-purchase-list',
        component: ManagePurchaseListComponent,
        data: {
          title: 'Manage PQ',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Manage PQ' }
          ]
        }
      }
    ]
  }
];