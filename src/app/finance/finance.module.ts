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
import { FinanceRoutes } from "./finance.routing";
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { SalesinvoicedetailsComponent } from './salesinvoicedetails/salesinvoicedetails.component';
import { PurchaseinvoicelistComponent } from './purchaseinvoicelist/purchaseinvoicelist.component';
import { PurchaseinvoicedetailsComponent } from './purchaseinvoicedetails/purchaseinvoicedetails.component';
import { SalescreditnoteListComponent } from './salescreditnote-list/salescreditnote-list.component';
import { SalescreditnoteDetailsComponent } from './salescreditnote-details/salescreditnote-details.component';
import { CashReceiptJournalComponent } from './cash-receipt-journal/cash-receipt-journal.component';
import { PostedsalescreditnoteListComponent } from './postedsalescreditnote-list/postedsalescreditnote-list.component';
import { PostedsalescreditnoteDetailsComponent } from './postedsalescreditnote-details/postedsalescreditnote-details.component';
import { PurchasecreditnoteListComponent } from './purchasecreditnote-list/purchasecreditnote-list.component';
import { PurchasecreditnoteDetailsComponent } from './purchasecreditnote-details/purchasecreditnote-details.component';
import { VatregisterComponent } from './vatregister/vatregister.component';
import { BillingNoteComponent } from './billing-note/billing-note.component';
import { BillingNoteDetailsComponent } from './billing-note-details/billing-note-details.component';
import { VATSubmissionRegisterListComponent } from './vatsubmission-register-list/vatsubmission-register-list.component';
import { VatsubmissionregisterdetailsComponent } from './vatsubmissionregisterdetails/vatsubmissionregisterdetails.component';
import { ChartofaccountsComponent } from './chartofaccounts/chartofaccounts.component';
import { CashReceiptJournalDetailsComponent } from './cash-receipt-journal-details/cash-receipt-journal-details.component';
import { GenJournalListComponent } from './gen-journal-list/gen-journal-list.component';
import { GenJournalDetailsComponent } from './gen-journal-details/gen-journal-details.component';
import { AccountingreportsComponent } from './accountingreports/accountingreports.component';
import { PaymentJournalComponent } from './payment-journal/payment-journal.component';
import { PaymentJournalDetailsComponent } from './payment-journal-details/payment-journal-details.component';
import { ExpensejournalsListComponent } from './expensejournals-list/expensejournals-list.component';
import { ExpensejournalsDetailsComponent } from './expensejournals-details/expensejournals-details.component';
import { ArdetailsComponent } from './ardetails/ardetails.component';
import { PurchaseJournalComponent } from './purchase-journal/purchase-journal.component';
import { PurchaseJournalDetailsComponent } from './purchase-journal-details/purchase-journal-details.component';
import { ApdetailsComponent } from './apdetails/apdetails.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { WithholdingtaxDetailsComponent } from './withholdingtax-details/withholdingtax-details.component';
import { PostedPurchaseInvoiceListComponent } from './posted-purchase-invoice-list/posted-purchase-invoice-list.component';
import { PostedPurchaseInvoiceDetailsComponent } from './posted-purchase-invoice-details/posted-purchase-invoice-details.component';
import { PostedPurchaseCreditNoteListComponent } from './posted-purchase-credit-note-list/posted-purchase-credit-note-list.component';
import { PostedPurchaseCreditNoteDetailsComponent } from './posted-purchase-credit-note-details/posted-purchase-credit-note-details.component';
import { PostedSalesInvoiceListComponent } from './posted-sales-invoice-list/posted-sales-invoice-list.component';
import { PostedSalesInvoiceDetailsComponent } from './posted-sales-invoice-details/posted-sales-invoice-details.component';
import { GlRegisterComponent } from './gl-register/gl-register.component';
import { GlRegisterDetailsComponent } from './gl-register-details/gl-register-details.component';
import { InventoryWithCostComponent } from './inventory-with-cost/inventory-with-cost.component';
import { SalesJournalListComponent } from './sales-journal-list/sales-journal-list.component';
import { SalesJournalDetailsComponent } from './sales-journal-details/sales-journal-details.component';
import { GstReportsComponent } from './gst-reports/gst-reports.component';
import { SalesCreditMemoListComponent } from './sales-credit-memo-list/sales-credit-memo-list.component';
import { SalesCreditMemoDetailsComponent } from './sales-credit-memo-details/sales-credit-memo-details.component';
import { ImportFinanceTransactionComponent } from './import-finance-transaction/import-finance-transaction.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(FinanceRoutes),
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
    SalesinvoiceComponent,
    SalesinvoicedetailsComponent,
    PurchaseinvoicelistComponent,
    PurchaseinvoicedetailsComponent,
    SalescreditnoteListComponent,
    SalescreditnoteDetailsComponent,
    CashReceiptJournalComponent,
    PostedsalescreditnoteListComponent,
    PostedsalescreditnoteDetailsComponent,
    PurchasecreditnoteListComponent,
    PurchasecreditnoteDetailsComponent,
    VatregisterComponent,
    BillingNoteComponent,
    BillingNoteDetailsComponent,
    VATSubmissionRegisterListComponent,
    VatsubmissionregisterdetailsComponent,
    ChartofaccountsComponent,
    CashReceiptJournalDetailsComponent,
    GenJournalListComponent,
    GenJournalDetailsComponent,
    AccountingreportsComponent,
    PaymentJournalComponent,
    PaymentJournalDetailsComponent,
    ExpensejournalsListComponent,
    ExpensejournalsDetailsComponent,
    ArdetailsComponent,
    ApdetailsComponent,
    PurchaseJournalComponent,
    PurchaseJournalDetailsComponent,
    WithholdingtaxDetailsComponent,
    PostedPurchaseInvoiceListComponent,
    PostedPurchaseInvoiceDetailsComponent,
    PostedPurchaseCreditNoteListComponent,
    PostedPurchaseCreditNoteDetailsComponent,
    PostedSalesInvoiceListComponent,
    PostedSalesInvoiceDetailsComponent,
    GlRegisterComponent,
    GlRegisterDetailsComponent,
    InventoryWithCostComponent,
    SalesJournalListComponent,
    SalesJournalDetailsComponent,
    GstReportsComponent,
    SalesCreditMemoListComponent,
    SalesCreditMemoDetailsComponent,
    ImportFinanceTransactionComponent
  ],
  providers: [
    AuthGuardService
  ],
})

export class FinanceModule { }
