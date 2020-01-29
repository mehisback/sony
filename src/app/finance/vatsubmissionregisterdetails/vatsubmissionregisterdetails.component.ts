import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
var jsPDF = require('jspdf');
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
let variable = require('../../../assets/js/rhbusfont.json');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import { confirm } from 'devextreme/ui/dialog';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-vatsubmissionregisterdetails',
  templateUrl: './vatsubmissionregisterdetails.component.html',
  styleUrls: ['./vatsubmissionregisterdetails.component.css'],
  providers: [DatePipe]
})

export class VatsubmissionregisterdetailsComponent implements OnInit {
  @ViewChild("gridContainer1") gridContainer1: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;

  vatSubmissionFormDetail: [];
  todate: any;
  fromdate: any;
  curDate: any = new Date();
  dataSource: Object;
  PurchdataSource: Object;
  selectedRowSalesVAT: [] = null;
  submitValueSalesVAT: String;
  selectedRowPurchVAT: [] = null;
  submitValuePurchVAT: String;
  SubmissionNumber: string;
  VatSubmissionOperations: any = [];
  PrintSalesData: any = {};
  printPurchData: Object;
  companyHeader = null;
  vatNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('VatNumber');


  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "PostingDate", dataKey: "PostingDate", width: 40 },
    { title: "DocumentNo", dataKey: "DocumentNo", width: 40 },
    { title: "DocumentDate", dataKey: "DocumentDate", width: 40 },
    { title: "RefDocumentNo", dataKey: "RefDocumentNo", width: 40 },
    { title: "SourceName", dataKey: "SourceName", width: 40 },
    { title: "VATID", dataKey: "VATID", width: 40 },
    { title: "HID", dataKey: "HID", width: 40 },
    { title: "BID", dataKey: "BID", width: 40 },
    { title: "BaseAmount", dataKey: "BaseAmount", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 }
  ];


  constructor(private dataFromService: DataService,
    public router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.curDate = this.datePipe.transform(this.curDate, 'yyyy-MM-dd');

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyHeader = callData3[0];
      });

    var thisComponent = this;
    this.dataSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("VATRecords", "getRegister", ['',
          thisComponent.vatNumber]).subscribe(getVatSubmissionHeader => {
            thisComponent.vatSubmissionFormDetail = getVatSubmissionHeader[0];
            thisComponent.fromdate = thisComponent.vatSubmissionFormDetail["SalesFromDate"];
            thisComponent.todate = thisComponent.vatSubmissionFormDetail["ToDate"];
            if (thisComponent.vatSubmissionFormDetail["SubmissionLocked"] == 'Yes') {
              thisComponent.vatSubmissionFormDetail["SubmissionLocked"] = true;
            } else {
              thisComponent.vatSubmissionFormDetail["SubmissionLocked"] = false;
            }
            thisComponent.dataFromService.getServerData("VATRecords", "getSaleVatRecords", ['',
              thisComponent.vatNumber, thisComponent.vatSubmissionFormDetail["ToDate"],
              thisComponent.vatSubmissionFormDetail["SalesFromDate"]]).subscribe(gotVatRecords => {
                devru.resolve(gotVatRecords);
                if (Object.keys(gotVatRecords).length > 0) {
                  thisComponent.VatSubmissionOperations = ["Submit All Sales Entries", "Lock Submitted Sales Entries", "Print Sales Vat Report"]
                } else {
                  thisComponent.VatSubmissionOperations = [];
                }
              });
          });
        return devru.promise();
      }
    });

    this.PurchdataSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("VATRecords", "getRegister", ['',
          thisComponent.vatNumber]).subscribe(getVatSubmissionHeader => {
            thisComponent.vatSubmissionFormDetail = getVatSubmissionHeader[0];
            thisComponent.fromdate = thisComponent.vatSubmissionFormDetail["SalesFromDate"];
            thisComponent.todate = thisComponent.vatSubmissionFormDetail["ToDate"];
            if (thisComponent.vatSubmissionFormDetail["SubmissionLocked"] == 'Yes') {
              thisComponent.vatSubmissionFormDetail["SubmissionLocked"] = true;
            } else {
              thisComponent.vatSubmissionFormDetail["SubmissionLocked"] = false;
            }
            thisComponent.dataFromService.getServerData("VATRecords", "getPurchaseVatRecords", ['',
              thisComponent.vatSubmissionFormDetail["SalesFromDate"],
              thisComponent.vatSubmissionFormDetail["ToDate"],
              thisComponent.vatNumber]).subscribe(gotVatRecords => {
                devru.resolve(gotVatRecords);
                if (Object.keys(gotVatRecords).length > 0) {
                  thisComponent.VatSubmissionOperations = ["Submit All Purchase Entries", "Lock Submitted Purchase Entries", "Print Purchase Vat Report"];
                } else {
                  thisComponent.VatSubmissionOperations = [];
                }
              });
          });
        return devru.promise();
      }
    });

  }


  submitVatLine(event, data) {
    this.selectedRowSalesVAT = data.data;
    if (this.selectedRowSalesVAT["Submitted"] == "No") {
      this.submitValueSalesVAT = "Yes";
      this.SubmissionNumber = this.vatNumber;
    } else {
      this.submitValueSalesVAT = "No";
      this.SubmissionNumber = '';
    }
    if (this.selectedRowSalesVAT["LineLocked"] == "No") {
      this.dataFromService.getServerData("VATRecords", "updateSalesVATSubmit", ['',
        this.SubmissionNumber,
        this.selectedRowSalesVAT["EntryNo"],
        this.submitValueSalesVAT]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer1.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
    } else {
      this.toastr.error("Locked Submission, can't change");
    }

  }

  submitPurchVatLine(event, data) {
    this.selectedRowPurchVAT = data.data;
    if (this.selectedRowPurchVAT["Submitted"] == "No") {
      this.submitValuePurchVAT = "Yes";
      this.SubmissionNumber = this.vatNumber;
    } else {
      this.submitValuePurchVAT = "No";
      this.SubmissionNumber = '';
    }
if (this.selectedRowPurchVAT["LineLocked"] == "No") {
      this.dataFromService.getServerData("VATRecords", "updatePurchaseVATSubmit", ['',
        this.submitValuePurchVAT,
        this.SubmissionNumber,
        this.selectedRowPurchVAT["EntryNo"]]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
    } else {
      this.toastr.error("Locked Submission, can't change");
    }

  }


  VatSubmissionOperationssGo(selectedOperation) {
    if (selectedOperation == "Submit All Sales Entries") {
      this.dataFromService.getServerData("VATRecords", "btnSubmitAllSales_clickHandler", ['', this.vatNumber,
        this.vatSubmissionFormDetail["SalesFromDate"],
        this.vatSubmissionFormDetail["ToDate"]]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer1.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
    } else if (selectedOperation == "Submit All Purchase Entries") {
      this.dataFromService.getServerData("VATRecords", "btnSubmitAllPurch_clickHandler", ['', this.vatNumber,
        this.vatSubmissionFormDetail["SalesFromDate"],
        this.vatSubmissionFormDetail["ToDate"]]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
    } else if (selectedOperation == "Lock Submitted Sales Entries") {
      let result = confirm("<p>Do you want to Lock Submitted Entries?, Locked Can't be unlocked.</p>", "Confrim to Entries");
      result.then((dialogResult) => {
        dialogResult ? this.LockEntries(selectedOperation) : "Canceled";
      });
    } else if (selectedOperation == "Lock Submitted Purchase Entries") {
      let result = confirm("<p>Do you want to Lock Submitted Entries?, Locked Can't be unlocked.</p>", "Confrim to Entries");
      result.then((dialogResult) => {
        dialogResult ? this.LockEntries(selectedOperation) : "Canceled";
      });
    } else if (selectedOperation == "Print Sales Vat Report") {
      this.dataFromService.getServerData("VATRecords", "button1_clickHandler", ['', this.vatNumber, this.vatSubmissionFormDetail["ToDate"], this.vatSubmissionFormDetail["SalesFromDate"]])
        .subscribe(printSalesData => {
          if (Object.keys(printSalesData).length > 0) {
            this.PrintSalesData = printSalesData;
            this.generateStdPDF(this.vatSubmissionFormDetail, this.PrintSalesData, "Sales Tax Report");
          } else {
            this.toastr.warning("No Lines Found!");
          }
        });
    } else {
      this.dataFromService.getServerData("VATRecords", "button2_clickHandler", ['', this.vatNumber, this.vatSubmissionFormDetail["ToDate"], this.vatSubmissionFormDetail["SalesFromDate"]])
        .subscribe(printPurchData => {
          if (Object.keys(printPurchData).length > 0) {
            this.printPurchData = printPurchData;
            this.generateStdPDF(this.vatSubmissionFormDetail, this.printPurchData, "Purchase Tax Report");
          } else {
            this.toastr.warning("No Lines Found!");
          }
        });
    }

  }

  LockEntries(data) {
    if (data == "Lock Submitted Sales Entries") {
      this.dataFromService.getServerData("VATRecords", "lockSubmittedSalesEntries", ['',
        this.vatSubmissionFormDetail["SalesFromDate"],
        this.vatSubmissionFormDetail["ToDate"],
        this.vatNumber]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer1.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
    } else {
      this.dataFromService.getServerData("VATRecords", "lockSubmittedPurchaseEntries", ['',
        this.vatSubmissionFormDetail["SalesFromDate"],
        this.vatSubmissionFormDetail["ToDate"],
        this.vatNumber]).subscribe(UpdateRecords => {
          if (UpdateRecords > 0) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Successfully Updated", "DONE");
          } else {
            this.toastr.error("Failed to Update, Error Status UPDATE-ERR");
          }
        });
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
      printHeader.TotalAmount = 0;
      printHeader.TotalBaseAmount = 0;

      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printHeader.TotalAmount += Number(printLines[i].Amount);
        printHeader.TotalBaseAmount += Number(printLines[i].BaseAmount);
      }

      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = i + 1;
        printLines[i].BaseAmount = this.formatNumber(printLines[i].BaseAmount);
        printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      }

      // console.log(printHeader.TotalAmount);

      printHeader.TotalAmountinWords = (writtenNumber(parseInt(printHeader.TotalAmount), { lang: 'enIndian' }));
      var decimalAsInt = Math.round((printHeader.TotalAmount - parseInt(printHeader.TotalAmount)) * 100);
      if (Number(decimalAsInt) >= 0) {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
      }

      const doc = new jsPDF('l', 'pt', 'a4');
      //doc.autoTable(this.columnHeader1, printLines);
      doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
      doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
      doc.setFont(this.pdfFormate.SetFont);

      var tempY = this.pdfFormate.InitialstartY;

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SubTitleFontSize);
      doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
      tempY += (this.pdfFormate.NormalSpacing);

      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50);
      doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Submit Date :" + this.curDate, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);


      doc.setFontType(this.pdfFormate.SetFontType);
      //doc.textAlign("Name: " + "tets", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("For Month :" + printHeader.ForMonth + "-" + printHeader.ForYear, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      /* doc.setFontType(this.pdfFormate.SetFontType);
       doc.textAlign("" + printHeader.BuyFromAddress + ", " + printHeader.BuyFromAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
 
       doc.setFontType(this.pdfFormate.SetFontType);
       doc.textAlign("" + printHeader.BuyFromCity + ", " + printHeader.BuyFromZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
 
       doc.setFontType(this.pdfFormate.SetFontType);
       doc.textAlign("" + printHeader.BuyFromCountry, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
 
       doc.setFontType(this.pdfFormate.SetFontType);
       doc.textAlign("Contact Name " + printHeader.ContactName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
       doc.setFontType(this.pdfFormate.SetFontType);
       doc.textAlign("Contact No  " + printHeader.BuyFromPhone, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
 
      **/

      /* doc.autoTable(this.columnHeader1, this.vatSubmissionFormDetail, {
         startX: this.pdfFormate.startX,
         startY: tempY += this.pdfFormate.NormalSpacing,
         styles: {
           font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
           fontStyle: this.pdfFormate.SetFontType, halign: 'right'
         }
       });*/



      tempY += this.pdfFormate.NormalSpacing;
      const totalPagesExp = "{total_pages_count_string}";

      doc.autoTable(this.columnHeader2, printLines, {
        startX: this.pdfFormate.startX,
        startY: tempY += this.pdfFormate.NormalSpacing,
        styles: {
          font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
          fontStyle: this.pdfFormate.SetFontType, halign: 'right'
        },
        columnStyles: {
          SNo: {
            halign: 'left'
          },
          PostingDate: {
            halign: 'left'
          },
          DocumentNo: {
            halign: 'left'
          },
          DocumentDate: {
            halign: 'left'
          },
          RefDocumentNo: {
            halign: 'left'
          },
          SourceName: {
            halign: 'left'
          },
          VATID: {
            halign: 'left'
          },
          HID: {
            halign: 'left'
          },
          BID: {
            halign: 'left'
          }
        },
        headStyles: {
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
      doc.textAlign("TOTAL BASE AMOUNT:", { align: "left" }, rightcol1, (startY));
      doc.textAlign("" + this.formatNumber(printHeader.TotalBaseAmount), { align: "right-align" }, rightcol2, startY);
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("AMOUNT:", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalAmount), { align: "right-align" }, rightcol2, startY);



      startY += this.pdfFormate.NormalSpacing;
      doc.save("Tax Report" + this.vatNumber + ".pdf");
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


  formSummary_fieldDataChanged(event) {

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
