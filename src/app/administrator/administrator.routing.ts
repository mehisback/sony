import { Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ProcessFlowSetupComponent } from './process-flow-setup/process-flow-setup.component';
import { RoleSetupListComponent } from './role-setup-list/role-setup-list.component';
import { RoleSetupDetailsComponent } from './role-setup-details/role-setup-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { PriceGroupComponent } from './price-group/price-group.component';
import { NumberSeriesSetup2Component } from './number-series-setup2/number-series-setup2.component';
import { SetupComponent } from './setup/setup.component';
import { GenPolicySetupComponent } from './gen-policy-setup/gen-policy-setup.component';
import { PaymentMasterComponent } from './payment-master/payment-master.component';
import { VatSetupComponent } from './vat-setup/vat-setup.component';
import { FinanceSetupComponent } from './finance-setup/finance-setup.component';
import { FiscalYearComponent } from './fiscal-year/fiscal-year.component';
import { CurrencyExchangeSetupComponent } from './currency-exchange-setup/currency-exchange-setup.component';
import { StorePosSetupComponent } from './store-pos-setup/store-pos-setup.component';
import { TenderSetupComponent } from './tender-setup/tender-setup.component';
// import { GstSetupComponent } from './gst-setup/gst-setup.component';
import { WhtSetupComponent } from './wht-setup/wht-setup.component';
import { SalesPersonComponent } from './sales-person/sales-person.component';
import { PurchaserComponent } from './purchaser/purchaser.component';
import { AccountChargesSetupComponent } from './account-charges-setup/account-charges-setup.component';
import { ReportSetupComponent } from './report-setup/report-setup.component';
import { StatusCheckListComponent } from './status-check-list/status-check-list.component';

export const AdministratorRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'company',
        component: CompanyComponent,
        data: {
          title: 'Company',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Company' }
          ]
        }
      },
      {
        path: 'user-list',
        component: UserListComponent,
        data: {
          title: 'User List',
          urls: [
            { title: 'w', url: '/dashboard/dashboard1' },
            { title: 'User List' }
          ]
        }
      },
      {
        path: 'user-details',
        component: UserDetailsComponent,
        data: {
          title: 'User Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'User List', url: '/administrator/user-list' },
            { title: 'User Details' }
          ]
        }
      },
      {
        path: 'process-flow-setup',
        component: ProcessFlowSetupComponent,
        data: {
          title: 'Process Flow Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Process Flow Setup' }
          ]
        }
      },
      {
        path: 'role-setup-list',
        component: RoleSetupListComponent,
        data: {
          title: 'Role List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Role List' }
          ]
        }
      },
      {
        path: 'role-setup-details',
        component: RoleSetupDetailsComponent,
        data: {
          title: 'Role Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Role List', url: '/administrator/role-setup-list' },
            { title: 'Role Setup' }
          ]
        }
      },
      {
        path: 'price-group',
        component: PriceGroupComponent,
        data: {
          title: 'Price Group',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Price Group' }
          ]
        }
      },
      {
        path: 'number-series-setup2',
        component: NumberSeriesSetup2Component,
        data: {
          title: 'Number Series Setup2',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Number Series Setup2' }
          ]
        }
      },
      {
        path: 'setup',
        component: SetupComponent,
        data: {
          title: 'Custom Fields Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Custom Fields Setup' }
          ]
        }
      },
      {
        path: 'gen-policy-setup',
        component: GenPolicySetupComponent,
        data: {
          title: 'Gen Policy Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Gen Policy Setup' }
          ]
        }
      },
      {
        path: 'payment-master',
        component: PaymentMasterComponent,
        data: {
          title: 'Payment Master',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Payment Master' }
          ]
        }
      },
      {
        path: 'vat-setup',
        component: VatSetupComponent,
        data: {
          title: 'TAX Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'TAX Setup' }
          ]
        }
      },
      {
        path: 'finance-setup',
        component: FinanceSetupComponent,
        data: {
          title: 'AR/AP Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'AR/AP Setup' }
          ]
        }
      },
      {
        path: 'fiscal-year',
        component: FiscalYearComponent,
        data: {
          title: 'Fiscal Year',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Fiscal Year' }
          ]
        }
      },
      {
        path: 'currency-exchange-setup',
        component: CurrencyExchangeSetupComponent,
        data: {
          title: 'Currency Exchange',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Currency Exchange' }
          ]
        }
      },
      {
        path: 'store-pos-setup',
        component: StorePosSetupComponent,
        data: {
          title: 'Store and POS',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Store and POS' }
          ]
        }
      },
      {
        path: 'tender-setup',
        component: TenderSetupComponent,
        data: {
          title: 'Tender Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Tender Setup' }
          ]
        }
      },
      {
        path: 'wht-setup',
        component: WhtSetupComponent,
        data: {
          title: 'WHT Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WHT Setup' }
          ]
        }
      },
      {
        path: 'sales-person',
        component: SalesPersonComponent,
        data: {
          title: 'Salesperson',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Salesperson' }
          ]
        }
      },
      {
        path: 'purchaser',
        component: PurchaserComponent,
        data: {
          title: 'Purchaser',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchaser' }
          ]
        }
      },
      {
        path: 'account-charges-setup',
        component: AccountChargesSetupComponent,
        data: {
          title: 'Account Charges Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Account Charges Setup' }
          ]
        }
      },
      {
        path: 'report-setup',
        component: ReportSetupComponent,
        data: {
          title: 'Report Setup',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Report Setup' }
          ]
        }
      },
      {
        path: 'status-check-list',
        component: StatusCheckListComponent,
        data: {
          title: 'Setup Check List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Setup Check List' }
          ]
        }
      }
    ]
  }
];