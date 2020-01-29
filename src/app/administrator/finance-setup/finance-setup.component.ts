import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';

var fiscalListArray: any = [];

@Component({
  selector: 'app-finance-setup',
  templateUrl: './finance-setup.component.html',
  styleUrls: ['./finance-setup.component.css']
})
export class FinanceSetupComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;

  dataSource: CustomStore;
  itemArray: { paginate: boolean; pageSize: number; loadMode: string; load: () => String[]; };
  accountTypeArray: any = [];
  dataSourceforCustomer: CustomStore;
  dataSourceforgeneral: any = [];
  AllowBackDate = [{ "Code": "Yes" }, { "Code": "No" }];
  CostingMethod = [{ "Code": "AVERAGE" }, { "Code": "FIFO" }];
  fiscalArray: any;
  currencyArray: any;
  gotSelectedLists: any = [];
  accountdataSource: Object;
  accountCode: any;
  getSubTypeFilter: Object;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("FinancialSetUp", "initSubTypeSetUp", [''])
      .subscribe(getSelectedLists => {
        this.accountdataSource = getSelectedLists;
      });

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Description", "PayableAccount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "initVendorPostingGroupSetup", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "button3_clickHandler", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "button2_clickHandler", ["",
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "PayableAccount"),
          getUpdateValues(key, newValues, "Code")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "button2_clickHandlerINSERT", ["",
          values["Description"],
          values["PayableAccount"],
          values["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataSourceforCustomer = new CustomStore({
      key: ["Code", "Description", "ReceivablesAccount", "ConsignReceivableAccount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "initCustomerPosingGroupSetup", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "btnDelCustomerPostingGroup_clickHandler", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "btnAddCustomerPostingGroup_clickHandler", ["",
          getUpdateValues(key, newValues, "ConsignReceivableAccount"),
          getUpdateValues(key, newValues, "ReceivablesAccount"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "Code")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "btnAddCustomerPostingGroup_clickHandlerINSERT", ["",
          values["Code"],
          values["Description"],
          values["ReceivablesAccount"],
          values["ConsignReceivableAccount"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataSourceforgeneral = new CustomStore({
      key: ["CurrentFiscalYear", "AllowBackDate", "CurrencyCode", "CostingMethod", "RoundingPrecision", "SetupKey", "FirstDayofYear"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "initGenAccountSetup", ["", thisComponent.accountCode])
          .subscribe(data => {
            this.gotSelectedLists = data[0];
            devru.resolve(data);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "updateGenAccountingSetup", ["",
          getUpdateValues(key, newValues, "CurrentFiscalYear"),
          getUpdateValues(key, newValues, "AllowBackDate"),
          getUpdateValues(key, newValues, "CurrencyCode"),
          getUpdateValues(key, newValues, "CostingMethod"),
          getUpdateValues(key, newValues, "RoundingPrecision"),
          getUpdateValues(key, newValues, "FirstDayofYear"),
          this.gotSelectedLists["SetupKey"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });


    this.dataFromService.getServerData("COALookUp", "getListCHILDONLY", [''])
      .subscribe(getListCHILDONLY => {
        this.itemArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () =>
            <String[]>getListCHILDONLY
        }
      });

    this.dataFromService.getServerData("FinancialSetUp", "onGetGenAcctSetup", [''])
      .subscribe(onGetGenAcctSetup => {
        this.fiscalArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () => <String[]>onGetGenAcctSetup
        }
        fiscalListArray = onGetGenAcctSetup;
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedCurrencyCode", [''])
      .subscribe(currencyArray => {
        this.currencyArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () => <String[]>currencyArray
        }
      });


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }


  onUserRowSelect(event) {
    this.accountCode = event.data.Code;

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataFromService.getServerData("FinancialSetUp", "initSubTypeSetUp", [''])
      .subscribe(getServiceItems => {
        this.accountTypeArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () =>
            <String[]>getServiceItems
        }
      });

    this.getSubTypeFilter = new CustomStore({
      key: ["SubTypeCode", "AccountType"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "getSubTypeFilter", ["", thisComponent.accountCode])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "btnDelBubType_ClickHandler", ["", key["SubTypeCode"]])
          .subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            }
            else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("FinancialSetUp", "btnAddSubType_ClickHandler", ["",
          values["SubTypeCode"],
          values["AccountType"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.gridContainer.instance.refresh();
  }

  formateForItemListSuggestion6(data) {
    return data["Code"];
  }

  itemLookup6(data) {
    return data ? data.Code : '';
  }

  hover6(data) {
    return "<div class='custom-item' title='" + data.Code + "'>" + data.Code + "</div>";
  }



  formateForItemListSuggestion2(data) {
    return data["AccountCode"];
  }

  itemLookup2(data) {
    return data ? data.AccountCode + " | " + data.Name : '';
  }

  hover4(data) {
    return "<div class='custom-item' title='" + data.AccountCode + " | " + data.Name + "'>" + data.AccountCode + " | " + data.Name + "</div>";
  }


  onInitNewRow(event) {
    this.gridContainer2.instance.columnOption("Code", "allowEditing", true);
  }

  onInitNewRow2(event) {
    this.gridContainer3.instance.columnOption("Code", "allowEditing", true);
  }

  onEditingStart(event) {
    this.gridContainer2.instance.columnOption("Code", "allowEditing", false);
  }

  onEditingStart2(event) {
    this.gridContainer3.instance.columnOption("Code", "allowEditing", false);
  }

  suggestionFormateForDropDown(data) {
    return data ? data.AccountCode + " | " + data.Name : '';
  }

  hover(data) {
    return "<div class='custom-item' title='" + data.AccountCode + "'>" + data.AccountCode + "</div>";
  }

  suggestionFormateForcurrencyArray(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "CurrencyCode");
  }

  onGRClearingAccountChange(event) {
    if (this.gotSelectedLists["GRClearingAccount"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "onGetAcctCodeGenAcctGRClrAcct", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onUnrealizedRoundingAccountChange(event) {
    if (this.gotSelectedLists["UnrealizedRoundingAccount"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "onGetAcctCodeGenAcctUnRelRndAcct", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onRealizedRoundingAccountChange(event) {
    if (this.gotSelectedLists["RealizedRoundingAccount"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "onGetAcctCodeGenAcctRelRndAcct", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onPurchaseDiscountAccountChange(event) {
    if (this.gotSelectedLists["PurchaseDiscountAccount"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "onGetAcctCodeGenAcctPurchDisAcct", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onSalesDiscountAccountChange(event) {
    if (this.gotSelectedLists["SalesDiscountAccount"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "onGetAcctCodeGenAcctSaleDisAcct", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }


  suggestionFormateForDropDown2(data) {
    return data ? data.Code : '';
  }

  hover2(data) {
    return "<div class='custom-item' title='" + data.Code + "'>" + data.Code + "</div>";
  }

  suggestionFormateForDropDown3(data) {
    return data ? data.FiscalYearID : '';
  }

  hover3(data) {
    return "<div class='custom-item' title='" + data.FiscalYearID + "'>" + data.FiscalYearID + "</div>";
  }


  onAllowBackDateChange(event) {
    if (this.gotSelectedLists["AllowBackDate"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "chkAllowBackDate_changeHandler", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onCostingMethodChange(event) {
    if (this.gotSelectedLists["CostingMethod"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "cmbCostingMethod_closeHandler", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  onCurrentFiscalYearChange(event) {
    if (this.gotSelectedLists["FiscalYearID"] != event.value) {
      this.dataFromService.getServerData("FinancialSetUp", "cmbCurrentFiscalYear_closeHandler", ['',
        event.value,
        this.gotSelectedLists["SetupKey"]
      ]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup == '1') {
          this.toastr.success("Updated!");
        }
      });
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == 'CurrencyCode') {
        this.dataFromService.getServerData("FinancialSetUp", "txtCurrencyCode_enterHandler", ['',
          e.value,
          this.gotSelectedLists["SetupKey"]
        ]).subscribe(updateVATPostingSetup => {
          if (updateVATPostingSetup == '1') {
            this.toastr.success("Updated!");
          }
        });
      }

      if (e.dataField == 'RoundingPrecision') {
        this.dataFromService.getServerData("FinancialSetUp", "txtRoundingPrecision_enterHandler", ['',
          e.value,
          this.gotSelectedLists["SetupKey"]
        ]).subscribe(updateVATPostingSetup => {
          if (updateVATPostingSetup == '1') {
            this.toastr.success("Updated!");
          }
        });
      }
    }
  }


  setFiscalYearOnSelect(newData, value, currentData): void {
    for (var index = 0; index < Object.keys(fiscalListArray).length; ++index) {
      if (fiscalListArray[index].FiscalYearID == value) {
        newData.FirstDayofYear = fiscalListArray[index].FYStartDate;
        break;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }


}
