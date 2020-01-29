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
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-posted-gr-details',
  templateUrl: './posted-gr-details.component.html',
  styleUrls: ['./posted-gr-details.component.css']
})
export class PostedGrDetailsComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  GRHeader: [];
  duplicateGRHeader: string[];
  companyHeader: any = {};
  postedGoodsReceiptNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('postedGoodsReceiptNumber');
  ShipFromSuggestions: any = null;
  SOForSuggestions: any = null;
  SUCodeSuggestions: any = {};
  printLines: any = {};
  dataSource: any = {};
  dataSourceGRHH: any = {};
  dataSourceGRHH2: any = [];
  looseArr: any = {};
  isDivVisible: boolean = false;
  barcodeValue: any = {};
  goodsReceiptOperation: any = ['Create QC', 'Print GoodsReceipt'];
  columns3 = [
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
    { title: "Base Qty", dataKey: "QtyinBaseUOM", width: 40 },
    { title: "POUOM", dataKey: "POUOM", width: 40 },
    { title: "QtyinPO", dataKey: "QtyinPOUOM", width: 40 },
    { title: "ReceiveQty", dataKey: "ReceiveingQuantity", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalPOLookupPopup: Boolean = false;
  globalVendorDetailsPopup: Boolean = false;
  vendorDeatilsPerVendor: any = {};
  isLinesExist: Boolean = false;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "ReceiveingQuantity", "BarcodeNo", "ReceivedQuantity", "QtyinPOUOM"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchOpenHeader();
        thisComponent.dataFromService.getServerData("wmsGRHistoryCard", "openGRLines", ["",
          thisComponent.postedGoodsReceiptNumber])
          .subscribe(dataLines => {
            thisComponent.printLines = dataLines;
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyHeader = callData3[0];
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  fetchOpenHeader() {
    this.dataFromService.getServerData("wmsGRHistoryCard", "openGROrder", ['', this.postedGoodsReceiptNumber])
      .subscribe(getLocation => {
        this.GRHeader = getLocation[0];
      });
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Create QC') {
      this.dataFromService.getServerData("wmsGRHistoryCard", "btnQC_clickHandler", ['', this.postedGoodsReceiptNumber, this.GRHeader["DocumentDate"], UtilsForGlobalData.getUserId()])
        .subscribe(postedGoodsReceiptNumber => {
          if (postedGoodsReceiptNumber[1] == 'DONE') {
            this.toastr.success("QC Successfully Created" + postedGoodsReceiptNumber[1]);
          } else {
            this.toastr.error("Failed to Create the QC :" + postedGoodsReceiptNumber[1]);
          }
        });
    } else if (selected == 'Print GoodsReceipt') {
      if (Object.keys(this.printLines).length > 0) {
        this.generateStdPDF(this.GRHeader, this.printLines, this.columns3, "Goods Receipt Duplicate");
      } else {
        this.toastr.warning("There is No Lines to Print!!");
      }
    }
  }

  setFocus(e) {
    e.component.focus();
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
    rightStartCol1: 420,
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
    printHeader.VATID = printHeader.VATID == null ? '' : printHeader.VATID;

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyinPOUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ReceiveingQuantity);
      printLines[i].QtyinBaseUOM = this.formatNumber(printLines[i].QtyinBaseUOM);
      printLines[i].QtyinPOUOM = this.formatNumber(printLines[i].QtyinPOUOM);
      printLines[i].ReceiveingQuantity = this.formatNumber(printLines[i].ReceiveingQuantity);
    }

    const doc = new jsPDF('p', 'pt', 'a4'); //'p', 'pt' {filters: ['ASCIIHexEncode']}

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;



    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50); //variable.company_logo.src
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "right-align" }, this.pdfFormate.startX, tempY);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign(printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);
    doc.setFont(this.pdfFormate.SetFont);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Address2 + "," + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("Date : " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);


    //tempY += (this.pdfFormate.NormalSpacing);


    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    // doc.textAlign(printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT :", { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.Code, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Location Code  : " + printHeader.LocationCode, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address + " " + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("SU CODE         : " + printHeader.DefReceiveStorage, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.City + " " + printHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Handled By      : " + printHeader.HandledBy, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("VAT ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

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
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      },
      columnStyles: {
        ItemCode: {
          halign: 'left'
        },
        Description: {
          halign: 'left'
        },
        BaseUOM: {
          halign: 'right'
        },
        QtyinBaseUOM: {
          halign: 'right'
        },
        POUOM: {
          halign: 'right'
        },
        QtyinPOUOM: {
          halign: 'right'
        },
        ReceiveingQuantity: {
          halign: 'right'
        }
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
    doc.textAlign("REMARK:", { align: "left" }, this.pdfFormate.startX, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.O. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL RECEIVE QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 60, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("PostedGoodsReceipt" + this.postedGoodsReceiptNumber + ".pdf");
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
