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
  DxTooltipModule
} from 'devextreme-angular';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule
} from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxPaginationModule } from "ngx-pagination";
import { NgxBarcodeModule } from 'ngx-barcode';
import { PickListComponent } from "./pick-list/pick-list.component";
import { PickDetailsComponent } from "./pick-details/pick-details.component";
import { WarehouseRoutes } from "./warehouse.routing";
import { InventoryComponent } from './inventory/inventory.component';
import { GoodsreceiptListComponent } from './goodsreceipt-list/goodsreceipt-list.component';
import { GoodsreceiptDetailsComponent } from './goodsreceipt-details/goodsreceipt-details.component';
import { MovementsComponent } from './movements/movements.component';
import { MovementsListComponent } from './movements-list/movements-list.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { ReturnReceiptListComponent } from './return-receipt-list/return-receipt-list.component';
import { ReturnReceiptDetailsComponent } from './return-receipt-details/return-receipt-details.component';
import { ItemJournalListComponent } from './item-journal-list/item-journal-list.component';
import { ItemJournalDetailsComponent } from './item-journal-details/item-journal-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { ReturnPickListComponent } from './return-pick-list/return-pick-list.component';
import { ReturnPickDetailsComponent } from './return-pick-details/return-pick-details.component';
import { TransferIntransitListComponent } from './transfer-intransit-list/transfer-intransit-list.component';
import { TransferIntransitDetailsComponent } from './transfer-intransit-details/transfer-intransit-details.component';
import { WmsSoListComponent } from './wms-so-list/wms-so-list.component';
import { WmsPoListComponent } from './wms-po-list/wms-po-list.component';
import { WmsSegmentsComponent } from './wms-segments/wms-segments.component';
import { WmsSegmentsListComponent } from './wms-segments-list/wms-segments-list.component';
import { PostedGrListComponent } from './posted-gr-list/posted-gr-list.component';
import { PostedGrDetailsComponent } from './posted-gr-details/posted-gr-details.component';
import { PostedPickListComponent } from './posted-pick-list/posted-pick-list.component';
import { PostedPickDetailsComponent } from './posted-pick-details/posted-pick-details.component';
import { PostedReturnReceiptListComponent } from './posted-return-receipt-list/posted-return-receipt-list.component';
import { PostedReturnReceiptDetailsComponent } from './posted-return-receipt-details/posted-return-receipt-details.component';
import { PostedReturnPickListComponent } from './posted-return-pick-list/posted-return-pick-list.component';
import { PostedReturnPickDetailsComponent } from './posted-return-pick-details/posted-return-pick-details.component';
import { WmsTransferReceiveListComponent } from './wms-transfer-receive-list/wms-transfer-receive-list.component';
import { WmsTransferReceiveDetailsComponent } from './wms-transfer-receive-details/wms-transfer-receive-details.component';
import { PostedTransferListComponent } from './posted-transfer-list/posted-transfer-list.component';
import { PostedTransferDetailsComponent } from './posted-transfer-details/posted-transfer-details.component';
import { PostedMovementListComponent } from './posted-movement-list/posted-movement-list.component';
import { PostedMovementDetailsComponent } from './posted-movement-details/posted-movement-details.component';
import { NgxPrintModule } from 'ngx-print';
import { PickReviceComponent } from './pick-revice/pick-revice.component';
import { GrReviceComponent } from './gr-revice/gr-revice.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(WarehouseRoutes),
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
    DxNumberBoxModule,
    NgxBarcodeModule,
    ClickOutsideModule,
    DxTooltipModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    NgxPrintModule
  ],
  declarations: [
    PickListComponent,
    PickDetailsComponent,
    InventoryComponent,
    GoodsreceiptListComponent,
    GoodsreceiptDetailsComponent,
    MovementsComponent,
    MovementsListComponent,
    TransferListComponent,
    TransferDetailsComponent,
    ReturnReceiptListComponent,
    ReturnReceiptDetailsComponent,
    ItemJournalListComponent,
    ItemJournalDetailsComponent,
    ReturnPickListComponent,
    ReturnPickDetailsComponent,
    TransferIntransitListComponent,
    TransferIntransitDetailsComponent,
    WmsSoListComponent,
    WmsPoListComponent,
    WmsSegmentsComponent,
    WmsSegmentsListComponent,
    PostedGrListComponent,
    PostedGrDetailsComponent,
    PostedPickListComponent,
    PostedPickDetailsComponent,
    PostedReturnReceiptListComponent,
    PostedReturnReceiptDetailsComponent,
    PostedReturnPickListComponent,
    PostedReturnPickDetailsComponent,
    WmsTransferReceiveListComponent,
    WmsTransferReceiveDetailsComponent,
    PostedTransferListComponent,
    PostedTransferDetailsComponent,
    PostedMovementListComponent,
    PostedMovementDetailsComponent,
    PickReviceComponent,
    GrReviceComponent
  ],
  providers: [
    AuthGuardService
  ],
})

export class WarehouseModule { }