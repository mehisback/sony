import { Component, OnInit, ViewChild } from '@angular/core';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxTreeListModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
import { DatePipe } from '@angular/common';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');


/* @Author Ganesh
/* this is For With Holding Tax Details
/* On 05-03-2019
*/

@Component({
  selector: 'app-withholdingtax-details',
  templateUrl: './withholdingtax-details.component.html',
  styleUrls: ['./withholdingtax-details.component.css'],
  providers: [DatePipe]
})
export class WithholdingtaxDetailsComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  WHTDetails: any = {};
  exportWHTDetails: any = {};
  WHTDate: any = {};
  companyData = null;
  printHeader: any = null;
  columns1 = [
    { title: "ประเภทเงินได้พึงประเมินจ่าย", dataKey: "SnNo", width: 90 },
    { title: "วัน เดือน/หรือ ปีภาษีที่จ่าย", dataKey: "Data", width: 40 },
    { title: "จำนวนเงินที่จ่าย", dataKey: "Description", width: 40 },
    { title: "ภาษีที่หัก/และนำส่งไว้", dataKey: "Data2", width: 40 }
  ];

  columns2 = [
    { SnNo: "1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40 (1)", Data: "", Description: "", Data2: "" },
    { SnNo: "2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40 (2)", Data: "", Description: "", Data2: "" },
    { SnNo: "3. ค่าแห่งลิขสิทธิ์ฯลฯ ตามมาตรา 40 (3)", Data: "", Description: "", Data2: "" },
    { SnNo: "4. (ก)  ดอกเบี้ย ฯลฯ ตามมาตรา 40 (4) ก", Data: "", Description: "", Data2: "" },
    { SnNo: "(ข) เงินปันผล เงินส่วนแบ่งกำไร ฯลฯ ตามมาตรา 40 (4) (ข)", Data: "", Description: "", Data2: "" },
    { SnNo: "(1) กรณีผู้ได้รับเงินปันผลได้รับเครดิตภาษี โดยจ่ายจาก", Data: "", Description: "", Data2: "" },
    { SnNo: "กำไรสุทธิของกิจการที่ต้องเสียภาษีเงินได้นิติบุคคลในอัตราดังนี้", Data: "", Description: "", Data2: "" },
    { SnNo: "(1.1) อัตราร้อยละ 30 ของกำไรสุทธิ", Data: "", Description: "", Data2: "" },
    { SnNo: "(1.2) อัตราร้อยละ 25 ของกำไรสุทธิ", Data: "", Description: "", Data2: "" },
    { SnNo: "(1.3) อัตราร้อยละ 20 ของกำไรสุทธิ", Data: "", Description: "", Data2: "" },
    { SnNo: "(1.4) อัตราอื่นๆ (ระบุ)........... ของกำไรสุทธิ", Data: "", Description: "", Data2: "" },
    { SnNo: "(2) กรณีผู้ได้รับเงินปันผลไม่ได้รับเครดิตภาษี เนื่องจากจ่ายจาก", Data: "", Description: "", Data2: "" },
    { SnNo: "(2.1) กำไรสุทธิของกิจการที่ได้รับยกเว้นภาษีเงินได้นิติบุคคล", Data: "", Description: "", Data2: "" },
    { SnNo: "(2.2) เงินปันผลหรือเงินส่วนแบ่งของกำไรที่ได้รับยกเว้นไม่ต้องนำมารวม", Data: "", Description: "", Data2: "" },
    { SnNo: "       ก่อนรอบระยะเวลาบัญชีปีปัจจุบัน", Data: "", Description: "", Data2: "" },
    { SnNo: "(2.3) กำไรสุทธิส่วนที่ได้หักผลขาดทุนสุทธิยกมาไม่เกิน 5 ปี", Data: "", Description: "", Data2: "" },
    { SnNo: "       ก่อนรอบระยะเวลาบัญชีปีปัจจุบัน", Data: "", Description: "", Data2: "" },
    { SnNo: "(2.4) กำไรที่รับรู้ทางบัญชีโดยวิธีส่วนได้เสีย (equity method)", Data: "", Description: "", Data2: "" },
    { SnNo: "(2.5) อื่น ๆ (ระบุ) ......................................................", Data: "", Description: "", Data2: "" },
    { SnNo: "5. การจ่ายเงินได้ที่ต้องหักภาษี ณ ที่จ่ายตามคำสั่งกรมสรรพากรที่ออกตามมาตรา", Data: "", Description: "", Data2: "" },
    { SnNo: "3 เตรส เช่น รางวัล ส่วนลดหรือประโยชน์ใดๆ เนื่องจากการส่งเสริมการขาย", Data: "", Description: "", Data2: "" },
    { SnNo: "รางวัลในการประกวด การแข่งขัน การชิงโชค ค่าแสดงของนักแสดงสาธารณะ", Data: "", Description: "", Data2: "" },
    { SnNo: "ค่าจ้างทำของ ค่าโฆษณา ค่าเช่า ค่าขนส่ง ค่าบริการ ค่าเบี้ยประกันวินาศภัย ฯลฯ", Data: "", Description: "", Data2: "" },
    { SnNo: "6. อื่นๆ (ระบุ)...............................................................................................", Data: "", Description: "", Data2: "" },
    { SnNo: "7. อื่นๆ (ระบุ)...............................................................................................", Data: "", Description: "", Data2: "" }
  ];

  columnsHeaderText = [
    'ฉบับที่ 1 สำหรับผู้ถูกหักภาษี ณ ที่จ่าย ใช้แนบพร้อมกับแบบแสดงรายการภาษี',
    'ฉบับที่ 2 สำหรับผู้ถูกหักภาษี ณ ที่จ่าย เก็บไว้เป็นหลักฐาน',
    'ฉบับที่ 3 สำหรับผู้มีหน้าที่หักภาษี ณ ที่จ่าย ใช้แนบพร้อมกับแบบแสดงรายการภาษี',
    'ฉบับที่ 4 สำหรับผู้มีหน้าที่หักภาษี ณ ที่จ่าย เก็บไว้เป็นหลักฐาน'
  ];
  strReportType: string = 'ภ.ง.ด. 53';
  WHTOperations: any = ['Print Details'];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.WHTDate.DocumentFromDate = new Date();
    this.WHTDate.DocumentToDate = new Date();

    this.WHTDate.DocumentFromDate.setMonth(this.WHTDate.DocumentFromDate.getMonth() - 1);
    this.WHTDate.DocumentFromDate = this.datePipe.transform(this.WHTDate.DocumentFromDate, 'yyyy-MM-dd');
    this.WHTDate.DocumentToDate = this.datePipe.transform(this.WHTDate.DocumentToDate, 'yyyy-MM-dd');

    this.WHTDate.ShowSuspened = false;
    var thisComponent = this;

    this.WHTDetails = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("WHTRecords", "getWHTrecords", ["",
          thisComponent.WHTDate.DocumentFromDate,
          thisComponent.WHTDate.DocumentToDate
        ]).subscribe(data => {
          thisComponent.exportWHTDetails = data;
          devru.resolve(data);
        });
        return devru.promise();
      },
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyData = callData3[0];
      });

  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      this.gridContainer.instance.refresh();
    }
  }

  onUserRowSelect(event) {
    this.printHeader = event.data;

  }

  WHTOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Details') {
      if (this.printHeader != null) {
        this.generateStdPDF(this.printHeader, null, "With Holding Tax Details");
      } else {
        this.toastr.warning("Please Select The Document from the Lines");
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
    SmallFontSize: 7, //8
    SetFont: "Garuda-Bold",
    SetFontType: "normal",
    NormalSpacing: 12,
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    InitialstartY: 20,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, title) {

    printHeader.TotalAmountinWords = "" + this.companyData.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.BaseAmount), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.BaseAmount - parseInt(printHeader.BaseAmount)) * 100);
    if (Number(decimalAsInt) >= 0) {
      printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
    }
    printHeader.BaseAmount = this.formatNumber(printHeader.BaseAmount);
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    var index = Number(printHeader.LineTypeNo);
    if (index > Object.keys(this.columns2).length) {
      index = Object.keys(this.columns2).length;
    }
    this.columns2[index].Data = printHeader.DocumentDate;
    this.columns2[index].Description = printHeader.BaseAmount;
    this.columns2[index].Data2 = printHeader.Amount;


    const doc = new jsPDF('p', 'pt', 'a4'); //'p', 'pt' {filters: ['ASCIIHexEncode']}

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var pages = 4;
    for (var j = 0; j < pages; j++) {
      this.callmeToGeneretePDF(doc, title, this.columnsHeaderText[j], this.strReportType, printHeader, printLines);
      if (j != pages - 1)
        doc.addPage();
    }

    doc.save("WithHoldingTax" + printHeader.DocumentNo + ".pdf");
  }

  calculateThePage(startY, doc) {
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY;
    }
    return startY;
  }

  callmeToGeneretePDF(doc, title, headerTxt, strReportType, printHeader, printLines) {
    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SmallFontSize - 2);
    doc.textAlign("ฉบับที่ 1 (สำหรับผู้ถูกหักภาษี ณ ที่จ่าย ใช้แนบพร้อมกับแบบแสดงราการภาษี)", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("ฉบับที่ 2 (สำหรับผู้ถูกหักภาษี ณ ที่จ่าย เก็บไว้เป็นหลักฐาน)", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("หนังสือรับรองการหักภาษี ณ ที่จ่าย", { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("เลขที่ : " + printHeader.WHTDocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign("ตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร", { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("ลำดับที่____ในแบบ  : " + strReportType, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign("" + headerTxt, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("ผู้มีหน้าที่หักภาษี ณ ที่จ่าย :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("ผู้ถูกหักภาษี ณ ที่จ่าย :", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + this.companyData.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.VendorName, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + this.companyData.Address1 + ", " + this.companyData.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.Address1, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + this.companyData.City + "- " + this.companyData.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.Address2, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("Phone :" + this.companyData.Phone + " Fax :" + this.companyData.Fax, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.City + "- " + printHeader.Zip, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("เลขประจำตัวผู้เสียภาษีอากร(13 หลัก)* " + this.companyData.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("เลขประจำตัวผู้เสียภาษีอากร(13 หลัก)* " + printHeader.TAXID, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

    //-------Customer Info Billing---------------------
    var startBilling = this.pdfFormate.startY;
    // columnStyles: {
    //   id: {fillColor: 255}
    // },

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns1, this.columns2, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing - 5,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize - 1,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
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

    var rightcol1 = 340;
    var rightcol2 = 480;
    doc.setFontType(this.pdfFormate.SetFontType);
    var startY = doc.autoTable.previous.finalY;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("รวมเงินที่จ่ายและภาษีที่หักนำส่ง : ", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseAmount, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("รวมเงินที่จ่ายและภาษีที่หักนำส่ง : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("รวมเงินภาษีที่หักนำส่ง (ตัวอักษร) " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("ผู้จ่ายเงิน     (X) หัก ณ ที่จ่าย          ( ) ออกให้ตลอดไป          ( ) ออกให้ครั้งเดียว           ( ) อื่นๆ (ระบุ) ........", { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("คำเตือน : ผู้มีหน้าที่ออกหนังสือรับรองการหักภาษี ณ ที่จ่าย", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("ขอรับรองว่าข้อความและตัวเลขดังกล่าวข้างต้นถูกต้องตรงกับความจริงทุกประการ", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("ฝ่าฝืนไม่ปฏิบัติตามมาตรา 50 ทวิ แห่งประมวล", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);
    doc.textAlign("ลงชื่อ _____________________________ ผู้จ่ายเงิน", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("รัษฎากร ต้้องรับโทษทางอาญาตามมาตรา 35", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);
    doc.textAlign("" + UtilsForGlobalData.getCurrentDate(), { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("แห่งประมาลรัษฎากร", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);
    doc.textAlign("(วัน เดือน ปี ที่ออกหนังสือรับรองฯ)", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("ประทับตรา", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("นิติบุคคล", { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("(ถ้ามี)", { align: "right-align" }, rightcol2, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("หมายเหตุ : เลขประจำตัวผู้เสียภาษีอากร (13 หลัก)* หมายถึง", { align: "left" }, this.pdfFormate.startX, startY);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("1. กรณีบุคคลธรรมดาไทย ให้ใช้เลขประจำตัวประชาชนของกรมการปกครองออกให้", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("2. กรณีนิติบุคคล ให้ใช้เลขทะเบียนนิติบุคคลของกรมพัฒนาธุรกิจการค้าออกให้", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("3. กรณีอื่นๆ นอกเหนือจาก 1.และ2.ให้ใช้เลขประจำตัวผู้เสียภาษีอากร(13 หลัก)ที่กรมสรรพากรออกให้", { align: "left" }, this.pdfFormate.startX + this.pdfFormate.NormalSpacing, startY);


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
