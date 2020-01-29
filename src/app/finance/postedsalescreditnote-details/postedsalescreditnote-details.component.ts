import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import { PostedsalescreditnoteDetailsHttpDataService } from './postedsalescreditnote-details-http-data.service';

/* @Author Ganesh
/* this is For Posted Sales Credit Note
/* On 01-03-2019
*/


@Component({
  selector: 'app-postedsalescreditnote-details',
  templateUrl: './postedsalescreditnote-details.component.html',
  styleUrls: ['./postedsalescreditnote-details.component.css']
})


export class PostedsalescreditnoteDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  itemArray: any = [];
  SalesCNDetails: [];
  duplicateSaleCNHeader: any[];
  SCNNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PSCNNumber');
  dataSource: any = {};
  companyHeader: any = {};
  dropdownmenu = ['Print Order', 'Post'];

  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Order No", dataKey: "ConnectedOrder", width: 40 },
    { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 },
    { title: "Sales Staff", dataKey: "Salesperson", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "UOM", width: 40 },
    { title: "Rate", dataKey: "UnitPrice", width: 40 },
    { title: "Quantity", dataKey: "QuantityToInvoice", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Toatal Vat Amount", dataKey: "VatAmount", width: 40 },
    { title: "Amount IncludingVAT", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  popupSelltoCustDetails: Boolean = false;
  isLinesExist: Boolean = false;

  constructor(
    private httpDtaService: PostedsalescreditnoteDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.httpDtaService.getSaleInvoiceHeader(['', this.SCNNumber]).subscribe(getSaleInvoiceHeader => {
      this.printHeader = getSaleInvoiceHeader;
      this.assignToDuplicate(getSaleInvoiceHeader);
      this.SalesCNDetails = getSaleInvoiceHeader[0];
    });
  }

  ngOnInit() {
    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "LineType", "LineCode", "Description", "QuantityToInvoice", "UnitPrice", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount", "RRNo", "RRLineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        thisComponent.httpDtaService.getSaleInvoiceLines(["",
          thisComponent.SCNNumber]).subscribe(dataLines => {
            if ((dataLines ? Object.keys(dataLines).length > 0 : false)) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.printLines = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    this.httpDtaService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });
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

  PostedSalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Print Order') {
      if (this.printLines != null ? Object.keys(this.printLines).length > 0 : false) {
        this.generateStdPDF(this.SalesCNDetails, this.printLines, "Posted Sales Credit Note Original");
      } else {
        this.toastr.warning("Please add The Lines!!");
      }
    }
    else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["UnitPrice", "Amount", "LineAmount", "AmountIncludingVAT","VatAmount","VATPerct","NetPrice"]);
    this.itemDetailsPopup = true;
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
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
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Customer name : " + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("DocumentNo " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Document Date" + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToAddress + ", " + printHeader.BillToAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Location ", { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToCity + ", " + printHeader.BillToCountry + "-" + printHeader.BillToZip, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Vat ID " + printHeader.VATID, { align: "right-align" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.autoTable(this.columnHeader1, this.printHeader, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
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
    doc.textAlign("In Words : " + printHeader.AmountIncludingVATtext, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    var startY = doc.autoTable.previous.finalY + 30;
    startY = this.calculateThePage(startY, doc);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Total Bill Value", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount Exc Vat", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);
    if (printHeader.InvDiscountAmount > 0) {
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
      doc.textAlign(printHeader.InvDiscountAmount, { align: "right-align" }, rightcol2, startY);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount Inc Vat", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    var inty = startY += this.pdfFormate.NormalSpacing + 30;
    doc.line(this.pdfFormate.startX, inty, 150, inty);

    startY += this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Aproved By", { align: "right-align" }, rightcol2, startY);

    doc.save("PostedSalesInvoice" + this.SCNNumber + ".pdf");
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


