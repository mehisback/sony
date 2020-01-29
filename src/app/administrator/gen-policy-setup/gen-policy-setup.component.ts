import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";

var itemListArray: any = [];
@Component({
  selector: 'app-gen-policy-setup',
  templateUrl: './gen-policy-setup.component.html',
  styleUrls: ['./gen-policy-setup.component.css']
})
export class GenPolicySetupComponent implements OnInit {
  dataSource: CustomStore;
  codeforSetup: any = [];
  getSelectedLists: any = {};
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
        dummyDataServive.getServerData("GenPolicySetup", "getList1", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("GenPolicySetup", "delBtnGenPolicyPressed", ["", key["Code"], 'POLICY'])
          .subscribe(data => {
            if (data[0] == 'DONE') {
              devru.resolve(data);
            }
            else {
              devru.reject("Error while Updating the Lines with Code: " + key["Code"] + ", Error Status Code is Denied and " + data[0]);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("GenPolicySetup", "save1PressedModify", ["",
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "Code")]).subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is " + data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("GenPolicySetup", "save1PressedAdd", ["",
          values["Code"],
          values["Description"]])
          .subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
              dummyDataServive.getServerData("GenPolicySetup", "addGenPolicypostingSetup", ["",
                values["Code"]])
                .subscribe(data => {
                  if (data == '1') {
                    this.toastr.success("Policy Setup Created!");
                  }
                });
            } else {
              devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is " + data[0]);
            }
          });
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
    this.codeforSetup["Code"] = event.data.Code;
    this.dataFromService.getServerData("GenPolicySetup", "getSelectedLists", ['',
      this.codeforSetup["Code"]])
      .subscribe(getSelectedLists => {
        if (Object.keys(getSelectedLists).length == 0) {
          this.dataFromService.getServerData("GenPolicySetup", "addGenPolicypostingSetup", ['',
            this.codeforSetup["Code"]]).subscribe(addVATpostingSetup => {
              if (addVATpostingSetup == 1) {
                this.dataFromService.getServerData("GenPolicySetup", "getSelectedLists", ['',
                  this.codeforSetup["Code"]]).subscribe(getSelectedLists => {
                    this.getSelectedLists = getSelectedLists[0];
                  });
              }
            });
        } else {
          this.getSelectedLists = getSelectedLists[0];
        }
      });
  }

  suggestionFormateForDropDown(data) {
    return data ? data.AccountCode + " | " + data.Name : '';
  }

  hover(data) {
    return "<div class='custom-item' title='" + data.AccountCode + " | " + data.Name + "'>" + data.AccountCode + " | " + data.Name + "</div>";
  }

  onSalesAccountChange(event) {
    if (event.value ? this.getSelectedLists["SalesAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'SalesAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onConsignSalesAccountChange(event) {
    if (event.value ? this.getSelectedLists["ConsignSalesAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'ConsignSalesAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onSalesCNAccountChange(event) {
    if (event.value ? this.getSelectedLists["SalesCNAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'SalesCNAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onSalesDiscountAccountChange(event) {
    if (event.value ? this.getSelectedLists["SalesDiscountAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'SalesDiscountAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onPurchaseAccountChange(event) {
    if (event.value ? this.getSelectedLists["PurchaseAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'PurchaseAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onPurchVATUnRealizedAcctChange(event) {
    if (event.value ? this.getSelectedLists["PurchaseCNAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'PurchaseCNAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onPurchDiscountAccountChange(event) {
    if (event.value ? this.getSelectedLists["PurchDiscountAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'PurchDiscountAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onInventoryAccountChange(event) {
    if (event.value ? this.getSelectedLists["InventoryAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'InventoryAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onCOGSAccountChange(event) {
    if (event.value ? this.getSelectedLists["COGSAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'COGSAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onDirectCostAccountChange(event) {
    if (event.value ? this.getSelectedLists["DirectCostAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'DirectCostAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onInventoryAdjustmentAccountChange(event) {
    if (event.value ? this.getSelectedLists["InventoryAdjustmentAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'InventoryAdjustmentAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onExpenseAccountChange(event) {
    if (event.value ? this.getSelectedLists["ExpenseAccount"] != event.value : false) {
      this.dataFromService.getServerData("GenPolicySetup", "updateGenPolicySetup", ['',
        'ExpenseAccount', event.value,
        this.codeforSetup["Code"]]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }


  delete() {
    this.dataFromService.getServerData("GenPolicySetup", "closeHandler", ['',
      this.codeforSetup["Code"]]).subscribe(updateVATPostingSetup => {
        if (updateVATPostingSetup > 0) {
          this.toastr.success("Deleted!");
          this.dataFromService.getServerData("GenPolicySetup", "getSelectedLists", ['', this.codeforSetup["Code"]])
            .subscribe(getSelectedLists => {
              this.getSelectedLists = getSelectedLists[0];
            });
        } else {
          this.toastr.error("Error While Deleting the Lines, Error Status Code : UPDATE-ERR");
        }
      });
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus > 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }


}
