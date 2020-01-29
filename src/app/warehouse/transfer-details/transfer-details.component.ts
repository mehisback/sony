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
import * as events from "devextreme/events";
import CustomStore from 'devextreme/data/custom_store';
import { TransferDetailsHttpDataService } from './transfer-details-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
var itemListArray: any = [];

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.css']
})
export class TransferDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("datagridforitems") datagridforitems: DxDataGridComponent;

  TRNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('TRNumber');
  transHeader: any;
  duplicateTHeader: string[];
  allLocation: any;
  dataSource: any;
  itemArray: any = [];
  TransferDetailsOperations: any = ['Print Order', 'Post'];
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
  isLinesExist: boolean = false;
  allowAdding: boolean = false;
  typeOfLocation: String = '';


  constructor(
    private httpDataService: TransferDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  gettransferheader() {
    this.httpDataService.openTransHeader(['', this.TRNumber])
      .subscribe(openTransHeader => {
        this.assignToDuplicate(openTransHeader);
        this.transHeader = openTransHeader[0];
        if (this.transHeader["FromLocationCode"]) {
          if (this.transHeader["ToLocationCode"]) {
            this.datagridforitems.instance.refresh();
            this.allowAdding = true;
          } else {
            this.allowAdding = false;
          }
        } else {
          this.allowAdding = false;
        }
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
      key: ["LineNo", "ItemCode", "BaseUOM", "Description", "LotNo", "QuantitySent", "ExpiryDate"],
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
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDelete_clickHandler(["",
          thisComponent.TRNumber, key["LotNo"],
          key["LineNo"]]).subscribe(dataStatus => {
            if (dataStatus[0] == 'DONE') {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (thisComponent.allowAdding ? values["ItemCode"] : false) {
          if (values["QuantitySent"] > 0) {
            for (var index = 0; index < itemListArray.length; ++index) {
              if (itemListArray[index].ItemCode == values["ItemCode"] && itemListArray[index].LotNumber == values["LotNo"]) {
                if (values["QuantitySent"] <= itemListArray[index].Stock) {
                  thisComponent.httpDataService.btnPickLoose_clickHandler2(["",
                    thisComponent.TRNumber,
                    values["ItemCode"],
                    values["LotNo"],
                    values["BaseUOM"],
                    values["QuantitySent"],
                    values["OriginDate"],
                    values["ExpiryDate"],
                    values["SUCode"],
                    UtilsForGlobalData.getUserId()]).subscribe(data => {
                      if (data[0] == 'DONE') {
                        devru.resolve(data);
                      } else {
                        devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + data[0]);
                      }
                    });
                } else {
                  devru.reject("Quantity is Greater than Stock Avalable( " + parseFloat(itemListArray[index].Stock).toFixed(2) + " )!, Quantity Cannot be Replaced!!");
                }
                break;
              }
            }
          } else {
            devru.reject("Quantity to Pick Can't be 0!!!");
          }
        } else {
          devru.reject("Select the From/To Location Code!!! , Data Required");
        }
        return devru.promise();
      }
    });

    this.itemArray = new CustomStore({
      key: ["ItemCode", "LotNumber", "SUCode", "Stock"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.transHeader ? thisComponent.transHeader["FromStorageUnitCode"] : false) {
          thisComponent.httpDataService.getInventoryDetails(["",
            thisComponent.transHeader["DocumentDate"],
            thisComponent.transHeader["FromLocationCode"],
            thisComponent.transHeader["FromStorageUnitCode"],]).subscribe(dataLines => {
              itemListArray = dataLines;
              devru.resolve(dataLines);
            });
        } else {
          devru.resolve();
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

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

  }

  onUserRowSelect(event, type) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "BaseUOM", event.data.UOM);
    this.gridContainer.instance.on("initNewRow", e => {
      e.data.ItemCode = event.data.ItemCode;
      e.data.Description = event.data.Description;
      e.data.BaseUOM = event.data.UOM;
      e.data.QuantitySent = event.data.Stock;
      e.data.LotNo = event.data.LotNumber;
      e.data.ExpiryDate = event.data.ExpiryDate;
      e.data.OriginDate = event.data.OriginDate;
      e.data.ExpiryHours = event.data.ExpiryHours;
      e.data.SUCode = event.data.SUCode;
    });
    this.gridContainer.instance.addRow();
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : 1;
    value = value != 0 ? value : 1;
    (<any>this).defaultSetCellValue(newData, value);
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }
  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }


  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "Description", "UOM", "Stock");
  }

  formateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hover1(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  onLocationSearckClicked(type) {
    this.typeOfLocation = type;
    this.globalLocationLookupPopup = true;
  }

  onLocationRowClicked(event) {
    this.globalLocationLookupPopup = false;
    if (this.typeOfLocation == 'FromLocation') {
      if (event.data.Code != this.transHeader["ToLocationCode"]) {
        this.httpDataService.handleMasterLookupFLC(['',
          event.data.Code, event.data.DefPickStorage,
          this.TRNumber]).subscribe(handleMasterLookupFLC => {
            this.errorHandlingToasterForUPDATE(handleMasterLookupFLC);
          });
      } else {
        this.toastr.error("From location and To Location Cant be same");
      }
    } else {
      if (event.data.Code != this.transHeader["FromLocationCode"]) {
        this.httpDataService.handleMasterLookupTLC(['',
          event.data.Code, event.data.DefStoreageUnit,
          this.TRNumber]).subscribe(handleMasterLookupFLC => {
            this.errorHandlingToasterForUPDATE(handleMasterLookupFLC);
          });
      } else {
        this.toastr.error("From location and To Location Cant be same");
      }
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
    this.httpDataService.btnSend_clickHandler(['', this.TRNumber,
      UtilsForGlobalData.getUserId()]).subscribe(btnSend_clickHandler2 => {
        if (btnSend_clickHandler2[0] == 'DONE') {
          this.toastr.success("Transfer " + this.TRNumber + " is successfully Sent", "Sent");
          this.router.navigate(['/warehouse/transfer-list']);
        } else {
          this.toastr.error("Transfer Send Failed! with Error status Code :" + btnSend_clickHandler2[0], "Try again");
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

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", true);
    this.gridContainer.instance.columnOption("Details", "visible", false);
  }

  onRowInserted(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", false);
    this.gridContainer.instance.columnOption("Details", "visible", true);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.command == "edit") {
      let cellElement = e.cellElement,
        cancelLink = cellElement.querySelector(".dx-link-cancel"),
        saveLink = cellElement.querySelector(".dx-link-save");
      events.on(cancelLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
      });
    }
  };

  rowIndex: number = 0;
  ItemLookupvalueChanged(data) {
    this.rowIndex = data.rowIndex;
    this.globalItemLookupPopup = true;
    this.httpDataService.getInventoryDetails(["",
      this.transHeader["DocumentDate"],
      this.transHeader["FromLocationCode"]]).subscribe(dataLines => {
        itemListArray = dataLines;
        this.itemArray = dataLines;
      });
  }

  onUserRowSelect1(event, type) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "BaseUOM", event.data.UOM);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "LotNo", event.data.LotNumber);
    this.gridContainer.instance.cellValue(this.rowIndex, "QuantitySent", event.data.Stock);
    this.gridContainer.instance.cellValue(this.rowIndex, "ExpiryDate", event.data.ExpiryDate);
    this.gridContainer.instance.cellValue(this.rowIndex, "StockAvailable", event.data.Stock);
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
  }

  SalesOrderOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.warning("Please Select The Operation");
    } else if (userOption == 'Post') {
      if (this.isLinesExist) {
        this.postTransfer();
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
