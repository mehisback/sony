import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
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
  DxDateBoxModule,
  DxRangeSelectorModule
} from 'devextreme-angular';
import { NgxPaginationModule } from "ngx-pagination";
import { NgxBarcodeModule } from 'ngx-barcode';
import { DxChartModule } from 'devextreme-angular';
import { IntegrationRoutes } from "./integration.routing";
import { AuthGuardService } from '../Utility/auth-guard.service';
import { LazadaOrderListComponent } from './lazada-order-list/lazada-order-list.component';
import { LazadaOrderDetailsComponent } from './lazada-order-details/lazada-order-details.component';
import { LazadaAuthComponent } from './lazada-auth/lazada-auth.component';
import { WooOrderListComponent } from './woo-order-list/woo-order-list.component';
import { WooOrderDetailsComponent } from './woo-order-details/woo-order-details.component';
import { ShopifyOrderListComponent } from './shopify-order-list/shopify-order-list.component';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(IntegrationRoutes),
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
    DxRangeSelectorModule
  ],
  declarations: [
    LazadaOrderListComponent,
    LazadaOrderDetailsComponent,
    LazadaAuthComponent,
    WooOrderListComponent,
    WooOrderDetailsComponent,
    ShopifyOrderListComponent,
    SetupComponent
  ],
  providers: [
    AuthGuardService
  ]
})
export class IntegrationModule { }
