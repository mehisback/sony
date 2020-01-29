import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as events from "devextreme/events";
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedReturnReceiptDetailsHttpDataService } from './posted-return-receipt-details-http-data.service';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-posted-return-receipt-details',
  templateUrl: './posted-return-receipt-details.component.html',
  styleUrls: ['./posted-return-receipt-details.component.css']
})
export class PostedReturnReceiptDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;

  GRReceiptHeader: [];
  duplicateGRReceiptHeader: string[];
  companyHeader: any = {};
  GoodsReceiptReturnNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PostedGRReturnNumber');
  ShipFromSuggestions: any = {};
  SOForSuggestions: any = null;
  printLines: any = {};
  dataSource: any = {};
  dataSourceGRHH: any = {};
  dataSourceGRHH2: any = [];
  dataStore: any = [];
  isLinesExist: boolean = false;
  looseArr: any = {};
  isDivVisible: boolean = false;
  barcodeValue: any = {};
  GoodsReceiptOperation = ['Print GoodsReceipt'];
  GoodsReceiptOperationHandHeld = ['Confirm'];
  columns3 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
    { title: "Base Qty", dataKey: "QtyinBaseUOM", width: 40 },
    { title: "POUOM", dataKey: "POUOM", width: 40 },
    { title: "QtyinPO", dataKey: "QtyinPOUOM", width: 40 },
    { title: "ReceiveQty", dataKey: "ReceivedQuantity", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalSOLookupPopup: boolean = false;
  globalStoreLookupPopup: boolean = false;
  isLocationCodeSelected: boolean = false;
  popupSelltoCustDetails: Boolean = false;

  constructor(
    private httpDataService: PostedReturnReceiptDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {


    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "ReceiveingQuantity", "BarcodeNo", "ReceivedQuantity", "QtyinPOUOM"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchOpenHeader();
        thisComponent.httpDataService.openGRLines(["",
          thisComponent.GoodsReceiptReturnNumber])
          .subscribe(dataLines => {
            thisComponent.printLines = dataLines;
            if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });


    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  fetchOpenHeader() {
    this.httpDataService.openGROrder(["",
      this.GoodsReceiptReturnNumber]).subscribe(gotGRDetails => {
        this.GRReceiptHeader = gotGRDetails[0];
        if (this.GRReceiptHeader["SentFromStore"] == 'Yes') {
          this.GRReceiptHeader["SentFromStore"] = true;
        } else {
          this.GRReceiptHeader["SentFromStore"] = false;
        }
      });
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Register') {
      if (this.isLinesExist) {
      } else
        this.toastr.warning("Please Add the Lines");
    } else if (selected == 'Print GoodsReceipt') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.GRReceiptHeader, this.printLines, this.columns3, "Goods Return Receipt");
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }


  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
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

  generateStdPDF(printHeader, printLines, columHeader, title) {

    printHeader.BaseTotalQty = 0;
    printHeader.POTotalQty = 0;
    printHeader.ReceivedTotalQty = 0;
    printHeader.Comments = printHeader.Comments ? printHeader.Comments : '';

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyinPOUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ReceivedQuantity);
      printLines[i].QtyinBaseUOM = this.formatNumber(printLines[i].QtyinBaseUOM);
      printLines[i].QtyinPOUOM = this.formatNumber(printLines[i].QtyinPOUOM);
      printLines[i].ReceivedQuantity = this.formatNumber(printLines[i].ReceivedQuantity);
    }

    const doc = new jsPDF('p', 'pt', 'a4');

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
    doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT :", { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.Code, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.LocationCode, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address + " " + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("SU CODE : " + printHeader.DefReceiveStorage, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.City + " " + printHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Handled By: " + printHeader.HandledBy, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columHeader, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing * 2,
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
    var startY = doc.autoTable.previous.finalY + 30;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.O. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL RECEIVED QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks : " + printHeader.Comments, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(this.pdfFormate.startX, startY, 150, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("GoodsReceipt" + this.GoodsReceiptReturnNumber + ".pdf");
    this.gridContainer.instance.refresh();
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

      x = x - txtWidth;
    } else if (options.align === "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;
    } else if (options.align === "right-align-toleft") {
      if (430 + txtWidth > this.internal.pageSize.width - 40) {
        x = this.internal.pageSize.width - 40 - txtWidth;
      } else
        x = x;
    }
    this.text(txt, x, y);
  };

  API.getLineHeight = function (txt) {
    return this.internal.getLineHeight();
  };

})(jsPDF.API);

