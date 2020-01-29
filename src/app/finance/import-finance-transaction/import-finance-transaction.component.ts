import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import * as XLSX from 'xlsx';
var XLSXSample = require('xlsx');
import * as uuid from 'uuid';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { ImportFinanceTransactionHttpDataService } from './import-finance-transaction-http-data.service';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-finance-transaction',
  templateUrl: './import-finance-transaction.component.html',
  styleUrls: ['./import-finance-transaction.component.css']
})

export class ImportFinanceTransactionComponent {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;

  rowCount1: Number = 0;
  rowCount2: Number = 0;
  APIButtonFlag: boolean = false;
  ChoosefileFlag: boolean = false;
  importData: any = {};
  importData2: any = {};
  importFileData: any;
  importpopup: boolean = false;
  dataSourceIJ1: any;
  dataSourceIJ2: any;
  isFileSelected1: boolean = false;
  inWhichOrders: String;
  CustSuggestions: any;
  TypeSuggestions: any;
  attributeSuggestions: any;
  locationSuggestions: any;
  chooseImportFormat = ["API", "EXCEL/CSV"];
  tokenofLazofromBack: any = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
  codefromLAZO: string;
  countdown: number;
  refreshTokenofLazofromBack: any;
  refreshTimerofLazofromBack: any;
  checkTokenofLazoFromLS;
  refreshTokenbackfromLS: any;
  ifTimerExists: any = 'No';

