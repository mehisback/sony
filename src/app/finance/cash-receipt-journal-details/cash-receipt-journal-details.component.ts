import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import DataSource from "devextreme/data/data_source";
import CustomStore from 'devextreme/data/custom_store';
import { CashReceiptJournalDetailsHttpDataService } from './cash-receipt-journal-details-http-data.service';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
@Component({
    selector: 'app-cash-receipt-journal-details',
    templateUrl: './cash-receipt-journal-details.component.html',
    styleUrls: ['./cash-receipt-journal-details.component.css']
})

export class CashReceiptJournalDetailsComponent implements OnInit {
    @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
    @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
    @ViewChild(DxFormComponent) formWidget: DxFormComponent;

    CRJNumber: String = UtilsForGlobalData.retrieveLocalStorageKey('CRJNumber');
    CRJDetails: any;
    duplicateCRJDetails: any[];
    popupVisible: boolean = false;
    popuptoAddCharges: boolean = false;
    getCustomerList: any = {};
    dropdownmenu2 = ['Get All Lines', 'Delete All Lines', 'Post'];
    currentDate = UtilsForGlobalData.getCurrentDate();
    paymentMethodData = [{ "Code": "CASH" }, { "Code": "CHEQUE" }, { "Code": "BANK" }, { "Code": "CREDITCARD" }, { "Code": "DEBITCARD" }, { "Code": "OTHER" }, { "Code": "PDC" }];
    PaymentCodeData: any;
    dataSource: any = {};
    dataSource2: any = {};
    onCreateGLBuffResultSet: any;
    balanceforpost: any;
    newCustomerDetail: any = [];
    getAccountCharges: Object;
    amt: any;
    dbAmt: number;
    crAmt: any;
    globalCustomerLookupPopup: boolean = false;
    popupSelltoCustDetails: Boolean = false;
    isLinesExist: Boolean = false;
    isShowAll: Boolean = false;

    constructor(
        private httpDataService: CashReceiptJournalDetailsHttpDataService,
        public router: Router,
        private toastr: ToastrService
    ) { 
        this.setApplicableAmountValue = this.setApplicableAmountValue.bind(this);
    }

    getHeaderDetails() {
        this.httpDataService.getHeader(['',
            this.CRJNumber]).subscribe(getHeader => {
                getHeader[0]["Amount"] = parseFloat(getHeader[0]["Amount"]).toFixed(2);
                getHeader[0]["showAll"] = this.isShowAll;
                this.assignToDuplicate(getHeader);
                this.CRJDetails = getHeader[0];
                this.httpDataService.handleConnectedPaymentCodes(['',
                    this.CRJDetails["PaymentMethod"]])
                    .subscribe(handleConnectedPaymentCodes => {
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
                    thisComponent.CRJNumber]).subscribe(dataLines => {
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
                thisComponent.httpDataService.btnDelete_clickHandler(["",
                    key["LineNo"],
                    thisComponent.CRJNumber])
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
                    thisComponent.CRJNumber,
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
            key: ["LineNo", "ChargeCode", "AccountCode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.getCharges(["",
                    thisComponent.CRJNumber]).subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                thisComponent.httpDataService.bntDelCharge_clickHandler(["",
                    thisComponent.CRJNumber,
                    key["LineNo"]])
                    .subscribe(data => {
                        if (data == '1') {
                            devru.resolve(data);
                        }
                        else {
                            devru.reject("Error while Deleting the Line with ChargeCode: " + key["ChargeCode"] + ", Error Status Code is DELETE-ERR");
                        }
                    });
                return devru.promise();
            }
        });

        function getUpdateValues(key, newValues, field): String {
            return (newValues[field] == null) ? key[field] : newValues[field];
        }

        this.getCustomerList.store = new CustomStore({
            key: ["CustCode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.getCustomerList([""])
                    .subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            }
        });
    }

    suggestionFormateForCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    hoverFormateForCode(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
    }

    suggestionFormateForPayment(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
    }

    hoverFormateForPayment(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
    }

