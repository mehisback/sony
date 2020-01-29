import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    NgbModal,
    ModalDismissReasons,
    NgbActiveModal,
    NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');

import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { CompundDiscountService } from '../../Utility/compund-discount.service';
import { PurchaseinvoicedetailsHttpDataService } from './purchaseinvoicedetails-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';


@Component({
    selector: 'app-purchaseinvoicedetails',
    templateUrl: './purchaseinvoicedetails.component.html',
    styleUrls: ['./purchaseinvoicedetails.component.css']
})
export class PurchaseinvoicedetailsComponent implements OnInit {
    @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
    @ViewChild("refreshtebgrid") refreshtebgrid: DxDataGridComponent;
    @ViewChild("getlinesforgrid") getlinesforgrid: DxDataGridComponent;
    @ViewChild("getlinesforgrid2") getlinesforgrid2: DxDataGridComponent;

    PINumber: String = UtilsForGlobalData.retrieveLocalStorageKey('PINumber');
    POOperations: any = ['Print Order', 'Post'];
    itemArray: any = [];
    dataSource: any = {};
    vendorSuggestions: any = null;
    popupVisible: boolean = false;
    newPurchaseInvoiceDetails: any[];
    vendorgrpSuggestions: any = null;
    vatGrpSuggestions: any = null;
    PoListSuggestions: any = null;
    onCreateGLBuffResultSet: any;
    balanceforpost: any;
    companyHeader: any = {};
    isConnectedOrderSelected: boolean = false;
    isPayToVendorSelected: boolean = false;
    isLinesExist: boolean = false;

