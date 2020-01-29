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
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');

import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";

var itemListArray: any = [];

@Component({
  selector: 'app-billing-note-details',
  templateUrl: './billing-note-details.component.html',
  styleUrls: ['./billing-note-details.component.css']
})
export class BillingNoteDetailsComponent implements OnInit {
  @ViewChild("getlinesforgrid") getlinesforgrid: DxDataGridComponent;
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  headerDetails: any = [];
  dataSource: any = {};
  popupforlines: boolean = false;
  dataSource2: Object;
  LineOperations = ['Delete All Lines', 'Print'];
  companyData: any = {};
  printLines: any = {};
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "InvoiceNo", dataKey: "InvoiceNo", width: 40 },
    { title: "DocumentDate", dataKey: "DocumentDate", width: 40 },
    { title: "DueDate", dataKey: "DueDate", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 },
    { title: "Remark", dataKey: "Remark", width: 40 }
  ];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("BillingNote", "openDoc", ['',
      UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
      .subscribe(openDoc => {
        this.headerDetails = openDoc[0];
      });
  }

  ngOnInit() {
    this.getHeaderDetails();

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;


    this.dataSource.store = new CustomStore({
      key: ["LineNo", "Remark"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("BillingNote", "getAllLines", ["", UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
          .subscribe(data => {
            devru.resolve(data);
            thisComponent.printLines = data;
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("BillingNote", "btnDelLine_clickHandler", ["", key["LineNo"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            }
            else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("BillingNoteEditRemarkLine", "btnSave_clickHandler", ["",
          getUpdateValues(key, newValues, "Remark"),
          getUpdateValues(key, newValues, "LineNo")
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is UPDATE-ERR");
          }
        });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['', UtilsForGlobalData.getCompanyName()])
      .subscribe(callData3 => {
        this.companyData = callData3[0];
      });


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == 'DocumentDate') {
        this.dataFromService.getServerData("BillingNote", "datefield1_changeHandler", ['',
          e.value,
          UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
          .subscribe(datefield1_changeHandler => {
            if (datefield1_changeHandler == '1') {
              this.toastr.success("Updated");
            }
          });
      }
      if (e.dataField == 'DueDate') {
        this.dataFromService.getServerData("BillingNote", "duedate_changeHandler", ['',
          e.value,
          UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
          .subscribe(datefield1_changeHandler => {
            if (datefield1_changeHandler == '1') {
              this.toastr.success("Updated");
            }
          });
      }
      if (e.dataField == 'PaymentTerm') {

      }
      if (e.dataField == 'Remark') {
        this.dataFromService.getServerData("BillingNote", "txtHRemark_keyDownHandler", ['',
          e.value,
          UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
          .subscribe(datefield1_changeHandler => {
            if (datefield1_changeHandler == '1') {
              this.toastr.success("Updated");
            }
          });

      }
    }
  }

  getthelines() {
    this.popupforlines = true;
    this.dataFromService.getServerData("BillingNoteLineAdd", "getAllLines", ["", this.headerDetails["BillToCustomer"]])
      .subscribe(getAllLines => {
        this.dataSource2 = getAllLines;
        this.getlinesforgrid.instance.refresh();
      });
  }

  addnewline(event) {
    this.dataFromService.getServerData("BillingNoteLineAdd", "btnSave_clickHandler", ["",
      UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber'),
      event.key["DocumentNo"],
      event.key["DocumentDate"],
      event.key["DueDate"],
      event.key["Amount"]
    ])
      .subscribe(btnSave_clickHandler => {
        this.popupforlines = false;
        this.toastr.success(btnSave_clickHandler[0]);
        this.gridContainer.instance.refresh();
      });
  }

  BNLineOperationsGo(selected: string) {
    if (selected == 'Print Order') {
      this.generateStdPDF(this.headerDetails, this.printLines, "Billing Note Original");
    } else if (selected == 'Delete All Lines') {
      this.dataFromService.getServerData("BillingNote", "btnDelAll_clickHandler", ["", UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber')])
        .subscribe(btnDelAll_clickHandler => {
          if (btnDelAll_clickHandler == '1' || btnDelAll_clickHandler == '2') {
            this.toastr.success("All Lines Deleted");
            this.gridContainer.instance.refresh();
          }
        });
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
      printHeader.TtlAmount = 0;
      printHeader.VATID = printHeader.VATID == null ? '' : printHeader.VATID;
      printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
      for (var i = 0; i < Object.keys(printLines).length; i++) {
        printLines[i].SnNo = i + 1;
        printHeader.TtlAmount += Number(printLines[i].Amount);
        printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      }
      printHeader.TotalAmountinWords = this.companyData.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.TtlAmount), { lang: 'enIndian' }));
      var decimalAsInt = Math.round((printHeader.TtlAmount - parseInt(printHeader.TtlAmount)) * 100);
      if (Number(decimalAsInt) >= 0) {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
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

      doc.addImage('data:image/jpeg;base64,' + this.companyData.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50);
      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.setFontSize(this.pdfFormate.SmallFontSize);
      doc.textAlign("" + this.companyData.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.Address1 + ", " + this.companyData.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("" + this.companyData.City + "- " + this.companyData.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Phone :" + this.companyData.Phone + " Fax :" + this.companyData.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("VAT ID :" + this.companyData.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

      doc.setFont(this.pdfFormate.SetFont);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Customer name : " + printHeader.BillToCustomer, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("DocumentNo :" + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.BillToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign("Document Date :" + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.BillToAddress + ", " + printHeader.BillToAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("" + printHeader.BillToCity + "-" + printHeader.BillToZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Vat ID " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

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
      doc.textAlign("Sub Total", { align: "left" }, rightcol1, (startY));
      doc.textAlign("" + printHeader.TtlAmount, { align: "right-align" }, rightcol2, startY);
      doc.setFontType(this.pdfFormate.SetFontType);


      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Remark :" + printHeader.Remark, { align: "left" }, this.pdfFormate.startX, startY);
      doc.setLineWidth(1);
      var inty = startY += this.pdfFormate.NormalSpacing + 30;
      doc.line(this.pdfFormate.startX, inty, 150, inty);

      doc.save("BillingNote" + UtilsForGlobalData.retrieveLocalStorageKey('BillingNoteNumber') + ".pdf");
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
