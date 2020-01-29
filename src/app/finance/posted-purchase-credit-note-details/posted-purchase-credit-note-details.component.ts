import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
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
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";

/* @Author Ganesh
/* this is For Purchase Credit Note
/* On 27-02-2019
*/

@Component({
  selector: 'app-posted-purchase-credit-note-details',
  templateUrl: './posted-purchase-credit-note-details.component.html',
  styleUrls: ['./posted-purchase-credit-note-details.component.css']
})

export class PostedPurchaseCreditNoteDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  POOperations: any = ['Print Order'];
  PCNNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PostedPCNNumber');
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
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "UOM", width: 40 },
    { title: "Cost", dataKey: "DirectUnitCost", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Quantity", dataKey: "QuantityToInvoice", width: 40 },
    { title: "Amount", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  PurchaseCNDetails: any = [];
  popupforlines: boolean = false;
  POlinesfortab: any;
  dataSource1: Object;
  dataSource2: Object;
  duplicatePurchCNHeader: any[];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("postedPurchaseCreditNote", "getPurchaseInvoiceHeader", ['',
      this.PCNNumber])
      .subscribe(getPurchaseInvoiceHeader => {
        this.printHeader = getPurchaseInvoiceHeader;
        this.PurchaseCNDetails = getPurchaseInvoiceHeader[0];
        if (this.PurchaseCNDetails["AmtIncvat"] == 'Yes') {
          this.PurchaseCNDetails["AmtIncvat"] = true;
        } else {
          this.PurchaseCNDetails["AmtIncvat"] = false;
        }
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
        dummyDataServive.getServerData("postedPurchaseCreditNote", "getPurchaseInvoiceLines", ["", thisComponent.PCNNumber])
          .subscribe(data => {
            thisComponent.printLines = data;
            devru.resolve(data);
          });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyData = callData3[0];
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  SalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Print Order') {
      this.generateStdPDF(this.PurchaseCNDetails, this.printLines, "Posted Purchase Credit Note Original");
    } else if (selected == 'Post') {

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
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    rightStartCentre: 250,
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
      const doc = new jsPDF('p', 'pt', 'a4');

      doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
      doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
      doc.setFont(this.pdfFormate.SetFont);

      var tempY = this.pdfFormate.InitialstartY;

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SubTitleFontSize);

      tempY += (this.pdfFormate.NormalSpacing);

      doc.addImage('data:image/jpeg;base64,' + this.companyData.CompanyLogo, 'PNG', 450, 30, 80, 50);
      doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, tempY + 45);
      doc.line(this.pdfFormate.startX, 110, 550, 110);
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      //left
      tempY += 47;
      var tempYC = tempY;
      var tempYR = tempY;
      doc.textAlign("" + this.companyData.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.Address1 + ", " + this.companyData.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.City + "- " + this.companyData.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Phone : " + this.companyData.Phone + " Fax :" + this.companyData.Fax, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("VAT ID : " + this.companyData.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      //centre
      doc.textAlign("Branch ID : " + this.companyData.BranchID, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Account No : " + this.companyData.AccountNo, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Email : " + this.companyData.EMail, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);
      /*doc.textAlign("" + this.companyData.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("VATID :" + this.companyData.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);*/
      //right
      doc.textAlign("Document No : " + printHeader.DocumentNo, { align: "right" }, this.pdfFormate.rightStartCol1 + 120, tempYR += this.pdfFormate.NormalSpacing);
      doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "right" }, this.pdfFormate.rightStartCol1 + 120, tempYR += this.pdfFormate.NormalSpacing);

      //box2x2
      doc.line(this.pdfFormate.startX + 255, tempY + 15, this.pdfFormate.startX + 255, tempY + 35);//middle vertical
      doc.line(this.pdfFormate.startX, tempY + 15, 550, tempY + 15);//top-hor
      doc.line(this.pdfFormate.startX, tempY + 15, this.pdfFormate.startX, tempY + 35);//left vert
      doc.textAlign("Buy From", { align: "left" }, this.pdfFormate.startX + 100, tempY + 28);
      doc.line(550, tempY + 15, 550, tempY + 35);//left-vert
      doc.line(this.pdfFormate.startX, tempY + 35, 550, tempY + 35);//bottm-hor
      doc.textAlign("Pay To", { align: "left" }, this.pdfFormate.startX + 355, tempY + 28);
      var tempBoxY = tempY;
      //text in box1
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Code: " + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startX + 15, tempY = tempY + 45);
      doc.textAlign("Customer name: " + printHeader.PayToName, { align: "left" }, this.pdfFormate.startX + 15, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Address: " + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startX + 15, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + printHeader.PayToCity + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startX + 15, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Vat ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 15, tempY += this.pdfFormate.NormalSpacing);
      // doc.textAlign("Contact: " + printHeader.BillToContact, { align: "left" }, this.pdfFormate.startX+15, tempY += this.pdfFormate.NormalSpacing);
      //text in box2
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Code: " + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startX + 270, tempYC = tempYC + 68);
      doc.textAlign("Customer name: " + printHeader.PayToName, { align: "left" }, this.pdfFormate.startX + 270, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Address: " + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startX + 270, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + printHeader.PayToCity + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startX + 270, tempYC += this.pdfFormate.NormalSpacing);
      doc.textAlign("Vat ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 270, tempYC += this.pdfFormate.NormalSpacing);
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
      doc.textAlign("Total ", { align: "left" }, rightcol1, (startY));
      doc.textAlign("" + printHeader.Amount, { align: "left-align" }, rightcol2, startY);
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Amount Exc Tax", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + printHeader.Amount, { align: "left-align" }, rightcol2, startY);
      if (printHeader.InvDiscountAmount > 0) {
        doc.setFontType(this.pdfFormate.SetFontType);
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
        doc.textAlign(printHeader.InvDiscountAmount, { align: "left-align" }, rightcol2, startY);
      }

      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Amount Inc Tax", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "left-align" }, rightcol2, startY);


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
      doc.textAlign("Name: ", { align: "left" }, this.pdfFormate.startX, startY + 12);
      doc.textAlign("Phone No: ", { align: "left" }, this.pdfFormate.startX, startY + 24);
      doc.textAlign("Email Id: ", { align: "left" }, this.pdfFormate.startX, startY + 36);
      /*doc.textAlign("Material Received & Accepted",{ align: "left" }, this.pdfFormate.startX+210, startY);
      doc.textAlign("in Good Condition",{ align: "left" }, this.pdfFormate.startX+210, startY+12);
      doc.textAlign(""+printHeader.PayToName,{ align: "left" }, this.pdfFormate.startX+210, startY+24);*/
      doc.textAlign("Aproved By", { align: "right-align" }, rightcol2, startY);
      doc.textAlign("" + this.companyData.Name, { align: "right-align" }, rightcol2, startY + 12);
      doc.save("PurchaseCreditNote" + this.PCNNumber + ".pdf");
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

