import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
import { DxButtonModule, DevExtremeModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DatePipe, NumberFormatStyle } from '@angular/common';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

var UserActionSuggestion = ["", "", ""];

/* @Author Ganesh
/* this is For With Accounting Reports
/* On 06-03-2019
*/

@Component({
  selector: 'app-accountingreports',
  templateUrl: './accountingreports.component.html',
  styleUrls: ['./accountingreports.component.css'],
  providers: [DatePipe]
})

export class AccountingreportsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  FormDate: any = {};
  totalAsset: Number = 0;
  totalEquity: Number = 0;
  totalLiablity: Number = 0;
  totalDiff: Number = 0;
  txtBalanced: String = null;
  isDivVisible: boolean = false;
  reportHeaderText: string = "GL Trial Balance";
  dataSourceGLTrialBalance: any = {};
  dataServiceName = "GLTrailBalance";
  dataMethodName = "getReportData";
  dataParameters = ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, 'No'];
  dataSuggestions: any = null;
  columns1 = [];
  printLines: any = [];
  AccountType = ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSES']
  continents = [{
    id: "1",
    text: "GL Trial Balance",
    dataService: "GLTrailBalance",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, 'No'],
    UserActionSuggestion: ["", "", ""],
    selected: true,
    items: [],
    columnHeader: [
      { columns: "Acccode", title: "Account code", dataKey: "Acccode", pdfFirstColumn: "Acccode" },
      { columns: "name", title: "name", dataKey: "name" },
      { columns: "startdebit", title: "Debit", dataKey: "startdebit" },
      { columns: "startcredit", title: "Credit", dataKey: "startcredit" },
      { columns: "rangedebit", title: "Debit", dataKey: "rangedebit" },
      { columns: "rangecredit", title: "Credit", dataKey: "rangecredit" },
      { columns: "enddebit", title: "Debit", dataKey: "enddebit" },
      { columns: "endcredit", title: "Credit", dataKey: "endcredit" },
    ]
  }, {
    id: "2",
    text: "GL Trial Balance Total",
    dataService: "GLTrailBalanceSummary",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DebitAmount", title: "DebitAmount", dataKey: "DebitAmount" },
      { columns: "CreditAmount", title: "CreditAmount", dataKey: "CreditAmount" },
      { columns: "Balance", title: "Balance", dataKey: "Balance" },
    ]
  }, {
    id: "3",
    text: "GL Trial Balance Balance",
    dataService: "GLTrailBalanceSummary2",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "AccountName", title: "AccountName", dataKey: "AccountName" },
      { columns: "BalanceDebit", title: "BalanceDebit", dataKey: "BalanceDebit" },
      { columns: "BalanceCredit", title: "BalanceCredit", dataKey: "BalanceCredit" }
    ]
  }, {
    id: "4",
    text: "Financial Stmt.Overview",
    dataService: "FSOverview",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "AccountName", title: "AccountName", dataKey: "name" },
      { columns: "DebitAmount", title: "DebitAmount", dataKey: "DebitAmount" },
      { columns: "CreditAmount", title: "CreditAmount", dataKey: "CreditAmount" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
      { columns: "SalesAmount", title: "SALES", dataKey: "SalesAmount" },
      { columns: "ExpenseAmount", title: "EXPENSES", dataKey: "ExpenseAmount" },
      { columns: "PLAmount", title: "PROFIT/LOSS", dataKey: "PLAmount" },
      { columns: "AssetAmount", title: "ASSET", dataKey: "AssetAmount" },
      { columns: "LiabilityAmount", title: "LIABILITY", dataKey: "LiabilityAmount" }
    ]
  }, {
    id: "5",
    text: "Income Statement",
    dataService: "IncomeStatement",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '2'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "Particulars", title: "Particulars", dataKey: "Particulars", pdfFirstColumn: "Particulars" },
      { columns: "Name" },
      { columns: "MainType" },
      { columns: "SUB_TOTAL", title: "SUB_TOTAL", dataKey: "SUB_TOTAL" },
      { columns: "TOTAL", title: "TOTAL", dataKey: "TOTAL" }, //, isTotal: true
      { columns: "PY_SUB_TOTAL", title: "PY_SUB_TOTAL", dataKey: "PY_SUB_TOTAL" },
      { columns: "PY_TOTAL", title: "PY_TOTAL", dataKey: "PY_TOTAL" }
    ]
  }, {
    id: "6",
    text: "Income Statement Simple",
    dataService: "IncomeStatementSummary",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '1'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "Particulars", title: "Particulars", dataKey: "Particulars", pdfFirstColumn: "Particulars" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "MainType", title: "MainType", dataKey: "MainType" },
      { columns: "SUB_TOTAL", title: "SUB_TOTAL", dataKey: "SUB_TOTAL" },
      { columns: "TOTAL", title: "TOTAL", dataKey: "TOTAL" },
    ]
  }, {
    id: "7",
    text: "Balance Sheet",
    dataService: "BalanceSheet",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '2'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "Particulars", title: "Particulars", dataKey: "Particulars", pdfFirstColumn: "Particulars" },
      { columns: "MainType" },
      { columns: "SUB_TOTAL", title: "SUB_TOTAL", dataKey: "SUB_TOTAL" },
      { columns: "TOTAL", title: "TOTAL", dataKey: "TOTAL" },
      { columns: "PY_SUB_TOTAL", title: "PY_SUB_TOTAL", dataKey: "PY_SUB_TOTAL" },
      { columns: "PY_TOTAL", title: "PY_TOTAL", dataKey: "PY_TOTAL" }
    ]
  }, {
    id: "8",
    text: "Balance Sheet Simple",
    dataService: "BalanceSheetSummary",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '1'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "Name", title: "Name", dataKey: "Name", pdfFirstColumn: "Name", pdfSecondColumn: "Particulars" },
      { columns: "MainType" },
      { columns: "Amount", title: "Amount", dataKey: "Amount" },
      { columns: "SUB_TOTAL", title: "SUB_TOTAL", dataKey: "SUB_TOTAL" },
      { columns: "TOTAL", title: "TOTAL", dataKey: "TOTAL" }
    ]
  }, {
    id: "9",
    text: "General Ledger By AccountCode",
    dataService: "GeneralLedgerByAccountCodeReport",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.FormDate.AccountCode],
    UserActionSuggestion: ["getCOA", "AccountCode", "Name"],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "Documentdate", title: "Documentdate", dataKey: "Documentdate" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "Type", dataKey: "DocumentType" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "DebitAmount", title: "DebitAmount", dataKey: "DebitAmount" },
      { columns: "CreditAmount", title: "CreditAmount", dataKey: "CreditAmount" },
      { columns: "Balance", title: "Balance", dataKey: "Balance" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
    ]
  }, {
    id: "10",
    text: "General Ledger All Accounts",
    dataService: "GeneralLedgerAllAccountCodeReport",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "Documentdate", title: "Documentdate", dataKey: "Documentdate" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "DebitAmount", title: "DebitAmount", dataKey: "DebitAmount" },
      { columns: "CreditAmount", title: "CreditAmount", dataKey: "CreditAmount" },
      { columns: "Balance", title: "Balance", dataKey: "Balance" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
    ]
  }, {
    id: "11",
    text: "Statement of Cash Flow",
    dataService: "StatementOfCashFlow",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "Detail", title: "Detail", dataKey: "Detail", pdfFirstColumn: "Detail" },
      { columns: "TOTAL", title: "TOTAL", dataKey: "TOTAL" }
    ]
  }, {
    id: "12",
    text: "General Ledger",
    dataService: "GeneralLedgerReport",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "DocumentDate", title: "DocumentDate", dataKey: "DocumentDate", pdfFirstColumn: "DocumentDate" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "AMOUNT", title: "AMOUNT", dataKey: "AMOUNT" },
      { columns: "BLANCE", title: "BalanceAmount", dataKey: "BLANCE" }
    ]
  }, {
    id: "13",
    text: "Journal Report",
    dataService: "JournalReport",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "DocumentDate", title: "DocumentDate", dataKey: "DocumentDate", pdfFirstColumn: "DocumentDate" },
      { columns: "TRANSACTION_TYPE", title: "TRANSACTION_TYPE", dataKey: "TRANSACTION_TYPE" },
      { columns: "NAME", title: "NAME", dataKey: "NAME" },
      { columns: "ACCOUNT_NO", title: "ACCOUNT_NO", dataKey: "ACCOUNT_NO" },
      { columns: "DESCRIPTION", title: "DESCRIPTION", dataKey: "DESCRIPTION" },
      { columns: "DEBIT", title: "DEBIT", dataKey: "DEBIT" },
      { columns: "CREDIT", title: "CREDIT", dataKey: "CREDIT" }
    ]
  }, {
    id: "14",
    text: "--- SUB LEDGER REPORTS---",
    dataService: "",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: []
  }, {
    id: "15",
    text: "Stock Card",
    dataService: "StockCard",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.FormDate.AccountCode, UtilsForGlobalData.getUserId()],
    UserActionSuggestion: ["getItemMaster", "ItemCode", "Description"],
    items: [],
    columnHeader: [
      { columns: "DocumentDate", title: "DocumentDate", dataKey: "DocumentDate", pdfFirstColumn: "DocumentDate" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "InQty", title: "InQty", dataKey: "InQty" },
      { columns: "InCost", title: "InCost", dataKey: "InCost" },
      { columns: "InAmount", title: "InAmount", dataKey: "InAmount" },
      { columns: "OutQty", title: "OutQty", dataKey: "OutQty" },
      { columns: "OutCost", title: "OutCost", dataKey: "OutCost" },
      { columns: "OutAmount", title: "OutAmount", dataKey: "OutAmount" },
      { columns: "BalanceQty", title: "BalanceQty", dataKey: "BalanceQty" },
      { columns: "BalanceCost", title: "BalanceCost", dataKey: "BalanceCost" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" }
    ]
  }, {
    id: "16",
    text: "Stock Card All",
    dataService: "StockCardAll",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, 'N', UtilsForGlobalData.getUserId()],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "ItemCode", title: "ItemCode", dataKey: "ItemCode", pdfFirstColumn: "ItemCode" },
      { columns: "DocumentDate", title: "DocumentDate", dataKey: "DocumentDate" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "InQty", title: "InQty", dataKey: "InQty" },
      { columns: "InCost", title: "InCost", dataKey: "InCost" },
      { columns: "InAmount", title: "InAmount", dataKey: "InAmount" },
      { columns: "OutQty", title: "OutQty", dataKey: "OutQty" },
      { columns: "OutCost", title: "OutCost", dataKey: "OutCost" },
      { columns: "OutAmount", title: "OutAmount", dataKey: "OutAmount" },
      { columns: "BalanceQty", title: "BalanceQty", dataKey: "BalanceQty" },
      { columns: "BalanceCost", title: "BalanceCost", dataKey: "BalanceCost" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" }
    ]
  }, {
    id: "17",
    text: "AR Detail Trial All",
    dataService: "ARDetailTrailBalance",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "Documentdate", title: "Documentdate", dataKey: "Documentdate" },
      { columns: "ExternalDocumentNo", title: "ExternalDocumentNo", dataKey: "ExternalDocumentNo" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "Debit", title: "Debit", dataKey: "Debit" },
      { columns: "Credit", title: "Credit", dataKey: "Credit" },
      { columns: "Amount", title: "Amount", dataKey: "Amount" },
      { columns: "RemainingAmount", title: "RemainingAmount", dataKey: "RemainingAmount" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
      { columns: "invoicestatus", title: "invoicestatus", dataKey: "invoicestatus" },
      { columns: "Duedate", title: "Duedate", dataKey: "Duedate" },
    ]
  }, {
    id: "18",
    text: "AR Detail Trial-By Customer",
    dataService: "ARDetailTrailBalanceCust",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.FormDate.AccountCode],
    UserActionSuggestion: ["getCustomerList", "CustCode", "Name"],
    items: [],
    columnHeader: [
      { columns: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "Type", dataKey: "DocumentType" },
      { columns: "Documentdate", title: "Date", dataKey: "Documentdate" },
      { columns: "ExternalDocumentNo" },
      { columns: "Description" },
      { columns: "Debit", title: "Debit", dataKey: "Debit" },
      { columns: "Credit", title: "Credit", dataKey: "Credit" },
      { columns: "Amount" },
      { columns: "RemainingAmount" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
      { columns: "invoicestatus" },
      { columns: "Duedate" },
    ]
  }, {
    id: "19",
    text: "AP Detail Trial All",
    dataService: "APDetailTrailBalance",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "Documentdate", title: "Documentdate", dataKey: "Documentdate" },
      { columns: "ExternalDocumentNo", title: "ExternalDocumentNo", dataKey: "ExternalDocumentNo" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "Debit", title: "Debit", dataKey: "Debit" },
      { columns: "Credit", title: "Credit", dataKey: "Credit" },
      { columns: "Amount", title: "Amount", dataKey: "Amount" },
      { columns: "RemainingAmount", title: "RemainingAmount", dataKey: "RemainingAmount" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
      { columns: "invoicestatus", title: "invoicestatus", dataKey: "invoicestatus" },
      { columns: "Duedate", title: "Duedate", dataKey: "Duedate" }
    ]
  }, {
    id: "20",
    text: "AP Detail Trial- By Vendor",
    dataService: "APDetailTrailBalanceVend",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.FormDate.AccountCode],
    UserActionSuggestion: ["getVendorList", "VendCode", "Name"],
    items: [],
    columnHeader: [
      { columns: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DocumentType", title: "Type", dataKey: "DocumentType" },
      { columns: "Documentdate", title: "Date", dataKey: "Documentdate" },
      { columns: "ExternalDocumentNo" },
      { columns: "Description" },
      { columns: "Debit", title: "Debit", dataKey: "Debit" },
      { columns: "Credit", title: "Credit", dataKey: "Credit" },
      { columns: "Amount" },
      { columns: "RemainingAmount" },
      { columns: "BalanceAmount", title: "BalanceAmount", dataKey: "BalanceAmount" },
      { columns: "invoicestatus" },
      { columns: "Duedate" }
    ]
  },/* {
    id: "21",
    text: "Sales Commission Report",
    dataService: "SalesPersonCommision",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: []
  },{
    id: "22",
    text: "HSN Report",
    dataService: "HSNCardAll",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: []
  }, */ {
    id: "23",
    text: "Income By Customer Summary",
    dataService: "IncomeByCustomer",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "BillToCustomer", title: "BillToCustomer", dataKey: "BillToCustomer", pdfFirstColumn: "BillToCustomer" },
      { columns: "BillToName", title: "BillToName", dataKey: "BillToName" },
      { columns: "AMOUNT", title: "AMOUNT", dataKey: "AMOUNT" },
      { columns: "EXPENSES", title: "EXPENSES", dataKey: "EXPENSES" },
      { columns: "NET_INCOME", title: "NET_INCOME", dataKey: "NET_INCOME" }
    ]
  }, {
    id: "24",
    text: "Open Invoice",
    dataService: "OpenInvoice",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "CUSTCODE", title: "CUSTCODE", dataKey: "CUSTCODE", pdfFirstColumn: "CUSTCODE" },
      { columns: "DocumentDate", title: "DocumentDate", dataKey: "DocumentDate" },
      { columns: "TRANSACTION_TYPE", title: "TRANSACTION_TYPE", dataKey: "TRANSACTION_TYPE" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "DUE_DATE", title: "Duedate", dataKey: "DUE_DATE" },
      { columns: "OPEN_BALANCE", title: "OPEN_BALANCE", dataKey: "OPEN_BALANCE" }
    ]
  }, {
    id: "25",
    text: "Sales By Product Detail",
    dataService: "SalesByProduct",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "PRODUCT", title: "PRODUCT", dataKey: "PRODUCT", pdfFirstColumn: "PRODUCT" },
      { columns: "TYPE", title: "TYPE", dataKey: "TYPE" },
      { columns: "CUSTOMER", title: "CUSTOMER", dataKey: "CUSTOMER" },
      { columns: "NAME", title: "NAME", dataKey: "NAME" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "QTY", title: "QTY", dataKey: "QTY" },
      { columns: "Salesprice", title: "Salesprice", dataKey: "Salesprice" },
      { columns: "AMOUNT", title: "AMOUNT", dataKey: "AMOUNT" }
    ]
  }, {
    id: "26",
    text: "Customer Detail",
    dataService: "CustomerDetail",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '1'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DATE", title: "DATE", dataKey: "DATE" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "Duedate", title: "Duedate", dataKey: "Duedate" },
      { columns: "Amount", title: "Amount", dataKey: "Amount" },
      { columns: "OPEN_BALANCE", title: "OPEN_BALANCE", dataKey: "OPEN_BALANCE" },
      { columns: "BALANCE", title: "BALANCE", dataKey: "BALANCE" }
    ]
  }, /*{
    id: "27",
    text: "Customer Detail Card",
    dataService: "CustomerDetailCard",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: []
  },*/ {
    id: "28",
    text: "Supplier Balance Detail",
    dataService: "SupplierBalanceDetail",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, '1'],
    UserActionSuggestion: ["", "", ""],
    items: [],
    columnHeader: [
      { columns: "AccountCode", title: "AccountCode", dataKey: "AccountCode", pdfFirstColumn: "AccountCode" },
      { columns: "Name", title: "Name", dataKey: "Name" },
      { columns: "DATE", title: "DATE", dataKey: "DATE" },
      { columns: "DocumentType", title: "DocumentType", dataKey: "DocumentType" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "Description", title: "Description", dataKey: "Description" },
      { columns: "Duedate", title: "Duedate", dataKey: "Duedate" },
      { columns: "Amount", title: "Amount", dataKey: "Amount" },
      { columns: "OPEN_BALANCE", title: "OPEN_BALANCE", dataKey: "OPEN_BALANCE" },
      { columns: "BALANCE", title: "BALANCE", dataKey: "BALANCE" }
    ]
  }, {
    id: "29",
    text: "Aging Report",
    dataService: "AgingReport",
    dataMethod: "getReportData",
    dataParameters: ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.FormDate.AccountCode],
    UserActionSuggestion: ["Aging", "agingGroup", "desc"],
    items: [],
    columnHeader: [
      { columns: "DocumentDate", title: "Date", dataKey: "DocumentDate", pdfFirstColumn: "DocumentDate" },
      { columns: "DocumentType", title: "Type", dataKey: "DocumentType" },
      { columns: "DocumentNo", title: "DocumentNo", dataKey: "DocumentNo" },
      { columns: "CustCode", title: "CustCode", dataKey: "CustCode" },
      { columns: "Name" },
      { columns: "DueDate", title: "Duedate", dataKey: "Duedate" },
      { columns: "AMOUNT", title: "AMOUNT", dataKey: "AMOUNT" },
      { columns: "OPEN_BALANCE", title: "OPEN_BALANCE", dataKey: "OPEN_BALANCE" }
    ]
  }
  ];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.getFormatOfNumber = this.getFormatOfNumber.bind(this);
    this.incomeTotal = this.incomeTotal.bind(this);
  }

  ngOnInit() {

    this.FormDate.DocumentFromDate = new Date();
    this.FormDate.DocumentToDate = new Date();
    this.FormDate.AccountCode = '';

    //this.FormDate.DocumentFromDate.setMonth(this.FormDate.DocumentFromDate.getMonth() - 1);
    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    var thisComponent = this;
    this.dataSourceGLTrialBalance = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataParameters[1] = thisComponent.FormDate.DocumentFromDate;
        thisComponent.dataParameters[2] = thisComponent.FormDate.DocumentToDate;
        if (thisComponent.dataServiceName == "GeneralLedgerByAccountCodeReport") {
          thisComponent.dataParameters[3] = thisComponent.FormDate.AccountCode;
        } else if (thisComponent.dataServiceName == 'StockCard') {
          thisComponent.dataParameters[3] = thisComponent.FormDate.AccountCode;
        } else if (thisComponent.dataServiceName == 'ARDetailTrailBalanceCust') {
          thisComponent.dataParameters[3] = thisComponent.FormDate.AccountCode;
        } else if (thisComponent.dataServiceName == 'APDetailTrailBalanceVend') {
          thisComponent.dataParameters[3] = thisComponent.FormDate.AccountCode;
        } else if (thisComponent.dataServiceName == 'AgingReport') {
          thisComponent.dataParameters[3] = thisComponent.FormDate.AccountCode == '' ? '1' : thisComponent.FormDate.AccountCode;
        }
        if (thisComponent.dataServiceName == 'BalanceSheetSummary') {
          thisComponent.isDivVisible = true;
        } else {
          thisComponent.isDivVisible = false;
        }
        thisComponent.dataFromService.getServerData(thisComponent.dataServiceName, thisComponent.dataMethodName,
          thisComponent.dataParameters)
          .subscribe(data => {
            if (data[0] == 'DONE') {
              thisComponent.printLines = data[1];
              devru.resolve(data[1]);
              if (thisComponent.dataServiceName == "BalanceSheetSummary") {
                thisComponent.setLABELforBalanceSheetSummary(data[1]);
              } else {
                thisComponent.txtBalanced = null;
              }
            } else {
              devru.reject("Modify The Date!!, Error Status Code: NO-DATA-FOUND OR " + data[0]);
            }
          }, error => this.error = thisComponent.alertCode(error, devru));
        if (UserActionSuggestion[0] == "Aging") {
          thisComponent.dataSuggestions = new DataSource({
            store: [
              { agingGroup: '1', desc: 'SHOW ALL' },
              { agingGroup: '2', desc: '1 - 30 days' },
              { agingGroup: '3', desc: '31- 60 days' },
              { agingGroup: '4', desc: '61 - 90 days' },
              { agingGroup: '5', desc: 'More Than 91 days' }
            ],
            paginate: true,
            pageSize: 10
          });
        }
        else if (UserActionSuggestion[0] != "" && UserActionSuggestion[0] != "Aging") {
          thisComponent.dataFromService.getServerData(thisComponent.dataServiceName, UserActionSuggestion[0], [''])
            .subscribe(callData3 => {
              thisComponent.dataSuggestions = new DataSource({
                store: <String[]>callData3,
                paginate: true,
                pageSize: 10
              });
            });
        } else {
          thisComponent.dataSuggestions = null;
        }
        return devru.promise();
      }
    });

  }

  setLABELforBalanceSheetSummary(data) {
    for (var i = 0; i < Object.keys(data).length; i++) {
      if (data[i].MainType == "ASSET") {
        this.totalAsset = Number(this.totalAsset) + Number(data[i].TOTAL);
      }
      if (data[i].MainType == "EQUITY") {
        this.totalEquity = Number(this.totalEquity) + Number(data[i].TOTAL);
      }
      if (data[i].MainType == "LIABILITY") {
        this.totalLiablity = Number(this.totalLiablity) + Number(data[i].TOTAL);
      }
    }
    this.totalDiff = Number(this.totalAsset) - (Number(this.totalEquity) + Number(this.totalLiablity));
    if (this.totalDiff != 0) {
      this.txtBalanced = "NOT CLOSED!";
    }
    else {
      this.txtBalanced = "BALANCED.";
    }
  }

  onTabChange(event: NgbTabChangeEvent) {

  }

  changeSelection(e) {
    if (e.event != undefined) {
      this.gridContainer.instance.beginCustomLoading("Loading");
      this.reportHeaderText = e.itemData.text;
      this.dataServiceName = e.itemData.dataService;
      this.dataMethodName = e.itemData.dataMethod;
      this.dataParameters = e.itemData.dataParameters;
      UserActionSuggestion = e.itemData.UserActionSuggestion;

      for (var i = 0; i < this.gridContainer.instance.columnCount(); i++) {
        var visibleIndex = this.gridContainer.instance.columnOption(i, "visibleIndex");
        if (visibleIndex >= 0) {
          this.gridContainer.instance.columnOption(this.gridContainer.instance.columnOption(i, "dataField"), "visible", false);
        }
        /*if(Number(i+1) == this.gridContainer.instance.columnCount()){
          for (var j = 0; j < Object.keys(e.itemData.columnHeader).length; j++) {
            this.gridContainer.instance.columnOption(e.itemData.columnHeader[j].columns, "visible", true);
          }
        }*/
      }
      this.columns1 = e.itemData.columnHeader;
      for (var j = 0; j < Object.keys(e.itemData.columnHeader).length; j++) {
        this.gridContainer.instance.columnOption(e.itemData.columnHeader[j].columns, "visible", true);
      }
      this.gridContainer.instance.refresh();
      this.gridContainer.instance.endCustomLoading();
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      this.gridContainer.instance.refresh();
    }
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "invoicestatus") {
      if (e.value == "Approved")
        e.cellElement.className += " color-for-column-Approved";
      else if (e.value == "OPEN")
        e.cellElement.className += " color-for-column-OPEN";
      else if (e.value == "SENT FOR APPROVAL")
        e.cellElement.className += " color-for-column-SFApproval";
      else if (e.value == "Rejected")
        e.cellElement.className += " color-for-column-Rejected";
    }
  }

  suggestionFormateForCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, UserActionSuggestion[1], UserActionSuggestion[2]);
  }

  valueExprsuggestionFormateForCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, UserActionSuggestion[1]);
  }

  hoversuggestionFormateForCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, UserActionSuggestion[1], UserActionSuggestion[2]);
  }

  setTextInTextField(itemData5) {
    this.FormDate.AccountCode = itemData5 ? itemData5["" + UserActionSuggestion[1]] : this.FormDate.AccountCode;
    return itemData5 != null ? itemData5["" + UserActionSuggestion[1]] : '';
  }

  getFormatOfNumber(e) {
    if (this.dataServiceName == "ARDetailTrailBalance") {
      return " ";
    } else {
      return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }
  }

  incomeTotal(e) {
    if (this.dataServiceName == "IncomeStatement" || this.dataServiceName == "IncomeStatementSummary") {
      var Total = 0.0;
      var TotalExp = 0.0;
      var TotalInc = 0.0;
      for (var i = 0; i < Object.keys(this.printLines).length; i++) {
        if (this.printLines[i]["Particulars"] == "TOTAL   EXPENSES") {
          TotalExp = Number(this.printLines[i]["TOTAL"]);
        } if (this.printLines[i]["Particulars"] == "TOTAL   INCOME") {
          TotalInc = Number(this.printLines[i]["TOTAL"]);
        }
      }
      Total = TotalInc - TotalExp;
      return Total;
    } else {
      return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }
  }

  onDropDownCodeChanged(event) {
    event.value = (event.value == null ? '' : event.value);
    this.FormDate.AccountCode = event.value;
    this.gridContainer.instance.refresh();
  }

  AccountingReportGo(userOption) {
    if (userOption == '') {
      this.toastr.warning("Please Select The Operation");
    } else if (userOption == 'Print Order') {
      if (Object.keys(this.printLines).length > 0) {
        this.generateStdPDF(null, this.printLines, this.dataServiceName);
      } else {
        this.toastr.warning("There is No Lines To Print !!");
      }
    } else if (userOption == 'Refresh') {
      this.gridContainer.instance.refresh();
    }
  }

  alertCode(error, devru) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      devru.reject("No Accounting Details For this TYPE");
    }
    else {
      devru.reject("Internal server Error, Please Try After Some Times!");
      this.toastr.error("Server Error");
    }
  }

  formatNumber(number) {
    number = parseFloat(number).toFixed(2) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  public pdfFormate = {
    HeadTitleFontSize: 18,
    Head2TitleFontSize: 16,
    TitleFontSize: 14,
    SubTitleFontSize: 12,
    NormalFontSize: 10,
    SmallFontSize: 8,
    SetFont: "Garuda-Bold",
    SetFontType: "normal",
    NormalSpacing: 12,
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, title) {

    const doc = new jsPDF('p', 'pt', 'a4'); //'p', 'pt' {filters: ['ASCIIHexEncode']}

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.NormalFontSize);
    doc.textAlign("" + UtilsForGlobalData.getCompanyName(), { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY += (this.pdfFormate.NormalSpacing));
    doc.textAlign("As On : " + UtilsForGlobalData.getCurrentDate(), { align: "center" }, this.pdfFormate.startX, tempY += (this.pdfFormate.NormalSpacing));
    tempY += (this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    function SortByName(x, y) {
      return ((x[sortColumnName] == y[sortColumnName]) ? 0 : ((x[sortColumnName] > y[sortColumnName]) ? 1 : -1));
    }

    if (printLines[0].MainType != undefined) {
      var sortColumnName = "MainType";
      printLines.sort(SortByName);

      for (var j = 0; j < this.AccountType.length; j++) {
        var index = Object.keys(printLines).length;
        var lastIndex = -1;
        var lastSubIndex = -1;
        for (var i = 0; i < index; i++) {
          if (this.AccountType[j] == printLines[i].MainType) {
            var firstCol = this.columns1[0].pdfFirstColumn;
            var json = {};
            if (lastIndex == -1) {
              json[firstCol] = this.AccountType[j];
              printLines.splice(Number(i), 0, json);
              lastIndex = i;
            }
            else {
              if (this.columns1[0].pdfSecondColumn != undefined) {
                if (lastSubIndex == -1) {
                  json = {};
                  json[firstCol] = "   " + printLines[i][this.columns1[0].pdfSecondColumn];
                  printLines.splice(Number(i), 0, json);
                  lastSubIndex = i;
                } else if (printLines[i][firstCol] == "TOTAL") {
                  printLines[i][firstCol] = "           " + printLines[i][firstCol];
                  lastSubIndex = -1;
                } else if (printLines[i][firstCol].indexOf("TOTAL") != -1) {
                  printLines[i][firstCol] = printLines[i][firstCol];
                  printLines.splice(Number(i) + 1, 0, {});
                  lastSubIndex = -1;
                } else {
                  printLines[i][firstCol] = "        " + printLines[i][firstCol];
                }
              } else {
                if (printLines[i][firstCol].indexOf("TOTAL") != -1) {
                  printLines[i][firstCol] = printLines[i][firstCol];
                  printLines.splice(Number(i) + 1, 0, {});
                } else {
                  printLines[i][firstCol] = "        " + printLines[i][firstCol];
                }
              }
            }
          }
        }
      }
    }
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      for (var prop in printLines[i]) {
        if (!isNaN(printLines[i][prop])) {
          printLines[i][prop] = this.formatNumber(printLines[i][prop]) == 'NaN' ? "" : this.formatNumber(printLines[i][prop]);
        }
      }
      if (printLines[i][this.columns1[0].pdfFirstColumn] != undefined) {
        if (printLines[i][this.columns1[0].pdfFirstColumn].indexOf("TOTAL") != -1)
          printLines.splice(Number(i) + 1, 0, {});
      }
    }
    this.addTableToPDF(doc, printLines, tempY);
    doc.save("AccountingReports-" + title + ".pdf");
    this.gridContainer.instance.refresh();
  }

  addTableToPDF(doc, printLines, tempY) {
    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns1, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      columnStyles: { Acccode: { cellWidth: 5 }, name: { cellWidth: 5 }, startdebit: { cellWidth: 5 }, startcredit: { cellWidth: 5 } },
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages == 'function') {
          footerStr = footerStr;
        }
        footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.text(footerStr, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });
    if (typeof doc.putTotalPages == 'function') {
      doc.putTotalPages(totalPagesExp);
    }
  }

  calculateThePage(startY, doc) {
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY;
    }
    return startY;
  }

}