    onSellToCustomerCodeChanged(event) {
        if (this.CRJDetails["ReceiveFromCode"] != event.value) {
            this.httpDataService.handleReceiveFromLookUpManager(['',
                event.value,
                this.CRJNumber]).subscribe(handleReceiveFromLookUpManager => {
                    this.errorHandlingToasterForUpdate(handleReceiveFromLookUpManager);
                });
        }
    }

    setApplicableAmountValue(newData, value, currentData): void {
        value = value != null ? value : 0;
        if (value > Number(currentData.RemainingAmount)) {
          value = currentData.RemainingAmount;
          this.toastr.warning("Applicable Amount is More than the Remaining Amount", "RESET");
        }
        newData.ApplicationAmount = value;
    }

    onSellToCustomerGrpCodeChanged(event) {
        if (event.value ? this.CRJDetails["PaymentMethod"] != event.value : false) {
            this.httpDataService.updatePaymentMethodInfo(['',
                event.value, '',
                this.CRJDetails["Amount"],
                this.CRJNumber]).subscribe(updatePaymentMethodInfo => {
                    this.errorHandlingToasterForUpdate(updatePaymentMethodInfo);
                });
        }
    }

    onSellToVatGrpCodeChanged(event) {
        if (event.value ? this.CRJDetails["PaymentCode"] != event.value : false) {
            this.httpDataService.updatePaymentMethodInfo(['',
                this.CRJDetails["PaymentMethod"],
                event.value,
                this.CRJDetails["Amount"],
                this.CRJNumber]).subscribe(updatePaymentMethodInfo => {
                    this.errorHandlingToasterForUpdate(updatePaymentMethodInfo);
                });
        }
    }


    formSummary_fieldDataChanged(e) {
        if ((e.value != undefined || e.value != null) && this.duplicateCRJDetails[0][e.dataField] != e.value) {
            if (e.dataField == 'DocumentDate' || e.dataField == 'ChequeDate' || e.dataField == 'Remarks' || e.dataField == 'ChequeNo') {
                if (e.dataField == 'ChequeDate') {
                    if (!this.duplicateCRJDetails[0][e.dataField]) {
                        e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
                    }
                }
                this.httpDataService.generalUpdate(['',
                    e.dataField, e.value,
                    this.CRJNumber]).subscribe(generalUpdate => {
                        this.errorHandlingToasterForUpdate(generalUpdate);
                    });
            }
            else if (e.dataField == 'showAll') {
                this.isShowAll = e.value;
                var filterType: String = (this.isShowAll == false) ? 'ByDueDate' : 'ShowAll';
                if (!this.isLinesExist) {
                    this.httpDataService.createApplicationLines(['',
                        this.CRJNumber, UtilsForGlobalData.getUserId(),
                        filterType]).subscribe(generalUpdate => {
                            if (generalUpdate[0] == 'CREATED') {
                                this.toastr.success("Successfully Updated", "DONE");
                                this.gridContainer.instance.refresh();
                            }
                        });
                } else {
                    this.toastr.warning("Clear existing Lines to Create new Lines");
                    this.duplicateCRJDetails[0][e.dataField] = e.value;
                }
            }
        }
    }

    CRJOperationsGo(selected: string) {
        if (selected == 'Get All Lines') {
            if (!this.isLinesExist) {
                var filterType: String = (this.isShowAll == false) ? 'ByDueDate' : 'ShowAll';
                this.httpDataService.createApplicationLines(['',
                    this.CRJNumber,
                    UtilsForGlobalData.getUserId(),
                    filterType]).subscribe(generalUpdate => {
                        if (generalUpdate[0] == 'CREATED') {
                            this.toastr.success("Successfully Updated", "DONE");
                            this.gridContainer.instance.refresh();
                        }
                    });
            } else {
                this.toastr.warning("Clear existing Lines to Create new Lines");
            }
        }
        else if (selected == 'Delete All Lines') {
            this.httpDataService.btnDeleteAll_clickHandler(['',
                this.CRJNumber]).subscribe(generalUpdate => {
                    if (generalUpdate >= 1) {
                        this.toastr.success("Deleted!");
                        this.gridContainer.instance.refresh();
                    }
                });
        }
        else if (selected == 'Post') {
            this.showInfo();
        }
        else {
            this.toastr.warning("Please Select The Operation");
        }
    }

