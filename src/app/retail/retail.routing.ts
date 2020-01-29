import { Routes } from '@angular/router';
import { PeriodicSalesReportComponent } from './periodic-sales-report/periodic-sales-report.component';
import { RetailTransactionsComponent } from './retail-transactions/retail-transactions.component';
import { RetailTransactionInvoiceComponent } from './retail-transaction-invoice/retail-transaction-invoice.component';
import { RetailStatementsComponent } from './retail-statements/retail-statements.component';
import { RetailStatementsDetailsComponent } from './retail-statements-details/retail-statements-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { PeriodicSalesReportAllComponent } from './periodic-sales-report-all/periodic-sales-report-all.component';
import { PeriodicSalesReportByStoreComponent } from './periodic-sales-report-by-store/periodic-sales-report-by-store.component';
import { PosSaleByPaymentComponent } from './pos-sale-by-payment/pos-sale-by-payment.component';
import { PosSaleByHourComponent } from './pos-sale-by-hour/pos-sale-by-hour.component';

export const RetailRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'periodic-sales-report',
        component: PeriodicSalesReportComponent,
        data: {
          title: 'Periodic Sales Report By POS',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Periodic Sales Report' }
          ]
        }
      },
      {
        path: 'retail-transactions',
        component: RetailTransactionsComponent,
        data: {
          title: 'Retail Transactions',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Retail Transactions' }
          ]
        }
      },
      {
        path: 'retail-transaction-invoice',
        component: RetailTransactionInvoiceComponent,
        data: {
          title: 'Retail Transaction Invoice',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Retail Transaction Invoice' }
          ]
        }
      },
      {
        path: 'retail-statements',
        component: RetailStatementsComponent,
        data: {
          title: 'Retail Statements',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Retail Statements' }
          ]
        }
      },
      {
        path: 'retail-statements-details',
        component: RetailStatementsDetailsComponent,
        data: {
          title: 'Retail Statements Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Retail Statements', url: '/retail/retail-statements' },
            { title: 'Retail Statements Details' }
          ]
        }
      },
      {
        path: 'periodic-sales-report-all',
        component: PeriodicSalesReportAllComponent,
        data: {
          title: ' Periodic Sales Report All',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Periodic Sales Report All' }
          ]
        }
      },
      {
        path: 'periodic-sales-report-by-store',
        component: PeriodicSalesReportByStoreComponent,
        data: {
          title: 'Periodic Sales Report by Store',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Periodic Sales Report by Store' }
          ]
        }
      },
      {
        path: 'pos-sale-by-payment',
        component: PosSaleByPaymentComponent,
        data: {
          title: 'POS Sale by Payment',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'POS Sale by Payment' }
          ]
        }
      },
      {
        path: 'pos-sale-by-hour',
        component: PosSaleByHourComponent,
        data: {
          title: 'POS Sale by Hour',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'POS Sale by Hour' }
          ]
        }
      }
    ]
  }
];