import { ItemsListComponent } from "./items-list/items-list.component";
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
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule,
  DxNumberBoxModule,
  DxTooltipModule,
  DxScrollViewModule,
  DxScrollViewComponent ,
  DxPieChartModule,
  DxDateBoxModule,
  DxSwitchModule,
  DxTreeViewModule
} from 'devextreme-angular';
import { 
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatRippleModule, 
  MatIconModule } from '@angular/material';
import {MatStepperModule} from '@angular/material/stepper';
import { PurchasesRoutes } from "./purchases.routing";
import { ItemsDetailsComponent } from "./items-details/items-details.component";
import { FilterPipe } from "./items-list/filter.pipe";
import { FilterPipeVend } from "./vendorlist/filter.pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxBarcodeModule } from 'ngx-barcode';
import { DxChartModule } from 'devextreme-angular';
import { PurchaseorderlistComponent } from './purchaseorderlist/purchaseorderlist.component';
import { PurchaseorderComponent } from './purchaseorder/purchaseorder.component';
import { PurchasereturnListComponent } from './purchasereturn-list/purchasereturn-list.component';
import { PurchasereturnDetailsComponent } from './purchasereturn-details/purchasereturn-details.component';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { AuthGuardService } from "../Utility/auth-guard.service";
import { ItemSetupComponent } from './item-setup/item-setup.component';
import { FormioModule } from 'angular-formio';
import { ServiceItemListComponent } from './service-item-list/service-item-list.component';
import { ServiceItemDetailsComponent } from './service-item-details/service-item-details.component';
import { VendorTypeSetupComponent } from './vendor-type-setup/vendor-type-setup.component';
import { PurchaseQuoteListComponent } from './purchase-quote-list/purchase-quote-list.component';
import { PurchaseQuoteDetailsComponent } from './purchase-quote-details/purchase-quote-details.component';
import { ManagePurchaseListComponent } from './manage-purchase-list/manage-purchase-list.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(PurchasesRoutes),
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxTreeViewModule,
    DxButtonModule,
    DxSwitchModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxPopupModule,
    DxValidatorModule,
    NgxPaginationModule,
    DxNumberBoxModule,
    NgxBarcodeModule,
    ClickOutsideModule,
    DxTooltipModule,
    DxChartModule,
    DxPieChartModule,
    DxDateBoxModule,
    FormioModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  declarations: [
    ItemsListComponent,
    ItemsDetailsComponent,
    FilterPipe,
    FilterPipeVend,
    PurchaseorderlistComponent,
    PurchaseorderComponent,
    PurchasereturnListComponent,
    PurchasereturnDetailsComponent,
    VendorlistComponent,
    VendorDetailsComponent,
    ItemSetupComponent,
    ServiceItemListComponent,
    ServiceItemDetailsComponent,
    VendorTypeSetupComponent,
    PurchaseQuoteListComponent,
    PurchaseQuoteDetailsComponent,
    ManagePurchaseListComponent
  ],
  providers: [
    AuthGuardService
  ],
})

export class PurchasesModule { }