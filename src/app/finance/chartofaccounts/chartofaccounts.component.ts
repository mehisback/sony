import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
import * as events from "devextreme/events";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ChartofaccountsHttpDataService } from './chartofaccounts-http-data.service';

/* @Author Ganesh
/* this is For Chart Of Account
/* On 01-03-2019
*/


@Component({
  selector: 'app-chartofaccounts',
  templateUrl: './chartofaccounts.component.html',
  styleUrls: ['./chartofaccounts.component.css']
})

export class ChartofaccountsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  AccountType: string = 'ALL';
  dataSource: any;
  printLines: any = {};
  AccountTypeSuggestions: any = {};
  ParentCodeSuggestions: any = {};
  SubAccountTypeSuggestions: any = [];
  PostingTypeSuggestions: any = {
    paginate: true,
    pageSize: 10,
    loadMode: "raw",
    load: () => ['Both', 'Debit', 'Credit']
  };
  MainTypeSuggestions: any = ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSES'];
  AccountLevelSuggestions: any = {
    paginate: true,
    pageSize: 10,
    loadMode: "raw",
    load: () => ['1','2', '3', '4', '5']
  };
  onUpdateHolder: any = {};
  companyHeader = null;
  COARowSelected: any = null;
  globalGLEntriesPopup: Boolean = false;
  dataSourceGLEntries: any = [];
  columns1 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Account Code", dataKey: "AccountCode", width: 40 },
    { title: "Name", dataKey: "Name", width: 40 },
    { title: "Balance", dataKey: "Balance", width: 40 }
  ];

  constructor(
    private httpDataService: ChartofaccountsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.setSubAccountTypeOnAccountType = this.setSubAccountTypeOnAccountType.bind(this);
    this.setAccountLevelOn = this.setAccountLevelOn.bind(this);
  }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: "AccountCode",
      //key: ["AccountCode", "Name", "AccountLevel", "AccountType", "SubAccountType", "PostingType", "parentAccount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.AccountType == 'ALL') {
          thisComponent.httpDataService.openChartOfAccounts([""]).subscribe(dataHeader => {
            for (var i = 0; i < Object.keys(dataHeader).length; i++) {
              dataHeader[i]["ParentCode"] = String(dataHeader[i]["ParentCode"]).charCodeAt(0) == 13 ? 0 : dataHeader[i]["ParentCode"];
              if (String(dataHeader[i]["ParentCode"]).charCodeAt(String(dataHeader[i]["ParentCode"]).length - 1) == 13) {
                dataHeader[i]["ParentCode"] = String(dataHeader[i]["ParentCode"]).substring(0, String(dataHeader[i]["ParentCode"]).length - 1);
              }
            }
            thisComponent.printLines = dataHeader;
            devru.resolve(dataHeader);
          });
        }
        else {
          thisComponent.httpDataService.openChartOfAccountsFilter(["",
            thisComponent.AccountType]).subscribe(dataHeader => {
              for (var i = 0; i < Object.keys(dataHeader).length; i++) {
                dataHeader[i]["ParentCode"] = String(dataHeader[i]["ParentCode"]).charCodeAt(0) == 13 ? 0 : dataHeader[i]["ParentCode"];
                if (String(dataHeader[i]["ParentCode"]).charCodeAt(String(dataHeader[i]["ParentCode"]).length - 1) == 13) {
                  dataHeader[i]["ParentCode"] = String(dataHeader[i]["ParentCode"]).substring(0, String(dataHeader[i]["ParentCode"]).length - 1);
                }
              }
              thisComponent.printLines = dataHeader;
              devru.resolve(dataHeader);
            });
        }
        return devru.promise();
      },
      /* remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SONEW2", "deleteLine", ["", key["LineNo"], UtilsForGlobalData.retrieveLocalStorageKey('SONumber')])
          .subscribe(data => {
            if (data == '0') {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      }, */
      insert: function (values) {
        var devru = $.Deferred();
        if (values["AccountCode"] != null ? values["Name"] != null ? values["AccountLevel"] != null ?
          values["AccountType"] != null ? values["PostingType"] != null ? values["ParentCode"] != null ? values["MainType"] != null ? true : false : false : false : false : false : false : false) {
          thisComponent.httpDataService.btnSave_clickHandlerADD(["",
            values["AccountCode"],
            values["Name"],
            values["MainType"],
            values["AccountLevel"],
            values["AccountType"],
            values["SubAccountType"] ? values["SubAccountType"] : '',
            values["PostingType"],
            values["AccountType"],
            values["AccountLevel"] == '1' ? 0 : values["ParentCode"]
          ]).subscribe(data => {
            if (data == 1) {
              devru.resolve(data);
            } else {
              devru.resolve();
              thisComponent.toastr.error("Error while Adding the Lines with AccountCode: " + values["AccountCode"] + ", Check for Duplicate! Error Status Code is INSERT-ERR");
            }
          });
        } else {
          devru.resolve();
          thisComponent.toastr.warning("Some Fields Are Missing");
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnSave_clickHandlerMODIFY(["",
          getUpdateValues(key, newValues, "Name"),
          getUpdateValues(key, newValues, "AccountLevel"),
          getUpdateValues(key, newValues, "AccountType"),
          getUpdateValues(key, newValues, "SubAccountType"),
          getUpdateValues(key, newValues, "PostingType"),
          getUpdateValues(key, newValues, "AccountLevel") == '1' ? 0 : getUpdateValues(key, newValues, "ParentCode"),
          getUpdateValues(key, newValues, "AccountCode")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with AccountCode: " + getUpdateValues(key, newValues, "AccountCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      errorHandler: function (error) {
        this.toastr.error(error.message);
      }
    });

    this.httpDataService.getAccountType(['']).subscribe(AccountType => {
      this.AccountTypeSuggestions = {
        paginate: true,
        pageSize: 10,
        loadMode: "raw",
        load: () => <String[]>AccountType
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(CompanyInfo => {
      this.companyHeader = CompanyInfo[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == undefined || newValues[field] == null) ? thisComponent.onUpdateHolder[field] : newValues[field];
    }
  }

  formateForAccountTypeSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  formateForSubAccountTypeSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "SubTypeCode");
  }

  AccountTypeLookUp(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "CodeType");
  }

  formateForParentCodeTypeSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "AccountCode");
  }

  ParentCodeLookUp(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }


  onTabChange(event: NgbTabChangeEvent) {
    this.AccountType = event.nextId;
    this.gridContainer.instance.refresh();
  }

  COAOnEditing(event, type) {
    event.component.columnOption("AccountLevel", "visible", true);
    event.component.columnOption("PostingType", "visible", true);
    if (type == 'ADD') {
      //event.component.columnOption("ParentCode", "visible", false);
      event.component.columnOption("AccountCode", "allowEditing", true);
      if (event.data.ParentCode == '0') {
        event.data.AccountLevel = 1;
        this.setAccountLevelOnEdit(Number(0));
        event.component.columnOption("MainType", "allowEditing", true);
        event.component.columnOption("AccountLevel", "allowEditing", false);
        event.component.columnOption("SubAccountType", "visible", false);
      } else {
        for (var index = 0; index < Object.keys(this.printLines).length; ++index) {
          if (this.printLines[index].AccountCode == event.data.ParentCode) {
            event.data.MainType = this.printLines[index].MainType;
            this.setAccountLevelOnEdit(Number(this.printLines[index].AccountLevel));
            event.component.columnOption("SubAccountType", "visible", true);
            event.component.columnOption("MainType", "allowEditing", false);
            event.component.columnOption("AccountLevel", "allowEditing", true);
            break;
          }
        }
      }
    }
    else {
      this.onUpdateHolder = event.data;
      //event.component.columnOption("ParentCode", "visible", true);
      event.component.columnOption("AccountCode", "allowEditing", false);
      event.component.columnOption("AccountLevel", "allowEditing", false);
      event.component.columnOption("MainType", "allowEditing", false);
      this.httpDataService.getListBYLEVEL(['',
        event.data.AccountLevel]).subscribe(getList => {
          if (false) { //(Object.keys(getList).length > 0)
            this.ParentCodeSuggestions = new DataSource({
              store: <String[]>getList,
              paginate: true,
              pageSize: 10
            });
          }
        });
    }
  }

  setAccountLevelOnEdit(AccountLevel: Number) {
    switch (AccountLevel) {
      case 1: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => ['2', '3', '4', '5']
        }
        break;
      }
      case 2: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => ['3', '4', '5']
        }
        break;
      }
      case 3: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => ['4', '5']
        }
        break;
      }
      case 4: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => ['5']
        }
        break;
      }
      case 5: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => []
        }
        break;
      }
      default: {
        this.AccountLevelSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () => ['1', '2', '3', '4', '5']
        }
        break;
      }
    }
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.command == "edit") {
      let cellElement = e.cellElement,
        cancelLink = cellElement.querySelector(".dx-link-cancel"),
        saveLink = cellElement.querySelector(".dx-link-save");
      events.on(cancelLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("SubAccountType", "visible", true);
        this.gridContainer.instance.columnOption("AccountLevel", "visible", false);
        this.gridContainer.instance.columnOption("PostingType", "visible", false);
        this.gridContainer.instance.columnOption("ParentCode", "visible", false);
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("SubAccountType", "visible", true);
        this.gridContainer.instance.columnOption("AccountLevel", "visible", false);
        this.gridContainer.instance.columnOption("PostingType", "visible", false);
        this.gridContainer.instance.columnOption("ParentCode", "visible", false);
      });
    }
  };

  setSubAccountTypeOnAccountType(newData, value, currentData): void {
    newData.SubAccountType = '';
    newData.AccountType = value;
    this.setFetch(value);
    //(<any>this).defaultSetCellValue(newData, value);
  }

  setAccountLevelOn(newData, value, currentData): void {
    this.httpDataService.getListBYLEVEL(['',
      value]).subscribe(getList => {
        this.ParentCodeSuggestions = new DataSource({
          store: <String[]>getList,
          paginate: true,
          pageSize: 10
        });
      });
  }

  setFetch(value) {
    this.httpDataService.getSubAccountType(['',
      value]).subscribe(SubAccountType => {
        if ((Object.keys(SubAccountType).length > 0)) {
          this.SubAccountTypeSuggestions = {
            paginate: true,
            pageSize: 10,
            loadMode: "raw",
            load: () => <String[]>SubAccountType
          }
        } else {
          this.SubAccountTypeSuggestions = {
            paginate: true,
            pageSize: 10,
            loadMode: "raw",
            load: () => <String[]>[]
          }
        }
      });
  }

  onCOARowClicked(event) {
    this.COARowSelected = event.data;
  }

  COAOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Details') {
      this.generateStdPDF(null, this.printLines, "Chart Of Accounts Details");
    } else if (userOption == 'GL Entries') {
      if (this.COARowSelected) {
        this.globalGLEntriesPopup = true;
        this.httpDataService.getHeaderListDefault(['', this.COARowSelected.AccountCode]).subscribe(glEntry => {
          this.dataSourceGLEntries = <String[]>glEntry
        });
      } else {
        this.toastr.warning("Please Select The Account Code from Lines");
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

  generateStdPDF(printHeader, printLines, title) {

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printLines[i].Balance = this.formatNumber(printLines[i].Balance);
    }

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
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns1, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'justify'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages == 'function') {
          footerStr = footerStr;
        }
        footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId()
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.text(footerStr, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });
    if (typeof doc.putTotalPages == 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save("ChartOfAccounts.pdf");
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

    if (options.align == "center") {

      // Calculate text's x coordinate
      x = (pageWidth - txtWidth) / 2;

    } else if (options.align == "centerAtX") { // center on X value

      x = x - (txtWidth / 2);

    } else if (options.align == "right") {

      x = x - txtWidth;
    } else if (options.align == "right-align") {

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
