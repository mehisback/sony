import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import DataSource from "devextreme/data/data_source";
var accCodeListArray: any = [];
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import { GenJournalDetailsHttpDataService } from './gen-journal-details-http-data.service';

@Component({
  selector: 'app-gen-journal-details',
  templateUrl: './gen-journal-details.component.html',
  styleUrls: ['./gen-journal-details.component.css']
})
export class GenJournalDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  genJournDataSource: any;
  trackCodePOPUP: boolean = false;
  isEnableButton: boolean = true;
  GenJournalNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('GenJournalNumber');
  genJournHeaderDetail: [] = null;
  genTotalValues: [] = null;
  duplicateGenJournalHeader: string[];
  TrackCodesData: [] = null;
  newTemplateData: [] = null;
  trackCodesListSuggestions: DataSource = null;
  tempListSuggestions: DataSource = null;
  trackCodesValueListSuggestions: DataSource = null;
  documentValues: any = {};
  TempLines: any = {};
  duplicateDocumentValues: any = {};
  checkFiscalArray: any = {};
  accountCodeArray: any = [];
  printHeader: any = {};
  printLines = null;
  ConfrimPOPUP: boolean = false;
  Operation2: string = '';
  GenJournalOperations: any = ["Post", "Print", "Save As Template", "Get From Template"];
  GenJournalLineOperations: any = ["Delete All"];
  Operation1: string = '';
  ConfrimPostPOPUP: boolean = false;
  createNewTempPOP: boolean = false;
  saveTempRes: Object;
  GetFromTempPOP: boolean = false;
  getTemplateData: Object;
  companyHeader: any = {};
  isLinesExist: boolean = false;

  columnHeader1 = [
    { title: "JV Number", dataKey: "DocumentNo", width: 40 },
    { title: "Date", dataKey: "DocumentDate", width: 40 },
    { title: "Remark", dataKey: "Remarks", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "AccountCode", dataKey: "AccountCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "DebitAmount", dataKey: "DebitAmount", width: 40 },
    { title: "CreditAmount", dataKey: "CreditAmount", width: 40 }

  ];
  parseExcel: (file: any) => void;

  constructor(
    private httpDataService: GenJournalDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) {
    // this.saveNewTemplate = this.saveNewTemplate.bind(this);
  }

  ngOnInit() {
    this.isEnableButton = true;
    var thisComponent = this;


    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });


    this.httpDataService.getCOA(['']).subscribe(data => {
      this.accountCodeArray = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>data
      }
      accCodeListArray = data;
    });


    this.genJournDataSource = new CustomStore({
      key: ["LineNo", "AccountCode", "Description", "DebitAmount", "CreditAmount", "Amount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getLines(["",
          thisComponent.GenJournalNumber]).subscribe(data => {
            thisComponent.printLines = data;
            thisComponent.getHeaderDetails();
            devru.resolve(data);
            if (Object.keys(thisComponent.printLines).length > 0) {
              thisComponent.getTotalAmounts();
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDeleteLine_clickHandler(["",
          thisComponent.GenJournalNumber,
          key["LineNo"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines with AccountCode : " + key["AccountCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        thisComponent.httpDataService.addGenJournalLine(["",
          thisComponent.GenJournalNumber,
          values["AccountCode"],
          values["DebitAmount"],
          values["CreditAmount"],
          values["Amount"],
          values["Description"],
          thisComponent.genJournHeaderDetail["FiscalYearID"],
          thisComponent.genJournHeaderDetail["FiscalPeriod"],
          UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Adding the Lines with AccountCode: " + values["AccountCode"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateGenJournalLine(["",
          getUpdateValues(key, newValues, "AccountCode"),
          getUpdateValues(key, newValues, "DebitAmount") ? getUpdateValues(key, newValues, "DebitAmount") : '0.0',
          getUpdateValues(key, newValues, "CreditAmount") ? getUpdateValues(key, newValues, "CreditAmount") : '0.0',
          getUpdateValues(key, newValues, "Amount") ? getUpdateValues(key, newValues, "Amount") : '0.0',
          getUpdateValues(key, newValues, "Description"),
          thisComponent.GenJournalNumber,
          getUpdateValues(key, newValues, "LineNo")])
          .subscribe(dataStatus => {
            if (dataStatus >= 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Updating the Lines with AccountCode: " + getUpdateValues(key, newValues, "AccountCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  formateForAccCodeListSuggestion2(data) {
    return data ? data["AccountCode"] : '';
  }

  itemLookup2(data) {
    return data ? data.AccountCode : ''; //+ " | " + data.UOM + " | " + data.UnitPrice + " | " + data.StockOnHand
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }


  setValueItemCode(newData, value, currentData): void {
    for (var index = 0; index < accCodeListArray.length; ++index) {
      if (accCodeListArray[index].AccountCode == value) {
        newData.Description = accCodeListArray[index].Name;
        newData.DebitAmount = '0.00';
        newData.CreditAmount = '0.00';
        newData.Amount = '0.00';
        //newData.AmountIncludingVAT = (newData.DirectUnitCost * newData.Quantity) - newData.LineDiscountAmount;
        break;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setDebitValue(newData, value, currentData): void {
    if (value > 0) {
      newData.DebitAmount = value;
      newData.CreditAmount = '0.00';
      newData.Amount = value;
    }
  }

  setCreditValue(newData, value, currentData): void {
    if (value > 0) {
      newData.CreditAmount = value;
      newData.DebitAmount = '0.00';
      newData.Amount = -1 * value;
    }
  }


  getHeaderDetails() {
    this.isEnableButton = true;
    this.httpDataService.getHeader(["",
      this.GenJournalNumber]).subscribe(gotGenJournDetails => {
        this.genJournHeaderDetail = gotGenJournDetails[0];
        this.printHeader = gotGenJournDetails;
        var a = new Array(this.genJournHeaderDetail["FiscalYearID"], this.genJournHeaderDetail["FiscalPeriod"]);
        this.genJournHeaderDetail["FiscalPeriodCombined"] = a.join("     ");
      });
  }

  getTotalAmounts() {
    this.httpDataService.getTotalAmounts(["",
      this.GenJournalNumber]).subscribe(dataTotal => {
        this.genTotalValues = dataTotal[0];
      });
  }

  GenJournalLineOperationsGo(operation) {
    if (operation == 'Delete All') {
      this.ConfrimPOPUP = true;
    }
  }

  GenJournalLineOperationsGoOption(event) {
    this.Operation2 = event.value;
  }

  GenJournalOperationssGo(option) {
    if (option == "Post") {
      if (this.isLinesExist) {
        this.ConfrimPostPOPUP = true;
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    } else if (option == "Save As Template") {
      this.createNewTempPOP = true;
    } else if (option == "Get From Template") {
      this.GetFromTempPOP = true;
      this.getFromTemplate();
    } else {
      if (this.isLinesExist) {
        this.generateStdPDF(this.genJournHeaderDetail, this.printLines, "General Voucher");
      } else {
        this.toastr.warning("Please Add the Lines!!");
      }
    }
  }

  ConfrimedPosting(event) {
    this.ConfrimPostPOPUP = false;
    this.httpDataService.checkFiscalYear(["",
      this.genJournHeaderDetail["FiscalYearID"],
      this.genJournHeaderDetail["DocumentDate"]]).subscribe(checkFiscalYear => {
        this.checkFiscalArray = checkFiscalYear;
        if (Object.keys(this.checkFiscalArray).length > 0) {
          this.checkBalances();
        } else {
          this.toastr.error("No Open Fiscal Year  Found for this Date , POSTING DENIED")
        }
      });
  }

  checkBalances() {
    if (Number(this.genTotalValues["totalAmt"]) != 0) {
      this.toastr.error("Journal is Out of Balance by: " + this.genTotalValues["totalAmt"], "POSTING DENIED");
      return;
    }

    if (Number(this.genTotalValues["totalCreditAmt"]) != Number(this.genTotalValues["totalDebitAmt"])) {
      this.toastr.error("Debit and Credit Amounts are Not Equal , POSTING DENIED");
      return;
    }

    if (Number(this.genTotalValues["totalCreditAmt"]) == 0 || Number(this.genTotalValues["totalDebitAmt"]) == 0) {
      this.toastr.error("Thers is NOTHING to Post , POSTING DENIED");
      return;
    }

    this.postJournal();

  }

  postJournal() {
    this.httpDataService.postJournal(["",
      this.GenJournalNumber,
      UtilsForGlobalData.getUserId()]).subscribe(postRes => {
        if (postRes == 'DONE') {
          this.ConfrimPOPUP = false;
          this.toastr.success("Posted Suucessfully");
          this.gridContainer.instance.refresh();
          this.router.navigate(['/finance/gen-journal-list']);
        }
        else {
          this.toastr.error("Error While Posting");
        }
      });
  }

  DeleteAll(event) {
    this.httpDataService.deleteAllLines(["",
      this.GenJournalNumber]).subscribe(deleteAllRes => {
        if (deleteAllRes > 0) {
          this.ConfrimPOPUP = false;
          this.gridContainer.instance.refresh();
        }
      });
  }

  PopUpClose() {
    this.ConfrimPOPUP = false;
  }

  saveNewTemplate(event) {
    this.newTemplateData = [];
    this.httpDataService.btnSAVE_clickHandler(["",
      this.newTemplateData["newTemplateCode"],
      this.GenJournalNumber, 'INS',
      UtilsForGlobalData.getUserId()]).subscribe(addNewTempCode => {
        this.saveTempRes = addNewTempCode;
        if (this.saveTempRes[0] == "DONE") {
          this.toastr.success("Saved Template Successfully");
          this.createNewTempPOP = false;
        } else if (this.saveTempRes[0] == "TEMPLATEEXISTS") {
          this.toastr.warning("Template Already Exisits,Try New Name");
        } else {
          this.toastr.error("Template Creation Failed! Error Status Code " + this.saveTempRes[0]);
        }
      });

  }

  PopUpCloseForNewTemp() {
    this.newTemplateData = null;
    this.createNewTempPOP = false;
  }

  onNewTempCodeValueChanged(event) {
    this.createNewTempPOP = true;
    if (event.value != undefined || event.value != '' || event.value != null) {
      this.newTemplateData["newTemplateCode"] = event.value;
      if (this.newTemplateData["newTemplateCode"] != null) {

        this.createNewTempPOP = true;
      }
    }
  }

  getFromTemplate() {
    this.httpDataService.getList([""]).subscribe(gotTrackCode => {
      this.tempListSuggestions = new DataSource({
        store: <String[]>gotTrackCode,
        paginate: true,
        pageSize: 10
      });
    });

  }

  suggestionFormatForTempList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "TemplateID");
  }

  onTempChanged(event) {
    this.getFromTemplate["TemplateID"] = event.value;
    if (this.getFromTemplate["TemplateID"] != null) {
      this.httpDataService.recList_itemClickHandler(["",
        this.getFromTemplate["TemplateID"]]).subscribe(gotTemplateValues => {
          this.TempLines = gotTemplateValues;
        });
    }
  }

  onSelectTemplate(event) {
    this.httpDataService.handleTemplateLookUp(["",
      this.getFromTemplate["TemplateID"],
      this.GenJournalNumber, 'INSGL',
      UtilsForGlobalData.getUserId()]).subscribe(createfromTemp => {
        if (createfromTemp[0] == 'DONE') {
          this.toastr.success("Lines From Template Created!");
          this.GetFromTempPOP = false;
          this.gridContainer.instance.refresh();
        } else {
          this.toastr.error("Line Creation Failed! Error Status Code " + createfromTemp[0]);
        }
      });
  }

  assignToDuplicate(data) {
    this.isEnableButton = true;
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateGenJournalHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateGenJournalHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateGenJournalHeader[i][prop] = data[i][prop];
      }
    }
  }

  import(e) {

  }

  trackCodes() {
    this.trackCodePOPUP = true;
    this.TrackCodesData = [];
    this.isEnableButton = true;
    this.httpDataService.getHeaderList([""]).subscribe(gotTrackCode => {
      this.trackCodesListSuggestions = new DataSource({
        store: <String[]>gotTrackCode,
        paginate: true,
        pageSize: 10
      });
    });
    this.DocumentTrackLines();
  }


  DocumentTrackLines() {
    this.httpDataService.getDocumentTrackingList(["",
      this.GenJournalNumber,
      'GENJOURNAL']).subscribe(gotDocumentValues => {
        this.documentValues = gotDocumentValues
      });
    this.isEnableButton = true;
  }

  suggestionFormatForTrackCodeList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  onTrackCodeChanged(event) {
    this.isEnableButton = true;
    this.TrackCodesData["TrackCode"] = event.value;
    if (event.value != undefined || event.value != "" || event.value != null) {
      this.httpDataService.TrackingDocumentgetLines(["",
        event.value]).subscribe(gotTrackValues => {
          this.trackCodesValueListSuggestions = new DataSource({
            store: <String[]>gotTrackValues,
            paginate: true,
            pageSize: 10
          });
        });
    }
  }

  suggestionFormatForTrackCodeValueList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "CodeValue");
  }

  onTrackCodeValueChanged(event) {
    this.isEnableButton = true;
    if (event.value != undefined || event.value != '' || event.value != null) {
      this.TrackCodesData["TrackCodeValue"] = event.value;
      if (this.TrackCodesData["TrackCodeValue"] != null) {

        this.isEnableButton = false;
      }
    }
  }


  SaveNewValues() {
    this.formWidget.instance.updateData(this.TrackCodesData);
    if (this.TrackCodesData["TrackCode"] && this.TrackCodesData["TrackCodeValue"]) {
      this.httpDataService.btnAdd_clickHandler(["",
        this.GenJournalNumber,
        this.TrackCodesData["TrackCodeValue"]]).subscribe(checkForDuplication => {
          this.duplicateDocumentValues = checkForDuplication;
          if (Object.keys(this.duplicateDocumentValues).length == 0) {
            this.httpDataService.addTrackingLine(["",
              this.GenJournalNumber,
              this.genJournHeaderDetail["DocumentDate"],
              '0', 'GENJOURNAL', UtilsForGlobalData.getUserId(),
              this.TrackCodesData["TrackCode"],
              this.TrackCodesData["TrackCodeValue"]]).subscribe(insertedRes => {
                if (insertedRes == 1) {
                  this.DocumentTrackLines();
                } else {
                  this.toastr.error("Action Failed");
                }
              });
          } else {
            this.toastr.error("This Tracking Code Value is Already Selected");
          }
        });
    }
    else {
      this.toastr.error("Please Select Code and Value to add");
    }
  }


  deleteEvent(event: any) {
    var devru = $.Deferred();
    this.httpDataService.button1_clickHandler(["",
      this.GenJournalNumber,
      event.data.LineNo]).subscribe(deleteUOMforthisItem => {
        if (deleteUOMforthisItem > 0) {
          this.DocumentTrackLines();
          this.toastr.success("Deleted Successfully");
        } else {
          this.toastr.error("Error while Deleting");
          this.DocumentTrackLines();
        }
      });
  }

  formSummary_fieldDataChanged(e) {
    this.isEnableButton = true;
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

    printHeader.TotalAmount = 0;
    printHeader.TotalCreditAmount = 0;
    printHeader.TotalDebitAmount = 0;

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printLines[i].DebitAmount = this.formatNumber(printLines[i].DebitAmount);
      printLines[i].CreditAmount = this.formatNumber(printLines[i].CreditAmount);
      printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      printHeader.TotalAmount += Number(printLines[i].Amount);
      printHeader.TotalCreditAmount += Number(printLines[i].CreditAmount);
      printHeader.TotalDebitAmount += Number(printLines[i].DebitAmount);
    }

    printHeader.TotalAmounttext = (writtenNumber(parseInt(printHeader.TotalAmount), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.TotalAmount - parseInt(printHeader.TotalAmount)) * 100);
    if (Number(decimalAsInt) >= 0) {
      printHeader.TotalAmounttext += " and " + decimalAsInt + "/100";
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
    doc.textAlign("VATID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

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
      columnStyles: {
        SNo: {
          halign: 'left'
        },
        AccountCode: {
          halign: 'left'
        },
        Description: {
          halign: 'left'
        }
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
    doc.textAlign("In Words : " + printHeader.TotalAmounttext, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Total Credit", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + this.formatNumber(printHeader.TotalCreditAmount), { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Total Debit", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(printHeader.TotalDebitAmount), { align: "right-align" }, rightcol2, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Amount", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(printHeader.TotalAmount), { align: "right-align" }, rightcol2, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setLineWidth(1);
    var inty = startY += this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX, inty, 150, inty);
    startY += this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Aproved By", { align: "right-align" }, rightcol2, startY);

    doc.save("GenJournal" + this.GenJournalNumber + ".pdf");
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

