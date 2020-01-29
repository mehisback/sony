import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
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
import { ToastrService } from 'ngx-toastr';

let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');

import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
var itemListArray: any = [];

/* @Author Ganesh
/* this is For Purchase Credit Note
/* On 27-02-2019
*/

@Component({
  selector: 'app-purchasecreditnote-details',
  templateUrl: './purchasecreditnote-details.component.html',
  styleUrls: ['./purchasecreditnote-details.component.css']
})

export class PurchasecreditnoteDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("refreshtebgrid") refreshtebgrid: DxDataGridComponent;
  @ViewChild("getlinesforgrid") getlinesforgrid: DxDataGridComponent;
  @ViewChild("getlinesforgrid2") getlinesforgrid2: DxDataGridComponent;

  POOperations: any = ['Print Order', 'Post'];
  PCNNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PCNNumber');
  itemArray: any = [];
  dataSource: any = {};
  vendorSuggestions: any = null;
  popupVisible: boolean = false;
  newPurchaseInvoiceDetails: any[];
  vendorgrpSuggestions: any = null;
  vatGrpSuggestions: any = null;
  PRListSuggestions: any = null;
  onCreateGLBuffResultSet: any;
  balanceforpost: any;
  companyData: any = {};

  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Order No", dataKey: "FromInvoiceNo", width: 40 },
    { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "LineCode", dataKey: "LineCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "UOM", width: 40 },
    { title: "Cost", dataKey: "DirectUnitCost", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Qty", dataKey: "QuantityToInvoice", width: 40 },
    { title: "Amt.IncTax", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  PurchaseCNDetails: any = [];
  popupforlines: boolean = false;
  isLinesExist: boolean = false;
  POlinesfortab: any;
  dataSource1: Object;
  dataSource2: Object;
  duplicatePurchCNHeader: any[];
  itemPopupName = "ITEM DETAILS";
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalServiceItemLookupPopup: boolean = false;
  globalDepositItemLookupPopup: boolean = false;
  globalVendorDetailsPopup: Boolean = false;
  globalVendorLookupPopup: boolean = false;
  TAX: number = 0;
  Quantity: number = 0;
  TotalLineDiscountAmount: any;
  totalInvoiceDisocunt: any;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("PurchaseCreditNote", "getPurchaseInvoiceHeader", ['',
      this.PCNNumber])
      .subscribe(getPurchaseInvoiceHeader => {
        this.printHeader = getPurchaseInvoiceHeader;
        this.assignToDuplicate(getPurchaseInvoiceHeader);
        this.PurchaseCNDetails = getPurchaseInvoiceHeader[0];
        if (this.PurchaseCNDetails["AmtIncvat"] == 'Yes') {
          this.PurchaseCNDetails["AmtIncvat"] = true;
        } else {
          this.PurchaseCNDetails["AmtIncvat"] = false;
        }
        this.getPOListforDropdown();

        this.dataFromService.getServerData("POListForInvoice", "getAllLines", ['',
          this.PurchaseCNDetails["PayToVendor"]])
          .subscribe(getServiceItems => {
            this.itemArray = {
              paginate: true,
              pageSize: 20,
              loadMode: "raw",
              load: () =>
                <String[]>getServiceItems
            }
            itemListArray = getServiceItems;
          });

        this.dataFromService.getServerData("PurchaseCreditNote", "getTotalLinesDiscAmt", ['',
          this.PCNNumber]).subscribe(getTotalLinesDiscAmt => {
            this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
            this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.PurchaseCNDetails["InvDiscountAmount"])).toFixed(2);
          });
        this.dataFromService.getServerData("PurchaseCreditNote", "getPurchaseInvoiceLinesQuantity", ['',
          this.PCNNumber]).subscribe(getTotalLinesDiscAmt => {
            this.Quantity = getTotalLinesDiscAmt[0]["getPurchaseInvoiceLinesQuantity"];
          });
        this.TAX = this.PurchaseCNDetails["AmountIncludingVAT"] - this.PurchaseCNDetails["Amount"];

      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicatePurchCNHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatePurchCNHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatePurchCNHeader[i][prop] = data[i][prop];
      }
    }
  }

  getlines() {
    this.dataFromService.getServerData("POListForInvoice", "getAllLines", ['',
      this.PurchaseCNDetails["PayToVendor"]]).subscribe(getServiceItems => {
        this.itemArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () =>
            <String[]>getServiceItems
        }
        itemListArray = getServiceItems;
      });
  }

  getPOListforDropdown() {
    this.dataFromService.getServerData("PRListForCreditNote2", "getList", ['',
      this.PurchaseCNDetails["PayToVendor"], this.PurchaseCNDetails["DocumentDate"]])
      .subscribe(getList => {
        this.PRListSuggestions = new DataSource({
          store: <String[]>getList,
          paginate: true,
          pageSize: 10
        });
      });

  }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "LineType", "LineCode", "PickDocumentNo", "PickLineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        dummyDataServive.getServerData("PurchaseCreditNote", "getPurchaseInvoiceLines", ["", thisComponent.PCNNumber])
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
        dummyDataServive.getServerData("PurchaseCreditNote", "btnDelLine_clickHandler", ["",
          thisComponent.PCNNumber,
          key["LineNo"],
          key["LineType"],
          key["PickDocumentNo"],
          key["PickLineNo"]])
          .subscribe(data => {
            if (data[0] == 'DONE') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR " + data[0]);
            }
          });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyData = callData3[0];
      });

    this.dataFromService.getServerData("vendorList", "getVendorList", [''])
      .subscribe(getVendorList => {
        this.vendorSuggestions = new DataSource({
          store: <String[]>getVendorList,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedvendgroup", [''])
      .subscribe(handleConnectedvendgroup => {
        this.vendorgrpSuggestions = new DataSource({
          store: <String[]>handleConnectedvendgroup,
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

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForVendor(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "VendCode", "Name");
  }

  suggestionFormateForVendorGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForVatGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForPolist(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "DocumentNo");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "VendCode", "Name");
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

  updateVendorGroup() {
    this.dataFromService.getServerData("PurchaseCreditNote", "onPaytoVendorUpdate", ["",
      this.PCNNumber])
      .subscribe(onPaytoVendorUpdate => {
        this.getHeaderDetails();
      });
  }

  ItemDeatilsForPopUp(data) {
    this.itemPopupName = "ITEM DETAILS";
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["BaseQuantity", "QuantityToInvoice", "DirectUnitCost", "AmountIncludingVAT", "LineDiscountAmount", "VatAmount", "InvDiscountAmount"]);
    this.itemDetailsPopup = true;
  }

  onVendorSearchClicked(type) {
    this.globalVendorLookupPopup = true;
  }

  onVendorRowClicked(event) {
    this.globalVendorLookupPopup = false;
    this.dataFromService.getServerData("PurchaseCreditNote", "handlePayToLookUpManager", ["",
      event.data.VendCode, this.PCNNumber])
      .subscribe(handlePayToLookUpManager => {
        this.updateVendorGroup();
      });
  }

  onSellToVendorCodeChanged(event) {
    if (this.duplicatePurchCNHeader[0]["PayToVendor"] != event.value) {
      this.dataFromService.getServerData("PurchaseCreditNote", "handlePayToLookUpManager", ["",
        event.value, this.PCNNumber])
        .subscribe(handlePayToLookUpManager => {
          this.updateVendorGroup();
        });
    }
  }

  onSellToVendorGrpCodeChanged(event) {
    if (this.duplicatePurchCNHeader[0]["VendorGroup"] != event.value) {
      this.dataFromService.getServerData("PurchaseCreditNote", "updateHeader", ["",
        'VendorGroup', event.value, this.PCNNumber])
        .subscribe(onSellToVendorGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  onSellToVatGrpCodeChanged(event) {
    if (this.duplicatePurchCNHeader[0]["VATGroup"] != event.value) {
      this.dataFromService.getServerData("PurchaseCreditNote", "updateHeader", ["",
        'VATGroup', event.value, this.PCNNumber])
        .subscribe(onSellToVatGrpCodeChanged => {
          this.getHeaderDetails();
        });

    }
  }

  getBuyFromVendorDetail() {
    this.globalVendorDetailsPopup = true;
  }


  onSellToPoListCodeChanged(event) {
    if (event.value ? this.duplicatePurchCNHeader[0]["ConnectedOrder"] != event.value : false) {
      var array = this.PRListSuggestions["_store"]._array;
      for (var index = 0; index < array.length; ++index) {
        if (array[index].DocumentNo == event.value) {
          this.dataFromService.getServerData("PRListForCreditNote2", "btnCreateLines_clickHandler", ["",
            this.PCNNumber, array[index].PickReturnNo, event.value, array[index].FromInvoiceNo])
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
    this.getHeaderDetails();
  }

  clearConnectedOrderfromPI() {
    if (this.PurchaseCNDetails.ConnectedOrder ? this.PurchaseCNDetails.ConnectedOrder != '' : false) {
      this.dataFromService.getServerData("SalesCreditNote", "btnPRDelete_clickHandler", ["",
        this.PCNNumber, this.PurchaseCNDetails.ConnectedOrder])
        .subscribe(btnDeletePOLines_clickHandler => {
          if (btnDeletePOLines_clickHandler[0] == 'DONE') {
            this.toastr.success("Update Successfully","DONE");
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

  PickAdHAction(event) {
    this.dataFromService.getServerData("POListForInvoice", "btnAddLinePressed", ["",
      this.PCNNumber,
      this.PurchaseCNDetails["PayToVendor"],
      event.key["DocumentNo"],
      event.key["POLineNo"],
      event.key["GRNo"],
      event.key["LineNo"]]).subscribe(btnAddLinePressed => {
        this.popupforlines = false;
        this.toastr.success(btnAddLinePressed[0]);
        this.gridContainer.instance.refresh();
      });
  }

  PoListforlines(event) {
    this.dataFromService.getServerData("POListForInvoice", "txtPONo_changeHandler", ["",
      this.PurchaseCNDetails["PayToVendor"],
      event.value])
      .subscribe(getAllLines => {
        this.dataSource1 = getAllLines;
        this.getlinesforgrid2.instance.refresh();
        UtilsForGlobalData.setLocalStorageKey('CurrentPOforLines', event.value);
      });
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicatePurchCNHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'ExternalDocumentNo' ||
        e.dataField == 'PaymentTerm' || e.dataField == 'DueDate' || e.dataField == 'VendorInvoiceNo') {
        if (e.dataField == 'DocumentDate' || e.dataField == 'DueDate') {
          if (this.duplicatePurchCNHeader[0][e.dataField] == null) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
          }
        }
        this.dataFromService.getServerData("PurchaseCreditNote", "updateHeader", ["",
          e.dataField, e.value, this.PCNNumber])
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
    this.dataFromService.getServerData("PurchCreditNotePostConfirm", "createGLBufferLines", ["",
      this.PCNNumber])
      .subscribe(createGLBufferLines => {
        this.onCreateGLBuffResultSet = createGLBufferLines[1];
        this.dataFromService.getServerData("PurchCreditNotePostConfirm", "onCreateGLBuffResultSet", ["",
          this.PCNNumber])
          .subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });
      });

  }

  getthelines() {
    this.popupforlines = true;
    this.dataFromService.getServerData("POListForInvoice", "getAllLines", ["",
      this.PurchaseCNDetails["PayToVendor"]])
      .subscribe(getAllLines => {
        this.dataSource2 = getAllLines;
        this.getlinesforgrid.instance.refresh();
      });

  }

  addLinesbyPoNumber() {
    this.dataFromService.getServerData("POListForInvoice", "btnCreateLines_clickHandler", ["",
      this.PCNNumber,
      UtilsForGlobalData.retrieveLocalStorageKey('CurrentPOforLines'),
      this.PurchaseCNDetails["PayToVendor"]
    ])
      .subscribe(btnAddLinePressed => {
        this.popupforlines = false;
        if (btnAddLinePressed[0] == 'DONE') {
          this.toastr.success(btnAddLinePressed[0]);
          this.gridContainer.instance.refresh();
        } else {
          this.toastr.error(btnAddLinePressed[0]);
        }

      });
  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.dataFromService.getServerData("PurchCreditNotePostConfirm", "btnPost_clickHandler", ["",
        this.PCNNumber])
        .subscribe(onPostingAccountValidatation => {
          if (onPostingAccountValidatation != null) {
            if (onPostingAccountValidatation[0]["AccCount"] == '0') {
              this.dataFromService.getServerData("PurchCreditNotePostConfirm", "onPostingAccountValidatation", ["",
                this.PCNNumber, UtilsForGlobalData.getUserId()])
                .subscribe(onPostingAccountValidatation => {
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Purchase Credit Note " + this.PCNNumber + " is successfully Posted and Archived", "Posted");
                    this.popupVisible = false;
                    this.router.navigate(['/finance/purchasecreditnote-list']);
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

  SalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Print Order') {
      this.generateStdPDF(this.PurchaseCNDetails, this.printLines, "Purchase Credit Note Original");
    } else if (selected == 'Post') {
      this.showInfo();
    }
    else {
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
    SetFont: "Garuda-Bold",
    SetFontType: "normal",
    NormalSpacing: 12,
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    rightStartCentre: 235,
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

      printHeader.TotalAmountinWords = this.companyData.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
      var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
      if (Number(decimalAsInt) >= 0) {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
      }
      printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
      printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? this.formatNumber(printHeader.InvDiscountAmount) : '0';
      printHeader.Amount = this.formatNumber(printHeader.Amount);
      printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = i + 1;
        printLines[i].DirectUnitCost = this.formatNumber(printLines[i].DirectUnitCost);
        printLines[i].QuantityToInvoice = this.formatNumber(printLines[i].QuantityToInvoice);
        printLines[i].Amount = this.formatNumber(printLines[i].Amount);
        printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
        printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
        printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
      }

      for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
        // this.printHeader[i].ConnectedCustCode= ( this.printHeader[i].ConnectedCustCode==null || this.printHeader[i].ConnectedCustCode=='') ? ' - ':this.printHeader[i].ConnectedCustCode;
        this.printHeader[i].FromInvoiceNo = (this.printHeader[i].FromInvoiceNo == null || this.printHeader[i].FromInvoiceNo == '') ? ' - ' : this.printHeader[i].FromInvoiceNo;
        this.printHeader[i].DueDate = (this.printHeader[i].DueDate == null || this.printHeader[i].DueDate == '') ? ' - ' : this.printHeader[i].DueDate;
        this.printHeader[i].PaymentTerm = (this.printHeader[i].PaymentTerm == null || this.printHeader[i].PaymentTerm == '') ? ' - ' : this.printHeader[i].PaymentTerm;
      }

      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = (printLines[i].SnNo == null || printLines[i].SnNo == '') ? ' - ' : printLines[i].SnNo;
        printLines[i].LineCode = (printLines[i].LineCode == null || printLines[i].LineCode == '') ? ' - ' : printLines[i].LineCode;
        printLines[i].Description = (printLines[i].Description == null || printLines[i].Description == '') ? ' - ' : printLines[i].Description;
        printLines[i].UOM = (printLines[i].UOM == null || printLines[i].UOM == '') ? ' - ' : printLines[i].UOM;
        printLines[i].DirectUnitCost = (printLines[i].DirectUnitCost == null || printLines[i].DirectUnitCost == '') ? ' - ' : printLines[i].DirectUnitCost;
        printLines[i].LineDiscountAmount = (printLines[i].LineDiscountAmount == null || printLines[i].LineDiscountAmount == '') ? ' - ' : printLines[i].LineDiscountAmount;
        printLines[i].QuantityToInvoice = (printLines[i].QuantityToInvoice == null || printLines[i].QuantityToInvoice == '') ? ' - ' : printLines[i].QuantityToInvoice;
        printLines[i].AmountIncludingVAT = (printLines[i].AmountIncludingVAT == null || printLines[i].AmountIncludingVAT == '') ? ' - ' : printLines[i].AmountIncludingVAT;
      }
      const doc = new jsPDF('p', 'pt', 'a4');

      doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
      doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
      doc.setFont(this.pdfFormate.SetFont);

      var tempY = this.pdfFormate.InitialstartY;

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SubTitleFontSize);

      tempY += (this.pdfFormate.NormalSpacing);

      doc.addImage('data:image/jpeg;base64,' + this.companyData.CompanyLogo, 'PNG', 450, 30, 80, 50);
      doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, 80);
      doc.line(this.pdfFormate.startX, 85, 550, 85);
      // tempY += (this.pdfFormate.NormalSpacing+15);
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      //left
      tempY += 27;
      var tempYC = tempY;
      var tempYR = tempY;
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
      /*doc.textAlign("" + this.companyData.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("VATID :" + this.companyData.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);*/
      //right
      printHeader.DocumentNo = printHeader.DocumentNo == null || printHeader.DocumentNo == '' ? printHeader.DocumentNo = ' - ' : printHeader.DocumentNo;
      doc.textAlign("Document No   : " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1, tempYR += this.pdfFormate.NormalSpacing);

      printHeader.DocumentDate = printHeader.DocumentDate == null || printHeader.DocumentDate == '' ? printHeader.DocumentDate = ' - ' : printHeader.DocumentDate;
      doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.rightStartCol1, tempYR += this.pdfFormate.NormalSpacing);

      //box2x2
      doc.line(this.pdfFormate.startX + 255, tempY + 15, this.pdfFormate.startX + 255, tempY + 35);//middle vertical
      doc.line(this.pdfFormate.startX, tempY + 15, 550, tempY + 15);//top-hor
      doc.line(this.pdfFormate.startX, tempY + 15, this.pdfFormate.startX, tempY + 35);//left vert
      doc.textAlign("Buy From", { align: "left" }, this.pdfFormate.startX + 10, tempY + 28);
      doc.line(550, tempY + 15, 550, tempY + 35);//left-vert
      doc.line(this.pdfFormate.startX, tempY + 35, 550, tempY + 35);//bottm-hor
      doc.textAlign("Pay To", { align: "left" }, this.pdfFormate.startX + 265, tempY + 28);
      var tempBoxY = tempY;
      //text in box1
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Code: " + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startX + 10, tempY = tempY + 45);
      doc.textAlign("Customer name: " + printHeader.PayToName, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Address: " + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + printHeader.PayToCity + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
      // doc.textAlign("Contact: " + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX+15, tempY += this.pdfFormate.NormalSpacing);
      //text in box2
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      printHeader.ConnectedOrder = printHeader.ConnectedOrder == null || printHeader.ConnectedOrder == '' ? printHeader.ConnectedOrder = ' - ' : printHeader.ConnectedOrder;
      doc.textAlign("Code: " + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startX + 265, tempYC = tempYC + 68);

      printHeader.PayToName = printHeader.PayToName == null || printHeader.PayToName == '' ? printHeader.PayToName = ' - ' : printHeader.PayToName;
      doc.textAlign("Customer name: " + printHeader.PayToName, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

      printHeader.PayToAddress = printHeader.PayToAddress == null || printHeader.PayToAddress == '' ? printHeader.PayToAddress = ' - ' : printHeader.BillPayToAddressToName;
      printHeader.PayToAddress2 = printHeader.PayToAddress2 == null || printHeader.PayToAddress2 == '' ? printHeader.PayToAddress2 = ' - ' : printHeader.PayToAddress2;
      doc.textAlign("Address: " + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

      printHeader.PayToCity = printHeader.PayToCity == null || printHeader.PayToCity == '' ? printHeader.PayToCity = ' - ' : printHeader.PayToCity;
      printHeader.PayToZip = printHeader.PayToZip == null || printHeader.PayToZip == '' ? printHeader.PayToZip = ' - ' : printHeader.PayToZip;
      doc.textAlign("" + printHeader.PayToCity + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

      printHeader.VATID = printHeader.VATID == null || printHeader.VATID == '' ? printHeader.VATID = ' - ' : printHeader.VATID;
      doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
      //doc.textAlign("Contact: " + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX+270, tempYC += this.pdfFormate.NormalSpacing);

      //box outline
      tempY += 10;
      doc.line(this.pdfFormate.startX, tempBoxY + 35, this.pdfFormate.startX, tempY);//vert-left
      doc.line(this.pdfFormate.startX + 255, tempBoxY + 35, this.pdfFormate.startX + 255, tempY);//vert-centre
      doc.line(550, tempBoxY + 35, 550, tempY);//vert-right
      doc.line(this.pdfFormate.startX, tempY, 550, tempY);
      /*doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("", { align: "left-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Pay To,", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + printHeader.DocumentNo, { align: "left-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.PayToName, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Document Date: " + printHeader.DocumentDate, { align: "left-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Payment Term: " + printHeader.PaymentTerm + " Days", { align: "left-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.PayToCity + "-" + printHeader.PayToZip, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Vat ID " + printHeader.VATID, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      tempY += this.pdfFormate.NormalSpacing;
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);*/

      doc.autoTable(this.columnHeader1, this.printHeader, {
        startX: this.pdfFormate.startX,
        startY: tempY += this.pdfFormate.NormalSpacing,
        styles: {
          font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
          fontStyle: this.pdfFormate.SetFontType, halign: 'center'
        }, columnStyles: {
          FromInvoiceNo: {
            halign: 'center'
          },
          PaymentTerm: {
            halign: 'center'
          },
          DueDate: {
            halign: 'center'
          }
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
            halign: 'left'
          },
          LineCode: {
            halign: 'left'
          },
          Description: {
            halign: 'left'
          },
          UOM: {
            halign: 'center'
          },
          DirectUnitCost: {
            halign: 'right'
          },
          LineDiscountAmount: {
            halign: 'right'
          },
          QuantityToInvoice: {
            halign: 'right'
          },
          AmountIncludingVAT: {
            halign: 'right'
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
      doc.setFontType(this.pdfFormate.SetFontType);
      var startY = doc.autoTable.previous.finalY + 30;
      startY = this.calculateThePage(startY, doc);
      doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
      doc.setFontType(this.pdfFormate.SetFontType);

      var startY = doc.autoTable.previous.finalY + 30;
      startY = this.calculateThePage(startY, doc);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Total ", { align: "left" }, rightcol1 + 20, (startY));
      doc.textAlign("" + printHeader.Amount, { align: "left-align" }, rightcol2 + 35, startY);
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Tax amount", { align: "left" }, rightcol1 + 20, startY);
      doc.textAlign("" + printHeader.AmountExcVat, { align: "left-align" }, rightcol2 + 43, startY);
      if (printHeader.InvDiscountAmount > 0) {
        doc.setFontType(this.pdfFormate.SetFontType);
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1 + 20, startY);
        doc.textAlign(printHeader.InvDiscountAmount, { align: "left-align" }, rightcol2 + 35, startY);
      }

      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Amount Inc Tax", { align: "left" }, rightcol1 + 20, startY);
      doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "left-align" }, rightcol2 + 35, startY);


      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
      doc.textAlign("Remark :", { align: "left" }, this.pdfFormate.startX, startY);
      doc.setLineWidth(1);
      var inty = startY += this.pdfFormate.NormalSpacing + 30;
      doc.line(this.pdfFormate.startX, inty, 550, inty);
      var inty = startY += this.pdfFormate.NormalSpacing + 30;
      //doc.line(this.pdfFormate.startX, inty, 150, inty);
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

      doc.save("PurchaseCreditNote" + this.PCNNumber + ".pdf");
      this.gridContainer.instance.refresh();
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
    } else if (options.align === "left-align") {

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
