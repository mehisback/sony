import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { EcommerceRoutes } from "./ecommerce.routing";
import { AuthGuardService } from '../Utility/auth-guard.service';
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
    RouterModule.forChild(EcommerceRoutes),
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
    DashboardComponent,
    SetupComponent
  ],
  providers: [
    AuthGuardService
  ],
})
export class EcommerceModule { }
