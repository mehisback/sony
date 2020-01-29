import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { PostedTransferDetailsHttpDataService } from './posted-transfer-details-http-data.service';

@Component({
  selector: 'app-posted-transfer-details',
  templateUrl: './posted-transfer-details.component.html',
  styleUrls: ['./posted-transfer-details.component.css']
})
export class PostedTransferDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  TRNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('PostedTRINumber');
  transHeader: any;
  TransferDetailsOperations: any = ['Print Order'];
  dataSource: any;
  columns1 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "LotNo", dataKey: "", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "BaseUOM", width: 40 },
    { title: "QtySent", dataKey: "QtySent", width: 40 },
  ];
  printPickLine: any;
  isLinesExist: boolean = false;
  companyHeader: any;

  constructor(
    private httpDataService: PostedTransferDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["LineNo", "ItemCode", "BaseUOM", "Description", "LotNo", "QtySent", "ExpiryDate"],
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
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });
  }

  gettransferheader() {
    this.httpDataService.openTransHeader(['', this.TRNumber])
      .subscribe(openTransHeader => {
        this.transHeader = openTransHeader[0];
      });
  }

  SalesOrderOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.warning("Please Select The Operation");
    } else if (userOption == 'Print Order') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.transHeader, this.printPickLine, this.columns1, "Transfer Order");
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    }
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

    printHeader.TotalQtySent = 0;

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.TotalQtySent = Number(printHeader.TotalQtySent) + Number(printLines[i].QtySent);
      printLines[i].QtySent = this.formatNumber(printLines[i].QtySent);
    }

    printHeader = UtilsForSuggestion.StandardValueFormat(printHeader, ["Reason"]);

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

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.FromStorageUnitCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.ToStorageUnitCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    tempY += this.pdfFormate.startY;

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columHeader, printLines, {
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
        ItemCode: {
          halign: 'left'
        },
        LotNo: {
          halign: 'left'
        },
        Description: {
          halign: 'left'
        },
        BaseUOM: {
          halign: 'left'
        }
      },
      headStyles: {
        halign: 'left'
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
    doc.textAlign("TOTAL : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(printHeader.TotalQtySent), { align: "right-align" }, rightcol2, startY);


    //-------Invoice Footer---------------------
    var rightcol1 = 340;
    var rightcol2 = 480;
    doc.setFontType(this.pdfFormate.SetFontType);
    var startY = doc.autoTable.previous.finalY;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 30, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remark : " + printHeader.Reason, { align: "left" }, this.pdfFormate.startX, startY);//หมายเหตุ
    doc.setLineWidth(1);
    var inty = startY += this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX, inty, 150, inty);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Inspector", { align: "center" }, rightcol1, startY);
    doc.textAlign("Sender .................................", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("........................................", { align: "center" }, rightcol1, startY);
    doc.textAlign("Date ....../...../...........", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Date ....../...../...........", { align: "center" }, rightcol1, startY);
    doc.textAlign("Recipient .................................", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Date ....../...../...........", { align: "right-align" }, rightcol2, startY);

    doc.save("TransferReceipt" + this.TRNumber + ".pdf");
    this.gridContainer.instance.refresh();
  }

}