    printHeader: any = {};
    printLines: any = {};
    columnHeader1 = [
        { title: "Order No", dataKey: "ConnectedOrder", width: 40 },
        { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
        { title: "Due Date", dataKey: "DueDate", width: 40 },
        { title: "Currency Code", dataKey: "CurrencyCode", width: 40 }
    ];
    columnHeader2 = [
        { title: "SNo", dataKey: "SnNo", width: 90 },
        { title: "Code", dataKey: "LineCode", width: 40 },
        { title: "Desc", dataKey: "Description", width: 40 },
        { title: "UOM", dataKey: "UOM", width: 40 },
        { title: "Quantity", dataKey: "QuantityToInvoice", width: 40 },
        { title: "Amount", dataKey: "Amount", width: 40 },
        { title: "Tax Rate", dataKey: "VATPerct", width: 40 },
        { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
        { title: "TAX Amount", dataKey: "VatAmount", width: 40 },
        { title: "Amount Inc Tax", dataKey: "AmountIncludingVAT", width: 40 }
    ];
    PurchaseInvoiceDetails: any = [];
    popupforlines: boolean = false;
    POlinesfortab: any;
    dataSource1: Object = [];
    dataSource2: Object;
    duplicateSalesHeader: any[];
    itemDetails: any = {};
    itemDetailsPopup: Boolean = false;
    globalServiceItemLookupPopup: boolean = false;
    globalDepositItemLookupPopup: boolean = false;
    globalVendorDetailsPopup: Boolean = false;
    globalVendorLookupPopup: boolean = false;
    itemPopupName: string = "ITEM DETAILS";
    serviceitemArray: any = [];
    deposititemArray: any = [];
    postopupAllowed: boolean = false;
    TAX: number;
    Quantity: number = 0;
    TotalLineDiscountAmount: any;
    totalInvoiceDisocunt: any;
    PayToDetails: any = {};

    constructor(
        private httpDataService: PurchaseinvoicedetailsHttpDataService,
        public router: Router,
        private toastr: ToastrService,
        private compoundDiscount: CompundDiscountService
    ) { }

    ngOnInit() {

        this.httpDataService.getCompanyInfo().subscribe(getCompany => {
            this.companyHeader = getCompany[0];
        });

        this.httpDataService.handleConnectedvendgroup([''])
            .subscribe(handleConnectedvendgroup => {
                this.vendorgrpSuggestions = new DataSource({
                    store: <String[]>handleConnectedvendgroup,
                    paginate: true,
                    pageSize: 10
                });
            });

        this.httpDataService.handleConnectedvatBusGrp([''])
            .subscribe(handleConnectedvatBusGrp => {
                this.vatGrpSuggestions = new DataSource({
                    store: <String[]>handleConnectedvatBusGrp,
                    paginate: true,
                    pageSize: 10
                });
            });



        var thisComponent = this;

        this.dataSource.store = new CustomStore({
            key: ["LineNo", "LineType", "LineCode", "Description", "QuantityToInvoice", "UnitPrice", "DirectUnitCost", "AmountIncludingVAT", "Amount", "LineDiscountAmount", "InvDiscountAmount", "VatAmount", "LineCompoundDiscount", "GRDocumentNo", "GRLineNo"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.getHeaderDetails();
                thisComponent.httpDataService.getPurchaseInvoiceLines(["", thisComponent.PINumber])
                    .subscribe(dataLines => {
                        if (Object.keys(dataLines).length > 0) {
                            thisComponent.isLinesExist = true;
                        } else {
                            thisComponent.isLinesExist = false;
                        }
                        for (var i = 0; i < Object.keys(dataLines).length; i++) {
                            dataLines[i]["LineDiscountAmount"] = parseFloat(dataLines[i]["LineDiscountAmount"]).toFixed(2);
                        }
                        thisComponent.printLines = dataLines;
                        devru.resolve(dataLines);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                if (Number(thisComponent.PurchaseInvoiceDetails["InvDiscountAmount"]) == 0) {
                    if (key.LineType == 'DEPOSIT') {
                        thisComponent.httpDataService.btnDelLine_clickHandlerDeposit(["", thisComponent.PINumber,
                            key["LineNo"], key["LineCode"]])
                            .subscribe(dataStatus => {
                                if (dataStatus == 'DONE') {
                                    devru.resolve(dataStatus);
                                } else {
                                    devru.reject("Error while Deleting the Lines with LineCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR");
                                }
                            });
                    } else {
                        thisComponent.httpDataService.btnDelLine_clickHandler(["", thisComponent.PINumber, key["LineNo"], key["LineType"], key["GRDocumentNo"], key["GRLineNo"]])
                            .subscribe(dataStatus => {
                                if (dataStatus == 'DONE') {
                                    devru.resolve(dataStatus);
                                } else {
                                    devru.reject("Error while Deleting the Lines with LineCode: " + key["LineCode"] + ", Error Status Code is DELETE-ERR");
                                }
                            });
                    }
                } else {
                    devru.resolve();
                    thisComponent.toastr.warning("Line Operation cannot be performed, as INVOICE DISCOUNT IS APPLIED");
                }
                return devru.promise();
            },
            update: function (key, newValues) {
                var devru = $.Deferred();
                if (Number(thisComponent.PurchaseInvoiceDetails["InvDiscountAmount"]) == 0) {
                    var GAmount: Number = (Number(getUpdateValues(key, newValues, "QuantityToInvoice")) * Number(getUpdateValues(key, newValues, "DirectUnitCost")));
                    newValues["LineCompoundDiscount"] = newValues["LineDiscountAmount"] != null ? newValues["LineDiscountAmount"] : getUpdateValues(key, newValues, "LineCompoundDiscount");
                    thisComponent.httpDataService.CompoundDiscountP(["", GAmount, getUpdateValues(key, newValues, "LineDiscountAmount")])
                        .subscribe(dataDiscLines => {
                            var disc = 0;
                            if (dataDiscLines[0] == "invalid value") {
                                newValues["LineCompoundDiscount"] = 0;
                                disc = 0;
                                thisComponent.toastr.warning('Invalid Discount Value!!');
                            } else {
                                disc = Number(GAmount) - Number(dataDiscLines[1]);
                                if (disc <= GAmount) {
                                    disc = Number(disc.toFixed(2));
                                } else {
                                    thisComponent.toastr.warning('Line Discount is greater than Price!');
                                    disc = 0;
                                }
                            }
                            thisComponent.httpDataService.btnSave_clickHandler(["",
                                getUpdateValues(key, newValues, "DirectUnitCost"),
                                getUpdateValues(key, newValues, "QuantityToInvoice"),
                                disc,
                                getUpdateValues(key, newValues, "LineCompoundDiscount") ? getUpdateValues(key, newValues, "LineCompoundDiscount") : disc,
                                getUpdateValues(key, newValues, "Description"),
                                thisComponent.PINumber,
                                getUpdateValues(key, newValues, "LineNo")]).subscribe(dataStatus => {
                                    if (dataStatus == 1) {
                                        devru.resolve(dataStatus);
                                    } else {
                                        devru.reject("Error while Updating the Lines with LineCode: " + getUpdateValues(key, newValues, "LineCode") + ", Error Status Code is UPDATE-ERR");
                                    }
                                });
                        });
                } else {
                    devru.resolve();
                    thisComponent.toastr.warning("Line Operation cannot be performed, as INVOICE DISCOUNT IS APPLIED");
                }
                return devru.promise();
            }

        });

        // var total_amount = this.gridContainer.instance.getTotalSummaryValue("LineDiscountAmount");
        // console.log(total_amount);

        function getUpdateValues(key, newValues, field): String {
            return (newValues[field] == null) ? key[field] : newValues[field];
        }

        this.vendorSuggestions = new CustomStore({
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.getVendorList().subscribe(getVendor => {
                    devru.resolve(getVendor);
                });
                return devru.promise();
            }
        });

        this.serviceitemArray = new CustomStore({
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.getServiceItems().subscribe(getSItem => {
                    devru.resolve(getSItem);
                });
                return devru.promise();
            }
        });
    }

    getHeaderDetails() {
        this.httpDataService.getPurchaseInvoiceHeader(['',
            this.PINumber])
            .subscribe(getPurchaseInvoiceHeader => {
                this.printHeader = getPurchaseInvoiceHeader;
                this.assignToDuplicate(getPurchaseInvoiceHeader);
                this.PurchaseInvoiceDetails = getPurchaseInvoiceHeader[0];
                this.httpDataService.getTotalLinesDiscAmt(['',
                    this.PINumber])
                    .subscribe(getTotalLinesDiscAmt => {
                        this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
                        this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.PurchaseInvoiceDetails["InvDiscountAmount"])).toFixed(2);
                    });
                this.httpDataService.getPurchaseInvoiceLinesQuantity(['',
                    this.PINumber])
                    .subscribe(getTotalLinesDiscAmt => {
                        this.Quantity = getTotalLinesDiscAmt[0]["getPurchaseInvoiceLinesQuantity"];
                    });
                this.TAX = this.PurchaseInvoiceDetails["AmountIncludingVAT"] - this.PurchaseInvoiceDetails["Amount"];
                if (this.PurchaseInvoiceDetails["AmtIncvat"] == 'Yes') {
                    this.PurchaseInvoiceDetails["AmtIncvat"] = true;
                } else {
                    this.PurchaseInvoiceDetails["AmtIncvat"] = false;
                }
                if (this.PurchaseInvoiceDetails["ConnectedOrder"] ? this.PurchaseInvoiceDetails["ConnectedOrder"] != '' : false) {
                    this.isConnectedOrderSelected = true;
                } else {
                    this.isConnectedOrderSelected = false;
                }
                if (this.PurchaseInvoiceDetails["PayToVendor"] ? this.PurchaseInvoiceDetails["PayToVendor"] != '' : false) {
                    this.isPayToVendorSelected = true;
                } else {
                    this.isPayToVendorSelected = false;
                }
                this.httpDataService.getList(['',
                    this.PurchaseInvoiceDetails["PayToVendor"]])
                    .subscribe(getList => {
                        this.PoListSuggestions = new DataSource({
                            store: <String[]>getList,
                            paginate: true,
                            pageSize: 10
                        });
                    });
                this.httpDataService.getAllLines(['', this.PurchaseInvoiceDetails["PayToVendor"]])
                    .subscribe(getServiceItems => {
                        this.itemArray = {
                            paginate: true,
                            pageSize: 20,
                            loadMode: "raw",
                            load: () => <String[]>getServiceItems
                        }
                    });

                this.httpDataService.getListPREPAYMENTHEADER(['',
                    this.PurchaseInvoiceDetails["PayToVendor"],
                    this.PurchaseInvoiceDetails["DocumentDate"]]).subscribe(dataDeposit => {
                        this.deposititemArray = dataDeposit;
                    });
                this.httpDataService.getVendorDetailPerVendor(["", this.PurchaseInvoiceDetails["PayToVendor"]])
                    .subscribe(GotVenDetail => {
                        this.PayToDetails = GotVenDetail[0];
                    });
            });
    }

