import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
var writtenNumber = require('written-number');
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { Column } from 'ng2-smart-table/lib/data-set/column';
var itemListArray: any = [];

/* @Author Ganesh
/* this is For Sales Credit Memo
/* On 22-11-2019
*/


@Component({
  selector: 'app-sales-credit-memo-details',
  templateUrl: './sales-credit-memo-details.component.html',
  styleUrls: ['./sales-credit-memo-details.component.css']
})

export class SalesCreditMemoDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  itemArray: any = [];
  SalesCNDetails: [];
  duplicateSaleCNHeader: any[];
  SCNNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('SCMNumber');
  dataSource: any = {};
  customerSuggestions: any = null;
  popupVisible: boolean = false;
  newSalesInvoiceDetails: any[];
  customergrpSuggestions: any = null;
  vatGrpSuggestions: any = null;
  SoListSuggestions: DataSource;
  onCreateGLBuffResultSet: any;
  balanceforpost: any;
  companyData: any = {};
  isLinesExist: Boolean = false;
  dropdownmenu = ['Print Order', 'Post'];

  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Order No", dataKey: "ConnectedOrder", width: 40 },
    { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 },
    { title: "Sales Staff", dataKey: "Salesperson", width: 40 }
  ];
  columnHeader0 = [
    { title: "Bill To/Buyer", dataKey: "BillToBuyer", width: 40 },
    { title: "Ship To/Consignee", dataKey: "shipToConsignee", width: 40 }
  ];
  columnHeader2 = [
    { title: "SN", dataKey: "SnNo", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "Rate", dataKey: "UnitPrice", width: 40 },
    { title: "Qty", dataKey: "QuantityToInvoice", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Vat Amount", dataKey: "VatAmount", width: 40 },
    { title: "Amt.IncTax", dataKey: "AmountIncludingVAT", width: 40 }
  ];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("SalesCreditMemo", "getSaleInvoiceHeader", ['',
      this.SCNNumber])
      .subscribe(getSaleInvoiceHeader => {
        this.printHeader = getSaleInvoiceHeader;
        this.assignToDuplicate(getSaleInvoiceHeader);
        this.SalesCNDetails = getSaleInvoiceHeader[0];
        this.dataFromService.getServerData("SRListForCreditNote", "getAllLines", ['',
          this.SalesCNDetails["BillToCustomer"]])
          .subscribe(getList => {
            this.SoListSuggestions = new DataSource({
              store: <String[]>getList,
              paginate: true,
              pageSize: 10
            });
          });
      });
  }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "LineType", "LineCode", "NewUnitPrice", "Description", "QuantityToInvoice", "UnitPrice", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount", "RRNo", "RRLineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        dummyDataServive.getServerData("SalesCreditMemo", "getSaleInvoiceLines", ["", thisComponent.SCNNumber])
          .subscribe(dataLines => {
            if ((dataLines ? Object.keys(dataLines).length > 0 : false)) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.printLines = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SalesCreditMemo", "btnDelLine_clickHandler", ["",
          thisComponent.SCNNumber,
          key["LineNo"],
          key["LineType"],
          key["RRNo"],
          key["RRLineNo"]])
          .subscribe(data => {
            if (data[0] != 'DONE') {
              devru.reject("Error while Updating the Lines with ItemCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR " + data[0]);
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SaleCreditMemoLineEdit", "btnSave_clickHandler", ["",
          getUpdateValues(key, newValues, "NewUnitPrice"),
          getUpdateValues(key, newValues, "UnitPrice"),
          thisComponent.SCNNumber,
          getUpdateValues(key, newValues, "LineNo")
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "LineCode") + ", Error Status Code is UPDATE-ERR");
          }
        });
        return devru.promise();
      }

    });

    this.dataFromService.getServerData("customerList", "getCustomerList", [''])
      .subscribe(getCustomerList => {
        this.customerSuggestions = new DataSource({
          store: <String[]>getCustomerList,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedcustgroup", [''])
      .subscribe(handleConnectedcustgroup => {
        this.customergrpSuggestions = new DataSource({
          store: <String[]>handleConnectedcustgroup,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", [''])
      .subscribe(handleConnectedvatBusGrp => {
        this.vatGrpSuggestions = new DataSource({
          store: <String[]>handleConnectedvatBusGrp,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyData = callData3[0];
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateSaleCNHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateSaleCNHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateSaleCNHeader[i][prop] = data[i][prop];
      }
    }
  }


  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForCustomerGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForVatGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForSolist(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "DocumentNo");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "DocumentNo");
  }

  hover5(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  showNewCustomerCard(event) {
    this.popupVisible = true;
    this.newSalesInvoiceDetails = [];
  }
  onSellToCustomerCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["BillToCustomer"] != event.value) {
      this.dataFromService.getServerData("SalesCreditMemo", "handleBuyFromLookUpManager", ["",
        event.value, this.SCNNumber])
        .subscribe(onSellToCustomerCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  onSellToCustomerGrpCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["CustPostingGroup"] != event.value) {
      this.dataFromService.getServerData("SalesCreditMemo", "updateHeader", ["",
        'CustPostingGroup', event.value, this.SCNNumber])
        .subscribe(onSellToCustomerGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  onSellToVatGrpCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["VATGroup"] != event.value) {
      this.dataFromService.getServerData("SalesCreditMemo", "updateHeader", ["",
        'VATGroup', event.value, this.SCNNumber])
        .subscribe(onSellToVatGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }


  onSellToSoListCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["ConnectedOrder"] != event.value) {
      this.dataFromService.getServerData("SOListForInvoice2", "btnCreateLines_clickHandler", ["",
        this.SCNNumber,
        event.value, this.SalesCNDetails["BillToCustomer"]])
        .subscribe(onSellToSoListCodeChanged => {
          if (onSellToSoListCodeChanged[0] == 'DONE') {
            this.gridContainer ? this.gridContainer.instance.refresh() : this.getHeaderDetails();
          } else {
            this.toastr.error("Error while Creating from Sales Return: " + onSellToSoListCodeChanged[0]);
          }
        });
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateSaleCNHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate') {
        if (this.SalesCNDetails[e.dataField] == null) {
          e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
        }
        this.dataFromService.getServerData("SalesCreditMemo", "updateHeader", ["",
          'DocumentDate', e.value, this.SCNNumber])
          .subscribe(callData5 => {
            if (callData5 == '-1') {
              this.toastr.error("Error In Updating!!", "Try Again");
            }
          });
      }
      if (e.dataField == 'ExternalDocumentNo') {
        this.dataFromService.getServerData("SalesCreditMemo", "updateHeader", ["",
          'ExternalDocumentNo', e.value, this.SCNNumber])
          .subscribe(callData5 => {
            if (callData5 == '-1') {
              this.toastr.error("Error In Updating!!", "Try Again");
            }
          });
      }
      if (e.dataField == 'RemarksToPrint') {
        this.dataFromService.getServerData("SalesCreditMemo", "updateHeader", ["",
          'RemarksToPrint', e.value, this.SCNNumber])
          .subscribe(callData5 => {
            if (callData5 == '-1') {
              this.toastr.error("Error In Updating!!", "Try Again");
            }
          });
      }
    }
  }

  showInfo() {
    this.popupVisible = true;
    this.dataFromService.getServerData("SaleCreditMemoPostConfirm", "createGLBufferLines", ["",
      this.SCNNumber])
      .subscribe(showInfo => {
        this.onCreateGLBuffResultSet = showInfo[1];
        this.dataFromService.getServerData("SaleCreditMemoPostConfirm", "onCreateGLBuffResultSet", ["",
          this.SCNNumber]).subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });

      });

  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.dataFromService.getServerData("SaleCreditMemoPostConfirm", "btnPost_clickHandler", ["",
        this.SCNNumber])
        .subscribe(onPostingAccountValidatation => {
          if (onPostingAccountValidatation != null) {
            if (onPostingAccountValidatation[0]["AccCount"] == '0') {
              this.dataFromService.getServerData("SaleCreditMemoPostConfirm", "onPostingAccountValidatation", ["",
                this.SCNNumber,
                UtilsForGlobalData.getUserId()]).subscribe(onPostingAccountValidatation => {
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Sales Credit Memo " + this.SCNNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/finance/sales-credit-memo-list']);
                  } else {
                    this.toastr.error("Posting Failed : " + onPostingAccountValidatation[0]);
                  }
                });
            } else {
              this.toastr.error("Account Code is Null or Not Found for " + onPostingAccountValidatation[0]["AccCount"] + "Records");
            }
          }
          else {
            this.toastr.error("Validation Failed, No Buffer Entry Found Error!");
          }
        });
    } else {
      this.toastr.error("Balance is not Zero!!");
    }
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    if (currentData.LineType == undefined) {
      for (var index = 0; index < itemListArray.length; ++index) {
        if (itemListArray[index].Code == value) {
          newData.LineCode = itemListArray[index].Code;
          newData.LineType = itemListArray[index].LineType;
          newData.Description = itemListArray[index].Description;
          newData.QuantityToInvoice = '1';
          newData.UnitPrice = itemListArray[index].UnitPrice;
          newData.LineDiscountAmount = '0.0';
          newData.AmountIncludingVAT = (newData.UnitPrice * newData.QuantityToInvoice) - newData.LineDiscountAmount;
          break;
        }
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  SalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Print Order') {
      this.generateStdPDF(this.SalesCNDetails, this.printLines, "Sales Credit Note Original");
    }
    else if (selected == 'Post') {
      this.showInfo();
    }
    else {
      this.toastr.warning("Please Select The Operation");
    }
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
    rightStartCentre: 240,
    rightStartCol1: 400,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

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

  generateStdPDF(printHeader, printLines, title) {
    if (printLines != null ? Object.keys(printLines).length > 0 : false) {
      printHeader.AmountIncludingVATWords = printHeader.CurrencyCode + " " + writtenNumber(parseInt(printHeader.AmountIncludingVAT)), { lang: 'enIndian' };
      printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? this.formatNumber(printHeader.InvDiscountAmount) : '0';
      printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
      printHeader.Amount = this.formatNumber(printHeader.Amount);
      printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = i + 1;
        printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
        printLines[i].QuantityToInvoice = this.formatNumber(printLines[i].QuantityToInvoice);
        printLines[i].Amount = this.formatNumber(printLines[i].Amount);
        printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
        printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
        printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
      }
      for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
        this.printHeader[i].ConnectedOrder = (this.printHeader[i].ConnectedOrder == null || this.printHeader[i].ConnectedOrder == '') ? ' - ' : this.printHeader[i].ConnectedOrder;
        this.printHeader[i].PaymentTerm = (this.printHeader[i].PaymentTerm == null || this.printHeader[i].PaymentTerm == '') ? ' - ' : this.printHeader[i].PaymentTerm;
        this.printHeader[i].DueDate = (this.printHeader[i].DueDate == null || this.printHeader[i].DueDate == '') ? ' - ' : this.printHeader[i].DueDate;
        this.printHeader[i].Salesperson = (this.printHeader[i].Salesperson == null || this.printHeader[i].Salesperson == '') ? ' - ' : this.printHeader[i].Salesperson;
      }
      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = (printLines[i].SnNo == null || printLines[i].SnNo == '') ? ' - ' : printLines[i].SnNo;
        printLines[i].QuantityToInvoice = (printLines[i].QuantityToInvoice == null || printLines[i].QuantityToInvoice == '') ? ' - ' : printLines[i].QuantityToInvoice;
        printLines[i].Description = (printLines[i].Description == null || printLines[i].Description == '') ? ' - ' : printLines[i].Description;
        printLines[i].UOM = (printLines[i].UOM == null || printLines[i].UOM == '') ? ' - ' : printLines[i].UOM;
        printLines[i].UnitPrice = (printLines[i].UnitPrice == null || printLines[i].UnitPrice == '') ? ' - ' : printLines[i].UnitPrice;
        printLines[i].Amount = (printLines[i].Amount == null || printLines[i].Amount == '') ? ' - ' : printLines[i].Amount;
        printLines[i].LineDiscountAmount = (printLines[i].LineDiscountAmount == null || printLines[i].LineDiscountAmount == '') ? ' - ' : printLines[i].LineDiscountAmount;
        printLines[i].VatAmount = (printLines[i].VatAmount == null || printLines[i].VatAmount == '') ? ' - ' : printLines[i].VatAmount;
      }
      const doc = new jsPDF('p', 'pt', 'a4');

      doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
      doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
      doc.setFont(this.pdfFormate.SetFont);

      var tempY = this.pdfFormate.InitialstartY;

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SubTitleFontSize);

      doc.addImage('data:image/jpeg;base64,' + this.companyData.CompanyLogo, 'PNG', 450, 30, 80, 50);
      doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, 80);
      doc.line(this.pdfFormate.startX, 85, 550, 85);
      tempY += (this.pdfFormate.NormalSpacing + 25);
      var tempYC = tempY;
      var tempYR = tempY;
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      //left
      this.companyData.Name = this.companyData.Name == null || this.companyData.Name == '' ? this.companyData.Name = ' - ' : this.companyData.Name;
      this.companyData.BranchName = this.companyData.BranchName == null || this.companyData.BranchName == '' ? this.companyData.BranchName = ' - ' : this.companyData.BranchName;
      doc.textAlign("" + this.companyData.Name + " ( " + this.companyData.BranchName + " )", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      this.companyData.Address1 = this.companyData.Address1 == null || this.companyData.Address1 == '' ? this.companyData.Address1 = ' - ' : this.companyData.Address1;
      this.companyData.Address2 = this.companyData.Address2 == null || this.companyData.Address2 == '' ? this.companyData.Address2 = ' - ' : this.companyData.Address2;
      doc.textAlign("" + this.companyData.Address1 + ", " + this.companyData.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      this.companyData.City = this.companyData.City == null || this.companyData.City == '' ? this.companyData.City = ' - ' : this.companyData.City;
      this.companyData.PostCode = this.companyData.PostCode == null || this.companyData.PostCode == '' ? this.companyData.PostCode = ' - ' : this.companyData.PostCode;
      doc.textAlign("" + this.companyData.City + "- " + this.companyData.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      this.companyData.Phone = this.companyData.Phone == null || this.companyData.Phone == '' ? this.companyData.Phone = ' - ' : this.companyData.Phone;
      this.companyData.Fax = this.companyData.Fax == null || this.companyData.Fax == '' ? this.companyData.Fax = ' - ' : this.companyData.Fax;
      doc.textAlign("Phone  : " + this.companyData.Phone + " Fax :" + this.companyData.Fax, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      this.companyData.VATID = this.companyData.VATID == null || this.companyData.VATID == '' ? this.companyData.VATID = ' - ' : this.companyData.VATID;
      doc.textAlign("Tax ID : " + this.companyData.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      //centre
      this.companyData.BranchID = this.companyData.BranchID == null || this.companyData.BranchID == '' ? this.companyData.BranchID = ' - ' : this.companyData.BranchID;
      doc.textAlign("Branch ID   : " + this.companyData.BranchID, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);

      this.companyData.AccountNo = this.companyData.AccountNo == null || this.companyData.AccountNo == '' ? this.companyData.AccountNo = ' - ' : this.companyData.AccountNo;
      doc.textAlign("Account No : " + this.companyData.AccountNo, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);

      this.companyData.EMail = this.companyData.EMail == null || this.companyData.EMail == '' ? this.companyData.EMail = ' - ' : this.companyData.EMail;
      doc.textAlign("Email         : " + this.companyData.EMail, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);
      //right
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      printHeader.DocumentNo = printHeader.DocumentNo == null || printHeader.DocumentNo == '' ? printHeader.DocumentNo = ' - ' : printHeader.DocumentNo;
      doc.textAlign("Document No   : " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1 + 20, tempYR += this.pdfFormate.NormalSpacing);

      printHeader.DocumentDate = printHeader.DocumentDate == null || printHeader.DocumentDate == '' ? printHeader.DocumentDate = ' - ' : printHeader.DocumentDate;
      doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.rightStartCol1 + 20, tempYR += this.pdfFormate.NormalSpacing);
      // doc.textAlign("Location :" + this.printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1, tempYR += this.pdfFormate.NormalSpacing);
      //box2x2

      doc.line(this.pdfFormate.startX + 255, tempY + 15, this.pdfFormate.startX + 255, tempY + 35);//middle vertical
      doc.line(this.pdfFormate.startX, tempY + 15, 550, tempY + 15);//top-hor
      doc.line(this.pdfFormate.startX, tempY + 15, this.pdfFormate.startX, tempY + 35);//left vert
      doc.textAlign("Bill To", { align: "left" }, this.pdfFormate.startX + 10, tempY + 28);
      doc.line(550, tempY + 15, 550, tempY + 35);//left-vert
      doc.line(this.pdfFormate.startX, tempY + 35, 550, tempY + 35);//bottm-hor
      doc.textAlign("Sales To", { align: "left" }, this.pdfFormate.startX + 265, tempY + 28);
      var tempBoxY = tempY;
      //text in box1
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      printHeader.BillToCustomer = printHeader.BillToCustomer == null || printHeader.BillToCustomer == '' ? printHeader.BillToCustomer = ' - ' : printHeader.BillToCustomer;
      doc.textAlign("Code: " + printHeader.BillToCustomer, { align: "left" }, this.pdfFormate.startX + 10, tempY = tempY + 45);

      printHeader.BillToName = printHeader.BillToName == null || printHeader.BillToName == '' ? printHeader.BillToName = ' - ' : printHeader.BillToName;
      doc.textAlign("Customer name: " + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);

      printHeader.BillToAddress = printHeader.BillToAddress == null || printHeader.BillToAddress == '' ? printHeader.BillToAddress = ' - ' : printHeader.BillToAddress;
      printHeader.BillToAddress2 = printHeader.BillToAddress2 == null || printHeader.BillToAddress2 == '' ? printHeader.BillToAddress2 = ' - ' : printHeader.BillToAddress2;
      doc.textAlign("Address: " + printHeader.BillToAddress + ", " + printHeader.BillToAddress2, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);

      printHeader.BillToCity = printHeader.BillToCity == null || printHeader.BillToCity == '' ? printHeader.BillToCity = ' - ' : printHeader.BillToCity;
      printHeader.BillToZip = printHeader.BillToZip == null || printHeader.BillToZip == '' ? printHeader.BillToZip = ' - ' : printHeader.BillToZip;
      doc.textAlign("" + printHeader.BillToCity + ", " + printHeader.BillToCountry + "-" + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);

      printHeader.VATID = printHeader.VATID == null || printHeader.VATID == '' ? printHeader.VATID = ' - ' : printHeader.VATID;
      doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
      // doc.textAlign("Contact: " + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX+15, tempY += this.pdfFormate.NormalSpacing);
      //text in box2
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Code: " + printHeader.BillToCustomer, { align: "left" }, this.pdfFormate.startX + 265, tempYC = tempYC + 68);
      doc.textAlign("Customer name: " + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Address: " + printHeader.BillToAddress + ", " + printHeader.BillToAddress2, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + printHeader.BillToCity + ", " + printHeader.BillToCountry + "-" + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
      //doc.textAlign("Contact: " + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX+270, tempYC += this.pdfFormate.NormalSpacing);

      //box outline
      tempY += 10;
      doc.line(this.pdfFormate.startX, tempBoxY + 35, this.pdfFormate.startX, tempY);//vert-left
      doc.line(this.pdfFormate.startX + 255, tempBoxY + 35, this.pdfFormate.startX + 255, tempY);//vert-centre
      doc.line(550, tempBoxY + 35, 550, tempY);//vert-right
      doc.line(this.pdfFormate.startX, tempY, 550, tempY);
      //no
      /*doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing+30);
      doc.setFontType(this.pdfFormate.SetFontType);
      
      doc.textAlign("DocumentNo " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Document Date" + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      
      doc.textAlign("Location ", { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      

      doc.setFontType(this.pdfFormate.SetFontType);*/

      tempY += this.pdfFormate.NormalSpacing;
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);

      doc.autoTable(this.columnHeader1, this.printHeader, {
        startX: this.pdfFormate.startX,
        startY: tempY += this.pdfFormate.NormalSpacing,
        styles: {
          font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
          fontStyle: this.pdfFormate.SetFontType, halign: 'center'
        },
        columnStyles: {
          ConnectedOrder: {
            halign: 'center'
          },
          PaymentTerm: {
            halign: 'center'
          },
          DueDate: {
            halign: 'center'
          },
          Salesperson: {
            halign: 'center'
          },

        }
      });

      tempY = doc.autoTable.previous.finalY + 10;
      const totalPagesExp = "{total_pages_count_string}";

      doc.autoTable(this.columnHeader2, printLines, {
        startX: this.pdfFormate.startX,
        startY: tempY += this.pdfFormate.NormalSpacing,
        styles: {
          font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
          fontStyle: this.pdfFormate.SetFontType, halign: 'center'
        },
        columnStyles: {
          SnNo: {
            halign: 'center'
          },
          Description: {
            halign: 'center'
          },
          UOM: {
            halign: 'center'
          },
          UnitPrice: {
            halign: 'right'
          },
          QuantityToInvoice: {
            halign: 'right'
          },
          Amount: {
            halign: 'right'
          },
          LineDiscountAmount: {
            halign: 'center'
          },
          VatAmount: {
            halign: 'center'
          },
          AmountIncludingVAT: {
            halign: 'center'
          }
        },
        headStyles: {
          fillColor: [64, 139, 202],
          halign: 'center'
        },
        didDrawPage: data => {
          let footerStr = "Page " + doc.internal.getNumberOfPages();
          if (typeof doc.putTotalPages === 'function') {
            footerStr = footerStr;
          }
          footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
          doc.setFontSize(this.pdfFormate.SmallFontSize);
          doc.text(footerStr, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }

      //-------Invoice Footer---------------------
      var rightcol1 = 340;
      var rightcol2 = 480;
      // var writtenNumber = require('written-number');
      doc.setFontType(this.pdfFormate.SetFontType);
      var startY = doc.autoTable.previous.finalY + 30;
      startY = this.calculateThePage(startY, doc);

      doc.textAlign("In Words : " + printHeader.AmountIncludingVATWords, { align: "left" }, this.pdfFormate.startX, startY);
      doc.setFontType(this.pdfFormate.SetFontType);

      var startY = doc.autoTable.previous.finalY + 30;
      startY = this.calculateThePage(startY, doc);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Total Bill Value", { align: "left" }, rightcol1, (startY));
      doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Tax amount", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);
      if (Number(printHeader.InvDiscountAmount) > 0) {
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
        doc.textAlign(printHeader.InvDiscountAmount, { align: "right-align" }, rightcol2, startY);
      }

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Amount Inc Tax", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);


      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
      doc.setLineWidth(1);
      var inty = startY += this.pdfFormate.NormalSpacing + 30;
      doc.line(this.pdfFormate.startX, inty, 550, inty);

      startY += this.pdfFormate.NormalSpacing;
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
      //  doc.textAlign("Name      : ", { align: "left" }, this.pdfFormate.startX, startY+12);
      doc.textAlign("_______/______/_______", { align: "left" }, this.pdfFormate.startX, startY + 24);
      // doc.textAlign("Email Id   : ", { align: "left" }, this.pdfFormate.startX, startY+36);
      //doc.textAlign("Checked By", { align: "center" }, rightcol1, startY);
      //  doc.textAlign(""+this.companyHeader.Name,{align:"right-align"},rightcol2,startY);
      doc.textAlign("Approved By", { align: "left-align" }, rightcol2 - 25, startY);
      doc.textAlign("_______/______/_______", { align: "right-align" }, rightcol2, startY + 24);
      /* doc.textAlign("Clarification on Credit Note",{align:"left"},this.pdfFormate.startX+120,startY);
       doc.textAlign("Name: ",{align:"left"},this.pdfFormate.startX+120,startY+12);
       doc.textAlign("Phone: ",{align:"left"},this.pdfFormate.startX+120,startY+24);
       doc.textAlign("Email Id: ",{align:"left"},this.pdfFormate.startX+120,startY+36);
 
       doc.textAlign("Material Received & Accepted",{ align: "left" }, this.pdfFormate.startX+270, startY);
       doc.textAlign("in Good Condition",{ align: "left" }, this.pdfFormate.startX+270, startY+12);
       doc.textAlign(""+printHeader.BillToName,{ align: "left" }, this.pdfFormate.startX+270, startY+24);*/
      // doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
      /*doc.textAlign("Material Received & Accepted",{ align: "left" }, this.pdfFormate.startX+210, startY);
       doc.textAlign("in Good Condition",{ align: "left" }, this.pdfFormate.startX+210, startY+12);
       doc.textAlign(""+printHeader.BillToName,{ align: "left" }, this.pdfFormate.startX+210, startY+24);*/
      //  doc.textAlign(""+this.companyData.Name,{align:"right-align"},rightcol2,startY);
      // doc.textAlign("",{align:"right-align"},rightcol2,startY+7);
      // doc.textAlign("Approved By", { align: "right-align" }, rightcol2, startY+36);


      doc.save("SalesInvoice" + this.SCNNumber + ".pdf");
    } else {
      this.toastr.warning("Please add The Lines!!");
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

    if (options.align === "center") {

      // Calculate text's x coordinate
      x = (pageWidth - txtWidth) / 2;

    } else if (options.align === "centerAtX") { // center on X value

      x = x - (txtWidth / 2);

    } else if (options.align === "right") {

      x = txtWidth - x;
    } else if (options.align === "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;
    } else if (options.align === "right-align") {

      x = x;
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