  constructor(
    private httpDataService: ImportFinanceTransactionHttpDataService,
    public router: Router,
    private toastr: ToastrService,
    public dataServices: DataService,
    private activatedRoute: ActivatedRoute
  ) {

    var thisComponent = this;

    this.dataSourceIJ1 = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount1 = 0;
        thisComponent.httpDataService.getRecords(["",
          thisComponent.importData.uuID]).subscribe(data => {
            thisComponent.rowCount1 = Object.keys(data).length;
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDeleteLine_clickHandler(["", key["LineNo"],
          thisComponent.importData.uuID])
          .subscribe(data => {
            if (data < 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      }
    });

    this.dataSourceIJ2 = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount2 = 0;
        thisComponent.httpDataService.getRecords2(["",
          thisComponent.importData2.uuID]).subscribe(data => {
            thisComponent.rowCount2 = Object.keys(data).length;
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDeleteLine_clickHandler(["", key["LineNo"],
          thisComponent.importData2.uuID])
          .subscribe(data => {
            if (data < 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      }
    });

    this.getDate2();
    this.import();
    this.import2();

  }

  getDate2() {
    this.httpDataService.getAllSetup([''])
      .subscribe(callData3 => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
  }


  import() {
    this.importData.uuID = UtilsForGlobalData.getUserId() + "-" + UtilsForGlobalData.getCurrentDate() + "-" + UtilsForGlobalData.getCurrentTime();
    this.importData.DocumentFromDate = UtilsForGlobalData.getCurrentDate();
    this.isFileSelected1 = false;
    this.importData.userselected = 'API';
  }

  import2() {
    this.importData2.uuID = UtilsForGlobalData.getUserId() + "-" + UtilsForGlobalData.getCurrentDate() + "-" + UtilsForGlobalData.getCurrentTime();
    this.importData2.DocumentFromDate = UtilsForGlobalData.getCurrentDate();
    this.importData2.DocumentToDate = UtilsForGlobalData.getCurrentDate();
    this.isFileSelected1 = false;
    this.importData2.userselected = 'API';
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'Payout') {
      //this.import();
    } else if (event.nextId == 'Transactions') {
      //this.import2();
    }
  }

  checkforParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if (code == 'Yes') {
        this.importData.Type == UtilsForGlobalData.retrieveLocalStorageKey("SoImportType");
        this.importData2.Type == UtilsForGlobalData.retrieveLocalStorageKey("SoImportType");
        localStorage.removeItem("SoImportType");
      }
    });
  }


  APICallImport(onwhich) {
    this.inWhichOrders = onwhich;
    this.importData.uuID = UtilsForGlobalData.getUserId() + "-" + UtilsForGlobalData.getCurrentDate() + "-" + UtilsForGlobalData.getCurrentTime();

    if (this.inWhichOrders == 'Payout') {
      if (this.importData.Type) {
        if (this.importData.Type == 'LAZADA') {
          this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
          if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
            UtilsForGlobalData.setLocalStorageKey("SoImportType", this.importData.Type);
            localStorage.setItem('LazobackURL', this.router.url);
            this.router.navigate(['/integration/lazada-auth']);
          } else {
            //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.generateAccessToken();
            //}
          }
        }
      } else {
        this.toastr.warning("Please Select the Import Type!");
      }
    } else if (this.inWhichOrders == 'Transactions') {
      if (this.importData2.Type) {
        if (this.importData2.Type == 'LAZADA') {
          this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
          if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
            localStorage.setItem('LazobackURL', this.router.url);
            this.router.navigate(['/integration/lazada-auth']);
          } else {
            //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.generateAccessToken();
            //}
          }
        }
      } else {
        this.toastr.warning("Please Select the Import Type!");
      }
    }
  }

  generateAccessToken() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    if (this.tokenofLazofromBack == '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.dataServices.getServerData("lazadaAuth", "generateAccessToken", ["", this.codefromLAZO])
        .subscribe(generateAccessToken => {
          this.tokenofLazofromBack = generateAccessToken["access_token"];
          this.refreshTokenofLazofromBack = generateAccessToken["refresh_expires_in"];
          this.refreshTimerofLazofromBack = generateAccessToken["refresh_token"];
          UtilsForGlobalData.setLocalStorageKey("refresh_token", this.refreshTimerofLazofromBack);
          UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
          this.startCountdownTimer(this.refreshTokenofLazofromBack);
          if (this.inWhichOrders == 'Payout') {
            this.getOrders();
          } else if (this.inWhichOrders == 'Transactions') {
            this.getOrders2();
          }
        });
    } else {
      if (this.inWhichOrders == 'Payout') {
        this.getOrders();
      } else if (this.inWhichOrders == 'Transactions') {
        this.getOrders2();
      }
    }
  }

  getOrders() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    this.dataServices.getServerData("lazadaFinance", "getPayoutStatus", ["",
      this.tokenofLazofromBack,
      this.importData.DocumentFromDate,
      this.importData.uuID]).subscribe(getOrders => {
        if (getOrders) {
          //this.toastr.success("Successfully Inserted!");
          this.gridContainer.instance.refresh();
        } else {
          this.toastr.error("Error While Getting the PayoutStatus");
        }
      });
  }

  getOrders2() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    this.dataServices.getServerData("lazadaFinance", "getTransactionDetails", ["",
      this.tokenofLazofromBack,
      this.importData2.DocumentFromDate,
      this.importData2.DocumentToDate,
      this.importData2.uuID]).subscribe(getOrders => {
        if (getOrders) {
          this.gridContainer2.instance.refresh();
        } else {
          this.toastr.error("Error While Getting the TransactionDetails");
        }
      });
  }

  startCountdownTimer(timer) {
    this.ifTimerExists = UtilsForGlobalData.retrieveLocalStorageKey("timerLazo");
    if (this.ifTimerExists == 'No' || this.ifTimerExists == '' || this.ifTimerExists == undefined || this.ifTimerExists == null) {
      UtilsForGlobalData.setLocalStorageKey("timerLazo", 'Yes');
      const interval = 1000;
      const duration = timer;
      const stream$ = Observable.timer(0, interval)
        .finally(() => this.timerfinish())
        .takeUntil(Observable.timer(duration + interval))
        .map(value => duration - value * interval);
      stream$.subscribe(value => {
        this.countdown = value;
      });
    }
  }

  timerfinish() {
    UtilsForGlobalData.setLocalStorageKey("timerLazo", 'No');
    this.refreshTokenbackfromLS = UtilsForGlobalData.retrieveLocalStorageKey("refresh_token");
    this.dataServices.getServerData("lazadaAuth", "refreshAccessToken", ["", this.refreshTokenbackfromLS])
      .subscribe(refreshAccessToken => {
        this.tokenofLazofromBack = refreshAccessToken["access_token"];
        this.refreshTokenofLazofromBack = refreshAccessToken["refresh_expires_in"];
        this.refreshTimerofLazofromBack = refreshAccessToken["refresh_token"];
        UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
        this.startCountdownTimer(this.refreshTokenofLazofromBack);
      });

  }


  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "CustCode");
  }

  hoverFormatForType(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Name");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Name");
  }

  hoverFormatForAttributes(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "AttributeValue");
  }

  suggestionFormateForAttributes(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "AttributeValue");
  }

  hoverFormatForLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  onCodeChanged(event, dataField) {
    if (event.value != undefined) {
      this.importData[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'API') {
          this.APIButtonFlag = true;
          this.ChoosefileFlag = false;
        } else {
          this.APIButtonFlag = false;
          this.ChoosefileFlag = true;
        }
      } else if (dataField == 'Type') {
        this.httpDataService.getSetup(['', event.value])
          .subscribe(callData3 => {
            this.importData["LocationCode"] = callData3[0].LocationCode;
            this.importData["AttirbuteCode"] = callData3[0].AttirbuteCode;
            this.importData["CustomerCode"] = callData3[0].CustomerCode;
            this.importData["RefNo"] = callData3[0].No;
          });
      }
    }
  }

  onCodeChanged2(event, dataField) {
    if (event.value != undefined) {
      this.importData2[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'API') {
          this.APIButtonFlag = true;
          this.ChoosefileFlag = false;
        } else {
          this.APIButtonFlag = false;
          this.ChoosefileFlag = true;
        }
      } else if (dataField == 'Type') {
        this.httpDataService.getSetup(['', event.value])
          .subscribe(callData3 => {
            this.importData2["LocationCode"] = callData3[0].LocationCode;
            this.importData2["AttirbuteCode"] = callData3[0].AttirbuteCode;
            this.importData2["CustomerCode"] = callData3[0].CustomerCode;
            this.importData2["RefNo"] = callData3[0].No;
          });
      }
    }
  }

  clearFile() {
    try {
      const file = document.querySelector('.selectedfile');
      file["value"] = '';
    } catch (Error) { }
  }

  StandardValueFormat(data: any, keys: any): any {
    for (var i = 0; i < keys.length; i++) {
      if (data["" + keys[i]] == undefined || data["" + keys[i]] == null || data["" + keys[i]] == '') {
        return false;
      }
    }
    return true;
  }

  btnImport_clickHandler() {
    if (this.isFileSelected1) {
      this.httpDataService.INSERTItems(["", this.importData.uuID,
        this.importData.CustomerCode,
        this.importData.LocationCode, this.importData.AttirbuteCode,
        UtilsForGlobalData.getUserId()])
        .subscribe(importJson => {
          if (importJson[0] == 'DONE') {
            if (Object.keys(importJson[1]).length != 0) {
              this.isFileSelected1 = false;
              this.toastr.success("ORDERS PROCESSED TO RHBUS", "Success");
            } else {
              this.toastr.error("Import Failed, PLEASE CHECK DATA AND SETUP");
            }
          } else {
            this.toastr.error("Import Failed with Error Status Code : " + importJson[0]);
          }
          this.gridContainer ? this.gridContainer.instance.refresh() : '';
        });
    } else {
      this.toastr.warning("Please Check the Line!!", "STATUS");
    }
  }

  btnImport_clickHandler2() {
    if (this.isFileSelected1) {
      this.httpDataService.INSERTItems2(["", this.importData.uuID,
        this.importData.CustomerCode,
        this.importData.LocationCode, this.importData.AttirbuteCode,
        UtilsForGlobalData.getUserId()])
        .subscribe(importJson => {
          if (importJson[0] == 'DONE') {
            if (Object.keys(importJson[1]).length != 0) {
              this.isFileSelected1 = false;
              this.toastr.success("ORDERS PROCESSED TO RHBUS", "Success");
            } else {
              this.toastr.error("Import Failed, PLEASE CHECK DATA AND SETUP");
            }
          } else {
            this.toastr.error("Import Failed with Error Status Code : " + importJson[0]);
          }
          this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
        });
    } else {
      this.toastr.warning("Please Check the Line!!", "STATUS");
    }
  }

  onDeleteClicked() {
    var data = this.gridContainer.instance.getSelectedRowKeys();
    var count = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
      this.httpDataService.btnDeleteLine_clickHandler(["", data[i]["LineNo"],
        this.importData.uuID]).subscribe(data2 => {
          count++;
          if (Number(Object.keys(data).length) == Number(count)) {
            this.gridContainer.instance.refresh();
            this.toastr.success("Line Successfully Deleted!");
          }
        });
    }
  }

  onDeleteClicked2() {
    var data = this.gridContainer2.instance.getSelectedRowKeys();
    var count = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
      this.httpDataService.btnDeleteLine_clickHandler2(["", data[i]["LineNo"],
        this.importData2.uuID]).subscribe(data2 => {
          count++;
          if (Number(Object.keys(data).length) == Number(count)) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Line Successfully Deleted!");
          }
        });
    }
  }

}

