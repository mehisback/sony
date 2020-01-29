import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

var itemListArray: any = [];
@Component({
  selector: 'app-vat-setup',
  templateUrl: './vat-setup.component.html',
  styleUrls: ['./vat-setup.component.css']
})
export class VatSetupComponent implements OnInit {
  @ViewChild("gridContainer4") gridContainer4: DxDataGridComponent;
  @ViewChild("gridContainer5") gridContainer5: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;

  dataSource: CustomStore;
  dataSource2: CustomStore;
  codeforSetup: any = [];
  listforSecondDatarid: Object;
  gotSelectedLists: any = {};
  duplicateSelectedList: any = [];
  gotListCHILDONLY: DataSource;
  IsUnRealizedVAT = [{ "Code": "Yes" }, { "Code": "No" }];
  NOVAT = [{ "Code": "Yes" }, { "Code": "No" }];
  hasGST: boolean = false;


  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .subscribe(getCompany => {
        if (getCompany[0]["CountryCode"] == 'IND') {
          if (getCompany[0]["HasINLocalization"] == 'Yes') {
            this.hasGST = true;
          }
        }
      });

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "getList1", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "onDeleteVatBusGroupProcedure", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "save1PressedModify", ["",
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "Code")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is " + data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("VATGSTSetup", "save1PressedAdd", ["",
            values["Code"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }

    });

    this.dataSource2 = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "getList2", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "onDeleteVatPrdGroupProcedure", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATGSTSetup", "save2PressedModify", ["",
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "Code")]).subscribe(data => {
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
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("VATGSTSetup", "save2PressedAdd", ["",
            values["Code"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.dataFromService.getServerData("COALookUp", "getListCHILDONLY", [''])
      .subscribe(getListCHILDONLY => {
        this.gotListCHILDONLY = new DataSource({
          store: <String[]>getListCHILDONLY,
          paginate: true,
          pageSize: 10
        });
      });

  }

  onUserRowSelect(event) {
    this.codeforSetup["Code1"] = event.data.Code;
    this.dataFromService.getServerData("VATGSTSetup", "getList2", [''])
      .subscribe(getList2 => {
        this.listforSecondDatarid = getList2;
      });

    this.gridContainer3.instance.refresh();
  }


  onUserRowSelect2(event) {
    this.codeforSetup["Code2"] = event.data.Code;
    this.gotSelectedLists = {};
    this.dataFromService.getServerData("VATGSTSetup", "getSelectedLists", ['',
      this.codeforSetup["Code1"],
      this.codeforSetup["Code2"]])
      .subscribe(getSelectedLists => {
        if (Object.keys(getSelectedLists).length == 0) {
          this.dataFromService.getServerData("VATGSTSetup", "addVATpostingSetup", ['',
            this.codeforSetup["Code1"],
            this.codeforSetup["Code2"]])
            .subscribe(addVATpostingSetup => {
              if (addVATpostingSetup == 1) {
                this.dataFromService.getServerData("VATGSTSetup", "getSelectedLists", ['',
                  this.codeforSetup["Code1"],
                  this.codeforSetup["Code2"]])
                  .subscribe(getSelectedLists => {
                    this.assignToDuplicate(getSelectedLists);
                    this.gotSelectedLists = getSelectedLists[0];
                  });
              } else {
                this.toastr.error("Error While Adding the Lines " + this.codeforSetup["Code1"] + " with " + this.codeforSetup["Code2"] + " Error Status Code : INSERT-ERR")
              }
            });
        } else {
          this.assignToDuplicate(getSelectedLists);
          this.gotSelectedLists = getSelectedLists[0];
        }
      });

  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateSelectedList = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateSelectedList["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateSelectedList[i][prop] = data[i][prop];
      }
    }
  }

  suggestionFormateForDropDown(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "AccountCode");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  onSalesVATAccountChange(event) {
    if (event.event != undefined ? this.gotSelectedLists["SalesVATAccount"] != event.value : false) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'SalesVATAccount', event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onSalesVATUnRealizedAcctChange(event) {
    if (this.gotSelectedLists["SalesVATUnRealizedAcct"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'SalesVATUnRealizedAcct',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onPurchVATAccountChange(event) {
    if (this.gotSelectedLists["PurchVATAccount"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'PurchVATAccount',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onPurchVATUnRealizedAcctChange(event) {
    if (this.gotSelectedLists["PurchVATUnRealizedAcct"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'PurchVATUnRealizedAcct',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onConsignVATAccountChange(event) {
    if (this.gotSelectedLists["ConsignVATAccount"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'ConsignVATAccount',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }



  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && e.value != '' ? this.duplicateSelectedList[0][e.dataField] != e.value : false) {
      this.duplicateSelectedList[0][e.dataField] = e.value;
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        e.dataField, e.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  suggestionFormatFordropdown(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onIsUnRealizedVATChange(event) {
    if (this.gotSelectedLists["IsUnRealizedVAT"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'IsUnRealizedVAT',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onNOVATChange(event) {
    if (this.gotSelectedLists["NOVAT"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'NOVAT',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onFlexiRateChange(event) {
    if (this.gotSelectedLists["FlexiRate"] != event.value) {
      this.dataFromService.getServerData("VATGSTSetup", "updateVATPostingSetup", ['',
        'FlexiRate',
        event.value,
        this.codeforSetup["Code1"],
        this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
          this.errorHandlingToasterForUpdate(updateVATPostingSetup);
        });
    }
  }

  onInitNewRow(event) {
    this.gridContainer4.instance.columnOption("Code", "allowEditing", true);
  }

  onInitNewRow2(event) {
    this.gridContainer5.instance.columnOption("Code", "allowEditing", true);
  }

  onEditingStart(event) {
    this.gridContainer4.instance.columnOption("Code", "allowEditing", false);
  }

  onEditingStart2(event) {
    this.gridContainer5.instance.columnOption("Code", "allowEditing", false);
  }

  delete() {
    this.dataFromService.getServerData("VATGSTSetup", "closeHandler", ['',
      this.codeforSetup["Code1"],
      this.codeforSetup["Code2"]]).subscribe(updateVATPostingSetup => {
        this.errorHandlingToasterForUpdate(updateVATPostingSetup);
      });
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }


}
