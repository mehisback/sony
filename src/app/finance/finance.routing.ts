import { Routes, CanActivate } from '@angular/router';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { SalesinvoicedetailsComponent } from './salesinvoicedetails/salesinvoicedetails.component';
import { PurchaseinvoicelistComponent } from './purchaseinvoicelist/purchaseinvoicelist.component';
import { PurchaseinvoicedetailsComponent } from './purchaseinvoicedetails/purchaseinvoicedetails.component';
import { SalescreditnoteListComponent } from './salescreditnote-list/salescreditnote-list.component';
import { CashReceiptJournalComponent } from './cash-receipt-journal/cash-receipt-journal.component';
import { SalescreditnoteDetailsComponent } from './salescreditnote-details/salescreditnote-details.component';
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
import { ApdetailsComponent } from './apdetails/apdetails.component';
import { PurchaseJournalComponent } from './purchase-journal/purchase-journal.component';
import { PurchaseJournalDetailsComponent } from './purchase-journal-details/purchase-journal-details.component';
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

export const FinanceRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'salesinvoice',
        component: SalesinvoiceComponent,
        data: {
          title: 'Sales Invoice List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Invoice' }
          ]
        }
      },
      {
        path: 'salesinvoicedetails',
        component: SalesinvoicedetailsComponent,
        data: {
          title: 'Sales Invoice Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Invoice List', url: '/finance/salesinvoice' },
            { title: 'Sales Invoice Details' }
          ]
        }
      },
      {
        path: 'purchaseinvoicelist',
        component: PurchaseinvoicelistComponent,
        data: {
          title: 'Purchase Invoice List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Invoice List' }
          ]
        }
      },
      {
        path: 'purchaseinvoicedetails',
        component: PurchaseinvoicedetailsComponent,
        data: {
          title: 'Purchase Invoice Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Invoice List', url: '/finance/purchaseinvoicelist' },
            { title: 'Purchase Invoice Details' }
          ]
        }
      },
      {
        path: 'salescreditnote-list',
        component: SalescreditnoteListComponent,
        data: {
          title: 'Sales Credit Note List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Credit Note' }
          ]
        }
      },
      {
        path: 'salescreditnote-details',
        component: SalescreditnoteDetailsComponent,
        data: {
          title: 'Sales Credit Note Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Credit Note List', url: '/finance/salescreditnote-list' },
            { title: 'Sales Credit Note Details' }
          ]
        }
      },
      {
        path: 'cash-receipt-journal',
        component: CashReceiptJournalComponent,
        data: {
          title: 'Cash Receipt Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Cash Receipt Journal' }
          ]
        }
      }, {
        path: 'postedsalescreditnote-list',
        component: PostedsalescreditnoteListComponent,
        data: {
          title: 'Posted Sales Credit Note List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Sales Credit Note' }
          ]
        }
      },
      {
        path: 'postedsalescreditnote-details',
        component: PostedsalescreditnoteDetailsComponent,
        data: {
          title: 'Posted Sales Credit Note Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Sales Credit Note List', url: '/finance/postedsalescreditnote-list' },
            { title: 'Posted Sales Credit Note Details' }
          ]
        }
      },
      {
        path: 'purchasecreditnote-list',
        component: PurchasecreditnoteListComponent,
        data: {
          title: 'Purchase Credit Note List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Credit Note' }
          ]
        }
      },
      {
        path: 'purchasecreditnote-details',
        component: PurchasecreditnoteDetailsComponent,
        data: {
          title: 'Purchase Credit Note Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Credit Note List', url: '/finance/purchasecreditnote-list' },
            { title: 'Purchase Credit Note Details' }
          ]
        }
      },
      {
        path: 'vatregister',
        component: VatregisterComponent,
        data: {
          title: 'TAX Register',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'TAX Details' }
          ]
        }
      },
      {
        path: 'billing-note',
        component: BillingNoteComponent,
        data: {
          title: 'Billing Note',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Billing Note' }
          ]
        }
      },
      {
        path: 'billing-note-details',
        component: BillingNoteDetailsComponent,
        data: {
          title: 'Billing Note Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Billing Note', url: 'billing-note' },
            { title: 'Billing Note Details' }
          ]
        }
      },
      {
        path: 'vatsubmission-register-list',
        component: VATSubmissionRegisterListComponent,
        data: {
          title: 'TAX Submission',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'TAX Records' }
          ]
        }
      },
      {
        path: 'vatsubmissionregisterdetails',
        component: VatsubmissionregisterdetailsComponent,
        data: {
          title: 'Vat Submission Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Vat Submission', url: '/finance/vatsubmission-register-list' },
            { title: 'Vat Submission Details' }
          ]
        }
      },
      {
        path: 'chartofaccounts',
        component: ChartofaccountsComponent,
        data: {
          title: 'Chart Of Account',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Chart Of Account' }
          ]
        }
      },
      {
        path: 'cash-receipt-journal-details',
        component: CashReceiptJournalDetailsComponent,
        data: {
          title: 'Cash Receipt Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Cash Receipt Journal', url: '/finance/cash-receipt-journal' },
            { title: 'Cash Receipt Journal Details' }
          ]
        }
      },
      {
        path: 'gen-journal-list',
        component: GenJournalListComponent,
        data: {
          title: 'Gen. Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'General Journal List' }
          ]
        }
      },
      {
        path: 'gen-journal-details',
        component: GenJournalDetailsComponent,
        data: {
          title: 'General Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Gen. Journal List', url: '/finance/gen-journal-list' },
            { title: 'General Journal Details' }
          ]
        }
      },
      {
        path: 'accountingreports',
        component: AccountingreportsComponent,
        data: {
          title: 'Accounting Reports',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Accounting Reports' }
          ]
        }
      },
      {
        path: 'payment-journal',
        component: PaymentJournalComponent,
        data: {
          title: 'Payment Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Payment Journal' }
          ]
        }
      },
      {
        path: 'payment-journal-details',
        component: PaymentJournalDetailsComponent,
        data: {
          title: 'Payment Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Payment Journal', url: '/finance/payment-journal' },
            { title: 'Payment Journal Details' }
          ]
        }
      },
      {
        path: 'expensejournals-list',
        component: ExpensejournalsListComponent,
        data: {
          title: 'Expense Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Expense Journal' }
          ]
        }
      },
      {
        path: 'expensejournals-details',
        component: ExpensejournalsDetailsComponent,
        data: {
          title: 'Expense Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Expense Journal', url: '/finance/expensejournals-list' },
            { title: 'Expense Journal Details' }
          ]
        }
      },
      {
        path: 'ardetails',
        component: ArdetailsComponent,
        data: {
          title: 'AR Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'AR Details' }
          ]
        }
      },
      {
        path: 'apdetails',
        component: ApdetailsComponent,
        data: {
          title: 'AP Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'AP Details' }
          ]
        }
      },
      {
        path: 'purchase-journal',
        component: PurchaseJournalComponent,
        data: {
          title: 'Purchase Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Journal' }
          ]
        }
      },
      {
        path: 'purchase-journal-details',
        component: PurchaseJournalDetailsComponent,
        data: {
          title: 'Purchase Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Purchase Journal', url: '/finance/purchase-journal' },
            { title: 'Purchase Journal Details' }
          ]
        }
      },
      {
        path: 'withholdingtax-details',
        component: WithholdingtaxDetailsComponent,
        data: {
          title: 'WHT Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WHT Details' }
          ]
        }
      },
      {
        path: 'posted-purchase-invoice-list',
        component: PostedPurchaseInvoiceListComponent,
        data: {
          title: 'Posted Purchase Invoice List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Purchase Invoice List' }
          ]
        }
      },
      {
        path: 'posted-purchase-invoice-details',
        component: PostedPurchaseInvoiceDetailsComponent,
        data: {
          title: 'Posted Purchase Invoice Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Purchase Invoice List', url: '/finance/posted-purchase-invoice-list' },
            { title: 'Posted Purchase Invoice Details' }
          ]
        }
      },
      {
        path: 'posted-purchase-credit-note-list',
        component: PostedPurchaseCreditNoteListComponent,
        data: {
          title: 'Posted Purchase Credit Note List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Purchase Credit Note List' }
          ]
        }
      },
      {
        path: 'posted-purchase-credit-note-details',
        component: PostedPurchaseCreditNoteDetailsComponent,
        data: {
          title: 'Posted Purchase Credit Note Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Purchase Credit Note List', url: '/finance/posted-purchase-credit-note-list' },
            { title: 'Posted Purchase Credit Note Details' }
          ]
        }
      },
      {
        path: 'posted-sales-invoice-list',
        component: PostedSalesInvoiceListComponent,
        data: {
          title: 'Posted Sales Invoice List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Sales Invoice List' }
          ]
        }
      },
      {
        path: 'posted-sales-invoice-details',
        component: PostedSalesInvoiceDetailsComponent,
        data: {
          title: 'Posted Sales Invoice Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Sales Invoice List', url: '/finance/posted-sales-invoice-list' },
            { title: 'Posted Sales Invoice Details' }
          ]
        }
      }
      ,
      {
        path: 'gl-register',
        component: GlRegisterComponent,
        data: {
          title: 'GL Register',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'GL Register' }
          ]
        }
      },
      {
        path: 'gl-register-details',
        component: GlRegisterDetailsComponent,
        data: {
          title: 'GL Register Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'GL Register', url: '/finance/gl-register' },
            { title: 'GL Register Details' }
          ]
        }
      },
      {
        path: 'inventory-with-cost',
        component: InventoryWithCostComponent,
        data: {
          title: 'Inventory with Cost',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Inventory with Cost' }
          ]
        }
      }, {
        path: 'sales-journal-list',
        component: SalesJournalListComponent,
        data: {
          title: 'Sales Journal List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Journal List' }
          ]
        }
      },
      {
        path: 'sales-journal-details',
        component: SalesJournalDetailsComponent,
        data: {
          title: 'Sales Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Journal List', url: '/finance/sales-journal-list' },
            { title: 'Sales Journal Details' }
          ]
        }
      },
      {
        path: 'gst-reports',
        component: GstReportsComponent,
        data: {
          title: 'GST Reports',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'GST Reports' }
          ]
        }
      }, {
        path: 'sales-credit-memo-list',
        component: SalesCreditMemoListComponent,
        data: {
          title: 'Sales Credit Memo List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Credit Memo List' }
          ]
        }
      },
      {
        path: 'sales-credit-memo-details',
        component: SalesCreditMemoDetailsComponent,
        data: {
          title: 'Sales Credit Memo Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Sales Credit Memo List', url: '/finance/sales-credit-memo-list' },
            { title: 'Sales Credit Memo Details' }
          ]
        }
      }, {
        path: 'import-finance-transaction',
        component: ImportFinanceTransactionComponent,
        data: {
          title: 'Import Finance Transaction',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Import Finance Transaction' }
          ]
        }
      }
    ]
  }
];