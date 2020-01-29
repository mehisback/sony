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
import { confirm } from 'devextreme/ui/dialog';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { CompundDiscountService } from '../../Utility/compund-discount.service';
import * as events from "devextreme/events";
import { PostedSalesInvoiceDetailsHttpDataService } from './posted-sales-invoice-details-http-data.service';

var writtenNumber = require('written-number');

@Component({
  selector: 'app-posted-sales-invoice-details',
  templateUrl: './posted-sales-invoice-details.component.html',
  styleUrls: ['./posted-sales-invoice-details.component.css']
})
export class PostedSalesInvoiceDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  SINumber: String = UtilsForGlobalData.retrieveLocalStorageKey('PostedSINumber');
  SalesInvoiceDetails: any = {};
  dataSource: any = {};
  popupVisible: boolean = false;
  companyHeader: any = {};
  dropdownmenu = ['Print SalesInvoice', 'Create CREDIT MEMO'];
  isLinesExist: boolean = false;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  popupSelltoCustDetails: Boolean = false;
  TAX;

  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Sales Order No", dataKey: "ConnectedOrder", width: 40 },
    { title: "Payment Term (Days)", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "FormtedDueDate", width: 40 },
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

  constructor(
    private httpDataService: PostedSalesInvoiceDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  getHeaderDetails() {
    this.httpDataService.getSaleInvoiceHeader(['',
      this.SINumber])
      .subscribe(getSaleInvoiceHeader => {
        try {
          getSaleInvoiceHeader[0]["InvDiscountAmount"] = parseFloat(getSaleInvoiceHeader[0]["InvDiscountAmount"]).toFixed(2);
        } catch (Error) { }
        this.printHeader = getSaleInvoiceHeader;
        this.SalesInvoiceDetails = getSaleInvoiceHeader[0];
        this.TAX = this.SalesInvoiceDetails["AmountIncludingVAT"] - this.SalesInvoiceDetails["Amount"];
      });
  }

  ngOnInit() {
    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "LineType", "LineCode", "Description", "QuantityToInvoice", "UnitPrice", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        thisComponent.getHSNSummaryLines();
        thisComponent.httpDataService.getSaleInvoiceLines(["", thisComponent.SINumber])
          .subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
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

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }


  getHSNSummaryLines() {
    this.httpDataService.getHSNSummaryLines(["",
      this.SINumber]).subscribe(dataStatus => {
        this.HSNSummaryArr = dataStatus;
      });
  }



  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.getHeaderDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToasterWhileAddingLines(dataStatus, type) {
    if (dataStatus[0] != "DONE") {
      this.toastr.error("Error while " + type + " Item with Status Code: " + dataStatus[0], "Try Again");
    }
    this.gridContainer.instance.refresh();
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["UnitPrice", "InvDiscountAmount", "LineDiscountAmount", "QuantityToInvoice", "QuantityReturned", "SOUnitprice", "VATPerct", "VatAmount"]);
    this.itemDetailsPopup = true;
  }

  showInfo() {
    this.popupVisible = true;
    /* this.httpDataService.createGLBufferLines(["",
      this.SINumber]).subscribe(showInfo => {
        this.onCreateGLBuffResultSet = showInfo[1];
        this.httpDataService.onCreateGLBuffResultSet(["",
          this.SINumber]).subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });

      }); */
  }

  SalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Print SalesInvoice') {
      if (this.isLinesExist) {
        this.httpDataService.getAllReportsSetup(["", "SI"]).subscribe(callData3 => {
          this.reportCustom = callData3;
          this.generateStdPDF(this.printHeader[0], this.printLines, "Sales Invoice Duplicate");
        });
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    }
    else if (selected == 'Create CREDIT MEMO') {
      if (this.isLinesExist) {
        let result = confirm("<p>Do you want to Create Credit Note from this Invoice?</p>", "CREATE CN");
        result.then((dialogResult) => {
          dialogResult ? this.alertListener2() : "Canceled";
        });
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    }
    else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  alertListener2() {
    this.httpDataService.alertListener2(["",
      this.SINumber,
      UtilsForGlobalData.getUserId()]).subscribe(showInfo => {
        if (showInfo[0] == 'DONE') {
          this.toastr.success("Successfully Create Credit Note :" + showInfo[1]);
        } else {
          this.toastr.error("Failed to Create Credit Note, with Error Status Code " + showInfo[0]);
        }

      });
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
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
      this.PrintReportForTHA(doc, printHeader, printLines, "Delivery Order / Invoice / Tax Invoice DUPLICATE");
    } else {
      this.PrintReportForIND(doc, printHeader, printLines, title);
    }

    doc.save("PostedSalesInvoice" + this.SINumber + ".pdf");
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
    doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3, startY);

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

