import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import * as events from "devextreme/events";
import { SalesJournalDetailsHttpDataService } from './sales-journal-details-http-data.service';

@Component({
  selector: 'app-sales-journal-details',
  templateUrl: './sales-journal-details.component.html',
  styleUrls: ['./sales-journal-details.component.css']
})

export class SalesJournalDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  PurchJNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('SalesJNumber');
  EJDetails: any;
  duplicateEJDetails: string[];
  companyHeader: any = {};
  popupVisible: boolean = false;
  popuptoAddCharges: boolean = false;
  customerSuggestions: any;
  dropdownmenu = ['Post'];
  currentDate = UtilsForGlobalData.getCurrentDate();
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
  vendorgrpSuggestions: DataSource;
  isLinesExist: Boolean = false;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalServiceItemLookupPopup: Boolean = false;
  popupSelltoCustDetails: Boolean = false;
  globalCustomerLookupPopup: boolean = false;

  constructor(
    private httpDataService: SalesJournalDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getHeaderDetails() {
    this.httpDataService.getHeader(['',
      this.PurchJNumber]).subscribe(getHeader => {
        this.assignToDuplicate(getHeader);
        this.EJDetails = getHeader[0];
      });
  }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource2 = new CustomStore({
      key: ["LineNo", "LineCode", "UnitPrice", "CostIncVAT", "LineAmount", "Description", "AmountIncludingVAT"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        thisComponent.httpDataService.getLines(["",
          thisComponent.PurchJNumber]).subscribe(dataLines => {
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
        thisComponent.httpDataService.deleteLine(["",
          thisComponent.PurchJNumber, key["LineNo"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines with LineCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateJournalLine(["",
          getUpdateValues(key, newValues, "LineCode"),
          getUpdateValues(key, newValues, "UnitPrice"),
          getUpdateValues(key, newValues, "CostIncVAT"),
          getUpdateValues(key, newValues, "LineAmount"),
          getUpdateValues(key, newValues, "Description"),
          thisComponent.PurchJNumber,
          getUpdateValues(key, newValues, "LineNo")]).subscribe(data => {
            if (data >= 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineCode: " + getUpdateValues(key, newValues, "LineCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        thisComponent.httpDataService.insertNewLine(["",
          thisComponent.PurchJNumber,
          values["LineCode"],
          values["Description"],
          values["CostIncVAT"],
          values["UnitPrice"]]).subscribe(data => {
            if (data[0] == 'DONE') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with LineCode: " + values["LineCode"] + ", Error Status Code is " + data[0]);
            }
          });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.itemArray = new CustomStore({
      key: ["LineCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getServiceItem([""]).subscribe(dataLines => {
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    this.customerSuggestions = new CustomStore({
      key: ["VendCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getCustomerList([""]).subscribe(dataLines => {
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    this.httpDataService.handleConnectedvatBusGrp(['']).subscribe(handleConnectedvatBusGrp => {
      this.paymentMethodData = new DataSource({
        store: <String[]>handleConnectedvatBusGrp,
        paginate: true,
        pageSize: 10
      });
    });


    this.httpDataService.handleConnectedvendgroup([''])
      .subscribe(handleConnectedvendgroup => {
        this.vendorgrpSuggestions = new DataSource({
          store: <String[]>handleConnectedvendgroup,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
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

  suggestionFormateForCustomerGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormateForVatGrp(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    value = value != null ? value : 0;
    newData.AmountIncludingVAT = value;
    newData.Amount = value;
    (<any>this).defaultSetCellValue(newData, value);
  }

  onSellToCustomerGrpCodeChanged(event) {
    if (this.EJDetails["VATGroup"] != event.value) {
      this.httpDataService.generalUpdate(['',
        'VATGroup', event.value,
        this.PurchJNumber]).subscribe(generalUpdate => {
          this.errorHandlingToasterForUpdate(generalUpdate);
        });
    }
  }

  onSellToCustomerGrpCodeChanged2(event) {
    if (this.EJDetails["WHTGroup"] != event.value) {
      this.httpDataService.generalUpdate(['',
        'WHTGroup', event.value,
        this.PurchJNumber])
        .subscribe(generalUpdate => {
          this.errorHandlingToasterForUpdate(generalUpdate);
        });
    }
  }

  onSellToVatGrpCodeChanged(event) {
    if (event.value != null ? this.EJDetails["CustomerGroup"] != event.value : false) {
      this.httpDataService.generalUpdate(['',
        'CustomerGroup', event.value,
        this.PurchJNumber])
        .subscribe(generalUpdate => {
          this.errorHandlingToasterForUpdate(generalUpdate);
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
        this.httpDataService.generalUpdate(['',
          e.dataField, e.value,
          this.PurchJNumber])
          .subscribe(generalUpdate => {
            this.errorHandlingToasterForUpdate(generalUpdate);
          });
      }
    }
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicateEJDetails[0][e.dataField] != e.value) {
        this.httpDataService.generalUpdate(["", e.dataField, e.value,
          this.PurchJNumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUpdate(dataStatus);
          });
      }
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
    this.globalServiceItemLookupPopup = true;
  }

  onUserRowSelect(event, type) {
    this.globalServiceItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "LineCode", event.data.Code);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "UnitPrice", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "AmountIncludingVAT", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "Amount", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "CostIncVAT", this.companyHeader.AmountIncludingVAT);
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["Amount", "Quantity", "UnitPrice", "AmountIncludingVAT", "LineDiscountAmount", "LineAmount", "VatAmount", "WHTPerct"]);
    this.itemDetailsPopup = true;
  }

  onVendorSearchClicked(type) {
    this.globalCustomerLookupPopup = true;
  }

  onCustomerRowClicked(event) {
    this.globalCustomerLookupPopup = false;
    this.httpDataService.handleBuyFromLookUpManager(['',
      event.data.CustCode,
      this.PurchJNumber]).subscribe(dataStatus => {
        if (dataStatus > 0) {
          this.httpDataService.onCustomerCodeUpdate(['',
            this.PurchJNumber]).subscribe(dataStatus => {
              this.errorHandlingToasterForUpdate(dataStatus);
            });
        } else {
          this.toastr.error("Error while Updating the Vendor Code, UPDATE-ERR!!");
        }
      });
  }

  getBuyFromVendorDetail() {
    this.popupSelltoCustDetails = true;
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.getHeaderDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  CRJOperationsGo(selected: string) {
    if (selected == 'Post') {
      if (this.isLinesExist)
        this.showInfo();
      else
        this.toastr.warning("There are No Lines Exist !!");
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  showInfo() {
    this.popupVisible = true;
    this.httpDataService.createGLBufferLines(["",
      this.PurchJNumber]).subscribe(createGLBufferLines => {
        this.onCreateGLBuffResultSet = createGLBufferLines[1];
        this.httpDataService.onCreateGLBuffResultSet(["",
          this.PurchJNumber]).subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });
      });
  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.httpDataService.btnPost_clickHandler(["",
        this.PurchJNumber]).subscribe(onPostingAccountValidatation => {
          if (onPostingAccountValidatation != null) {
            if (onPostingAccountValidatation[0]["AccCount"] == '0') {
              this.httpDataService.onPostingAccountValidatation(["",
                this.PurchJNumber, UtilsForGlobalData])
                .subscribe(onPostingAccountValidatation => {
                  this.popupVisible = false;
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Sales Journal " + this.PurchJNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/finance/sales-journal-list']);
                  } else {
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
      this.toastr.error("Balance is not Zero");
    }
  }

  Save(event) {
    this.formWidget.instance.updateData(this.newCustomerDetail);
    if (this.newCustomerDetail["PostingType"] == 'DEBIT') {
      this.amt = (this.newCustomerDetail["Amount"] * -1);
      this.dbAmt = 0;
      this.crAmt = this.newCustomerDetail["Amount"];
    }
    else {
      this.amt = this.newCustomerDetail["Amount"];
      this.dbAmt = this.newCustomerDetail["Amount"];
      this.crAmt = 0;
    }
    this.httpDataService.btnSaveChrge_clickHandler(["",
      this.PurchJNumber,
      this.newCustomerDetail["Code"],
      this.amt,
      this.dbAmt,
      this.crAmt,
      this.newCustomerDetail["AccountCode"],
      this.EJDetails["ReceiveFromCode"],
      this.currentDate]).subscribe(getNewCustDetail => {
        this.popuptoAddCharges = false;
        this.gridContainer.instance.refresh();
        if (getNewCustDetail > 0) {
          this.toastr.success("Added Sucessfully");
        }
        else {
          this.toastr.error("error While Inserting");
          this.popuptoAddCharges = false;
        }
      }
      );
  }

}

