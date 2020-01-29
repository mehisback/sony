import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedReturnPickDetailsHttpDataService } from './posted-return-pick-details-http-data.service';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-posted-return-pick-details',
  templateUrl: './posted-return-pick-details.component.html',
  styleUrls: ['./posted-return-pick-details.component.css']
})


export class PostedReturnPickDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;
  @ViewChild("gridContainerPA") gridContainerPA: DxDataGridComponent;

  PickReturnHeader: [];
  companyHeader: any = {};
  PickReturnNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PostedPickReturnNumber');
  printLines: any = {};
  dataSource: any = {};
  isLinesExist: boolean = false;
  GoodsReceiptOperation = ['Print Return Pick'];
  columns3 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
    { title: "Base Qty", dataKey: "QtyInBaseUOM", width: 40 },
    { title: "PRUOM", dataKey: "PRUOM", width: 40 },
    { title: "QtyinPR", dataKey: "QtyInPRUOM", width: 40 },
    { title: "ShippingQuantity", dataKey: "ShippingQuantity", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  popupSelltoCustDetails: Boolean = false;

  constructor(
    private httpDataService: PostedReturnPickDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "BaseUOM", "QtyInBaseUOM", "PRUOM", "QtyInPRUOM", "ShippingQuantity", "ShippedQuantity"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchOpenHeader();
        thisComponent.httpDataService.openPickLines(["",
          thisComponent.PickReturnNumber])
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
    this.httpDataService.openPickOrder(["",
      this.PickReturnNumber]).subscribe(gotGRDetails => {
        this.PickReturnHeader = gotGRDetails[0];
        if (this.PickReturnHeader["ReservedPick"] == 'Yes') {
          this.PickReturnHeader["ReservedPick"] = true;
        } else {
          this.PickReturnHeader["ReservedPick"] = false;
        }
      });
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Register') {
      if (this.isLinesExist) {
      } else
        this.toastr.warning("Please Add the Lines");
    } else if (selected == 'Print Return Pick') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.PickReturnHeader, this.printLines, this.columns3, "Purchase Return Pick");
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
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
    printHeader.RemarksExternal = printHeader.RemarksExternal ? printHeader.RemarksExternal : '';
    printHeader.Zone = printHeader.Zone ? printHeader.Zone : '';


    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyInBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyInPRUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ShippingQuantity);
      printLines[i].QtyInBaseUOM = this.formatNumber(printLines[i].QtyInBaseUOM);
      printLines[i].QtyInPRUOM = this.formatNumber(printLines[i].QtyInPRUOM);
      printLines[i].ShippingQuantity = this.formatNumber(printLines[i].ShippingQuantity);
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
    doc.textAlign("" + printHeader.VendorCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.LocationCode, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("SU CODE : " + printHeader.DefPickStorage, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address1 + " " + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.Zone, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.City + " " + printHeader.ZipCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
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
    var startY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.R. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL SHIPPING QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks : " + printHeader.RemarksExternal, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(this.pdfFormate.startX, startY, 150, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("ReturnPick" + this.PickReturnNumber + ".pdf");
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