    assignToDuplicate(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicateSalesHeader = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicateSalesHeader["" + i] = {};
            for (var prop in data[i]) {
                this.duplicateSalesHeader[i][prop] = data[i][prop];
            }
        }
    }

    itemLookup2(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    formateForItemListSuggestion2(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    suggestionFormateForVendor(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "VendCode", "Name");
    }

    suggestionFormateForVendorGrp(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    suggestionFormateForVatGrp(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    suggestionFormateForPolist(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "DocumentNo");
    }

    hover(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "VendCode", "Name");
    }

    hover2(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
    }

    hover3(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
    }

    hover4(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "DocumentNo");
    }

    hover5(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
    }

    suggestionFormateForType(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    setQuantityValue(newData, value, currentData): void {
        value = value != null ? value : '1';
        value = value != 0 ? value : '1';
        if ((value > Number(currentData.QuantityToInvoice)) && (currentData.LineType == 'ITEM')) {
            value = currentData.QuantityToInvoice;
        }
        if (currentData.DirectUnitCost != null && currentData.LineDiscountAmount != null) {
            newData.AmountIncludingVAT = (value * currentData.DirectUnitCost) - currentData.LineDiscountAmount;
            newData.Amount = newData.AmountIncludingVAT;
        }
        (<any>this).defaultSetCellValue(newData, value);
    }

    onUserRowSelect(event, type, CostIncVAT) {
        this.popupforlines = false;
        if (type == 'SERVICEITEM') {
            if (CostIncVAT == null || CostIncVAT == '') {
                CostIncVAT = 'Yes';
            }
            this.httpDataService.insertServiceLine(["", this.PINumber,
                this.PurchaseInvoiceDetails["PayToVendor"],
                event.data.Code, event.data.Description, CostIncVAT,
                event.data.UnitPrice]).subscribe(dataDetails => {
                    this.errorHandlingToasterWhileAddingLines(dataDetails, "Adding Service");
                });
        } else {
            this.httpDataService.insertDepositLine(["", this.PINumber,
                event.data.DocumentNo,
                event.data.EntryNo]).subscribe(dataDetails => {
                    this.errorHandlingToasterWhileAddingLines(dataDetails, "Adding Deposit");
                });
        }
    }

    ItemDeatilsForPopUp(data) {
        this.itemPopupName = "ITEM DETAILS";
        this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
            ["BaseQuantity", "QuantityToInvoice", "DirectUnitCost", "AmountIncludingVAT", "LineDiscountAmount", "VatAmount", "InvDiscountAmount"]);
        this.itemDetailsPopup = true;
    }

    onVendorSearchClicked(type) {
        this.globalVendorLookupPopup = true;
    }

    onVendorRowClicked(event) {
        this.globalVendorLookupPopup = false;
        this.httpDataService.handlePayToLookUpManager(["",
            event.data.VendCode,
            this.PINumber]).subscribe(handlePayToLookUpManager => {
                if (handlePayToLookUpManager >= 0) {
                    this.httpDataService.onPaytoVendorUpdate(["",
                        this.PINumber]).subscribe(onPaytoVendorUpdate => {
                            this.errorHandlingToasterForUPDATE(onPaytoVendorUpdate);
                        });
                } else {
                    this.toastr.error("Vendor Code Update Failed");
                }
            });
    }

    onSellToVendorGrpCodeChanged(event) {
        if (this.PurchaseInvoiceDetails["VendorGroup"] != event.value) {
            this.httpDataService.updateHeader(["",
                'VendorGroup', event.value,
                this.PINumber]).subscribe(onSellToVendorGrpCodeChanged => {
                    this.errorHandlingToasterForUPDATE(onSellToVendorGrpCodeChanged);
                });
        }
    }

    onSellToVatGrpCodeChanged(event) {
        if (this.PurchaseInvoiceDetails["VATGroup"] != event.value) {
            this.httpDataService.updateHeader(["",
                'VATGroup', event.value,
                this.PINumber]).subscribe(onSellToVatGrpCodeChanged => {
                    this.errorHandlingToasterForUPDATE(onSellToVatGrpCodeChanged);
                });
        }
    }

    clearConnectedOrderfromPI() {
        if (this.PurchaseInvoiceDetails["ConnectedTo"] == 'SINGLE') {
            this.httpDataService.btnDeletePOLines_clickHandler(["",
                this.PINumber]).subscribe(btnDeletePOLines_clickHandler => {
                    this.errorHandlingToasterWhileAddingLines(btnDeletePOLines_clickHandler, "Deleting");
                });
        } else {
            this.toastr.warning("Connected to Order is Not SINGLE!!")
            this.gridContainer.instance.refresh();
        }
    }


    onSellToPoListCodeChanged(event) {
        if (this.PurchaseInvoiceDetails["ConnectedOrder"] != event.value) {
            for (var index = 0; index < this.PoListSuggestions._store._array.length; ++index) {
                if (this.PoListSuggestions._store._array[index].DocumentNo == event.value) {
                    this.PurchaseInvoiceDetails["VendorInvoiceNo"] = this.PoListSuggestions._store._array[index].RefNo;
                    break;
                }
            }
            this.httpDataService.btnDeletePOLines_clickHandler(["",
                this.PINumber]).subscribe(btnDeletePOLines_clickHandler => {
                    this.httpDataService.btnCreateLines_clickHandler(["",
                        this.PINumber,
                        event.value,
                        this.PurchaseInvoiceDetails["PayToVendor"]]).subscribe(btnCreateLines_clickHandler => {
                            this.errorHandlingToasterWhileAddingLines(btnCreateLines_clickHandler, "Updating PO")
                        });
                });
        }
        this.getHeaderDetails();
    }

    PickAdHAction(event) {
        if (this.isConnectedOrderSelected) {
            this.httpDataService.btnAddLinePressed(["",
                this.PINumber,
                this.PurchaseInvoiceDetails["PayToVendor"],
                event.key["DocumentNo"],
                event.key["POLineNo"],
                event.key["GRNo"],
                event.key["LineNo"]]).subscribe(btnAddLinePressed => {
                    this.popupforlines = false;
                    this.toastr.success(btnAddLinePressed[0]);
                    this.gridContainer.instance.refresh();
                });
        } else {
            this.toastr.warning("Please Select the Purchase Order!!");
        }
    }

    PoListforlines(event) {
        this.httpDataService.txtPONo_changeHandler(["",
            this.PurchaseInvoiceDetails["PayToVendor"],
            event.value]).subscribe(getAllLines => {
                this.dataSource1 = getAllLines;
                this.getlinesforgrid2.instance.refresh();
            });
    }

    errorHandlingToasterForUPDATE(dataStatus) {
        if (dataStatus >= 0) {
            this.getHeaderDetails();
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
        }
    }

    errorHandlingToaster(dataStatus) {
        if (dataStatus[0] == "DONE") {
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
        }
    }

    errorHandlingToasterWhileAddingLines(dataStatus, type) {
        if (dataStatus[0] != "DONE") {
            this.toastr.error("Error while " + type + " Item with Status Code: " + dataStatus[0], "Try Again");
        }
        this.gridContainer.instance.refresh();
    }

    formSummary_fieldDataChanged(e) {
        if ((e.value != undefined || e.value != null) && this.duplicateSalesHeader[0][e.dataField] != e.value) {
            if (e.dataField == 'DueDate' || e.dataField == 'DocumentDate' || e.dataField == 'VendorInvoiceNo') {
                if (e.dataField == 'DueDate' || e.dataField == 'DocumentDate') {
                    if (!this.duplicateSalesHeader[0][e.dataField]) {
                        e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
                    }
                }
                this.httpDataService.updateHeader(["",
                    e.dataField, e.value,
                    this.PINumber]).subscribe(dataStatus => {
                        this.errorHandlingToasterForUPDATE(dataStatus);
                    });
            }
            /*  if (e.dataField == 'AmtIncvat') {
                var temp = (e.value == true ? 'Yes' : 'No');
                  this.dataFromService.getServerData("purchaseinvoiceheader", "updateHeader", ["",
                  'AmtIncvat',temp , UtilsForGlobalData.retrieveLocalStorageKey('PINumber')])
                    .subscribe(updateHeader => {
                      if (updateHeader == '1') {
                        this.getHeaderDetails();
                        this.toastr.success("DONE");
                      } else {
                        this.toastr.error("Error In Updating!!", "Try Again");
                      }
                    });
              }*/
            else if (e.dataField == 'InvoiceCompoundDiscount') {
                if (this.isConnectedOrderSelected) {
                    if (this.isLinesExist) {
                        this.httpDataService.getToatalAmount(["",
                            this.PINumber]).subscribe(getLines => {
                                var GAmount = Number(getLines[0].TotalAmount);
                                this.httpDataService.CompoundDiscountP(["", GAmount, e.value])
                                    .subscribe(dataDiscLines => {
                                        var disc = 0;
                                        if (dataDiscLines[0] == "invalid value") {
                                            this.getHeaderDetails();
                                            this.toastr.warning('Invalid Discount Value!!');
                                        } else {
                                            var disc = Number(GAmount) - Number(dataDiscLines[1]);
                                            if (disc <= GAmount) {
                                                disc = disc;
                                            } else {
                                                this.toastr.warning('Total Discount is geater than Amount!');
                                                disc = 0;
                                                e.value = 0.0;
                                            }
                                            this.httpDataService.btnInvDisc_clickHandler(["",
                                                this.PINumber, disc,
                                                e.value]).subscribe(dataStatus => {
                                                    if (dataStatus[0] == 'DONE') {
                                                        this.toastr.success("Successfully Updated", "DONE");
                                                        this.gridContainer.instance.refresh();
                                                    } else {
                                                        this.toastr.error('Total Discount Calculation Failed! Error Status Code :' + dataStatus[0]);
                                                    }
                                                });
                                        }
                                    });
                            });
                    } else {
                        this.getHeaderDetails();
                        this.toastr.warning("Please add the Lines!!");
                    }
                } else {
                    this.toastr.warning("Invoice Discount is allowed for One to One Purchase invoice. This invoice is connected to multiple orders");
                }
            }
        }
    }

    showInfo() {
        this.popupVisible = true;
        this.httpDataService.createGLBufferLines(["", UtilsForGlobalData.retrieveLocalStorageKey('PINumber')])
            .subscribe(createGLBufferLines => {
                this.onCreateGLBuffResultSet = createGLBufferLines[1];
                this.httpDataService.onCreateGLBuffResultSet(["", this.PINumber])
                    .subscribe(showInfo1 => {
                        this.balanceforpost = parseFloat(showInfo1[0]["Balance"]).toFixed(2);
                    });
            });
    }

    getthelines() {
        this.popupforlines = true;
        this.httpDataService.getAllLines(["", this.PurchaseInvoiceDetails["PayToVendor"]])
            .subscribe(getAllLines => {
                this.dataSource2 = getAllLines;
                this.getlinesforgrid ? this.getlinesforgrid.instance.refresh() : '';
            });
    }

    onHiding(e) {
        this.gridContainer.instance.refresh();
    }

    addLinesbyPoNumber() {
        if (this.isConnectedOrderSelected) {
            this.popupforlines = false;
            this.httpDataService.POListForInvoicebtnCreateLines_clickHandler(["",
                this.PINumber,
                this.PurchaseInvoiceDetails["ConnectedOrder"],
                this.PurchaseInvoiceDetails["PayToVendor"]]).subscribe(btnAddLinePressed => {
                    this.errorHandlingToaster(btnAddLinePressed);
                    this.gridContainer.instance.refresh();
                });
        } else {
            this.toastr.warning("Please Select the Purchase Order!!");
        }
    }

    PostBtn() {
        if (this.balanceforpost == 0) {
            this.httpDataService.btnPost_clickHandler(["",
                this.PINumber]).subscribe(onPostingAccountValidatation => {
                    if (onPostingAccountValidatation != null) {
                        if (onPostingAccountValidatation[0]["AccCount"] == '0') {
                            this.httpDataService.onPostingAccountValidatation(["",
                                this.PINumber,
                                UtilsForGlobalData.getUserId()])
                                .subscribe(onPostingAccoutStatus => {
                                    if (onPostingAccoutStatus[0] == 'POSTED') {
                                        this.toastr.success("Purchase Invoice " + this.PINumber + " is successfully Posted and Archived", "Posted");
                                        this.popupVisible = false;
                                        this.router.navigate(['/finance/purchaseinvoicelist']);
                                    } else {
                                        this.toastr.error("Posting Failed, Error Status Code: " + onPostingAccoutStatus[0]);
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
            this.toastr.warning("Balance Should Be Zero!!");
        }
    }

    SalesInvoiceOperationsGo(selected: string) {
        if (selected == 'Print Order') {
            if (this.printLines != null ? Object.keys(this.printLines).length > 0 : false) {
                this.generateStdPDF(this.PurchaseInvoiceDetails, this.printLines, "Purchase Invoice Original");
            } else {
                this.toastr.warning("Please add the Lines!!");
            }
        } else if (selected == 'Post') {
            if (this.isLinesExist == true) {
                this.showInfo();
            }
            else {
                this.toastr.warning("Please add the Lines");
            }
        } else {
            this.toastr.warning("Please Select The Operation");
        }
    }

    getFormatOfNumber(e) {
        return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }

    getBuyFromVendorDetail() {
        this.globalVendorDetailsPopup = true;
    }


    public pdfFormate = {
        HeadTitleFontSize: 18,
        Head2TitleFontSize: 16,
        TitleFontSize: 14,
        SubTitleFontSize: 12,
        NormalFontSize: 10,
        SmallFontSize: 8,
        SetFont: "Garuda",
        SetFontType: "normal",
        NormalSpacing: 12,
        rightStartCol1: 430,
        rightStartCol2: 480,
        InitialstartX: 40,
        startX: 40,
        startXDetails: 100,
        startXcol2: 220,
        startXcol2Details: 280,
        startXcol3: 400,
        startXcol3Details: 460,
        startXcol4: 300,
        startXcol4Details: 360,
        centerX: 238,
        centerBOX: 255,
        InitialstartY: 50,
        startY: 0,
        startTemp: 40,
        lineHeights: 12,
        MarginEndY: 40
    };

    formatNumber(number) {
        number = parseFloat(number).toFixed(2) + '';
        var x = number.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    generateStdPDF(printHeader, printLines, title) {

        printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? Number(printHeader.InvDiscountAmount) : 0;
        printHeader.TotalAmountinWords = this.companyHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
        var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
        if (Number(decimalAsInt) >= 0) {
            if (Number(decimalAsInt) < 10) {
                printHeader.TotalAmountinWords += " and 0" + decimalAsInt + "/100";
            } else {
                printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
            }
        }
        for (var i = 0; i < Object.keys(printLines).length; i++) {
            printLines[i].SnNo = i + 1;
            printHeader.InvDiscountAmount = Number(Number(printHeader.InvDiscountAmount) + Number(printLines[i].LineDiscountAmount));
            printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
            printLines[i].QuantityToInvoice = this.formatNumber(printLines[i].QuantityToInvoice);
            printLines[i].Amount = this.formatNumber(printLines[i].Amount);
            printLines[i].VATPerct = this.formatNumber(printLines[i].VATPerct);
            printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
            printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
            printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
        }
        printHeader.AmountBeforeDisc = this.formatNumber(Number(printHeader.Amount) + Number(printHeader.InvDiscountAmount));
        printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
        printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
        printHeader.Amount = this.formatNumber(printHeader.Amount);

        printHeader = UtilsForSuggestion.StandardValueFormat(printHeader,
            ["PayToName", "PayToAddress", "PayToAddress2", "PayToCity", "PayToZip", "PaymentTerm", "VATID"]);
        printHeader = UtilsForSuggestion.StandardDateFormat(printHeader, ["DocumentDate"]);

        const doc = new jsPDF('p', 'pt', 'a4');

        doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
        doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
        doc.setFont(this.pdfFormate.SetFont);

        if (this.companyHeader["CountryCode"] == 'THA' || this.companyHeader["CountryCode"] == 'SGP') {
            this.PrintReportForTHA(doc, printHeader, printLines, "Delivery Order / Invoice / Tax Invoice ORIGINAL");
        } else {
            this.PrintReportForIND(doc, printHeader, printLines, title);
        }

        doc.save("PurchaseInvoice" + UtilsForGlobalData.retrieveLocalStorageKey('PINumber') + ".pdf");
        this.gridContainer.instance.refresh();
    }


    PrintReportForTHA(doc, printHeader, printLines, title) {
        var tempY = this.pdfFormate.InitialstartY;

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SubTitleFontSize);
        doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
        doc.line(0, tempY += this.pdfFormate.NormalSpacing, 1000, tempY);

        tempY += (this.pdfFormate.NormalSpacing);

        doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 100, 70);
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.City + " " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Tax ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);

        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Name: " + printHeader.PayToName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("DocumentNo: " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Address: " + printHeader.PayToAddress + ", " + printHeader.PayToAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Document Date: " + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.startXcol3, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("" + printHeader.PayToCity + ", " + printHeader.PayToCountry + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        tempY += this.pdfFormate.NormalSpacing;
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);

        doc.autoTable(this.columnHeader1, this.printHeader, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'left'
            }
        });

        tempY = doc.autoTable.previous.finalY + 10;
        const totalPagesExp = "{total_pages_count_string}";

        doc.autoTable(this.columnHeader2, printLines, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'right'
            },
            columnStyles: {
                SnNo: {
                    halign: 'left'
                },
                LineCode: {
                    halign: 'left'
                },
                Description: {
                    halign: 'left',
                    cellWidth: 100
                },
                UOM: {
                    halign: 'left'
                },
                UnitPrice: {
                    halign: 'right'
                },
                QuantityToInvoice: {
                    halign: 'right'
                },
                Amount: {
                    halign: 'right'
                },
                LineDiscountAmount: {
                    halign: 'right'
                },
                VatAmount: {
                    halign: 'right'
                },
                AmountIncludingVAT: {
                    halign: 'right'
                }
            },
            headStyles: {
                fillColor: [64, 139, 202],
                halign: 'left'
            },
            didDrawPage: data => {
                let footerStr = "Page " + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === 'function') {
                    footerStr = footerStr;
                }
                footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
                doc.setFontSize(this.pdfFormate.SmallFontSize);
                doc.text(footerStr, data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }



        //-------Invoice Footer---------------------
        var rightcol1 = 340;
        var rightcol2 = 480;
        doc.setFontType(this.pdfFormate.SetFontType);
        var startY = doc.autoTable.previous.finalY + 30;
        startY = this.calculateThePage(startY, doc);
        doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
        doc.setFontType(this.pdfFormate.SetFontType);

        var startY = doc.autoTable.previous.finalY + 30;
        startY = this.calculateThePage(startY, doc);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Total ", { align: "left" }, rightcol1, (startY));
        doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

        if (Number(printHeader.InvDiscountAmount) > 0) {
            startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
            doc.setFontType(this.pdfFormate.SetFontType);
            doc.textAlign("Discount ( " + printHeader.InvoiceCompoundDiscount + " )", { align: "left" }, rightcol1, startY);
            doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
        }

        doc.setFontType(this.pdfFormate.SetFontType);
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("Amount Exc Tax", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("Tax Amount", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + Number(this.TAX).toFixed(2), { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("Amount Inc Tax", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

        startY += this.pdfFormate.NormalSpacing;
        doc.line(40, startY, 560, startY);

        startY += this.pdfFormate.NormalSpacing;
        startY += this.pdfFormate.NormalSpacing;
        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing
        doc.textAlign("Delivered By:", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("Recieved By", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("Approved By", { align: "left" }, this.pdfFormate.startXcol3, startY);

        startY += this.pdfFormate.NormalSpacing
        doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startXcol3, startY);
    }

    PrintReportForIND(doc, printHeader, printLines, title) {
        var tempY = this.pdfFormate.InitialstartY;

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SubTitleFontSize);
        doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, tempY);
        var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
        doc.line(0, tempY += this.pdfFormate.NormalSpacing, 1000, tempY);

        tempY += (this.pdfFormate.NormalSpacing);
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign(this.companyHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("State Code", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.StateCode, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
        doc.textAlign("Invoice No", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        doc.textAlign(":" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign(this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("GST No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
        doc.textAlign("Invoice Date", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        doc.textAlign(":" + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);


        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign(this.companyHeader.City + " - " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("PAN Number", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.PAN, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
        doc.textAlign("E-Bill", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        doc.textAlign(":", { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
        // doc.textAlign("Cust PO No: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("" + this.companyHeader.CountryName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("IEC Code", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.IEC, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
        // doc.textAlign("PO Date: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

        doc.textAlign(this.companyHeader.HomePage, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Phone No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.Phone, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

        doc.textAlign("CIN: " + this.companyHeader.CIN, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Email", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + this.companyHeader.EMail, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        //box2x2

        var tempX = this.pdfFormate.startX + this.pdfFormate.NormalSpacing;
        doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 2));
        doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + this.pdfFormate.NormalSpacing);//top-hor
        doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2));//left vert
        doc.textAlign("Pay To", { align: "left" }, tempX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
        doc.line(pageEnd, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//left-vert
        doc.line(this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//bottm-hor
        doc.textAlign("Bill To", { align: "left" }, tempX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
        var tempBoxY = tempY;
        var tempYC = tempBoxY;

        /* doc.line(this.pdfFormate.startTemp + 255, tempY - 10, this.pdfFormate.startTemp + 255, tempY + 100);//middle vertical
        doc.line(this.pdfFormate.startTemp, tempY - 10, 550, tempY - 10);//top-hor
        doc.line(this.pdfFormate.startTemp, tempY - 10, this.pdfFormate.startTemp, tempY + 100);//left vert
        doc.textAlign("Pay To", { align: "left" }, this.pdfFormate.startX + 5, tempY + 5);
        doc.line(550, tempY - 10, 550, tempY + 100);//left-vert
        doc.line(this.pdfFormate.startTemp, tempY + 15, 550, tempY + 15);//bottm-hor
        doc.textAlign("Bill To", { align: "left" }, this.pdfFormate.startXcol4, tempY + 5);
        doc.line(this.pdfFormate.startTemp, tempY + 100, 550, tempY + 100); */
        doc.setFontType(this.pdfFormate.SetFontType);

        tempY += this.pdfFormate.NormalSpacing * 2;
        var tempYC = tempY;
        doc.textAlign("Code", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Code", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Name", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        var splitTitle = doc.splitTextToSize(printHeader.PayToName, 200);
        tempY -= this.pdfFormate.NormalSpacing;
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
        }
        doc.textAlign("Name", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        splitTitle = doc.splitTextToSize(printHeader.PayToName, 200);
        tempYC -= this.pdfFormate.NormalSpacing;
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
        }

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Address", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        splitTitle = doc.splitTextToSize(printHeader.PayToAddress, 200);
        tempY -= this.pdfFormate.NormalSpacing;
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
        }
        doc.textAlign("Address", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        splitTitle = doc.splitTextToSize(printHeader.PayToAddress, 200);
        tempYC -= this.pdfFormate.NormalSpacing;
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
        }

        splitTitle = doc.splitTextToSize(printHeader.PayToAddress2, 200);
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
        }
        splitTitle = doc.splitTextToSize(printHeader.PayToAddress2, 200);
        for (var i = 0; i < splitTitle.length; i++) {
            doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
        }

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("City", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.PayToCity + ", " + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.textAlign("City", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.PayToCity + ", " + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Contact", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(": " + this.PayToDetails.Contact, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.textAlign("Contact", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        doc.textAlign(": " + this.PayToDetails.Contact, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Phone", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(": " + this.PayToDetails.Phone, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.textAlign("Phone", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        doc.textAlign(": " + this.PayToDetails.Phone, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Vat ID", { align: "left" }, this.pdfFormate.startX + 5, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.textAlign("Vat ID", { align: "left" }, this.pdfFormate.startXcol4, tempYC += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

        tempY = tempY > tempYC ? tempY : tempYC;

        tempY += 10;
        doc.line(this.pdfFormate.startX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX, tempY);//vert-left
        doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY);//vert-centre
        doc.line(pageEnd, tempBoxY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY);//vert-right
        doc.line(this.pdfFormate.startX, tempY, pageEnd, tempY);


        tempY += this.pdfFormate.NormalSpacing * 2;
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Order No", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign(":" + printHeader.ConnectedOrder, { align: "left" }, this.pdfFormate.startXDetails, tempY);
        doc.textAlign("Due Date", { align: "left" }, this.pdfFormate.startXcol2, tempY);
        doc.textAlign(":" + printHeader.DueDate, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
        // doc.textAlign("Payment Method: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
        // doc.textAlign(printHeader.PaymentMethod, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

        //tempY += this.pdfFormate.NormalSpacing;

        const totalPagesExp = "{total_pages_count_string}";

        doc.autoTable(this.columnHeader2, printLines, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'right'
            },
            columnStyles: {
                SnNo: {
                    halign: 'left'
                },
                LineCode: {
                    halign: 'left'
                },
                Description: {
                    halign: 'left',
                    cellWidth: 100
                },
                UOM: {
                    halign: 'left'
                },
                QuantityToInvoice: {
                    halign: 'right'
                },
                Amount: {
                    halign: 'right'
                },
                VATPerct: {
                    halign: 'right'
                },
                LineDiscountAmount: {
                    halign: 'right'
                },
                VatAmount: {
                    halign: 'right'
                },
                AmountIncludingVAT: {
                    halign: 'right'
                }
            },
            headStyles: {
                fillColor: [64, 139, 202],
                halign: 'left'
            },
            didDrawPage: data => {
                doc.setFontSize(this.pdfFormate.SmallFontSize);
                doc.text("Bank Name : Karnataka Bank Ltd, Bank AcNo : 0647000100245701, IFSC Code : KARB000006", data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        //-------Invoice Footer---------------------
        var rightcol1 = 340;
        var rightcol2 = 480;
        startY += this.pdfFormate.NormalSpacing;
        doc.setFontType(this.pdfFormate.SetFontType);
        var startY = doc.autoTable.previous.finalY;
        doc.line(40, startY, 560, startY);
        var startY = doc.autoTable.previous.finalY + 10;
        startY = this.calculateThePage(startY, doc);
        doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
        doc.setFontType(this.pdfFormate.SetFontType);

        var startY = doc.autoTable.previous.finalY + 30;

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Total Bill Value :", { align: "left" }, rightcol1, (startY));
        doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

        if (Number(printHeader.InvDiscountAmount) > 0) {
            startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
            doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
            doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
        }

        doc.setFontType(this.pdfFormate.SetFontType);
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("Amount Exc Vat :", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("Amount Inc Vat :", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

        startY += this.pdfFormate.NormalSpacing;
        doc.line(40, startY, 560, startY);

        // startY += this.pdfFormate.NormalSpacing;
        // doc.setFontType(this.pdfFormate.SetFontType);
        // doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
        // doc.setLineWidth(1);
        // var inty = startY += this.pdfFormate.NormalSpacing;
        // doc.line(this.pdfFormate.startX, inty, 150, inty);

        startY += this.pdfFormate.NormalSpacing;
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("We Certified that Particulars Above are true and correct, Terms And Conditions Over Leaf ", { align: "left" }, this.pdfFormate.startX, startY);

        startY += this.pdfFormate.NormalSpacing;
        startY += this.pdfFormate.NormalSpacing;
        doc.textAlign("Prepared By:", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("Material Received & Accepted In", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
        doc.textAlign(this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3Details, startY);

        startY += this.pdfFormate.NormalSpacing
        doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("Good Condition", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);

        startY += this.pdfFormate.NormalSpacing
        // doc.textAlign("Phone:", { align: "left" }, this.pdfFormate.startX, startY);
        //doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("" + printHeader.PayToName, { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);

        // startY += this.pdfFormate.NormalSpacing
        //doc.textAlign("Email:", { align: "left" }, this.pdfFormate.startX, startY);
        // doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);

        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing
        startY += this.pdfFormate.NormalSpacing;
        doc.textAlign("Signature", { align: "left" }, this.pdfFormate.startXcol2, startY);
        doc.textAlign("Authorised Signatory", { align: "left" }, this.pdfFormate.startXcol3Details, startY);
    }

    calculateThePage(startY, doc) {
        if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
            doc.addPage();
            doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
            startY = this.pdfFormate.InitialstartY;
        }
        return startY;
    }

}


(function (API) {
    API.textAlign = function (txt, options, x, y) {
        options = options || {};
        // Use the options align property to specify desired text alignment
        // Param x will be ignored if desired text alignment is 'center'.
        // Usage of options can easily extend the function to apply different text
        // styles and sizes

        // Get current font size
        var fontSize = this.internal.getFontSize();

        // Get page width
        var pageWidth = this.internal.pageSize.width;

        // Get the actual text's width
        // You multiply the unit width of your string by your font size and divide
        // by the internal scale factor. The division is necessary
        // for the case where you use units other than 'pt' in the constructor
        // of jsPDF.

        var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

        if (options.align === "center") {

            // Calculate text's x coordinate
            x = (pageWidth - txtWidth) / 2;

        } else if (options.align === "centerAtX") { // center on X value

            x = x - (txtWidth / 2);

        } else if (options.align === "right") {

            x = txtWidth - x;
        } else if (options.align === "left-align") {

            x = this.internal.pageSize.width - 40 - txtWidth;
        } else if (options.align === "right-align") {

            x = x;
        }

        // Draw text at x,y
        /*if(y >= this.internal.pageSize.height - 25){
          this.addPage();
          this.text("Page "+this.internal.getNumberOfPages(), 0, this.internal.pageSize.height - 10);
        } //%(this.internal.pageSize.height - 25)*/
        this.text(txt, x, y);
    };
    /*
        API.textWidth = function(txt) {
            var fontSize = this.internal.getFontSize();
            return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
        };
    */

    API.getLineHeight = function (txt) {
        return this.internal.getLineHeight();
    };

})(jsPDF.API);
