import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { WmsTransferReceiveDetailsHttpDataService } from './wms-transfer-receive-details-http-data.service';

@Component({
  selector: 'app-wms-transfer-receive-details',
  templateUrl: './wms-transfer-receive-details.component.html',
  styleUrls: ['./wms-transfer-receive-details.component.css']
})

export class WmsTransferReceiveDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  TRNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('TransferRNumber');
  transHeader: any;
  duplicateTHeader: string[];
  allLocation: any;
  inTransitLocation: any;
  dataSource: any;
  itemArray: any = [];
  TransferDetailsOperations: any = ['Receive'];
  printPickLine: any;
  columns1 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "รหัสสินค้า", dataKey: "ItemCode", width: 40 },
    { title: "หมวดย่อย", dataKey: "LotNo", width: 40 },
    { title: "ชื่อสินค้า", dataKey: "Description", width: 40 },
    { title: "หน่วยนับ", dataKey: "BaseUOM", width: 40 },
    { title: "จำนวน", dataKey: "QuantitySent", width: 40 },
  ];
  TotalQty: number;
  GrandTotalQty: number;
  companyHeader: any;
  StockAvailable: Number = 0;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalLocationLookupPopup: boolean = false;
  globalIntransitLocationLookupPopup: boolean = false;
  isLinesExist: boolean = false;
  allowAdding: boolean = false;
  typeOfLocation: String = '';


  constructor(
    private httpDataService: WmsTransferReceiveDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  gettransferheader() {
    this.httpDataService.openTransHeader(['', this.TRNumber])
      .subscribe(openTransHeader => {
        this.assignToDuplicate(openTransHeader);
        this.transHeader = openTransHeader[0];
      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicatePickHeader
    this.duplicateTHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateTHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateTHeader[i][prop] = data[i][prop];
      }
    }
  }


  ngOnInit() {

    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["LineNo", "ItemCode", "BaseUOM", "Description", "LotNo", "QuantitySent", "QuantityReceived", "QuantityReceiving"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.gettransferheader();
        thisComponent.httpDataService.openTransferLines(["",
          thisComponent.TRNumber]).subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.printPickLine = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        switch (checkData(key, getUpdateValues(key, newValues, "QuantityReceiving"))) {
          case 1: {
            devru.reject("Please enter a positive Number!");
            break;
          }
          case 2: {
            devru.reject("Receiving Units Should be less or Equal to Number of Units Shipped!!");
            break;
          }
          case 3: {
            thisComponent.httpDataService.looseDG_itemEditEndHandler(["",
              getUpdateValues(key, newValues, "QuantityReceiving"),
              thisComponent.TRNumber,
              getUpdateValues(key, newValues, "LineNo")
            ]).subscribe(dataStatus => {
              if (dataStatus >= 0) {
                devru.resolve(dataStatus);
              } else {
                devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
              }
            });
            break;
          }
          default: {
            break;
          }
        }
        return devru.promise();
      }
    });

    this.allLocation = new CustomStore({
      key: ["Code", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.AllLocation([""]).subscribe(dataLines => {
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    this.inTransitLocation = new CustomStore({
      key: ["Code", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.InTransitCode([""]).subscribe(dataLines => {
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    function checkData(previous: String, newData: String): Number {
      var receivedQty: Number = Number(previous["QuantityReceived"]);
      var ordQty: Number = Number(previous["QuantitySent"]);
      var val: Number = Number(newData);
      if (val < 0 || (newData != "0" && val == 0)) {
        // reset the entered input
        return 1;
      }
      if ((Number(val) + Number(receivedQty)) > ordQty) {
        return 2;
      }
      return 3;
    }

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : 1;
    value = value != 0 ? value : 1;
    (<any>this).defaultSetCellValue(newData, value);
  }

  onLocationSearckClicked(type) {
    this.typeOfLocation = type;
    this.globalLocationLookupPopup = true;
  }

  onIntransitLocationSearckClicked(type) {
    this.typeOfLocation = type;
    this.globalIntransitLocationLookupPopup = true;
  }

  onLocationRowClicked(event) {
    if (this.typeOfLocation == 'FromLocation') {
      this.globalLocationLookupPopup = false;
      if (event.data.Code != this.transHeader["ToLocationCode"]) {
        this.httpDataService.handleMasterLookupFLC(['',
          event.data.Code, event.data.DefPickStorage,
          this.TRNumber]).subscribe(handleMasterLookupFLC => {
            this.errorHandlingToasterForUPDATE(handleMasterLookupFLC);
          });
      } else {
        this.toastr.error("From location and To Location Cant be same");
      }
    } else if (this.typeOfLocation == 'ToLocation') {
      this.globalLocationLookupPopup = false;
      //if (event.data.Code != this.transHeader["FromLocationCode"]) {
      this.httpDataService.handleMasterLookupTLC(['',
        event.data.Code, event.data.DefStoreageUnit,
        this.TRNumber]).subscribe(handleMasterLookupFLC => {
          this.errorHandlingToasterForUPDATE(handleMasterLookupFLC);
        });
      /* } else {
        this.toastr.error("From location and To Location Cant be same");
      } */
    } else {
      this.globalIntransitLocationLookupPopup = false;
      this.httpDataService.handleMasterLookupITC(['',
        event.data.Code, event.data.DefStoreageUnit,
        this.TRNumber]).subscribe(handleMasterLookupFLC => {
          this.errorHandlingToasterForUPDATE(handleMasterLookupFLC);
        });
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateTHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'Reason') {
        if (e.dataField == 'DocumentDate') {
          if (this.duplicateTHeader[0][e.dataField] == null) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');
          }
        }
        this.httpDataService.genralMovUPDATE(["",
          e.dataField, e.value,
          this.TRNumber]).subscribe(callData3 => {
            this.errorHandlingToasterForUPDATE(callData3);
          });
      }
    }
  }


  postTransfer() {
    this.httpDataService.btnSend_clickHandler2(['', this.TRNumber,
      UtilsForGlobalData.getUserId()]).subscribe(btnSend_clickHandler2 => {
        if (btnSend_clickHandler2[0] == 'DONE') {
          this.toastr.success("Transfer " + this.TRNumber + " is successfully Received", "Received");
          this.router.navigate(['/warehouse/wms-transfer-receive-list']);
        } else {
          this.toastr.error("Transfer Receive Failed! with Error status Code :" + btnSend_clickHandler2[0], "Try again");
        }
      });
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == "DONE") {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
    }
  }

  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus >= 0) {
      this.gettransferheader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToasterForUPDATESTATUS(dataStatus) {
    if (dataStatus == true) {
      this.gettransferheader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
  }

  SalesOrderOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.warning("Please Select The Operation");
    } else if (userOption == 'Receive') {
      if (this.isLinesExist) {
        if (this.checkLinesforZeroQty()) {
          if (this.transHeader["DocumentStatus"] == 'PARTIALRECEIVED' || this.transHeader["DocumentStatus"] == 'INTRANSIT') {
            this.postTransfer();
          } else {
            this.toastr.warning("Document Status :" + this.transHeader["DocumentStatus"]);
          }
        } else {
          this.toastr.warning("No Quantity Receiving is Specified");
        }
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    } else if (userOption == 'Print Order') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.transHeader, this.printPickLine, this.columns1, "Transfer Order");
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    }
  }

  checkLinesforZeroQty(): Boolean {
    var qty: Number = 0;
    for (var i = 0; i < Object.keys(this.printPickLine).length; i++) {
      qty = Number(qty) + Number(this.printPickLine[i]["QuantityReceiving"]);
    }
    if (qty > 0) {
      return true;
    }
    return false;
  }

  onHidden(e) {
    this.globalItemLookupPopup = false;
    this.itemArray = null;
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

  calculateThePage(startY, doc) {
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY;
    }
    return startY;
  }

  generateStdPDF(printHeader, printLines, columHeader, title) {

    printHeader.TotalQuantitySent = 0;

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.TotalQuantitySent = Number(printHeader.TotalQuantitySent) + Number(printLines[i].QuantitySent);
      printLines[i].QuantitySent = this.formatNumber(printLines[i].QuantitySent);
    }

    const doc = new jsPDF('p', 'pt', 'a4'); //'p', 'pt' {filters: ['ASCIIHexEncode']}

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50); //variable.company_logo.src
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address2 + "," + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document No : " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Date : " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT :", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.FromLocationCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.ToLocationCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);



    //-------Customer Info Billing---------------------
    var startBilling = this.pdfFormate.startY;
    tempY += 25;


    // columnStyles: {
    //   id: {fillColor: 255}
    // },

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columHeader, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          footerStr = footerStr;
        }
        footerStr += "  Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
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
    var startY = doc.autoTable.previous.finalY;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalQuantitySent, { align: "right-align" }, rightcol2, startY);


    //-------Invoice Footer---------------------
    var rightcol1 = 340;
    var rightcol2 = 480;
    doc.setFontType(this.pdfFormate.SetFontType);
    var startY = doc.autoTable.previous.finalY;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("หมายเหตุ : " + printHeader.Reason, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    var inty = startY += this.pdfFormate.NormalSpacing + 30;
    doc.line(this.pdfFormate.startX, inty, 150, inty);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("ผุ้ตรวจสอบ", { align: "center" }, rightcol1, startY);
    doc.textAlign("ผู้ส่ง.................................", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("........................................", { align: "center" }, rightcol1, startY);
    doc.textAlign("วันที่ ......./............/...........", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("วันที่ ......./............/...........", { align: "center" }, rightcol1, startY);
    doc.textAlign("ผู้รับ.................................", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("วันที่ ......./............/...........", { align: "right-align" }, rightcol2, startY);

    doc.save("TransferReceipt" + this.TRNumber + ".pdf");
    this.gridContainer.instance.refresh();
  }


}


