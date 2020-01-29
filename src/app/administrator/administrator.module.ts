import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxTreeListModule,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule,
  DxNumberBoxModule,
  DxTooltipModule,
  DxTabPanelModule,
  DxTreeViewModule,
  DxTemplateModule,
  DxDateBoxModule
} from 'devextreme-angular';
import { NgxPaginationModule } from "ngx-pagination";
import { NgxBarcodeModule } from 'ngx-barcode';
import { DxChartModule } from 'devextreme-angular';
import { AdministratorRoutes } from "./administrator.routing";
import { CompanyComponent } from './company/company.component';
import { UserListComponent } from './user-list/user-list.component';
import { FilterPipeUser } from "./user-list/filter.pipe";
import { FilterPipeRole } from "./role-setup-list/filter.pipe";
import { UserDetailsComponent } from './user-details/user-details.component';
import { ProcessFlowSetupComponent } from './process-flow-setup/process-flow-setup.component';
import { RoleSetupListComponent } from './role-setup-list/role-setup-list.component';
import { RoleSetupDetailsComponent } from './role-setup-details/role-setup-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { PriceGroupComponent } from './price-group/price-group.component';
import { NumberSeriesSetup2Component } from './number-series-setup2/number-series-setup2.component';
import { SetupComponent } from './setup/setup.component';
import { FormioModule } from 'angular-formio';
import { GenPolicySetupComponent } from './gen-policy-setup/gen-policy-setup.component';
import { PaymentMasterComponent } from './payment-master/payment-master.component';
import { VatSetupComponent } from './vat-setup/vat-setup.component';
import { FinanceSetupComponent } from './finance-setup/finance-setup.component';
import { FiscalYearComponent } from './fiscal-year/fiscal-year.component';
import { CurrencyExchangeSetupComponent } from './currency-exchange-setup/currency-exchange-setup.component';
import { StorePosSetupComponent } from './store-pos-setup/store-pos-setup.component';
import { TenderSetupComponent } from './tender-setup/tender-setup.component';
import { GstSetupComponent } from './gst-setup/gst-setup.component';
import { WhtSetupComponent } from './wht-setup/wht-setup.component';
import { SalesPersonComponent } from './sales-person/sales-person.component';
import { PurchaserComponent } from './purchaser/purchaser.component';
import { AccountChargesSetupComponent } from './account-charges-setup/account-charges-setup.component';
import { ReportSetupComponent } from './report-setup/report-setup.component';
import { StatusCheckListComponent } from './status-check-list/status-check-list.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdministratorRoutes),
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeListModule,
    DxPopupModule,
    DxValidatorModule,
    NgxPaginationModule,
    DxNumberBoxModule,
    NgxBarcodeModule,
    ClickOutsideModule,
    DxTooltipModule,
    DxDateBoxModule,
    DxTabPanelModule,
    DxTreeViewModule,
    DxTemplateModule,
    DxChartModule,
    FormioModule
  ],
  declarations: [
    CompanyComponent, 
    UserListComponent,
    FilterPipeRole,
    FilterPipeUser,
    UserDetailsComponent,
    ProcessFlowSetupComponent,
    RoleSetupListComponent,
    RoleSetupDetailsComponent,
    PriceGroupComponent,
    NumberSeriesSetup2Component,
    SetupComponent,
    GenPolicySetupComponent,
    PaymentMasterComponent,
    VatSetupComponent,
    FinanceSetupComponent,
    FiscalYearComponent,
    CurrencyExchangeSetupComponent,
    StorePosSetupComponent,
    TenderSetupComponent,
    GstSetupComponent,
    WhtSetupComponent,
    SalesPersonComponent,
    PurchaserComponent,
    AccountChargesSetupComponent,
    ReportSetupComponent,
    StatusCheckListComponent
  ],
  providers: [
    AuthGuardService
  ],
})
export class AdministratorModule { }
