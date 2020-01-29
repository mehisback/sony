import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { PaymentJournalDetailsHttpDataService } from './payment-journal-details-http-data.service';
@Component({
  selector: 'app-payment-journal-details',
  templateUrl: './payment-journal-details.component.html',
  styleUrls: ['./payment-journal-details.component.css']
})
export class PaymentJournalDetailsComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  PAYJNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('PAYJNumber');
  PAYJDetails: any;
  duplicatePAYJDetails: any[];
  popupVisible: boolean = false;
  popuptoAddCharges: boolean = false;
  PAYJLines: any;
  dropdownmenu = ['Get All Lines', 'Delete All Lines', 'Post'];
  currentDate = UtilsForGlobalData.getCurrentDate();
  paymentMethodData = [{ Code: "CASH" }, { Code: "CHEQUE" }, { Code: "BANK" }, { Code: "CREDITCARD" }, { Code: "DEBITCARD" }, { Code: "OTHER" }, { Code: "PREPAYMENT" }];
  getPostingType = ['DEBIT', 'CREDIT'];
  PaymentCodeData: any;
  dataSource: any = {};
  dataSource2: any = {};
  onCreateGLBuffResultSet: any;
  balanceforpost: any;
  newCustomerDetail: any = {};
  getAccountCharges: Object;
  amt: any;
  dbAmt: number;
  crAmt: any;
  getVendorList: CustomStore;
  globalCustomerLookupPopup: boolean = false;
  popupSelltoCustDetails: Boolean = false;
  isLinesExist: Boolean = false;
  isShowAll: Boolean = false;

  constructor(
    private httpDataService: PaymentJournalDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.setApplicableAmountValue = this.setApplicableAmountValue.bind(this);
  }

  getHeaderDetails() {
    this.httpDataService.getHeader(['',
      this.PAYJNumber]).subscribe(getHeader => {
        getHeader[0]["Amount"] = parseFloat(getHeader[0]["Amount"]).toFixed(2);
        getHeader[0]["showAll"] = this.isShowAll;
        this.assignToDuplicate(getHeader);
        this.PAYJDetails = getHeader[0];
        this.httpDataService.handleConnectedPaymentCodes(['',
          this.PAYJDetails["PaymentMethod"]]).subscribe(handleConnectedPaymentCodes => {
            this.PaymentCodeData = new DataSource({
              store: <String[]>handleConnectedPaymentCodes,
              paginate: true,
              pageSize: 10
            });
          });
      });
  }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ApplicationAmount", "InvoiceNo", "InvoiceDate"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.getHeaderDetails();
        thisComponent.httpDataService.getLines(["",
          thisComponent.PAYJNumber]).subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.PAYJLines = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDelete_clickHandler(["",
          key["LineNo"],
          thisComponent.PAYJNumber])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with InvoiceNo: " + key["InvoiceNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.lineDG_itemEditEndHandler(["",
          getUpdateValues(key, newValues, "ApplicationAmount"),
          thisComponent.PAYJNumber,
          getUpdateValues(key, newValues, "LineNo")
        ]).subscribe(data => {
          if (data >= 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines with InvoiceNo: " + getUpdateValues(key, newValues, "InvoiceNo") + ", Error Status Code is UPDATE-ERR");
          }
        });
        return devru.promise();
      }
    });


    this.dataSource2.store = new CustomStore({
      key: ["LineNo", "ApplicationAmount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getCharges(["",
          thisComponent.PAYJNumber]).subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.bntDelCharge_clickHandler(["",
          thisComponent.PAYJNumber,
          key["LineNo"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.getVendorList = new CustomStore({
      key: ["VendCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getVendorList([""]).subscribe(dataVendor => {
          devru.resolve(dataVendor);
        });
        return devru.promise();
      }
    });

    this.httpDataService.getAccountCharges([""]).subscribe(getAccountCharges => {
      this.getAccountCharges = new DataSource({
        store: <String[]>getAccountCharges,
        paginate: true,
        pageSize: 10
      });
    });
  }

  suggestionFormateForCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormateForCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForPayment(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormateForPayment(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  setApplicableAmountValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    if (value > Number(currentData.RemainingAmount)) {
      value = currentData.RemainingAmount;
      this.toastr.warning("Applicable Amount is More than the Remaining Amount", "RESET");
    }
    newData.ApplicationAmount = value;
  }

  onSellToCustomerCodeChanged(event) {
    if (this.PAYJDetails["PayToVendor"] != event.value) {
      this.httpDataService.handlePayToLookUpManager(['',
        event.value,
        this.PAYJNumber]).subscribe(dataStatus => {
          if (dataStatus >= 0) {
            this.httpDataService.onPaytoVendorUpdate(['',
              this.PAYJNumber]).subscribe(dataStatus => {
                this.errorHandlingToasterForUpdate(dataStatus);
              });
          } else {
            this.toastr.error("Customer Code Update Failed");
          }
        });
    }
  }

  onSellToCustomerGrpCodeChanged(event) {
    if (event.value ? this.PAYJDetails["PaymentMethod"] != event.value : false) {
      this.httpDataService.updatePaymentMethodInfo(['',
        event.value, '',
        this.PAYJDetails["Amount"],
        this.PAYJNumber]).subscribe(dataStatus => {
          this.errorHandlingToasterForUpdate(dataStatus);
        });
    }
  }

  onSellToVatGrpCodeChanged(event) {
    if (event.value ? this.PAYJDetails["PaymentCode"] != event.value : false) {
      this.httpDataService.updatePaymentMethodInfo(['',
        this.PAYJDetails["PaymentMethod"],
        event.value,
        this.PAYJDetails["Amount"],
        this.PAYJNumber])
        .subscribe(dataStatus => {
          this.errorHandlingToasterForUpdate(dataStatus);
        });
    }
  }


  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicatePAYJDetails[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'ChequeDate' || e.dataField == 'Remarks' || e.dataField == 'ChequeNo') {
        if (e.dataField == 'ChequeDate') {
          if (!this.duplicatePAYJDetails[0][e.dataField]) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
          }
        }
        this.httpDataService.generalUpdate(['',
          e.dataField, e.value,
          this.PAYJNumber]).subscribe(generalUpdate => {
            this.errorHandlingToasterForUpdate(generalUpdate);
          });
      }
      else if (e.dataField == 'showAll') {
        this.isShowAll = e.value;
        var filterType: String = (this.isShowAll == false) ? 'ByDueDate' : 'ShowAll';
        if (!this.isLinesExist) {
          this.httpDataService.createApplicationLines(['',
            this.PAYJNumber, UtilsForGlobalData.getUserId(),
            filterType]).subscribe(generalUpdate => {
              if (generalUpdate[0] == 'CREATED') {
                this.toastr.success("Successfully Updated", "DONE");
                this.gridContainer.instance.refresh();
              }
            });
        } else {
          this.toastr.warning("Clear existing Lines to Create new Lines");
          this.duplicatePAYJDetails[0][e.dataField] = e.value;
        }
      }
    }
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicatePAYJDetails = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatePAYJDetails["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatePAYJDetails[i][prop] = data[i][prop];
      }
    }
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.getHeaderDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  PAYJOperationsGo(selected: string) {
    if (selected == 'Get All Lines') {
      if (!this.isLinesExist) {
        var filterType: String = (this.isShowAll == false) ? 'ByDueDate' : 'ShowAll';
        this.httpDataService.createApplicationLines(['',
          this.PAYJNumber, UtilsForGlobalData.getUserId(),
          filterType]).subscribe(generalUpdate => {
            if (generalUpdate[0] == 'CREATED') {
              this.toastr.success("Successfully Updated", "DONE");
              this.gridContainer.instance.refresh();
            }
          });
      } else {
        this.toastr.warning("Clear existing Lines to Create new Lines");
      }
    } else if (selected == 'Delete All Lines') {
      this.httpDataService.btnDeleteAll_clickHandler(['',
        this.PAYJNumber]).subscribe(generalUpdate => {
          if (generalUpdate >= 1) {
            this.toastr.success("Successfully Updated", "DONE");
            this.gridContainer.instance.refresh();
          }
        });
    } else if (selected == 'Post') {
      this.showInfo();
    }
    else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  showInfo() {
    this.popupVisible = true;
    this.httpDataService.createGLBufferLines(["", this.PAYJNumber])
      .subscribe(createGLBufferLines => {
        this.onCreateGLBuffResultSet = createGLBufferLines[1];
        this.httpDataService.onCreateGLBuffResultSet(["", this.PAYJNumber])
          .subscribe(showInfo1 => {
            this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
          });
      });
  }

  PostBtn() {
    if (this.balanceforpost == 0) {
      this.httpDataService.btnPost_clickHandler(["",
        this.PAYJNumber]).subscribe(onPostingAccountValidatation => {
          if (Object.keys(onPostingAccountValidatation).length > 0) {
            if (onPostingAccountValidatation[0]["AccCount"] == 0) {
              this.httpDataService.onPostingAccountValidatation(["", this.PAYJNumber,
                UtilsForGlobalData.getUserId()]).subscribe(onPostingAccountValidatation => {
                  this.popupVisible = false;
                  if (onPostingAccountValidatation[0] == 'POSTED') {
                    this.toastr.success("Payment Journal " + this.PAYJNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/finance/payment-journal']);
                  } else {
                    this.toastr.error("Posting Failed , Error Status Code: " + onPostingAccountValidatation[0]);
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

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'Charges') {
    }
  }

  getthelines() {
    this.newCustomerDetail = {};
    this.popuptoAddCharges = true;
  }

  Save(event) {
    this.formWidget.instance.updateData(this.newCustomerDetail);
    if (this.newCustomerDetail["PostingType"] == 'DEBIT') {
      this.amt = (this.newCustomerDetail["Amount"] * -1);
      this.dbAmt = 0;
      this.crAmt = this.newCustomerDetail["Amount"];
    } else {
      this.amt = this.newCustomerDetail["Amount"];
      this.dbAmt = this.newCustomerDetail["Amount"];
      this.crAmt = 0;
    }
    this.httpDataService.btnSaveChrge_clickHandler(["",
      this.PAYJNumber,
      this.newCustomerDetail["Code"],
      this.amt,
      this.dbAmt,
      this.crAmt,
      this.newCustomerDetail["AccountCode"],
      this.PAYJDetails["ReceiveFromCode"],
      this.currentDate]).subscribe(getNewCustDetail => {
        if (getNewCustDetail > 0) {
          this.toastr.success("Added Sucessfully", "DONE");
        } else {
          this.toastr.error("error While Inserting", "Try Again");
        }
        this.popuptoAddCharges = false;
      });
  }

  onSellToCustomerCodeChanged2(event, dataField) {
    if (event.value) {
      this.newCustomerDetail[dataField] = event.value;
      if (dataField == 'Code') {
        var json = this.getAccountCharges["_store"]._array ? this.getAccountCharges["_store"]._array : {};
        for (var index = 0; index < Object.keys(json).length; ++index) {
          if (json[index].Code == event.value) {
            this.newCustomerDetail["AccountCode"] = json[index].AccountCode;
            this.newCustomerDetail["Description"] = json[index].Description;
            this.newCustomerDetail["PostingType"] = json[index].PostingType;
            this.newCustomerDetail["Amount"] = 0;
            break;
          }
        }
      }
    }
  }

  onHiding(event) {
    this.gridContainer2.instance.refresh();
  }

  onCustomerSearchClicked(type) {
    this.globalCustomerLookupPopup = true;
  }

  onCustomerRowClicked(event) {
    this.globalCustomerLookupPopup = false;
    this.httpDataService.handlePayToLookUpManager(['',
      event.data.VendCode,
      this.PAYJNumber]).subscribe(dataStatus => {
        if (dataStatus >= 0) {
          this.httpDataService.onPaytoVendorUpdate(['',
            this.PAYJNumber]).subscribe(dataStatus => {
              this.errorHandlingToasterForUpdate(dataStatus);
            });
        } else {
          this.toastr.error("Vendor Code Update Failed");
        }
      });
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }



}