    showInfo() {
        this.popupVisible = true;
        this.httpDataService.createGLBufferLines(["",
            this.CRJNumber]).subscribe(createGLBufferLines => {
                this.onCreateGLBuffResultSet = createGLBufferLines[1];
                this.httpDataService.onCreateGLBuffResultSet(["",
                    this.CRJNumber]).subscribe(showInfo1 => {
                        this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
                    });
            });
    }

    PostBtn() {
        if (this.balanceforpost == 0) {
            this.httpDataService.btnPost_clickHandler(["",
                this.CRJNumber]).subscribe(onPostingAccountValidatation => {
                    if (onPostingAccountValidatation != null) {
                        if (onPostingAccountValidatation[0]["AccCount"] == '0') {
                            this.httpDataService.onPostingAccountValidatation(["", this.CRJNumber,
                                UtilsForGlobalData.getUserId()]).subscribe(onPostingAccountValidatation => {
                                    this.popupVisible = false;
                                    if (onPostingAccountValidatation[0] == 'POSTED') {
                                        this.toastr.success("Cash Receipt Journal " + this.CRJNumber + " is successfully Posted and Archived", "Posted");
                                        this.router.navigate(['/finance/cash-receipt-journal']);
                                    } else {
                                        this.toastr.error("Posting Failed, Error Status Code: " + onPostingAccountValidatation[0]);
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
            this.toastr.error("Balance is not zero");
        }
    }

    assignToDuplicate(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicateCRJDetails = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicateCRJDetails["" + i] = {};
            for (var prop in data[i]) {
                this.duplicateCRJDetails[i][prop] = data[i][prop];
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

    getthelines() {
        this.popuptoAddCharges = true;
        this.httpDataService.getAccountCharges([""])
            .subscribe(getAccountCharges => {
                this.getAccountCharges = getAccountCharges;
            });
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
            this.CRJNumber,
            this.newCustomerDetail["Code"],
            this.amt,
            this.dbAmt,
            this.crAmt,
            this.newCustomerDetail["AccountCode"],
            this.CRJDetails["ReceiveFromCode"],
            this.currentDate]).subscribe(getNewCustDetail => {
                if (getNewCustDetail > 0) {
                    this.toastr.success("Added Sucessfully", "DONE");
                }
                else {
                    this.toastr.error("error While Inserting!!", "Try Again");
                }
                this.popuptoAddCharges = false;
                this.gridContainer2.instance.refresh();
            }
            );
    }

    onSellToCustomerCodeChanged2(event) {
        if (this.newCustomerDetail["getAccountCharges"] != event.value) {
            var json = this.getAccountCharges == null ? {} : this.getAccountCharges;
            for (var index = 0; index < Object.keys(json).length; ++index) {
                if (json[index].Code == event.value) {
                    this.newCustomerDetail["AccountCode"] = json[index].AccountCode;
                    this.newCustomerDetail["Description"] = json[index].Description;
                    this.newCustomerDetail["PostingType"] = json[index].PostingType;
                    this.newCustomerDetail["Code"] = json[index].Code;
                    break;
                }
            }

        }
    }


    onCustomerSearchClicked(type) {
        this.globalCustomerLookupPopup = true;
    }

    onCustomerRowClicked(event) {
        this.globalCustomerLookupPopup = false;
        this.httpDataService.handleReceiveFromLookUpManager(['',
            event.data.CustCode,
            this.CRJNumber]).subscribe(dataStatus => {
                if (dataStatus >= 0) {
                    this.httpDataService.onReceiveFromCodeUpdate(['',
                        this.CRJNumber]).subscribe(dataStatus => {
                            this.errorHandlingToasterForUpdate(dataStatus);
                        });
                } else {
                    this.toastr.error("Customer Code Update Failed");
                }
            });
    }

    getSellToCustomerDetail(event) {
        this.popupSelltoCustDetails = true;
    }

}


