import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetailRoutes } from './retail.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule
} from 'devextreme-angular';
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

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(RetailRoutes),
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    DxValidatorModule,
    NgxPaginationModule,
    ClickOutsideModule,
    HttpClientModule
  ],
  declarations: [
    PeriodicSalesReportComponent, 
    RetailTransactionsComponent, 
    RetailTransactionInvoiceComponent, 
    RetailStatementsComponent, 
    RetailStatementsDetailsComponent, PeriodicSalesReportAllComponent, PeriodicSalesReportByStoreComponent, PosSaleByPaymentComponent, PosSaleByHourComponent
  ],
  providers: [
    AuthGuardService
  ],
})
export class RetailModule {
}
