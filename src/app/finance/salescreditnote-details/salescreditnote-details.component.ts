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
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
import { Column } from 'ng2-smart-table/lib/data-set/column';
var itemListArray: any = [];

/* @Author Ganesh
/* this is For Sales Credit Note
/* On 27-02-2019
*/


@Component({
  selector: 'app-salescreditnote-details',
  templateUrl: './salescreditnote-details.component.html',
  styleUrls: ['./salescreditnote-details.component.css']
})


export class SalescreditnoteDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  itemArray: any = [];
  SalesCNDetails: any = {};
  duplicateSaleCNHeader: any[];
  SCNNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('SCNNumber');
  dataSource: any = {};
  customerSuggestions: any;
  popupVisible: boolean = false;
  newSalesInvoiceDetails: any[];
  customergrpSuggestions: any;
  vatGrpSuggestions: any;
  SoListSuggestions: DataSource;
  onCreateGLBuffResultSet: any;
  balanceforpost: any;
  companyHeader: any = {};
  isLinesExist: Boolean = false;
  dropdownmenu = ['Print Order', 'Post'];

  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Sales Order No", dataKey: "ConnectedOrder", width: 40 },
    { title: "Payment Term (Days)", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 },
    { title: "Currency Code", dataKey: "CurrencyCode", width: 40 }
  ];
  columnHeader2 = [
    { title: "#", dataKey: "SnNo", width: 90 },
    { title: "ITEMCODE", dataKey: "LineCode", width: 40 },
    { title: "DESCRIPTION", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "QTY", dataKey: "QuantityToInvoice", width: 40 },
    { title: "PRICE", dataKey: "UnitPrice", width: 40 },
    { title: "AMOUNT", dataKey: "Amount", width: 40 },
    { title: "TAX AMT", dataKey: "VatAmount", width: 40 },
    { title: "AMT INC TAX", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  columnHeader3 = [
    { title: "Delivered By", dataKey: "Prepared", width: 40 },
    { title: "Recieved By", dataKey: "Checked", width: 40 },
    { title: "Approved By", dataKey: "Aproved", width: 40 }
  ];
  columnHeader4 = [
    { Prepared: "", Checked: "", Aproved: "" },
    { Prepared: "____/____/____", Checked: "____/____/____", Aproved: "____/____/____" }
  ];
  columnHeader5 = [
    { title: "HSN/SAC", dataKey: "HSNCode", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Taxable Value", dataKey: "Taxamountval", width: 40 },
    { title: "GSTAmount", dataKey: "GSTAmount", width: 40 },
  ];
  reportCustom: any = [];
  HSNSummaryArr: any = [];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalCustomerLookupPopup: boolean = false;
  popupSelltoCustDetails: Boolean = false;
  DepositAmount = 0.0;
  TAX = 0.0;
  totalDiscount: Number = 0.0;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("SalesCreditNote", "getSaleInvoiceHeader", ['',
      this.SCNNumber])
      .subscribe(getSaleInvoiceHeader => {
        this.printHeader = getSaleInvoiceHeader;
        this.assignToDuplicate(getSaleInvoiceHeader);
        this.SalesCNDetails = getSaleInvoiceHeader[0];
        this.TAX = this.SalesCNDetails["AmountIncludingVAT"] - this.SalesCNDetails["Amount"];
        this.totalDiscount = this.SalesCNDetails["InvDiscountAmount"];
        this.dataFromService.getServerData("SRListForCreditNote2", "getAllLines", ['',
          this.SalesCNDetails["BillToCustomer"],
          this.SalesCNDetails["DocumentDate"]])
          .subscribe(getList => {
            this.SoListSuggestions = new DataSource({
              store: <String[]>getList,
              paginate: true,
              pageSize: 10
            });
          });
      });
    this.getHSNSummaryLines();
  }

  getHSNSummaryLines() {
    this.dataFromService.getServerData("SalesCreditNote", "getHSNSummaryLines", ['',
      this.SCNNumber]).subscribe(dataStatus => {
        this.HSNSummaryArr = dataStatus;
      });
  }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      //key: ["LineNo", "LineType", "LineCode", "Description", "QuantityToInvoice", "UnitPrice", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount", "RRNo", "RRLineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        dummyDataServive.getServerData("SalesCreditNote", "getSaleInvoiceLines", ["", thisComponent.SCNNumber])
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
        dummyDataServive.getServerData("SalesCreditNote", "btnDelLine_clickHandler", ["",
          thisComponent.SCNNumber,
          key["LineNo"],
          key["LineType"],
          key["RRNo"],
          key["RRLineNo"]])
          .subscribe(data => {
            if (data[0] != 'DONE') {
              devru.reject("Error while Updating the Lines with LineCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR ");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SaleCreditLineEdit", "btnSave_clickHandler", ["",
          thisComponent.SCNNumber,
          getUpdateValues(key, newValues, "LineNo"),
          getUpdateValues(key, newValues, "QuantityToInvoice"),
          getUpdateValues(key, newValues, "UnitPrice"),
          getUpdateValues(key, newValues, "CostIncVAT"),
          getUpdateValues(key, newValues, "LineType")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineCode: " + getUpdateValues(key, newValues, "LineCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyHeader = callData3[0];
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

  onCustomerSearchClicked(type) {
    this.globalCustomerLookupPopup = true;
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }

  onCustomerRowClicked(event) {
    this.globalCustomerLookupPopup = false;
    this.dataFromService.getServerData("SalesCreditNote", "handleBuyFromLookUpManager", ["",
      event.data.CustCode, this.SCNNumber])
      .subscribe(onSellToCustomerCodeChanged => {
        if (onSellToCustomerCodeChanged) {
          this.dataFromService.getServerData("SalesCreditNote", "onBuyFromCustomerUpdate", ["",
            this.SCNNumber]).subscribe(onSellToCustomerChanged => {
              this.errorHandlingToasterForUpdate(onSellToCustomerChanged);
            });
        } else {
          this.toastr.error("Customer Code Update Failed!!", "Try Again");
        }
      });
  }

  onSellToCustomerCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["BillToCustomer"] != event.value) {
      this.dataFromService.getServerData("SalesCreditNote", "handleBuyFromLookUpManager", ["",
        event.value, this.SCNNumber])
        .subscribe(onSellToCustomerCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  onSellToCustomerGrpCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["CustPostingGroup"] != event.value) {
      this.dataFromService.getServerData("SalesCreditNote", "updateHeader", ["",
        'CustPostingGroup', event.value, this.SCNNumber])
        .subscribe(onSellToCustomerGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  onSellToVatGrpCodeChanged(event) {
    if (this.duplicateSaleCNHeader[0]["VATGroup"] != event.value) {
      this.dataFromService.getServerData("SalesCreditNote", "updateHeader", ["",
        'VATGroup', event.value, this.SCNNumber])
        .subscribe(onSellToVatGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }


  onSellToSoListCodeChanged(event) {
    if (event.value ? this.duplicateSaleCNHeader[0]["ConnectedOrder"] != event.value : false) {
      var array = this.SoListSuggestions["_store"]._array;
      for (var index = 0; index < array.length; ++index) {
        if (array[index].DocumentNo == event.value) {
          this.dataFromService.getServerData("SRListForCreditNote2", "btnCreateLines_clickHandler", ["",
            this.SCNNumber, array[index].ReturnReceiptNo, event.value, array[index].FromInvoiceNo])
            .subscribe(btnDeletePOLines_clickHandler => {
              if (btnDeletePOLines_clickHandler[0] == 'DONE')
                this.gridContainer.instance.refresh();
              else {
                this.toastr.error("Update Failed with the Error Status Code :" + btnDeletePOLines_clickHandler[0])
              }
            });
          break;
        }
      }
    }
  }

  clearConnectedOrderfromPI() {
    if (this.SalesCNDetails.ConnectedOrder ? this.SalesCNDetails.ConnectedOrder != '' : false) {
      this.dataFromService.getServerData("SalesCreditNote", "btnDeleteSOLines_clickHandler", ["",
        this.SCNNumber, this.SalesCNDetails.ConnectedOrder])
        .subscribe(btnDeletePOLines_clickHandler => {
          if (btnDeletePOLines_clickHandler[0] == 'DONE') {
            this.toastr.success("Update Successfully", "DONE");
          } else {
            this.toastr.error("Update Failed with the Error Status Code :" + btnDeletePOLines_clickHandler[0])
          }
          this.gridContainer.instance.refresh();
        });
    } else {
      this.toastr.warning("Please Provide the ConnectedOrder!!");
      this.gridContainer.instance.refresh();
    }
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicateSaleCNHeader[0][e.dataField] != e.value) {
        this.dataFromService.getServerData("SalesCreditNote", "updateHeader", ["",
          e.dataField, e.value, this.SCNNumber])
          .subscribe(callData5 => {
            this.errorHandlingToasterForUpdate(callData5);
          });
      }
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateSaleCNHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'ExternalDocumentNo' ||
        e.dataField == 'PaymentTerm' || e.dataField == 'DueDate' || e.dataField == 'FromInvoiceNo') {
        if (e.dataField == 'DocumentDate' || e.dataField == 'DueDate') {
          if (this.SalesCNDetails[e.dataField] == null) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
          }
        }
        this.dataFromService.getServerData("SalesCreditNote", "updateHeader", ["",
          e.dataField, e.value, this.SCNNumber])
          .subscribe(callData5 => {
            this.errorHandlingToasterForUpdate(callData5);
          });
      }
    }
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.getHeaderDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  showInfo() {
    this.popupVisible = true;
    this.dataFromService.getServerData("SaleCreditNotePostConfirm", "createGLBufferLines", ["",
      this.SCNNumber])
      .subscribe(showInfo => {
        this.onCreateGLBuffResultSet = showInfo[1];
        this.dataFromService.getServerData("SaleCreditNotePostConfirm", "onCreateGLBuffResultSet", ["",
          this.SCNNumber]).subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });
      });

  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.dataFromService.getServerData("SaleCreditNotePostConfirm", "btnPost_clickHandler", ["",
        this.SCNNumber]).subscribe(onPostingAccountValidatation => {
          if (onPostingAccountValidatation != null) {
            if (onPostingAccountValidatation[0]["AccCount"] == '0') {
              this.dataFromService.getServerData("SaleCreditNotePostConfirm", "onPostingAccountValidatation", ["",
                this.SCNNumber, UtilsForGlobalData.getUserId()])
                .subscribe(onPostingAccountValidatation => {
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Sales Credit Note " + this.SCNNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/finance/salescreditnote-list']);
                  } else {
                    this.toastr.error("Posting Failed :" + onPostingAccountValidatation[0]);
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

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["UnitPrice", "InvDiscountAmount", "LineDiscountAmount", "QuantityToInvoice", "NetPrice", "SOUnitprice", "VATPerct", "VatAmount"]);
    this.itemDetailsPopup = true;
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
      if (this.isLinesExist) {
        this.dataFromService.getServerData("reportssetup", "getAllReportsSetupDefault", ["",
          "SI"]).subscribe(callData3 => {
            this.reportCustom = callData3;
            this.generateStdPDF(this.SalesCNDetails, this.printLines, "Sales Credit Note ORIGINAL");
          });
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    }
    else if (selected == 'Post') {
      if (this.isLinesExist) {
        this.showInfo();
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  public pdfFormate = {
    HeadTitleFontSize: 18,
    Head2TitleFontSize: 16,
    TitleFontSize: 14,
    SubTitleFontSize: 12,
    NormalFontSize: 10,
    SmallFontSize: 8,
    SetFont: "Garuda",
    SetFontType: "normal",
    NormalSpacing: 12,
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    startXDetails: 100,
    startXcol2: 220,
    startXcol2Details: 280,
    startXcol3: 400,
    startXcol3Details: 460,
    startXcol4: 300,
    startXcol4Details: 360,
    centerX: 238,
    centerBOX: 255,
    InitialstartY: 40,
    startY: 0,
    startTemp: 40,
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

    printHeader.TotalAmountinWords = this.companyHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      if (Number(decimalAsInt) < 10) {
        printHeader.TotalAmountinWords += " and 0" + decimalAsInt + "/100";
      } else {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
      }
    }
    printHeader.TotalLineDiscount = 0;
    printHeader.TotalCGSTSGST = 0;
    printHeader.TotalIGST = 0;
    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? printHeader.InvDiscountAmount : 0;

    for (var i = 0; i < Object.keys(this.HSNSummaryArr).length; i++) {
      this.HSNSummaryArr[i].Quantity = this.formatNumber(this.HSNSummaryArr[i].Quantity);
      this.HSNSummaryArr[i].LineDiscountAmount = this.formatNumber(this.HSNSummaryArr[i].LineDiscountAmount);
      this.HSNSummaryArr[i].SGSTAmount = this.formatNumber(this.HSNSummaryArr[i].SGSTAmount) + "(" + Number(this.HSNSummaryArr[i].SGST) + "%)";
      this.HSNSummaryArr[i].CGSTAmount = this.formatNumber(this.HSNSummaryArr[i].CGSTAmount) + "(" + Number(this.HSNSummaryArr[i].CGST) + "%)";
      this.HSNSummaryArr[i].IGSTAmount = this.formatNumber(this.HSNSummaryArr[i].IGSTAmount) + "(" + Number(this.HSNSummaryArr[i].IGST) + "%)";
      this.HSNSummaryArr[i].Taxamountval = this.formatNumber(this.HSNSummaryArr[i].Taxamountval);
    }

    printHeader.TotalQty = 0;
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      if (printLines[i].LineType == 'ITEM') {
        printHeader.TotalQty += Number(printLines[i].QuantityToInvoice);
      }
      printLines[i].SnNo = i + 1;
      printHeader.TotalLineDiscount = Number(printHeader.TotalLineDiscount) + Number(printLines[i].LineDiscountAmount);
      printHeader.TotalCGSTSGST = Number(printHeader.TotalCGSTSGST) + Number(printLines[i].CGSTAmount) + Number(printLines[i].SGSTAmount);
      printHeader.TotalIGST = Number(printHeader.TotalIGST) + Number(printLines[i].IGSTAmount);
      printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
      printLines[i].QuantityToInvoice = this.formatNumber(printLines[i].QuantityToInvoice);
      printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
      printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
      if (Number(printLines[i].LineDiscountAmount) > 0) {
        if (this.columnHeader2.find(p => p.dataKey == "LineDiscountAmount") == undefined) {
          this.columnHeader2.splice(6, 0, { title: "LINE DISC.AMT", dataKey: "LineDiscountAmount", width: 40 });
        }
      }
      if (Number(printLines[i].SGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "SGSTAmount") == undefined) {
          this.columnHeader5.push({ title: "SGST", dataKey: "SGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].CGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "CGSTAmount") == undefined) {
          this.columnHeader5.push({ title: "CGST", dataKey: "CGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].IGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "IGSTAmount") == undefined) {
          this.columnHeader5.push({ title: "IGST", dataKey: "IGSTAmount", width: 40 });
        }
      }
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].SGSTAmount = this.formatNumber(printLines[i].SGSTAmount) + "(" + Number(printLines[i].SGST) + "%)";
      printLines[i].CGSTAmount = this.formatNumber(printLines[i].CGSTAmount) + "(" + Number(printLines[i].CGST) + "%)";
      printLines[i].IGSTAmount = this.formatNumber(printLines[i].IGSTAmount) + "(" + Number(printLines[i].IGST) + "%)";
    }

    printHeader.AmountBeforeDisc = this.formatNumber(Number(printHeader.Amount) + Number(printHeader.InvDiscountAmount) + Number(printHeader.TotalLineDiscount));
    printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);

    for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
      this.printHeader[i].CurrencyCode = this.printHeader[i].CurrencyCode ? this.printHeader[i].CurrencyCode : this.companyHeader.CurrencyCode;
      this.printHeader[i].FormtedDueDate = this.printHeader[i].DueDate != null ?
        new Date(this.printHeader[i].DueDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-') : '-';
      this.printHeader[i].ConnectedOrder = this.printHeader[i].ConnectedOrder ? this.printHeader[i].ConnectedOrder : '-';
    }

    this.companyHeader = UtilsForSuggestion.StandardValueFormat(this.companyHeader,
      ["Address1", "Address2", "City", "PostCode", "Phone", "Fax", "VATID"]);

    printHeader = UtilsForSuggestion.StandardValueFormat(printHeader,
      ["BillToCustomer", "BillToName", "BillToAddress", "BillToAddress2", "BillToCity", "BillToZip", "BillToCountry", "VATID",
        "BillToPhone", "BillToContact", "RemarksToPrint", "PaymentMethod", "RemarksToPrint", "PaymentMethodCode",
        "ConnectedPONo", "CreatedBy", "EWayBill"]);
    printHeader.FormtedDueDate = printHeader.DueDate != null ?
      new Date(printHeader.DueDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-') : '-';
    printHeader.FormteddocumentDate = new Date(printHeader.DocumentDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-');


    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda.tff", variable.thai6);
    doc.addFont('Garuda.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    if (this.companyHeader["CountryCode"] == 'THA' || this.companyHeader["CountryCode"] == 'SGP') {
      this.PrintReportForTHA(doc, printHeader, printLines, title);
    } else {
      this.PrintReportForIND(doc, printHeader, printLines, title);
    }

    doc.save("SalesCreditNotes" + this.SCNNumber + ".pdf");
    this.gridContainer.instance.refresh();
  }

  PrintReportForTHA(doc, printHeader, printLines, title) {

    var tempY = this.pdfFormate.InitialstartY;
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);

    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 100, 70);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.NormalFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    var splitTitle = doc.splitTextToSize(this.companyHeader.Address1 + ", " + this.companyHeader.Address2, 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("" + this.companyHeader.City + " " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Tax ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Name: " + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("DocumentNo: " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3, tempY);
    var tempYY = tempY + this.pdfFormate.NormalSpacing;

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.BillToAddress + ", " + printHeader.BillToAddress2, 200);
    for (var i = 0; i < splitTitle.length; i++) {
      if (i == 0) {
        doc.textAlign("Address: " + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      } else {
        doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      }
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document Date: " + printHeader.FormteddocumentDate, { align: "left" }, this.pdfFormate.startXcol3, tempYY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToCity + ", " + printHeader.BillToCountry + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Phone: " + printHeader.BillToPhone, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.autoTable(this.columnHeader1, this.printHeader, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      }
    });

    tempY = doc.autoTable.previous.finalY + 10;
    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader2, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      columnStyles: {
        SnNo: {
          halign: 'left'
        },
        LineCode: {
          halign: 'left',
          cellWidth: 80
        },
        Description: {
          halign: 'left',
          cellWidth: 100
        },
        UOM: {
          halign: 'left'
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
          halign: 'right'
        },
        AmountIncludingVAT: {
          halign: 'right'
        }
      },
      headStyles: {
        halign: 'center',
        fillColor: [64, 139, 202]
      },
      theme: 'grid',
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
    doc.setFontType(this.pdfFormate.SetFontType);
    var startY = doc.autoTable.previous.finalY + 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    var startY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY + this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL :", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    if (Number(printHeader.TotalLineDiscount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("LINE DISCOUNT :", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalLineDiscount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.InvDiscountAmount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("DISCOUNT ( " + printHeader.InvoiceCompoundDiscount + " ) :", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EXC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TAX AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(this.TAX), { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY += this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    startY += this.pdfFormate.NormalSpacing;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.autoTable(this.columnHeader3, this.columnHeader4, {
      startX: this.pdfFormate.startX,
      startY: startY,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'center'
      },
      theme: 'grid',
      headStyles: {
        fillColor: [64, 139, 202]
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
  }

  PrintReportForIND(doc, printHeader, printLines, title) {
    var tempY = this.pdfFormate.InitialstartY;
    var titleAllign = 'left';
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.setFont(this.pdfFormate.SetFont);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "CompanyLogo")) {
      var num = UtilsForSuggestion.getReportsCustomsItems(this.reportCustom, "CompanyLogo");
      num = num[0]["MetaData"] ? (num[0]["MetaData"]).split(',') : (pageEnd - 70 + ",20").split(',');
      var varx = num.length > 1 ? parseInt(num[0]) : pageEnd - 70;
      var vary = num.length > 2 ? parseInt(num[1]) : 20;
      doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', varx, vary, 70, 65);
      tempY = this.pdfFormate.InitialstartY + 35;
      if (varx < pageEnd / 2) {
        titleAllign = "right-align";
      }
    }
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: titleAllign }, this.pdfFormate.startX, tempY + 8);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);

    doc.setFontSize(this.pdfFormate.NormalFontSize);
    doc.textAlign(this.companyHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("State Code", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.StateCode, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Document No", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(":" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("GST No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Document Date", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(":" + printHeader.FormteddocumentDate, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);


    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.City + " - " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("PAN Number", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.PAN, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "EWayBill")) {
      doc.textAlign("E-Bill", { align: "left" }, this.pdfFormate.startXcol3, tempY);
      doc.textAlign(":" + printHeader.EWayBill, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    }
    //doc.textAlign("Cust PO No: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    //doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.CountryName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    // doc.textAlign("PO Date: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    doc.textAlign("Phone No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.Phone, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    doc.textAlign(this.companyHeader.HomePage, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    //doc.textAlign("CIN: " + this.companyHeader.CIN, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Email", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.EMail, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "IEC")) {
      doc.textAlign("IEC Code", { align: "left" }, this.pdfFormate.startXcol2, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign(":" + this.companyHeader.IEC, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    }

    //box2x2
    var tempX = this.pdfFormate.startX + this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 2));
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + this.pdfFormate.NormalSpacing);//top-hor
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2));//left vert
    doc.textAlign("Bill To/Buyer", { align: "left" }, tempX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    doc.line(pageEnd, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//left-vert
    doc.line(this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//bottm-hor
    doc.textAlign("Ship To/Consignee", { align: "left" }, tempX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    var tempBoxY = tempY;
    var tempYC = tempBoxY;

    //text in box1
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Code", { align: "left" }, tempX, tempY += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.BillToCustomer, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Name", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    var splitTitle = doc.splitTextToSize(printHeader.BillToName, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToAddress, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToAddress2, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.BillToCity + ", " + printHeader.BillToZip + "-" + printHeader.BillToCountry, { align: "left" }, this.pdfFormate.startXDetails, tempY);

    doc.textAlign("Contact", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToContact, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("Phone", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToPhone, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("GST No.", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXDetails, tempY);

    //text in box2
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    var tempX = this.pdfFormate.startX + this.pdfFormate.centerBOX + this.pdfFormate.NormalSpacing;
    doc.textAlign("Code", { align: "left" }, tempX, tempYC += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.BillToCustomer, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);
    doc.textAlign("Name", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToName, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToAddress, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToAddress2, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.BillToCity + ", " + printHeader.BillToCountry + "-" + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

    doc.textAlign("Contact", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToContact, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("Phone", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BillToPhone, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("GST No.", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);


    //box outline
    tempY = tempY > tempYC ? tempY : tempYC;
    tempY += 10;
    doc.line(this.pdfFormate.startX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX, tempY);//vert-left
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY);//vert-centre
    doc.line(pageEnd, tempBoxY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY);//vert-right
    doc.line(this.pdfFormate.startX, tempY, pageEnd, tempY);


    tempY += this.pdfFormate.NormalSpacing * 2;
    doc.setFontType(this.pdfFormate.SetFontType);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "ConnectedOrder")) {
      doc.textAlign("Order No", { align: "left" }, this.pdfFormate.startX, tempY);
      doc.textAlign(":" + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    }
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "DueDate")) {
      doc.textAlign("Due Date", { align: "left" }, this.pdfFormate.startXcol2, tempY);
      doc.textAlign(":" + printHeader.FormtedDueDate, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    }
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PaymentMethod")) {
      doc.textAlign("Payment Method", { align: "left" }, this.pdfFormate.startXcol3, tempY);
      doc.textAlign(":" + printHeader.PaymentMethod, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    }

    tempY += this.pdfFormate.NormalSpacing * 2;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader2, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      columnStyles: {
        SnNo: {
          halign: 'left'
        },
        LineCode: {
          halign: 'left',
          cellWidth: 80
        },
        Description: {
          halign: 'left',
          cellWidth: 100
        },
        UOM: {
          halign: 'left'
        },
        QuantityToInvoice: {
          halign: 'right'
        },
        UnitPrice: {
          halign: 'right'
        },
        LineDiscountAmount: {
          halign: 'right'
        },
        Amount: {
          halign: 'right'
        },
        VatAmount: {
          halign: 'right'
        },
        AmountIncludingVAT: {
          halign: 'right'
        }
      },
      headStyles: {
        halign: 'center'
      },
      didDrawPage: data => {
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
        //doc.text("Bank Name : Karnataka Bank Ltd, Bank AcNo : 0647000100245701, IFSC Code : KARB000006", data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    //-------Invoice Footer---------------------
    var rightcol1 = 340;
    var rightcol2 = 480;
    doc.setFontType(this.pdfFormate.SetFontType);
    var startY = doc.autoTable.previous.finalY + 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("AMOUNT", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    if (Number(printHeader.TotalLineDiscount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("LINE DISCOUNT", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalLineDiscount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.InvDiscountAmount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + ")", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.TotalCGSTSGST) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("CGST/SGST", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalCGSTSGST), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.TotalIGST) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("IGST", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalIGST), { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EXC TAX", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL GST", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(this.TAX), { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC TAX", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY += this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    doc.autoTable(this.columnHeader5, this.HSNSummaryArr, {
      startX: this.pdfFormate.startX,
      startY: startY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      columnStyles: {
        HSNCode: {
          halign: 'right'
        }
      }
    });
    startY = doc.autoTable.previous.finalY;

    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "RemarksToPrint")) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
      doc.setLineWidth(1);
      var inty = startY += this.pdfFormate.NormalSpacing;
      doc.line(this.pdfFormate.startX, inty, 150, inty);
    }

    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "TermsAndConditions")) {

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
      doc.textAlign("We certify that the particulars mentioned above are true and correct.", { align: "left" }, this.pdfFormate.startX, startY);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Payment terms- Card, online transfer, cash only.", { align: "left" }, this.pdfFormate.startX, startY);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Goods one sold cannot be taken back or exchanged. Nature of the game being such, sports goods are not guaranteed.", { align: "left" }, this.pdfFormate.startX, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PreparedBy")) {
      doc.textAlign("Prepared By:", { align: "left" }, this.pdfFormate.startX, startY);
      doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    }
    doc.textAlign("Material Received & Accepted In", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol3, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PreparedBy")) {
      doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, startY);
      doc.textAlign("" + printHeader.CreatedBy, { align: "left" }, this.pdfFormate.startX + 25, startY);
    }
    doc.textAlign("Good Condition", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign(this.companyHeader.Name, { align: "right-align" }, this.pdfFormate.startXcol3Details, startY);

    /* startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Phone:", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY); //+ printHeader.BillToName
    doc.textAlign("Customer", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign(this.companyHeader.Name, { align: "right-align" }, this.pdfFormate.startXcol3Details, startY); */

    //startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Email:", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    var tempstartY = startY;
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "SignatureSpace")) {
      var num = UtilsForSuggestion.getReportsCustomsItems(this.reportCustom, "SignatureSpace");
      num = num[0]["MetaData"] ? Number(num[0]["MetaData"]) : 3;
      startY = this.calculateThePageForSignature(tempstartY, startY += this.pdfFormate.NormalSpacing * num, doc, num);
    } else {
      startY = this.calculateThePageForSignature(tempstartY, startY += this.pdfFormate.NormalSpacing * 2, doc, 2);
    }
    doc.textAlign("Customer Signature", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("Authorised Signatory", { align: "right-align" }, this.pdfFormate.startXcol3Details, startY);
  }

  calculateThePage(startY, doc) {
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY;
    }
    return startY;
  }

  calculateThePageForSignature(currentY, startY, doc, noLines) {
    var lines = Math.ceil(Number(doc.internal.pageSize.height - this.pdfFormate.MarginEndY - currentY) / this.pdfFormate.NormalSpacing);
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY + (noLines - lines) * this.pdfFormate.NormalSpacing;
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

