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

import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";

var itemListArray: any = [];
@Component({
  selector: 'app-wht-setup',
  templateUrl: './wht-setup.component.html',
  styleUrls: ['./wht-setup.component.css']
})
export class WhtSetupComponent implements OnInit {
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;

  dataSource: CustomStore;
  dataSource2: CustomStore;
  codeforSetup: any = [];
  listforSecondDatarid: Object;
  gotSelectedLists: Object;
  gotListCHILDONLY: DataSource;


  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("WHTSetup", "getList1", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("WHTSetup", "delBtnWHTBusPressed", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("WHTSetup", "save1PressedModify", ["",
          getUpdateValues(key, newValues, "Code"),
          getUpdateValues(key, newValues, "Description")]).subscribe(data => {
            if (data == 'DONE') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is " + data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("WHTSetup", "save1PressedAdd", ["",
          values["Code"],
          values["Description"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      }

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'prod') {

      var dummyDataServive = this.dataFromService;
      var thisComponent = this;

      this.dataSource2 = new CustomStore({
        key: ["Code", "Description"],
        load: function (loadOptions) {
          var devru = $.Deferred();
          dummyDataServive.getServerData("WHTSetup", "getList2", [""])
            .subscribe(data => {
              devru.resolve(data);
            });
          return devru.promise();
        },
        remove: function (key) {
          var devru = $.Deferred();
          dummyDataServive.getServerData("WHTSetup", "delBtnWHTPrdPressed", ["", key["Code"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Deleting the Lines with Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
              }
            });
          return devru.promise();
        },
        update: function (key, newValues) {
          var devru = $.Deferred();
          dummyDataServive.getServerData("WHTSetup", "save2PressedModify", ["",
            getUpdateValues(key, newValues, "Description"),
            getUpdateValues(key, newValues, "Code")
          ]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is UPDATE-ERR");
            }
          });
          return devru.promise();
        },
        insert: function (values) {
          var devru = $.Deferred();
          dummyDataServive.getServerData("WHTSetup", "save2PressedAdd", ["",
            values["Code"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
          return devru.promise();
        }

      });
    }

    if (event.nextId == 'setup') {

      this.dataFromService.getServerData("COALookUp", "getListCHILDONLY", [''])
        .subscribe(getListCHILDONLY => {
          this.gotListCHILDONLY = new DataSource({
            store: <String[]>getListCHILDONLY,
            paginate: true,
            pageSize: 10
          });
        });

    }


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  suggestionFormateForDropDown(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  onPayChange(event) {
    if (this.gotSelectedLists["PayableWHTAccount"] != event.value) {
      this.dataFromService.getServerData("WHTSetup", "updateWHTPostingSetup", ['',
        'PayableWHTAccount',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]
      ])
        .subscribe(updateWHTPostingSetup => {
          if (updateWHTPostingSetup == '1') {
            this.toastr.success("Updated!");
          }
        });
    }
  }

  onRecieveChange(event) {
    if (this.gotSelectedLists["ReceivableWHTAccount"] != event.value) {
      this.dataFromService.getServerData("WHTSetup", "updateWHTPostingSetup", ['',
        'ReceivableWHTAccount',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]
      ])
        .subscribe(updateWHTPostingSetup => {
          if (updateWHTPostingSetup == '1') {
            this.toastr.success("Updated!");
          }
        });
    }
  }

  onUserRowSelect(event) {
    this.codeforSetup["Code1"] = event.data.Code;

    this.dataFromService.getServerData("WHTSetup", "getList2", [''])
      .subscribe(getList2 => {
        this.listforSecondDatarid = getList2;
      });

    this.gridContainer3.instance.refresh();
  }


  onUserRowSelect2(event) {
    this.codeforSetup["Code2"] = event.data.Code;

    this.dataFromService.getServerData("WHTSetup", "getSelectedLists", ['',
      this.codeforSetup["Code1"],
      this.codeforSetup["Code2"]])
      .subscribe(getSelectedLists => {
        if (Object.keys(getSelectedLists).length == 0) {
          this.dataFromService.getServerData("WHTSetup", "addWHTpostingSetup", ['',
            this.codeforSetup["Code1"],
            this.codeforSetup["Code2"]])
            .subscribe(addVATpostingSetup => {
              if (addVATpostingSetup == 1) {
                this.dataFromService.getServerData("WHTSetup", "getSelectedLists", ['',
                  this.codeforSetup["Code1"],
                  this.codeforSetup["Code2"]])
                  .subscribe(getSelectedLists => {
                    this.gotSelectedLists = getSelectedLists[0];
                  });
              }
            });
        } else {
          this.gotSelectedLists = getSelectedLists[0];
        }

      });

  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == 'WHTpercentage') {
        this.dataFromService.getServerData("WHTSetup", "updateWHTPostingSetup", ['',
          'WHTpercentage',
          e.value,
          this.codeforSetup["Code1"],
          this.codeforSetup["Code2"]
        ])
          .subscribe(updateWHTPostingSetup => {
            if (updateWHTPostingSetup == '1') {
              this.toastr.success("Updated!");
            }
          });
      }

      if (e.dataField == 'WHTReport') {
        this.dataFromService.getServerData("WHTSetup", "updateWHTPostingSetup", ['',
          'WHTReport',
          e.value,
          this.codeforSetup["Code1"],
          this.codeforSetup["Code2"]
        ])
          .subscribe(updateWHTPostingSetup => {
            if (updateWHTPostingSetup == '1') {
              this.toastr.success("Updated!");
            }
          });
      }
    }
  }



}