(function (API) {
  API.textAlign = function (txt, options, x, y) {
    options = options || {};
    // Use the options align property to specify desired text alignment
    // Param x will be ignored if desired text alignment is 'center'.
    // Usage of options can easily extend the function to apply different text
    // styles and sizes

    // Get current font size
    var fontSize = this.internal.getFontSize();

    // Get page width
    var pageWidth = this.internal.pageSize.width;

    // Get the actual text's width
    // You multiply the unit width of your string by your font size and divide
    // by the internal scale factor. The division is necessary
    // for the case where you use units other than 'pt' in the constructor
    // of jsPDF.

    var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

    if (options.align == "center") {

      // Calculate text's x coordinate
      x = (pageWidth - txtWidth) / 2;

    } else if (options.align == "centerAtX") { // center on X value

      x = x - (txtWidth / 2);

    } else if (options.align == "right") {

      x = x - txtWidth;
    } else if (options.align == "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;
    }

    // Draw text at x,y
    /*if(y >= this.internal.pageSize.height - 25){
      this.addPage();
      this.text("Page "+this.internal.getNumberOfPages(), 0, this.internal.pageSize.height - 10);
    } //%(this.internal.pageSize.height - 25)*/
    this.text(txt, x, y);
  };
  /*
      API.textWidth = function(txt) {
          var fontSize = this.internal.getFontSize();
          return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
      };
  */

  API.getLineHeight = function (txt) {
    return this.internal.getLineHeight();
  };

})(jsPDF.API);
