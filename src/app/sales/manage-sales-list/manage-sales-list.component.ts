import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../../data.service';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { DOCUMENT } from '@angular/common';
import { confirm } from 'devextreme/ui/dialog';
import { SalesorderListHttpDataService } from './manage-sales-list-http-data.service';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
var XLSXSample = require('xlsx');

@Component({
  selector: 'app-manage-sales-list',
  templateUrl: './manage-sales-list.component.html',
  styleUrls: ['./manage-sales-list.component.css'],
  providers: [DatePipe]
})
export class ManageSalesListComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;
  @ViewChild("gridContainer4") gridContainer4: DxDataGridComponent;

  clientID: string;
  mainURL: string;
  currentURL = "https://rhbussupport.com/dist/lazada_script.html";
  serverName: string;

  FormDate: any = {};
  FormDate2: any = {};
  FormDate3: any = {};
  FormDate4: any = {};
  importData: any = {};
  countdown: number;
  CustSuggestions: any;
  soListSource1: any = {};
  soListSource: CustomStore;
  soListSource2: CustomStore;
  soListSource3: CustomStore;
  soListSource4: CustomStore;
  userID: String = UtilsForGlobalData.getUserId();
  BatchIDForApprove: boolean = false;
  DateForApprove: boolean = false;
  BatchIDForPICK: boolean = false;
  DateForPICK: boolean = false;
  BatchIDForAutoPICK: boolean = false;
  DateForAutoPICK: boolean = false;
  BatchIDForPostPICK: boolean = false;
  DateForPostPICK: boolean = false;
  APIButtonFlag: boolean = false;
  ChoosefileFlag: boolean = false;
  APIButtonFlagButton: boolean = false;
  importFileData: any;
  chooseImportFormat = ["By Document Date", "By BatchId"];
  chooseSOImportFormat = [];
  TypeSuggestions: any;
  ImportTypeSuggestions: any;
  isFileSelected1: boolean = false;
  importpopup: boolean = false;
  codefromLAZO: string;
  tokenofLazofromBack: any = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
  refreshTokenofLazofromBack: any;
  refreshTimerofLazofromBack: any;
  refreshTokenbackfromLS: any;
  ifTimerExists: any = 'No';
  dataSourceIJ1: any;
  dataSourceIJ2: any;
  rowCount1: Number = 0;
  rowCount2: Number = 0;
  waitingDialogue: boolean = false;

  constructor(
    private httpDataService: SalesorderListHttpDataService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public dataServices: DataService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.getDate2();
    this.checkforParams();

    var thisComponent = this;
    this.soListSource1.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllSalesOrder(["", ""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
    this.dataSourceIJ1 = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getRecords(["",
          thisComponent.importData.uuID]).subscribe(data => {
            if (thisComponent.isFileSelected1) {
              thisComponent.rowCount1 = Object.keys(data).length;
              devru.resolve(data);
            } else
              devru.resolve();
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
      key: ["LineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount2 = 0;
        thisComponent.httpDataService.getRecords2(["",
          thisComponent.importData.uuID]).subscribe(data => {
            if (thisComponent.isFileSelected1) {
              thisComponent.rowCount2 = Object.keys(data).length;
              devru.resolve(data);
            } else
              devru.resolve();
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
  }

  ngOnInit() {
    this.importData = {};

    this.dataServices.getServerData("managesalesorder", "generateBatchID", ['', UtilsForGlobalData.getUserId()]).subscribe(generateBatchID => {
      this.importData.uuID = generateBatchID;
    });

    this.importData.DocumentFromDate = new Date().setDate(new Date().getDate() - 1);
    this.importpopup = true;
    this.isFileSelected1 = false;
    this.APIButtonFlag = false;
    this.ChoosefileFlag = false;
    this.clearFile();

    var thisComponent = this;

    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 1);
    this.FormDate.DocumentToDate = new Date();
    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    this.soListSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.FormDate.userselected == 'By Document Date') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllOpenSO", ['',
            thisComponent.FormDate.DocumentFromDate,
            thisComponent.FormDate.DocumentToDate]).subscribe(getAllOpenSO => {
              devru.resolve(getAllOpenSO);
            });
        } else if (thisComponent.FormDate.userselected == 'By BatchId') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllOpenSOByBatch", ['',
            thisComponent.FormDate.BatchID]).subscribe(getAllOpenSO => {
              devru.resolve(getAllOpenSO);
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      },
    });


    this.soListSource2 = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.FormDate2.userselected == 'By Document Date') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllapprovedSO", ['',
            thisComponent.FormDate2.DocumentFromDate,
            thisComponent.FormDate2.DocumentToDate]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else if (thisComponent.FormDate2.userselected == 'By BatchId') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllapprovedSOByBatch", ['',
            thisComponent.FormDate2.BatchID]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      },
    });

    this.soListSource3 = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.FormDate3.userselected == 'By Document Date') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllapprovedSO", ['',
            thisComponent.FormDate3.DocumentFromDate,
            thisComponent.FormDate3.DocumentToDate]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else if (thisComponent.FormDate3.userselected == 'By BatchId') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllPickOrderbyBatchID", ['',
            thisComponent.FormDate3.BatchID]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      },
    });

    this.soListSource4 = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.FormDate4.userselected == 'By Document Date') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllapprovedSO", ['',
            thisComponent.FormDate4.DocumentFromDate,
            thisComponent.FormDate4.DocumentToDate]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else if (thisComponent.FormDate4.userselected == 'By BatchId') {
          thisComponent.dataServices.getServerData("managesalesorder", "getAllPickOrderbyBatchID", ['',
            thisComponent.FormDate4.BatchID]).subscribe(getAllapprovedSO => {
              devru.resolve(getAllapprovedSO);
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      },
    });

    this.dataServices.getServerData("managesalesorder", "getAllBatchID", ['', 'Open']).subscribe(getAllBatchID => {
      this.TypeSuggestions = new DataSource({
        store: <String[]>getAllBatchID,
        paginate: true,
        pageSize: 20
      });
    });

  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'approve') {
      this.FormDate = {};
      var date = new Date();
      this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 1);
      this.FormDate.DocumentToDate = new Date();
      this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
      this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

      this.BatchIDForApprove = false;
      this.DateForApprove = false;

      //this.gridContainer.instance.refresh();
      this.dataServices.getServerData("managesalesorder", "getAllBatchID", ['', 'Open']).subscribe(getAllBatchID => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>getAllBatchID,
          paginate: true,
          pageSize: 20
        });
      });
    } else if (event.nextId == 'convert') {
      this.FormDate2 = {};
      /* var date = new Date();
      this.FormDate2.DocumentFromDate = date.setDate(date.getDate() - 1);
      this.FormDate2.DocumentToDate = new Date(); */
      this.FormDate2.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
      this.FormDate2.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

      this.BatchIDForPICK = false;
      this.DateForPICK = false;

      //this.gridContainer2.instance.refresh();
      this.dataServices.getServerData("managesalesorder", "getAllBatchID", ['', 'Approved']).subscribe(getAllBatchID => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>getAllBatchID,
          paginate: true,
          pageSize: 20
        });
      });
    } else if (event.nextId == 'autopick') {
      this.FormDate3 = {};
      this.FormDate3.userselected = 'By BatchId';
      this.FormDate3.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
      this.FormDate3.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

      this.BatchIDForAutoPICK = true;
      this.DateForAutoPICK = false;

      //this.gridContainer.instance.refresh();
      this.dataServices.getServerData("managesalesorder", "getAllBatchIDForPick", ['']).subscribe(getAllBatchID => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>getAllBatchID,
          paginate: true,
          pageSize: 20
        });
      });
    } else if (event.nextId == 'pickpost') {
      this.FormDate4 = {};
      this.FormDate4.userselected = 'By BatchId';
      this.FormDate4.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
      this.FormDate4.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

      this.BatchIDForPostPICK = true;
      this.DateForPostPICK = false;

      //this.gridContainer.instance.refresh();
      this.dataServices.getServerData("managesalesorder", "getAllBatchIDForPostPick", ['']).subscribe(getAllBatchID => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>getAllBatchID,
          paginate: true,
          pageSize: 20
        });
      });
    } else {
      this.importData = {};
      this.dataServices.getServerData("managesalesorder", "generateBatchID", ['', UtilsForGlobalData.getUserId()]).subscribe(generateBatchID => {
        this.importData.uuID = generateBatchID;
      });
      this.importData.DocumentFromDate = new Date().setDate(new Date().getDate() - 1);
      this.importpopup = true;
      this.isFileSelected1 = false;
      this.APIButtonFlag = false;
      this.ChoosefileFlag = false;
      this.clearFile();
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.FormDate[e.dataField] = e.value;
        this.gridContainer.instance.refresh();
      }
    }
  }

  formSummary_fieldDataChanged2(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.FormDate2[e.dataField] = e.value;
        this.gridContainer2.instance.refresh();
      }
    }
  }

  formSummary_fieldDataChanged3(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.FormDate3[e.dataField] = e.value;
        this.gridContainer2.instance.refresh();
      }
    }
  }

  formSummary_fieldDataChanged4(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.FormDate4[e.dataField] = e.value;
        this.gridContainer4.instance.refresh();
      }
    }
  }

  approveSO() {
    if (this.FormDate.userselected == 'By Document Date') {
      this.dataServices.getServerData("managesalesorder", "handleAuto_SalesOrder_ApproveByDate", ['',
        this.FormDate.DocumentFromDate,
        this.FormDate.DocumentToDate,
        this.userID]).subscribe(getAllOpenSO => {
          if (getAllOpenSO[0] == "DONE") {
            if (Object.keys(getAllOpenSO[1]).length > 0) {
              this.toastr.success("Sales Order Approved Successfully, TOTAL APPROVED: " + getAllOpenSO[1][0]["D_DocCount"], "Summary");
            } else {
              this.toastr.success("Sales Order Approved Successfully, TOTAL APPROVED: 0", "Summary");
            }
          } else {
            this.toastr.error("Error while convert to Approved :" + getAllOpenSO[0]);
          }
          this.gridContainer.instance.refresh();
        });
    } else {
      if (this.FormDate.BatchID) {
        this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllSoToApprovedByBatchId", ['',
          this.FormDate.BatchID,
          this.userID]).subscribe(getAllOpenSO => {
            if (getAllOpenSO[0] == "DONE") {
              if (Object.keys(getAllOpenSO[1]).length > 0) {
                this.toastr.success("Sales Order Approved Successfully, TOTAL APPROVED: " + getAllOpenSO[1][0]["D_DocCount"], "Summary");
              } else {
                this.toastr.success("Sales Order Approved Successfully, TOTAL APPROVED: 0", "Summary");
              }
            } else {
              this.toastr.error("Error while convert to Approved :" + getAllOpenSO[0]);
            }
            this.gridContainer.instance.refresh();
            this.dataServices.getServerData("managesalesorder", "getAllBatchID", ['', 'Open']).subscribe(getAllBatchID => {
              this.TypeSuggestions = new DataSource({
                store: <String[]>getAllBatchID,
                paginate: true,
                pageSize: 20
              });
            });
          });
      } else {
        this.toastr.warning("Please Provide the Batch Id and Proceed!");
      }
    }
  }

  convertSOtoPick() {
    if (this.FormDate2.userselected == 'By Document Date') {
      this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllSoToPickByDate", ['',
        this.FormDate2.DocumentFromDate,
        this.FormDate2.DocumentToDate,
        this.userID]).subscribe(getAllOpenSO => {
          if (getAllOpenSO[0] == "DONE") {
            this.toastr.success("Sales Order convert to Pick Successfully for BatchID : " + this.FormDate2.BatchID);
          } else {
            this.toastr.error("Error while convert to Pick :" + getAllOpenSO[0]);
          }
          this.gridContainer2.instance.refresh();
        });
    } else {
      if (this.FormDate2.BatchID) {
        this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllSoToPickByBatchId", ['',
          this.FormDate2.BatchID,
          this.userID]).subscribe(getAllOpenSO => {
            if (getAllOpenSO[0] == "DONE") {
              this.toastr.success("Sales Order convert to Pick Successfully for BatchID : " + this.FormDate2.BatchID);
            } else {
              this.toastr.error("Error while convert to Pick :" + getAllOpenSO[0]);
            }
            this.gridContainer2.instance.refresh();
            this.dataServices.getServerData("managesalesorder", "getAllBatchID", ['', 'Approved']).subscribe(getAllBatchID => {
              this.TypeSuggestions = new DataSource({
                store: <String[]>getAllBatchID,
                paginate: true,
                pageSize: 20
              });
            });
          });
      } else {
        this.toastr.warning("Please Provide the Batch Id and Proceed!");
      }
    }
  }

  transactionAutoPick() {
    if (this.FormDate3.userselected == 'By Document Date') {
      this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllSoToPickByDate", ['',
        this.FormDate3.DocumentFromDate,
        this.FormDate3.DocumentToDate,
        this.userID]).subscribe(getAllOpenSO => {
          if (getAllOpenSO[0] == "DONE") {
            this.toastr.success("Auto Pick is Created to Pick Orders Successfully for BatchID : " + this.FormDate3.BatchID);
          } else {
            this.toastr.error("Error while Auto Pick :" + getAllOpenSO[0]);
          }
          this.gridContainer3.instance.refresh();
        });
    } else {
      if (this.FormDate3.BatchID) {
        this.dataServices.getServerData("managesalesorder", "handleAuto_CompairStockPickByBatch", ['',
          this.FormDate3.BatchID]).subscribe(CompairStock => {
            if (CompairStock[0] == "DONE") {
              var isDone = true;
              var isCode = '';
              CompairStock = CompairStock[1];
              for (var i = 0; i < Object.keys(CompairStock).length; i++) {
                if (CompairStock[i].Available < 0) {
                  isDone = false;
                  isCode = CompairStock[i].ItemCode + " Required:" + Number(CompairStock[i].QtyRequest) + " Stock:" + Number(CompairStock[i].StockOnHand) + " Available:" + Number(CompairStock[i].Available);
                }
              }
              if (isDone) {
                this.callautoPickProc();
              } else {
                let result = confirm("<p>Stock Is Not Available for : " + isCode + "<br>Do You want to Proceed ?</p>", "AUTO PICK");
                result.then((dialogResult) => {
                  dialogResult ? this.callautoPickProc() : "Canceled";
                });
              }
            } else {
              this.toastr.error("Error while Compairing the Stock for Pick :" + CompairStock[0]);
            }
          });
      } else {
        this.toastr.warning("Please Provide the Batch Id and Proceed!");
      }
    }
  }

  callautoPickProc() {
    this.dataServices.getServerData("managesalesorder", "handleAuto_AutoPickByLotBatch", ['',
      this.FormDate3.BatchID,
      this.userID]).subscribe(getAllOpenSO => {
        if (getAllOpenSO[0] == "DONE") {
          this.toastr.success("Auto Pick is Created to Pick Orders Successfully for BatchID : " + this.FormDate3.BatchID);
          this.FormDate3.BatchID = '';
        } else {
          this.toastr.error("Error while Auto Pick :" + getAllOpenSO[0]);
        }
        this.gridContainer3.instance.refresh();
        this.dataServices.getServerData("managesalesorder", "getAllBatchIDForPick", ['']).subscribe(getAllBatchID => {
          this.TypeSuggestions = new DataSource({
            store: <String[]>getAllBatchID,
            paginate: true,
            pageSize: 20
          });
        });
      });
  }

  transactionPostPick() {
    if (this.FormDate4.userselected == 'By Document Date') {
      this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllSoToPickByDate", ['',
        this.FormDate4.DocumentFromDate,
        this.FormDate4.DocumentToDate,
        this.userID]).subscribe(getAllOpenSO => {
          if (getAllOpenSO[0] == "DONE") {
            this.toastr.success("Pick Orders Posted Successfully for BatchID : " + this.FormDate4.BatchID);
          } else {
            this.toastr.error("Error while Posting the Pick :" + getAllOpenSO[0]);
          }
          this.gridContainer4.instance.refresh();
        });
    } else {
      if (this.FormDate4.BatchID) {
        this.dataServices.getServerData("managesalesorder", "getAllPickOrderbyBatchID", ['',
          this.FormDate4.BatchID]).subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              this.dataServices.getServerData("managesalesorder", "handleAuto_ConvertAllPostPickByBatchId", ['',
                this.FormDate4.BatchID,
                dataLines[0].DocumentDate,
                this.userID]).subscribe(getAllOpenSO => {
                  if (getAllOpenSO[0] == "DONE") {
                    this.toastr.success("Pick Orders Posted Successfully for BatchID : " + this.FormDate4.BatchID);
                    this.FormDate4.BatchID = '';
                  } else {
                    this.toastr.error("Error while Posting the Pick :" + getAllOpenSO[0]);
                  }
                  this.gridContainer4.instance.refresh();
                  this.dataServices.getServerData("managesalesorder", "getAllBatchIDForPostPick", ['']).subscribe(getAllBatchID => {
                    this.TypeSuggestions = new DataSource({
                      store: <String[]>getAllBatchID,
                      paginate: true,
                      pageSize: 20
                    });
                  });
                });
            } else {
              this.toastr.warning("No Lines To Post!");
            }
          });
      } else {
        this.toastr.warning("Please Provide the Batch Id and Proceed!");
      }
    }
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  hoverFormatForType(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "BatchID");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "BatchID");
  }

  suggestionFormateForImportType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Name");
  }

  hoverFormatForImportType(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Name");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  onCodeChanged2(event, dataField) {
    if (event.value != undefined) {
      this.FormDate2[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'By BatchId') {
          this.BatchIDForPICK = true;
          this.DateForPICK = false;
        } else {
          this.BatchIDForPICK = false;
          this.DateForPICK = true;
        }
        this.gridContainer2.instance.refresh();
      } else if (dataField == 'BatchID') {
        this.gridContainer2.instance.refresh();
      }
    }
  }

  onCodeChanged1(event, dataField) {
    if (event.value != undefined) {
      this.FormDate[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'By BatchId') {
          this.BatchIDForApprove = true;
          this.DateForApprove = false;
        } else {
          this.BatchIDForApprove = false;
          this.DateForApprove = true;
        }
        this.gridContainer.instance.refresh();
      } else if (dataField == 'BatchID') {
        this.gridContainer.instance.refresh();
      }
    }
  }

  onCodeChanged3(event, dataField) {
    if (event.value != undefined) {
      this.FormDate3[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'By BatchId') {
          this.BatchIDForAutoPICK = true;
          this.DateForAutoPICK = false;
        } else {
          this.BatchIDForAutoPICK = false;
          this.DateForAutoPICK = true;
        }
        this.gridContainer3.instance.refresh();
      } else if (dataField == 'BatchID') {
        this.gridContainer3.instance.refresh();
      }
    }
  }

  onCodeChanged4(event, dataField) {
    if (event.value != undefined) {
      this.FormDate4[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'By BatchId') {
          this.BatchIDForPostPICK = true;
          this.DateForPostPICK = false;
        } else {
          this.BatchIDForPostPICK = false;
          this.DateForPostPICK = true;
        }
        this.gridContainer4.instance.refresh();
      } else if (dataField == 'BatchID') {
        this.gridContainer4.instance.refresh();
      }
    }
  }

  onCodeChanged(event, dataField) {
    if (event.value != undefined) {
      if (event.value == 'WOOCOMMERCE' || event.value == 'SHOPIFY') {
        this.chooseSOImportFormat = ["API"];
      } else {
        this.chooseSOImportFormat = ["API", "EXCEL/CSV"];
      }
      this.importData[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'API') {
          if (this.importData["Type"] == 'WOOCOMMERCE' || this.importData["Type"] == 'SHOPIFY') {
            this.APIButtonFlag = false;
            this.ChoosefileFlag = false;
            this.APIButtonFlagButton = true;
          } else {
            this.APIButtonFlag = true;
            this.ChoosefileFlag = false;
            this.APIButtonFlagButton = true;
          }
        } else {
          this.APIButtonFlag = false;
          this.ChoosefileFlag = true;
          this.APIButtonFlagButton = false;
        }
      } else {
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

  clearFile() {
    try {
      const file = document.querySelector('.selectedfile');
      file["value"] = '';
    } catch (Error) { }
  }

  onFileChange2(evt: any) {
    if (this.importData.Type) {
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        var sheet_name_list = wb.SheetNames;
        var isDone: boolean = true;
        this.importFileData = XLSXSample.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);
        if (Object.keys(this.importFileData).length == 0) {
          isDone = false;
        } else {
          this.isFileSelected1 = true;
        }
        if (isDone) {
          if (this.importData.Type === 'LAZADA') {
            this.importFileData = this.importFileData.map(function (obj) {
              return {
                OrderItemID: obj["Order Item Id"], ThirdPartyID: obj["Lazada Id"], CrossRefCode: obj["Seller SKU"],
                ThirdPartySKU: obj["Lazada SKU"], CreatedAT: obj["Created at"], OrderNumber: obj["Order Number"],
                CustomerName: obj["Customer Name"], ShippingName: obj["Shipping Name"], ShippingAddress: obj["Shipping Address"],
                ShippingPhoneNumber: obj["Shipping Phone Number"], ShippingCity: obj["Shipping City"], ShippingPostcode: obj["Shipping Postcode"],
                ShippingCountry: obj["Shipping Country"], TaxCode: obj["Tax Code"], PaymentMethod: obj["Payment Method"],
                PaidPrice: obj["Paid Price"], UnitPrice: obj["Unit Price"], Status: obj["Status"],
                CancelReturnInitiator: obj["Cancel / Return Initiator"], Reason: obj["Reason"],
                ShippingMode: obj["Shipping Provider (first mile)"], TrackingNo: obj["Tracking Code"]
              };
            });
          } else if (this.importData.Type === 'SHOPEE') {
            this.importFileData = this.importFileData.map(function (obj) {
              return {
                OrderItemID: obj["หมายเลขคำสั่งซื้อ"], CrossRefCode: obj["เลขอ้างอิง Parent SKU"],
                CreatedAT: obj["วันที่ทำการสั่งซื้อ"], OrderNumber: obj["หมายเลขคำสั่งซื้อ"],
                CustomerName: obj["ชื่อผู้ใช้ (ผู้ซื้อ)"], ShippingName: obj["ชื่อผู้รับ"], ShippingAddress: obj["ที่อยู่ในการจัดส่ง"],
                ShippingPhoneNumber: obj["หมายเลขโทรศัพท์"], ShippingCity: obj["เขต/อำเภอ"], ShippingPostcode: obj["รหัสไปรษณีย์"],
                ShippingCountry: obj["ประเทศ"], PaymentMethod: obj["ช่องทางการชำระเงิน"],
                PaidPrice: obj["จำนวนเงินทั้งหมด"], UnitPrice: obj["ราคาขาย"], Status: obj["สถานะการสั่งซื้อ"],
                Reason: obj["หมายเหตุจากผู้ซื้อ"], Quantity: obj["จำนวน"], ShippingMode: obj["วิธีการจัดส่ง"],
                TrackingNo: obj["หมายเลขติดตามพัสดุ"]
              };
            });
          }
          for (var i = 0; i < Object.keys(this.importFileData).length; i++) {
            this.importFileData[i].BatchID = this.importData.uuID;
            this.importFileData[i].CustomerCode = this.importData.CustomerCode;
            this.importFileData[i].RefNo = this.importData.RefNo;
            this.importFileData[i].RefName = this.importData.Type;
            this.importFileData[i].SourceType = this.importData.userselected;
            /* if (this.importFileData[i].Debit != undefined || this.importFileData[i].Credit != undefined) {
              if (Number(this.importFileData[i].Credit) > 0) {
                this.importFileData[i].Amount = this.importFileData[i].Amount * -1;
                this.importFileData[i].Debit = 0;
              } else {
                this.importFileData[i].Amount = this.importFileData[i].Amount;
                this.importFileData[i].Credit = 0;
              }
              
            } else {
              isDone = false;
            } */
          }
          if (isDone) {
            this.httpDataService.btnImport_clickHandler()
              .subscribe(btnImportItem_clickHandler => {
                this.httpDataService.importJsonSample(this.importFileData)
                  .subscribe(importJson => {
                    if (importJson == true) {
                      this.httpDataService.onImport(["", this.importData.Type, this.importData.uuID])
                        .subscribe(data => {
                          if (data[0] == 'DONE') {
                            this.importpopup = false;
                            this.isFileSelected1 = true;
                            this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
                          } else {
                            this.toastr.error("Item Validation : " + data[0]);
                          }
                        });
                    } else {
                      this.toastr.error("Invalid Line where Order Number is " + importJson + ", Please Check For Chars: SPECIAL/BLANK/DUP/INVALID");
                    }
                  });
              });
          } else {
            const file = document.querySelector('.file2');
            file["value"] = '';
            this.toastr.warning("Cannot Import, Importing Data are Not Correct!!");
          }
        } else {
          this.toastr.warning("Import File Does not have any Rows!");
        }
      };
      reader.readAsBinaryString(target.files[0]);
    } else {
      this.toastr.warning("Cannot Import, Please Select the Type!!");
    }
  }

  OpenPopup() {
    var width = 500;
    var height = 600;
    var left = 0;
    var top = 0;
    const options = `width=${width},height=${height},left=${left},top=${top}`;

    if (this.document.location.hostname == 'localhost') {
      this.serverName = 'http://localhost:4200';
    } else if (this.document.location.hostname == '27.254.172.167') {
      this.serverName = 'http://27.254.172.167/dist';
    } else if (this.document.location.hostname == 'rhbuscloud.com') {
      this.serverName = 'https://rhbuscloud.com/';
    } else if (this.document.location.hostname == 'rhbussupport.com') {
      this.serverName = 'https://rhbussupport.com/dist';
    } else if (this.document.location.hostname == 'rihbus.com') {
      this.serverName = 'https://rihbus.com';
    } else {
      this.serverName = "https://" + this.document.location.hostname;
    }

    this.currentURL = this.serverName + "/assets/js/lazada_script.html";

    this.dataServices.getServerData("lazadaAuth", "getAppKey", [""])
      .subscribe(getAppKey => {
        this.clientID = getAppKey[0]["AppKey"];
        this.currentURL = this.currentURL + "?id=" + this.clientID;
        localStorage.setItem('LazobackURL', this.router.url);
        var that = this;
        window.addEventListener('storage', function (e) {
          that.APICallImport();
        });
        window.open(this.currentURL, 'lazada', options);
      });

  }

  APICallImport() {
    UtilsForGlobalData.setLocalStorageKey("SoImportType", this.importData.Type);
    if (this.importData.Type == 'LAZADA') {
      this.waitingDialogue = true;
      this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
      if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
        this.OpenPopup();
      } else {
        window.removeEventListener('storage', function (e) { });
        //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
        this.generateAccessToken();
        //}
      }
    } else if (this.importData.Type == 'WOOCOMMERCE') {
      this.waitingDialogue = true;
      this.httpDataService.woo_listAllOrders1(["", UtilsForGlobalData.getUserId()])
        .subscribe(dataAttribute => {
          if (dataAttribute == false) {
            this.waitingDialogue = false;
            this.toastr.error("No Orders are Available!");
          } else {
            this.importData.uuID = dataAttribute;
            this.httpDataService.TransferFromOrdertoSoImport(["", this.importData.uuID])
              .subscribe(dataAttribute => {
                if (dataAttribute[0][0][0] == 'DONE') {
                  this.httpDataService.ValidateImportedSOfromBuffer(["",
                    'WOOCOMMERCE',
                    this.importData.uuID])
                    .subscribe(dataAttribute => {
                      if (dataAttribute[0][0][0] == 'DONE') {
                        this.gridContainer2.instance.refresh();
                        this.waitingDialogue = false;
                        this.isFileSelected1 = true;
                        this.importpopup = false;
                      } else {
                        this.waitingDialogue = false;
                        this.toastr.error("Error: " + dataAttribute[0][0][0]);
                      }
                    });
                } else {
                  this.waitingDialogue = false;
                  this.toastr.error("Error: " + dataAttribute[0][0][1]);
                }
              });
          }
        });
    } else if (this.importData.Type == 'SHOPIFY') {
      this.waitingDialogue = true;
      this.httpDataService.getOrdersImport(["",
        "SHOPIFY",
        UtilsForGlobalData.getUserId()
      ])
        .subscribe(dataAttribute => {
          if (dataAttribute[0] == 'DONE') {
            this.importData.uuID = dataAttribute[1];
            this.gridContainer2.instance.refresh();
            this.waitingDialogue = false;
            this.isFileSelected1 = true;
            this.importpopup = false;
          } else {
            this.toastr.error("Error: " + dataAttribute);
          }
        });
    } else if (this.importData.Type == 'SHOPEE') {
      this.waitingDialogue = true;
      this.httpDataService.importOrderDetails(["",
        UtilsForGlobalData.getUserId()
      ])
        .subscribe(dataAttribute => {
          if (dataAttribute[0] == 'DONE') {
            this.importData.uuID = dataAttribute[1];
            this.gridContainer2.instance.refresh();
            this.waitingDialogue = false;
            this.isFileSelected1 = true;
            this.importpopup = false;
          } else {
            this.toastr.error("Error: " + dataAttribute);
          }
        });
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
          this.getOrders();
        });
    } else {
      this.getOrders();
    }
  }

  getOrders() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    this.dataServices.getServerData("lazadaOrder", "importOrders", ["",
      this.tokenofLazofromBack,
      this.importData.Type,
      new Date(this.importData.DocumentFromDate).toISOString(),
      this.importData.RefNo,
      this.importData.CustomerCode,
      this.importData.userselected]).subscribe(getOrders => {
        if (Object.keys(getOrders).length > 0) {
          this.importData.uuID = getOrders[0]["BatchID"];
          this.gridContainer2.instance.refresh();
          this.waitingDialogue = false;
          this.isFileSelected1 = true;
          this.importpopup = false;
        } else {
          if (getOrders == null) {
            this.waitingDialogue = false;
            this.toastr.warning("No Orders are Available!");
          } else {
            this.waitingDialogue = false;
            this.toastr.warning("No Orders are Available!");
          }
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

  checkforParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if (code == 'Yes') {
        this.importData = {};
        this.importpopup = true;
        this.ChoosefileFlag = false;
        this.APIButtonFlag = true;
        this.importData.Type = UtilsForGlobalData.retrieveLocalStorageKey("SoImportType");
        localStorage.removeItem("SoImportType");
        this.importData.DocumentFromDate = new Date().setDate(new Date().getDate() - 1);
        this.httpDataService.getSetup(['', this.importData.Type])
          .subscribe(callData3 => {
            this.importData["LocationCode"] = callData3[0].LocationCode;
            this.importData["AttirbuteCode"] = callData3[0].AttirbuteCode;
            this.importData["CustomerCode"] = callData3[0].CustomerCode;
            this.importData["RefNo"] = callData3[0].No;
            this.importData["userselected"] = "API";
          });
        this.APICallImport();
      }
    });
  }

  getDate2() {
    this.httpDataService.getCustomerList([''])
      .subscribe(callData3 => {
        this.CustSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
    this.httpDataService.getAllSetup([''])
      .subscribe(callData3 => {
        this.ImportTypeSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
  }

  onDeleteClicked() {
    var data = this.gridContainer2.instance.getSelectedRowKeys();
    var count = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
      this.httpDataService.btnDeleteLine_clickHandler(["", data[i]["LineNo"],
        this.importData.uuID]).subscribe(data2 => {
          count++;
          if (Number(Object.keys(data).length) == Number(count)) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Line Successfully Deleted!");
          }
        });
    }
  }

  btnImport_clickHandler2() {
    if (this.importData.Type == 'WOOCOMMERCE') {
      this.httpDataService.ConvertallordersfromSOImporttoSO(["",
        this.importData.uuID,
        this.importData.LocationCode,
        this.importData.Type,
        UtilsForGlobalData.getUserId()]).subscribe(data => {
          if (data[0] == 'DONE') {
            this.httpDataService.updateOrdertoSOCreated(["",
              this.importData.uuID]).subscribe(data => {
                if (data == true) {
                  this.isFileSelected1 = false;
                  this.toastr.success("ORDERS PROCESSED TO RHBUS", "Success");
                  this.gridContainer ? this.gridContainer.instance.refresh() : '';
                  this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
                } else {
                  this.toastr.error("ORDERS PROCESSED TO RHBUS", "But Status not updated in Woocommerce");
                }
              });
          } else {
            this.toastr.error("Error: " + data[0]);
          }
        });
    } else {
      this.httpDataService.getRecords2(["",
        this.importData.uuID]).subscribe(data => {
          if (Object.keys(data).length == 0) {
            this.importData.CustomerCode = this.importData.CustomerCode ? this.importData.CustomerCode : '';
            this.httpDataService.INSERTItems(["", this.importData.uuID,
              this.importData.CustomerCode,
              this.importData.LocationCode, this.importData.AttirbuteCode,
              UtilsForGlobalData.getUserId(), this.importData.Type])
              .subscribe(importJson => {
                if (importJson[0] == 'DONE') {
                  this.httpDataService.onGetRes(["",
                    this.importData.uuID]).subscribe(data => {
                      if (Object.keys(data).length != 0) {
                        this.isFileSelected1 = false;
                        this.toastr.success("ORDERS PROCESSED TO RHBUS", "Success");
                      } else {
                        this.toastr.error("Import Failed, PLEASE CHECK DATA AND SETUP");
                      }
                    });
                } else {
                  this.toastr.error("Import Failed with Error Status Code : " + importJson[0]);
                }
                this.gridContainer ? this.gridContainer.instance.refresh() : '';
                this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
              });
          } else {
            this.toastr.warning("Please Check and Delete the Invalid Lines!!", "DUPLICATE/INVALID");
          }
        });
    }
  }
}


