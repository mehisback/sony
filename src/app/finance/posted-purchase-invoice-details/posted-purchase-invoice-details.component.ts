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
import DataSource from "devextreme/data/data_source";
import { CompundDiscountService } from '../../Utility/compund-discount.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { PostedPurchaseInvoiceDetailsHttpDataService } from './posted-purchase-invoice-details-http-data.service';


@Component({
  selector: 'app-posted-purchase-invoice-details',
  templateUrl: './posted-purchase-invoice-details.component.html',
  styleUrls: ['./posted-purchase-invoice-details.component.css']
})

export class PostedPurchaseInvoiceDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  PINumber: String = UtilsForGlobalData.retrieveLocalStorageKey('PostedPINumber');
  POOperations: any = ['Print Order'];
  dataSource: any = {};
  popupVisible: boolean = false;
  companyHeader: any = {};
  isPayToVendorSelected: boolean = false;
  isLinesExist: boolean = false;
  printHeader: any = {};
  printLines: any = {};
  columnHeader1 = [
    { title: "Order No", dataKey: "ConnectedOrder", width: 40 },
    { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 },
    { title: "Purchase Staff", dataKey: "Salesperson", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "UOM", width: 40 },
    { title: "Quantity", dataKey: "QuantityToInvoice", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 },
    { title: "Tax Rate", dataKey: "VATPerct", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Vat Amount", dataKey: "VatAmount", width: 40 },
    { title: "Amount IncVAT", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  PurchaseInvoiceDetails: any = [];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalVendorDetailsPopup: Boolean = false;
  itemPopupName: string = "ITEM DETAILS";
  TAX: number;
  TotalLineDiscountAmount: any;
  totalInvoiceDisocunt: any;
  Quantity: number = 0;

  constructor(
    private httpDataService: PostedPurchaseInvoiceDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService,
    private compoundDiscount: CompundDiscountService
  ) { }

  ngOnInit() {
    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "LineType", "LineCode", "Description", "QuantityToInvoice", "UnitPrice", "DirectUnitCost", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount", "GRDocumentNo", "GRLineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        thisComponent.httpDataService.getPurchaseInvoiceLines(["", thisComponent.PINumber])
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

    this.httpDataService.getCompanyInfo().subscribe(getCompany => {
      this.companyHeader = getCompany[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  getHeaderDetails() {
    this.httpDataService.getPurchaseInvoiceHeader(['',
      this.PINumber]).subscribe(getPurchaseInvoiceHeader => {
        this.printHeader = getPurchaseInvoiceHeader;
        this.PurchaseInvoiceDetails = getPurchaseInvoiceHeader[0];
        this.TAX = this.PurchaseInvoiceDetails["AmountIncludingVAT"] - this.PurchaseInvoiceDetails["Amount"];
        if (this.PurchaseInvoiceDetails["AmtIncvat"] == 'Yes') {
          this.PurchaseInvoiceDetails["AmtIncvat"] = true;
        } else {
          this.PurchaseInvoiceDetails["AmtIncvat"] = false;
        }
        this.httpDataService.getTotalLinesDiscAmt(['',
        this.PINumber])
        .subscribe(getTotalLinesDiscAmt => {
            this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["getPurchaseInvoiceLinesDiscount"];
            this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.PurchaseInvoiceDetails["InvDiscountAmount"])).toFixed(2);
        });
        this.httpDataService.getPurchaseInvoiceLinesQuantity(['',
                    this.PINumber])
                    .subscribe(getTotalLinesDiscAmt => {
                        this.Quantity = getTotalLinesDiscAmt[0]["getPurchaseInvoiceLinesQuantity"];
                    });
      });
  }


  ItemDeatilsForPopUp(data) {
    this.itemPopupName = "ITEM DETAILS";
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["BaseQuantity", "QuantityToInvoice", "DirectUnitCost", "AmountIncludingVAT", "LineDiscountAmount", "VatAmount", "CostIncVAT", "InvDiscountAmount"]);
    this.itemDetailsPopup = true;
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  getBuyFromVendorDetail() {
    this.globalVendorDetailsPopup = true;
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
    InitialstartY: 50,
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

    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? this.formatNumber(printHeader.InvDiscountAmount) : '0';
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    printHeader.AmountIncludingVATtext = this.companyHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      printHeader.AmountIncludingVATtext += " and " + decimalAsInt + "/100";
    }
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
    printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
      printLines[i].QuantityToInvoice = this.formatNumber(printLines[i].QuantityToInvoice);
      printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      printLines[i].VATPerct = this.formatNumber(printLines[i].VATPerct);
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
      printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
    }
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    if (this.companyHeader["CountryCode"] == 'THA' || this.companyHeader["CountryCode"] == 'SGP') {
      this.PrintReportForTHA(doc, printHeader, printLines, "Delivery Order / Invoice / Tax Invoice DUPLICATE");
    } else {
      this.PrintReportForIND(doc, printHeader, printLines, title);
    }

    doc.save("PurchaseInvoice" + UtilsForGlobalData.retrieveLocalStorageKey('PINumber') + ".pdf");
    this.gridContainer.instance.refresh();
  }


  PrintReportForTHA(doc, printHeader, printLines, title) {
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
    doc.textAlign("VATID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("To,", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("DocumentNo: " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document Date: " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToAddress + ", " + printHeader.BillToAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Payment Term: " + printHeader.PaymentTerm + " Days", { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BillToCity + ", " + printHeader.BillToCountry + "-" + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Vat ID " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

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
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount Exc Vat", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    if (Number(printHeader.InvDiscountAmount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Discount ( " + printHeader.InvoiceCompoundDiscount + " )", { align: "left" }, rightcol1, startY);
      doc.textAlign(printHeader.InvDiscountAmount, { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount Inc Vat", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

  }

  PrintReportForIND(doc, printHeader, printLines, title) {
    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, tempY);
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', pageEnd - 100, tempY, 80, 30);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, tempY += 40, pageEnd, tempY);
    doc.line(0, tempY, 1000, tempY);

    tempY += (this.pdfFormate.NormalSpacing);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("State Code: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Invoice No: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("GST No: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Invoice Date: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(printHeader.DocumentDate, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);


    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.City + " - " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("PAN Number: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("E-Bill: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    // doc.textAlign("Cust PO No: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    tempY += this.pdfFormate.NormalSpacing;
    doc.textAlign("IEC Code: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    // doc.textAlign("PO Date: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.textAlign(this.companyHeader.HomePage, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone No: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(this.companyHeader.Phone, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Email: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(this.companyHeader.EMail, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    //box2x2

    doc.line(this.pdfFormate.startTemp + 255, tempY - 10, this.pdfFormate.startTemp + 255, tempY + 100);//middle vertical
    doc.line(this.pdfFormate.startTemp, tempY - 10, 550, tempY - 10);//top-hor
    doc.line(this.pdfFormate.startTemp, tempY - 10, this.pdfFormate.startTemp, tempY + 100);//left vert
    doc.textAlign("Buy From", { align: "left" }, this.pdfFormate.startX + 100, tempY + 5);
    doc.line(550, tempY - 10, 550, tempY + 100);//left-vert
    doc.line(this.pdfFormate.startTemp, tempY + 15, 550, tempY + 15);//bottm-hor
    doc.textAlign("Sales To", { align: "left" }, this.pdfFormate.startX + 355, tempY + 5);
    doc.line(this.pdfFormate.startTemp, tempY + 100, 550, tempY + 100);
    doc.setFontType(this.pdfFormate.SetFontType);

    tempY += this.pdfFormate.NormalSpacing;
    doc.textAlign("Code: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Code: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    doc.textAlign(printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Name: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.PayToName, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Name: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    doc.textAlign(printHeader.PayToName, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Address: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Address: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    doc.textAlign(printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("City: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.PayToCity + ", " + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("City: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    doc.textAlign(printHeader.PayToCity + ", " + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    // doc.setFontType(this.pdfFormate.SetFontType);
    // doc.textAlign("Contact: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    // doc.textAlign(printHeader.BillToContact, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    // doc.textAlign("Contact: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    // doc.textAlign(printHeader.BillToContact, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    // doc.setFontType(this.pdfFormate.SetFontType);
    // doc.textAlign("Phone: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    // doc.textAlign(printHeader.BillToPhone, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    // doc.textAlign("Phone: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    // doc.textAlign(printHeader.BillToPhone, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Vat ID: ", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.VATID, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Vat ID: ", { align: "left" }, this.pdfFormate.startXcol4, tempY);
    doc.textAlign(printHeader.VATID, { align: "left" }, this.pdfFormate.startXcol4Details, tempY);


    tempY += this.pdfFormate.NormalSpacing;
    tempY += this.pdfFormate.NormalSpacing;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Order No: ", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Due Date: ", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(printHeader.DueDate, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    // doc.textAlign("Payment Method: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    // doc.textAlign(printHeader.PaymentMethod, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    tempY += this.pdfFormate.NormalSpacing;
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
      didDrawPage: data => {
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.text("Bank Name : Karnataka Bank Ltd, Bank AcNo : 0647000100245701, IFSC Code : KARB000006", data.settings.margin.left, doc.internal.pageSize.height - 10);
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
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
      doc.textAlign(printHeader.InvDiscountAmount, { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount Inc Vat", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY += this.pdfFormate.NormalSpacing;
    doc.line(40, startY, 560, startY);

    // startY += this.pdfFormate.NormalSpacing;
    // doc.setFontType(this.pdfFormate.SetFontType);
    // doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    var inty = startY += this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX, inty, 150, inty);

    startY += this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("We Certified that Particulars Above are true and correct, Terms And Conditions Over Leaf ", { align: "left" }, this.pdfFormate.startX, startY);

    startY += this.pdfFormate.NormalSpacing;
    startY += this.pdfFormate.NormalSpacing;
    doc.textAlign("Prepared By:", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Material Received & Accepted In", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign("SALOC Technologies Pvt Ltd", { align: "left" }, this.pdfFormate.startXcol3, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol3Details, startY);

    startY += this.pdfFormate.NormalSpacing
    doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Good Condition", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);

    startY += this.pdfFormate.NormalSpacing
    doc.textAlign("Phone:", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Agarwal Engg. Sales & Services", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);

    startY += this.pdfFormate.NormalSpacing
    doc.textAlign("Email:", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);

    startY += this.pdfFormate.NormalSpacing
    startY += this.pdfFormate.NormalSpacing
    startY += this.pdfFormate.NormalSpacing;
    doc.textAlign("Signature", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("Authorised Signatory", { align: "left" }, this.pdfFormate.startXcol3, startY);
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

