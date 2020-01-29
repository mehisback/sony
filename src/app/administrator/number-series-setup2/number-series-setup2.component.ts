import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DxDataGridComponent } from 'devextreme-angular';
var itemListArray: any = [];

@Component({
  selector: 'app-number-series-setup2',
  templateUrl: './number-series-setup2.component.html',
  styleUrls: ['./number-series-setup2.component.css']
})
export class NumberSeriesSetup2Component implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  continents: any = {};
  dataSourceMain: any = {};
  TypesID: any = {};
  AttributeArray: any;
  currLookUpID: string;
  error: any;
  isLinesExist: Boolean = false;
  MasterSetup = ["CUSTOMER", "VENDOR", "ITEM"];

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    //thisComponent.TypesID["TypesID"] = '';
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.continents.store = new CustomStore({
      key: ["TypesID", "Description", "GroupModule"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("NumberSeriesSetup2", "getDocumentTypes", [""]).subscribe(data => {
          devru.resolve(data);
        });
        return devru.promise();
      },
    });


    this.dataSourceMain.store = new CustomStore({
      key: ["Prefix", "AttributeValue", "UserYY", "UserMM", "RunningNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchAttributeValue();
        dummyDataServive.getServerData("NumberSeriesSetup2", "getDetail", ["",
          thisComponent.TypesID["TypesID"]]).subscribe(data => {
            thisComponent.isLinesExist = false;
            if (thisComponent.MasterSetup.indexOf(thisComponent.TypesID["TypesID"]) != -1) {
              if (Object.keys(data).length > 0) {
                thisComponent.isLinesExist = true;
              }
            }
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("NumberSeriesSetup2", "deleteAlertHandler", ["",
          key["Prefix"]]).subscribe(data => {
            if (data <= 0) {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["Prefix"] + ", Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (!thisComponent.isLinesExist) {
          if (values["Prefix"] ? values["RunningNo"] ? true : false : false) {
            dummyDataServive.getServerData("NumberSeriesSetup2", "btnSave_clickHandler", ["",
              values["Prefix"],
              values["UserYY"],
              values["UserMM"],
              values["RunningNo"],
              values["AttributeValue"] ? values["AttributeValue"] : '',
              thisComponent.TypesID["TypesID"]]).subscribe(data => {
                if (data > 0) {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Adding the Lines with Prefix: " + values["Prefix"] + ", Check For Duplicate!! Error Status Code is INSERT-ERR");
                }
              });
          } else {
            devru.reject("Please provide the Valid Data!!");
          }
        } else {
          thisComponent.toastr.warning("Not Allowed to Add new Lines, For Type :" + thisComponent.TypesID["TypesID"]);
          devru.resolve();
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        if (getUpdateValues(key, newValues, "RunningNo")) {
          dummyDataServive.getServerData("NumberSeriesSetup2", "btnUpdate_clickHandler", ["",
            getUpdateValues(key, newValues, "RunningNo"),
            thisComponent.TypesID["TypesID"],
            key["Prefix"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Update the Lines with Prefix: " + key["Prefix"] + ", Check For Duplicate!! Error Status Code is UPDATE-ERR");
              }
            });
        } else {
          devru.reject("Please provide the Valid Data!!");
        }
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  onInitNewRow(event) {
    event.data.UserYY = 'Yes';
    event.data.UserMM = 'Yes';
    event.data.RunningNo = 1;
    this.gridContainer.instance.columnOption("AttributeValue", "allowEditing", true);
    this.gridContainer.instance.columnOption("Prefix", "allowEditing", true);
    this.gridContainer.instance.columnOption("UserYY", "allowEditing", true);
    this.gridContainer.instance.columnOption("UserMM", "allowEditing", true);
  }

  onEditingStart(event) {
    this.gridContainer.instance.columnOption("AttributeValue", "allowEditing", false);
    this.gridContainer.instance.columnOption("Prefix", "allowEditing", false);
    this.gridContainer.instance.columnOption("UserYY", "allowEditing", false);
    this.gridContainer.instance.columnOption("UserMM", "allowEditing", false);
  }

  onUserRowSelect(event) {
    this.TypesID = event.data;
    this.gridContainer.instance.refresh();
  }

  fetchAttributeValue() {
    switch (this.TypesID["TypesID"]) {
      case "PURCHASEORDER":
        this.currLookUpID = "handleConnectedVendType";
        break;
      case "PURCHASERETURN":
        this.currLookUpID = "handleConnectedVendType";
        break;
      case "SALESORDER":
        this.currLookUpID = "handleConnectedcusttype";
        break;
      case "SALESRETURN":
        this.currLookUpID = "handleConnectedcusttype";
        break;

      default:
        this.currLookUpID = "NOTFOUND";
        break;
    }
    if (this.currLookUpID != "NOTFOUND") {
      this.dataFromService.getServerData("globalLookup", this.currLookUpID, [""])
        .subscribe(getCustType => {
          this.AttributeArray = {
            paginate: true,
            pageSize: 20,
            loadMode: "raw",
            load: () =>
              <String[]>getCustType
          }
        });
    } else {
      this.AttributeArray = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () => []
      }
    }
  }

  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Server Error");
    }
  }

  formateForAttributeArray(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    for (var index = 0; index < itemListArray.length; ++index) {
      if (itemListArray[index].Code == value) {
        newData.AttributeCode = itemListArray[index].Code;
        break;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }


}
