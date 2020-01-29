import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import * as events from "devextreme/events";
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

/* @Author Ganesh
/* this is For Expense Journals
/* On 01-03-2019
*/

@Component({
  selector: 'app-expensejournals-details',
  templateUrl: './expensejournals-details.component.html',
  styleUrls: ['./expensejournals-details.component.css']
})
export class ExpensejournalsDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  EJNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('EJNumber');
  EJDetails: any;
  duplicateEJDetails: string[];
  popupVisible: boolean = false;
  popuptoAddCharges: boolean = false;
  CRJLines: any;
  getVendorList: any;
  dropdownmenu = ['Post'];
  currentDate = UtilsForGlobalData.getCurrentDate();
  companyHeader: any = {};
  paymentMethodData: any = [];
  PaymentCodeData: any;
  dataSource2: any;
  onCreateGLBuffResultSet: any;
  balanceforpost: any;
  newCustomerDetail: any = [];
  getAccountCharges: Object;
  amt: any;
  dbAmt: number;
  crAmt: any;
  itemArray: any = [];
  paymentMethodData2: DataSource;
  isLinesExist: Boolean = false;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: Boolean = false;
  globalVendorDetailsPopup: Boolean = false;
  globalVendorLookupPopup: boolean = false;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("ExpenseJournal", "getHeader", ['',
      this.EJNumber])
      .subscribe(getHeader => {
        this.assignToDuplicate(getHeader);
        this.EJDetails = getHeader[0];
      });
  }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource2 = new CustomStore({
      key: ["LineNo", "LineCode", "DirectUnitCost", "CostIncVAT", "LineAmount", "Description", "AmountIncludingVAT"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        dummyDataServive.getServerData("ExpenseJournal", "getLines", ["", thisComponent.EJNumber])
          .subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ExpenseJournal", "deleteLine", ["",
          thisComponent.EJNumber,
          key["LineNo"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ExpenseJournal", "updateJournalLine", ["",
          getUpdateValues(key, newValues, "LineCode"),
          getUpdateValues(key, newValues, "DirectUnitCost"),
          getUpdateValues(key, newValues, "CostIncVAT"),
          getUpdateValues(key, newValues, "LineAmount"),
          getUpdateValues(key, newValues, "Description"),
          thisComponent.EJNumber,getUpdateValues(key, newValues, "LineNo")
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines with LineCode: " + getUpdateValues(key, newValues, "LineCode") + ", Error Status Code is UPDATE-ERR");
          }
        });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ExpenseJournal", "insertNewLine", ["",
          thisComponent.EJNumber,
          values["LineCode"],
          values["Description"],
          values["CostIncVAT"],
          values["DirectUnitCost"]]).subscribe(data => {
            if (data[0] == 'DONE') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + data[0]);
            }
          });
        return devru.promise();
      }

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.dataFromService.getServerData("vendorList", "getVendorList", [''])
      .subscribe(getCustomerList => {
        this.getVendorList = new DataSource({
          store: <String[]>getCustomerList,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", [''])
      .subscribe(handleConnectedvatBusGrp => {
        this.paymentMethodData = new DataSource({
          store: <String[]>handleConnectedvatBusGrp,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedWHTBUSGRP", [''])
      .subscribe(handleConnectedvatBusGrp => {
        this.paymentMethodData2 = new DataSource({
          store: <String[]>handleConnectedvatBusGrp,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedPaymentCodeAll", [''])
      .subscribe(handleConnectedPaymentCodes => {
        this.PaymentCodeData = new DataSource({
          store: <String[]>handleConnectedPaymentCodes,
          paginate: true,
          pageSize: 10
        });
      });

    this.itemArray = new CustomStore({
      key: ["LineCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("ExpenseJournal", "getServiceItem", ['']).subscribe(dataLines => {
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['', UtilsForGlobalData.getCompanyName()])
      .subscribe(callData3 => {
        this.companyHeader = callData3[0];
      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateEJ
    this.duplicateEJDetails = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateEJDetails["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateEJDetails[i][prop] = data[i][prop];
      }
    }
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "VendCode", "Name");
  }

  hoversuggestionFormateForVendor(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "VendCode", "Name")
  }

  hoverItemListSuggestion2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForPaymentMaster(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  hoverFormateForPaymentMaster(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.AmountIncludingVAT = currentData.DirectUnitCost;
    (<any>this).defaultSetCellValue(newData, value);
  }

  suggestionFormateForCustomerGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onSellToCustomerGrpCodeChanged(event) {
    if (event.value != null ? this.EJDetails["VATGroup"] != event.value : false) {
      this.dataFromService.getServerData("ExpenseJournal", "generalUpdate", ['',
        'VATGroup', event.value,
        this.EJNumber]).subscribe(generalUpdate => {
          this.errorHandlingToasterForUpdate(generalUpdate);
        });
    }
  }
  onSellToCustomerGrpCodeChanged2(event) {
    if (event.value != null ? this.EJDetails["WHTGroup"] != event.value : false) {
      this.dataFromService.getServerData("ExpenseJournal", "generalUpdate", ['',
        'WHTGroup', event.value,
        this.EJNumber]).subscribe(generalUpdate => {
          this.errorHandlingToasterForUpdate(generalUpdate);
        });
    }
  }

  suggestionFormateForVatGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onSellToVatGrpCodeChanged(event) {
    if (event.value != null ? this.EJDetails["PaymentCode"] != event.value : false) {
      this.dataFromService.getServerData("ExpenseJournal", "updatePaymentCode", ['',
        event.value,
        this.EJNumber]).subscribe(updatePaymentMethodInfo => {
          this.errorHandlingToasterForUpdate(updatePaymentMethodInfo);
        });
    }
  }


  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateEJDetails[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'Remarks' || e.dataField == 'ExternalDocumentNo'
        || e.dataField == 'ChequeNo' || e.dataField == 'ChequeDate') {
        if (e.dataField == 'ChequeDate') {
          if (!this.duplicateEJDetails[0][e.dataField]) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
          }
        }
        this.dataFromService.getServerData("ExpenseJournal", "generalUpdate", ['',
          e.dataField, e.value,
          this.EJNumber]).subscribe(generalUpdate => {
            this.errorHandlingToasterForUpdate(generalUpdate);
          });
      }
    }
  }

  EJOperationsGo(selected: string) {
    if (selected == 'Post') {
      this.showInfo();
    }
    else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  showInfo() {
    this.popupVisible = true;
    this.dataFromService.getServerData("ExpenseJournalPostConfirm", "createGLBufferLines", ["", this.EJNumber])
      .subscribe(createGLBufferLines => {
        this.onCreateGLBuffResultSet = createGLBufferLines[1];
        this.dataFromService.getServerData("ExpenseJournalPostConfirm", "onCreateGLBuffResultSet", ["", this.EJNumber])
          .subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });
      });
  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.dataFromService.getServerData("ExpenseJournalPostConfirm", "btnPost_clickHandler", ["", this.EJNumber])
        .subscribe(onPostingAccountValidatation => {
          if (onPostingAccountValidatation != null) {
            if (onPostingAccountValidatation[0]["AccCount"] == '0') {
              this.dataFromService.getServerData("ExpenseJournalPostConfirm", "onPostingAccountValidatation", ["", this.EJNumber,
               UtilsForGlobalData.getUserId()]).subscribe(onPostingAccountValidatation => {
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Expense Journal " + this.EJNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/finance/expensejournals-list']);
                    this.popupVisible = false;
                  } else {
                    this.popupVisible = false;
                    this.toastr.error("Posting Failed, Error Status Code : " + onPostingAccountValidatation[0]);
                  }
                });

            } else {
              this.toastr.error("Account Code is Null or Not Found for " + onPostingAccountValidatation[0]["AccCount"] + "Records");
            }
          }
          else {
            this.toastr.error("Validation Failed, No Buffer Entry Found Error!");
          }
        });
    } else {
      this.toastr.error("Balance is not Zero!!");
    }
  }

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", true);
    this.gridContainer.instance.columnOption("Details", "visible", false);
  }

  onRowInserted(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", false);
    this.gridContainer.instance.columnOption("Details", "visible", true);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.command == "edit") {
      let cellElement = e.cellElement,
        cancelLink = cellElement.querySelector(".dx-link-cancel"),
        saveLink = cellElement.querySelector(".dx-link-save");
      events.on(cancelLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
      });
    }
  };

  rowIndex: number = 0;
  ItemLookupvalueChanged(data) {
    this.rowIndex = data.rowIndex;
    this.globalItemLookupPopup = true;
  }

  onUserRowSelect(event) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "LineCode", event.data.Code);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "DirectUnitCost", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "CostIncVAT", this.companyHeader.AmountIncludingVAT);
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["Amount", "Quantity", "DirectUnitCost", "AmountIncludingVAT", "LineDiscountAmount", "LineAmount", "VatAmount", "WHTPerct"]);
    this.itemDetailsPopup = true;
  }

  onVendorSearchClicked(type) {
    this.globalVendorLookupPopup = true;
  }

  onVendorRowClicked(event) {
    this.globalVendorLookupPopup = false;
    this.dataFromService.getServerData("ExpenseJournal", "handlePayToLookUpManager", ['',
      event.data.VendCode,
      this.EJNumber]).subscribe(dataStatus => {
        if (dataStatus > 0) {
          this.dataFromService.getServerData("ExpenseJournal", "onPaytoVendorUpdate", ['',
            this.EJNumber,
            event.data.VendCode]).subscribe(dataStatus => {
              this.errorHandlingToasterForUpdate(dataStatus);
            });
        } else {
          this.toastr.error("Error while Updating Vendor!!");
        }
      });
  }

  getBuyFromVendorDetail() {
    this.globalVendorDetailsPopup = true;
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.getHeaderDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }


}



