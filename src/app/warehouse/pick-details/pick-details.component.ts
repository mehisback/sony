import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
var jsPDF = require('jspdf');
import * as html2canvas from "html2canvas";
import { PickDetailsHttpDataService } from './pick-details-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { Observable } from 'rxjs';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
import * as events from "devextreme/events";
import { DataService } from '../../data.service';
//import { BluetoothReadServiceService } from '../../Utility/bluetooth-read-service.service';
pickAdhoc: [];


/* @Author Ganesh
/* this is For Pick Order
/* On 07-02-2019
*/


@Component({
    selector: 'app-pick-details',
    templateUrl: './pick-details.component.html',
    styleUrls: ['./pick-details.component.css']
})
export class PickDetailsComponent implements OnInit {
    @ViewChild("gridContainerPL") gridContainerPL: DxDataGridComponent;
    @ViewChild("gridContainerAP") gridContainerAP: DxDataGridComponent;
    @ViewChild("gridContainerPS") gridContainerPS: DxDataGridComponent;
    @ViewChild("gridContainerPA") gridContainerPA: DxDataGridComponent;

    ShiptoDetail: any = {};
    shipToCode: any = {};
    pickHeader: any = {};
    printHeader: any = {};
    duplicatePickHeader: string[];
    companyHeader: any = {};
    PickNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PickNumber');
    ShipFromSuggestions: any = {};
    SOForSuggestions: any = {};
    dataSource: any = {};
    itemListArray: any = {};
    dataSource2: any = [];
    dataSourcePICKSUGG: any = {};
    printPICKSUGG: any = {};
    dataSourcePICKADH: any = {};
    dataSourcePICKADHQuantityToPick: any = [];
    dataSourcePICKHH: any = {};
    dataSourcePICKHH2: any = [];
    looseArr: any = {};
    dataSourcePICKAUTO: any = {};
    PickFlowResult: boolean = false;
    isPickLinesAdded: boolean = false;
    shippinglabelpopup: boolean = false;
    autoPickLinesOperation: any = [];
    printPickLine: any;
    printPickHeader: any;
    reqQty: Number = 0.00;
    codefromLAZO: string;
    refreshTokenofLazofromBack: any;
    refreshTimerofLazofromBack: any;
    ifTimerExists: any = 'No';
    countdown: number;
    refreshTokenbackfromLS: any;
    tokenofLazofromBack: any = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    ShipmentMethodFromSuggestions: any;

    columns1 = [
        { title: "SNo", dataKey: "SnNo", width: 40 },
        { title: "ITEM CODE", dataKey: "ItemCode", width: 40 },
        //{ title: "ยี่ห้อ", dataKey: "BrandCode", width: 40 },
        //{ title: "หมวดสินค้า", dataKey: "CategoryCode", width: 40 },
        //{ title: "หมวดย่อย", dataKey: "SubCatcode", width: 40 },
        { title: "DESCRIPTION", dataKey: "Description", width: 40 },
        { title: "UNIT PRICE", dataKey: "SOUnitPrice", width: 40 },
        { title: "SOUOM", dataKey: "SOUOM", width: 40 },
        { title: "SHIPPING QTY", dataKey: "ShippingQty", width: 40 },
    ];
    columns2 = [
        { title: "SNo", dataKey: "SnNo", width: 90 },
        { title: "ItemCode", dataKey: "ItemCode", width: 40 },
        { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
        { title: "Quantity", dataKey: "QtyinBaseUOM", width: 40 },
        { title: "StorageCode", dataKey: "StorageCode", width: 40 },
        { title: "Stock", dataKey: "Stock", width: 40 }
    ];
    columns3 = [
        { title: "SNo", dataKey: "SnNo", width: 90 },
        { title: "ItemCode", dataKey: "ItemCode", width: 40 },
        { title: "LotNo", dataKey: "LotNumber", width: 40 },
        { title: "StorageCode", dataKey: "SUCode", width: 40 },
        { title: "Req Quantity", dataKey: "reqQty", width: 40 },
        { title: "Available", dataKey: "Available", width: 40 },
        { title: "QuantityToPick", dataKey: "QuantityToPick", width: 40 }
    ];
    columHeader1 = [
        { title: "DOCUMENT NO", dataKey: "DocumentNo", width: 40 },
        { title: "DOCUMENT DATE", dataKey: "DocumentDate", width: 40 },
        { title: "SO No.", dataKey: "SourceNo", width: 40 }
    ];

    itemDetails: any = {};
    itemDetailsPopup: Boolean = false;
    popupShipToVendorDetails: Boolean = false;
    globalPOLookupPopup: Boolean = false;
    shippinglabelbackfromLazo: any;
    testbase64code: string;
    flagForInternalShipment: boolean = false;
    APIPickFlag: boolean = false;
    checkforAPIName: any;
    shipmentmethod: any;
    trackingNumber: any;
    shipmentmethodinternal: any;
    checkforAPINameLength: any = [];


    clientID: string;
    mainURL: string;
    currentURL = "https://rhbussupport.com/dist/lazada_script.html";
    serverName: string;

    constructor(
        private httpDataService: PickDetailsHttpDataService,
        private activatedRoute: ActivatedRoute,
        public dataServices: DataService,
        @Inject(DOCUMENT) private document: Document,
        public router: Router,
        private toastr: ToastrService) { }
    //private BluetoothReadServiceService: BluetoothReadServiceService

    ngOnInit() {

        this.httpDataService.getLocationList1([''])
            .subscribe(getLocation => {
                this.ShipFromSuggestions = new DataSource({
                    store: <String[]>getLocation,
                    paginate: true,
                    pageSize: 20
                });
            });

        var thisComponent = this;

        this.dataSource.store = new CustomStore({
            key: ["LineNo", "ItemCode", "Barcode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.fetchOpenHeader();
                thisComponent.httpDataService.openPickLines(["",
                    thisComponent.PickNumber])
                    .subscribe(dataLines => {
                        if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
                            thisComponent.isPickLinesAdded = true;
                        } else {
                            thisComponent.isPickLinesAdded = false;
                        }
                        thisComponent.printPickLine = dataLines;
                        devru.resolve(dataLines);
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                thisComponent.httpDataService.txtScan_enterHandler(["",
                    values["Barcode"],
                    thisComponent.PickNumber]).subscribe(getBarcode => {
                        if ((getBarcode != null ? Object.keys(getBarcode).length > 0 : false)) {
                            thisComponent.httpDataService.onScanHandler(["",
                                thisComponent.PickNumber,
                                thisComponent.pickHeader["DocumentDate"],
                                getBarcode[0]["Barcode"],
                                getBarcode[0]["LineNo"],
                                UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                                    if ((dataStatus[0] == 'DONE')) {
                                        devru.resolve(dataStatus);
                                    } else {
                                        devru.reject("Error while Inserting the Lines with Barcode: " + values["Barcode"] + " Error Status Code : INSERT-ERR");
                                    }
                                });
                        } else {
                            devru.reject("Barcode Not Found while Adding the Lines with Barcode: " + values["Barcode"]);
                        }
                    });
                return devru.promise();
            }
        });

        this.dataSourcePICKSUGG.store = new CustomStore({
            key: ["LineNo", "ItemCode", "Barcode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.getWMSLines(["",
                    thisComponent.PickNumber,
                    UtilsForGlobalData.getCurrentDate()])
                    .subscribe(dataLines => {
                        thisComponent.printPICKSUGG = dataLines;
                        devru.resolve(dataLines);
                    });
                return devru.promise();
            }
        });

        this.dataSourcePICKADH.store = new CustomStore({
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.httpDataService.wmsPickMoveLotgetWMSLines(["",
                    thisComponent.PickNumber,
                    thisComponent.pickHeader["DocumentDate"],
                    thisComponent.pickHeader["LocationCode"]]
                ).subscribe(dataLines => {
                    if (dataLines[0] == 'DONE') {
                        dataLines = dataLines[1];
                        thisComponent.itemListArray = dataLines;
                        if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
                            if (thisComponent.dataSourcePICKADHQuantityToPick.length == 0) {
                                for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                    thisComponent.dataSourcePICKADHQuantityToPick.push({
                                        LotLineNo: dataLines[i].LotLineNo,
                                        LineNo: dataLines[i].LineNo,
                                        QuantityToPick: 0
                                    });
                                }
                            } else {
                                if (thisComponent.dataSourcePICKADHQuantityToPick.length != Object.keys(dataLines).length) {
                                    for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                        thisComponent.dataSourcePICKADHQuantityToPick.push({
                                            LotLineNo: dataLines[i].LotLineNo,
                                            LineNo: dataLines[i].LineNo,
                                            QuantityToPick: 0
                                        });
                                    }
                                }
                            }
                            for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                var newA = thisComponent.dataSourcePICKADHQuantityToPick.filter(function (item) {
                                    return (item["LotLineNo"] == dataLines[i].LotLineNo && item["LineNo"] == dataLines[i].LineNo);
                                });
                                if (newA ? newA.length > 0 : false) {
                                    dataLines[i].QuantityToPick = newA[0].QuantityToPick;
                                } else {
                                    dataLines[i].QuantityToPick = 0;
                                }
                            }
                        }
                    }
                    devru.resolve(dataLines);
                });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                var recQty: Number = Number(key["QuantityToPick"]);
                var avb: Number = 0.00;
                avb = Number(key["Available"]);
                this.reqQty = Number(key["reqQty"]);
                if ((recQty > avb) || (recQty > this.reqQty)) {
                    devru.reject("Quantity Should be less than or Equal Inventory Available & less than or Equal to Pick Quantity!");
                } else if (recQty == 0) {
                    devru.reject("Quantity Should be More than Zero to Move!!");
                } else {
                    thisComponent.httpDataService.button1_clickHandler(["",
                        thisComponent.PickNumber,
                        key["LotNumber"],
                        key["ExpiryDate"],
                        recQty.toString(),
                        key["LineNo"],
                        UtilsForGlobalData.getUserId(),
                        key["OriginDate"],
                        key["SUCode"]]).subscribe(dataStatus => {
                            if (dataStatus[0] != 'DONE') {
                                devru.reject("Pick Move Failed! with Error Status Code :" + dataStatus[0]);
                            } else {
                                for (var index = 0; index < thisComponent.itemListArray.length; ++index) {
                                    if (thisComponent.itemListArray[index].LotLineNo == key.LotLineNo && thisComponent.itemListArray[index].LineNo == key.LineNo) {
                                        thisComponent.dataSourcePICKADHQuantityToPick[index].QuantityToPick = 0;
                                        thisComponent.itemListArray[index].QuantityToPick = 0;
                                        break;
                                    }
                                }
                                thisComponent.toastr.success("Pick Moved successfully, for ItemCode :" + key["ItemCode"] + " Lot :" + key["LotNumber"]);
                                devru.resolve(dataStatus);
                            }
                        });
                }
                return devru.promise();
            },
            update: function (key, newValues) {
                var devru = $.Deferred();
                for (var index = 0; index < thisComponent.itemListArray.length; ++index) {
                    if (thisComponent.itemListArray[index].LotLineNo == key.LotLineNo && thisComponent.itemListArray[index].LineNo == key.LineNo) {
                        thisComponent.dataSourcePICKADHQuantityToPick[index].QuantityToPick = newValues.QuantityToPick;
                        thisComponent.itemListArray[index].QuantityToPick = newValues.QuantityToPick;
                        break;
                    }
                }
                devru.resolve();
                return devru.promise();
            }
        });

        this.dataSourcePICKHH.store = new CustomStore({
            load: function (loadOptions) {
                var devru1 = $.Deferred();
                thisComponent.httpDataService.getAdhocLines(["",
                    thisComponent.PickNumber])
                    .subscribe(dataLines => {
                        if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
                            for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                dataLines[i].PickedQty = (dataLines[i].PickedQty != null) ? dataLines[i].PickedQty : 0;
                            }
                        }
                        devru1.resolve(dataLines);
                    });
                return devru1.promise();
            }
        });

        this.dataSourcePICKAUTO.store = new CustomStore({
            key: ["ItemCode", "BaseUOM"],
            load: function (loadOptions) {
                var devru1 = $.Deferred();
                thisComponent.httpDataService.getPickLot(["",
                    thisComponent.PickNumber])
                    .subscribe(dataLines => {
                        if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
                            thisComponent.autoPickLinesOperation = ['Undo'];
                        } else {
                            thisComponent.autoPickLinesOperation = ['Allocate Lot'];
                        }
                        devru1.resolve(dataLines);
                    });
                return devru1.promise();
            }
        });

        this.httpDataService.getCompanyInfo()
            .subscribe(companyData => {
                this.companyHeader = companyData[0];
            });

        function getUpdateValues(key, newValues, field): String {
            return newValues[field] ? newValues[field] : key[field];
        }

    }

    getPickSource() {
        this.httpDataService.getSource(['', this.pickHeader["SourceNo"]])
            .subscribe(getSource => {
                this.checkforAPINameLength = getSource;
                this.checkforAPIName = getSource[0];
                if (Object.keys(getSource).length > 0) {
                    if (getSource[0]["SourceType"] == "API") {
                        this.APIPickFlag = false;
                        this.fetchShipmentmethodfromLazada();
                    } else {
                        this.APIPickFlag = true;
                    }
                } else {
                    this.APIPickFlag = true;
                }

            });
    }

    fetchShipmentmethodfromLazada() {
        this.httpDataService.ShipmentMethodFromSuggestions(['',
            UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO")])
            .subscribe(Method => {
                this.ShipmentMethodFromSuggestions = new DataSource({
                    store: <String[]>Method["data"]["shipment_providers"],
                    paginate: true,
                    pageSize: 20
                });
            });
    }

    fetchOpenHeader() {
        this.httpDataService.openPickOrder(["",
            this.PickNumber]).subscribe(gotPickDetails => {
                if (gotPickDetails[0]["InternalShipmentType"] == 'Y') {
                    gotPickDetails[0]["InternalShipmentType"] = true;
                    this.flagForInternalShipment = true;
                } else {
                    gotPickDetails[0]["InternalShipmentType"] = false;
                    this.flagForInternalShipment = false;
                }
                this.assignToDuplicate(gotPickDetails);
                this.pickHeader = gotPickDetails[0];
                this.printHeader = gotPickDetails;
                this.getPickSource();
                this.httpDataService.getCustomerCard(["", this.pickHeader["ShiptoCode"]])
                    .subscribe(GotCustDetail => {
                        this.ShiptoDetail = GotCustDetail[0];
                    });
            });

    }

    assignToDuplicate(data) {
        // copy properties from Customer to duplicatePickHeader
        this.duplicatePickHeader = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicatePickHeader["" + i] = {};
            for (var prop in data[i]) {
                this.duplicatePickHeader[i][prop] = data[i][prop];
            }
        }
    }

    onLocationCodeChanged(event) {
        if (this.duplicatePickHeader[0]["LocationCode"] != event.value) {
            if (event.value == null) {
                this.httpDataService.btnClearLoc_clickHandler(["",
                    this.PickNumber]).subscribe(callData3 => {
                        this.fetchOpenHeader();
                    });
            } else {
                var json = this.ShipFromSuggestions == null ? {} : this.ShipFromSuggestions._store._array;
                for (var index = 0; index < json.length; ++index) {
                    if (json[index].LocationCode == event.value) {
                        this.httpDataService.handleLocation(["",
                            event.value,
                            json[index].DefPickStorage,
                            this.PickNumber]).subscribe(dataStatus => {
                                this.errorHandlingToasterForUPDATESTATUS(dataStatus);
                            });
                        break;
                    }
                }
            }
        }
    }

    onShipmentMethodChanged(event) {
        this.shipmentmethod = event.value;

        this.httpDataService.genralPickUpdate(["",
            this.PickNumber,
            this.shipmentmethod, "ShipmentMethodCode"]).subscribe(dataStatus => {
                this.errorHandlingToasterForUPDATE(dataStatus);
            });
    }

    onShipmentMethodChanged2(event) {
        this.shipmentmethodinternal = event.value;

        this.httpDataService.genralPickUpdate(["",
            this.PickNumber,
            this.shipmentmethodinternal, "ShipmentMethodCode"]).subscribe(dataStatus => {
                this.errorHandlingToasterForUPDATE(dataStatus);
            });
    }

    SOLookupClicked() {
        if (this.pickHeader["LocationCode"] ? this.pickHeader["LocationCode"] != '' : false) {
            this.globalPOLookupPopup = true;
            this.httpDataService.getAllSalesOrder(['',
                this.pickHeader["LocationCode"],
                this.pickHeader["DocumentDate"]]).subscribe(getSalesOrder => {
                    this.SOForSuggestions = getSalesOrder;
                });
        } else {
            this.toastr.warning("Please Select the Location Code !!");
        }
    }

    purchaseOrderOnClicked(event) {
        this.globalPOLookupPopup = false;
        if (this.pickHeader["LocationCode"] ? this.pickHeader["LocationCode"] != '' : false) {
            this.httpDataService.handleSOLookUp(['',
                this.PickNumber,
                event.data.DocumentNo,
                this.pickHeader["LocationCode"],
                this.pickHeader["DefPickStorage"]]).subscribe(dataStatus => {
                    if (dataStatus[0] == 'COMPLETED') {
                        this.fetchOpenHeader();
                        this.gridContainerPL ? this.gridContainerPL.instance.refresh() : '';
                        this.gridContainerPS ? this.gridContainerPS.instance.refresh() : '';
                        this.gridContainerPA ? this.gridContainerPA.instance.refresh() : '';
                    } else {
                        this.toastr.error("Error While Adding SO, Error Status Code: " + dataStatus[0]);
                    }
                });
        } else {
            this.toastr.warning("Please Select The Location Code");
        }

    }

    checkforParams() {
        this.activatedRoute.queryParams.subscribe(params => {
            const code = params['code'];
            if (code == 'Yes') {
                this.openShippingLabelpop("shipmentmethod");
            }
        });
    }

    formSummary_fieldDataChanged(e) {
        if ((e.value != undefined || e.value != null) && this.duplicatePickHeader[0][e.dataField] != e.value) {
            var temp = e.value;
            if (e.dataField == "InternalShipmentType") {
                temp = e.value ? 'Y' : 'N';
                if (e.value == false) {
                    if (this.checkforAPIName["RefName"] == "LAZADA") {
                        this.codefromLAZO = localStorage.getItem('tokenLAZO');
                        if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
                            this.openShippingLabelpop("shipmentmethod");
                        } else {
                            this.fetchShipmentmethodfromLazada();
                        }
                    } else {

                    }
                }
                this.ngOnInit();
            }
            if (e.dataField == 'DocumentDate') {
                this.httpDataService.DocumentDate_changeHandler(["",
                    this.PickNumber,
                    e.value]).subscribe(dataStatus => {
                        this.errorHandlingToasterForUPDATE(dataStatus);
                    });
            } else {
                this.httpDataService.genralPickUpdate(["",
                    this.PickNumber,
                    temp, e.dataField]).subscribe(dataStatus => {
                        this.errorHandlingToasterForUPDATE(dataStatus);
                    });
            }
        }
    }

    onVendorDetailsFieldsChanges(e) {
        if ((e.value != undefined || e.value != null) && this.duplicatePickHeader[0][e.dataField] != e.value) {
            this.httpDataService.genralPickUpdate(["", this.PickNumber,
                e.dataField, e.value]).subscribe(dataStatus => {
                    this.errorHandlingToasterForUPDATE(dataStatus);
                });
        }
    }

    errorHandlingToaster(dataStatus) {
        if (dataStatus[0] == "DONE") {
            this.fetchOpenHeader();
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
        }
    }

    errorHandlingToasterForUPDATE(dataStatus) {
        if (dataStatus >= 0) {
            this.fetchOpenHeader();
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
        }
    }

    errorHandlingToasterForUPDATESTATUS(dataStatus) {
        if (dataStatus == true) {
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
        }
        this.fetchOpenHeader();
    }

    getTasksdataSourcePICKHH2(key) {
        var thisComponent = this;
        let item = this.dataSourcePICKHH2.find((i) => i.key === key);
        if (!item) {
            item = {
                key: key,
                dataSourceInstance: new DataSource({
                    store: new CustomStore({
                        key: ["ItemCode"],
                        load: function (loadOptions) {
                            var devru = $.Deferred();
                            thisComponent.httpDataService.looseDG_itemClickHandler(["",
                                thisComponent.PickNumber,
                                key["ItemCode"]]).subscribe(dataLines => {
                                    thisComponent.looseArr = dataLines;
                                    devru.resolve(dataLines);
                                });
                            return devru.promise();
                        },
                        remove: function (key) {
                            var devru = $.Deferred();
                            thisComponent.httpDataService.deleteLine(["", key["LineNo"],
                                thisComponent.PickNumber]).subscribe(data => {
                                    if (data <= 0) {
                                        devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
                                    } else {
                                        devru.resolve(data);
                                    }
                                });
                            return devru.promise();
                        }
                    })
                })
            };
            this.dataSourcePICKHH2.push(item);
        }
        return item.dataSourceInstance;
    }

    getTasksdataSource(key) {
        var thisComponent = this;
        let item = this.dataSource2.find((i) => i.key === key);
        if (!item) {
            item = {
                key: key,
                dataSourceInstance: new DataSource({
                    store: new CustomStore({
                        key: ["LineNo"],
                        load: function (loadOptions) {
                            var devru = $.Deferred();
                            thisComponent.httpDataService.getAllRecords(["",
                                thisComponent.PickNumber,
                                key.LineNo]).subscribe(dataStatus => {
                                    devru.resolve(dataStatus);
                                });
                            return devru.promise();
                        }
                    })
                })
            };
            this.dataSource2.push(item);
        }
        return item.dataSourceInstance;
    }

    getSelectedOptionLines(key: string): any {
        this.httpDataService.looseDG_itemClickHandler(['',
            this.PickNumber,
            key]).subscribe(dataLines => {
                return dataLines;
            });
    }

    hover1(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerName");
    }

    suggestionFormateForLocationCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
    }

    hoverFormateForLocationCode(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
    }

    suggestionFormateForShipmentMethod(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "name");
    }

    hoverFormateForShipmentMethod(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "cod", "name");
    }

    suggestionFormateForSalesOrder(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerName");
    }

    getFormatOfNumber(e) {
        return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }
    
    onTabChange(event: NgbTabChangeEvent) {
        if (!this.isPickLinesAdded) {
            event.preventDefault();
            this.toastr.warning("Please Select The Location Code and Sales Order for the Lines");
        }
        if (event.nextId == 'Auto Pick') {
            //if (this.companyHeader["OneSUperLocation"] == 'Yes') {
            this.httpDataService.btnAutoPick_clickHandler(['',
                this.PickNumber])
                .subscribe(dataStatus => {
                    if (dataStatus[0].suCount == 0) {
                        this.gridContainerAP.instance.refresh();
                    } else {
                        this.toastr.success("Items with NO Storeage Unit codes associted identified in " + dataStatus[0].suCount + "  line(s).Please complete Setup!!");
                    }
                });
            /* } else {
              event.preventDefault();
              this.toastr.warning("Single Storage Unit Code Must be Yes for Auto pick");
            } */
        }
    }

    fetchforPickAuto() {
        var dummyThis = this;

    }

    valueChanged(event) {
        /* data.value = data.value >= 0 ? data.value : "0";
        event.key["QuantityToPick"] = data.value;*/
        var that = this;
        setTimeout(function () {
            that.PickAdHAction(event);
        }, 2000);
    }

    onCellPrepared(e) {
        if (e.rowType == "data" && e.column.command == "edit") {
            let cellElement = e.cellElement,
                deleteLink = cellElement.querySelector(".dx-link-delete");
            events.on(deleteLink, "dxclick", (args) => {
                var newA = e.row.cells.filter(function (item) {
                    return (Number(item["text"]) != item.value && item["isEditing"] == true);
                });
                if (newA ? newA.length > 0 : false) {
                    this.gridContainerPA.instance.cellValue(e.rowIndex, "QuantityToPick", newA[0].value)
                    this.gridContainerPA.instance.saveEditData();
                    this.gridContainerPA.instance.cancelEditData();
                    /* this.gridContainerPA.instance.beginUpdate();
                    this.gridContainerPA.instance.endUpdate(); */
                    this.gridContainerPA.instance.refresh();
                }

            });
        }
    };

    setBaseUOMValueItemCode(newData, value, currentData): void {
        newData.QuantityToPick = value;
        (<any>this).defaultSetCellValue(newData, value);
    }

    onRowUpdated(e, type) {
        if (type == 'RowUpdated') {
            this.gridContainerPA.instance.option("allowDeleting", true);
            //this.gridContainerPA.editing.allowDeleting = true;
        } else {
            this.gridContainerPA.instance.option("allowDeleting", false);
            //this.gridContainerPA.editing.allowDeleting = false;
        }
    }

    PickAdHAction(event) {
        if (event.key["QuantityToPick"]) {
            for (var index = 0; index < this.itemListArray.length; ++index) {
                if (this.itemListArray[index].LotLineNo == event.key.LotLineNo) {
                    event.key["QuantityToPick"] = this.dataSourcePICKADHQuantityToPick[index];
                    this.dataSourcePICKADHQuantityToPick[index] = 0;
                    break;
                }
            }
            var recQty: Number = Number(event.key["QuantityToPick"]);
            var avb: Number = 0.00;
            avb = Number(event.key["Available"]);
            this.reqQty = Number(event.key["reqQty"]);
            if ((recQty > avb) || (recQty > this.reqQty)) {
                this.toastr.error("Quantity Should be less than Equal Inventory Available & less than Equal Pick Quantity");
            } else if (recQty == 0) {
                this.toastr.warning("Quantity Should be More Than Zero to Move");
            }
            else { //gan : wmspickbylot -> parameter : fromSuCode
                this.httpDataService.button1_clickHandler(["",
                    this.PickNumber,
                    event.key["LotNumber"],
                    event.key["ExpiryDate"],
                    recQty.toString(),
                    event.key["LineNo"],
                    UtilsForGlobalData.getUserId(),
                    event.key["OriginDate"], event.key["SUCode"]]).subscribe(dataStatus => {
                        if (dataStatus[0] != 'DONE') {
                            this.toastr.error("Pack Move Failed! with Error Status Code :" + dataStatus[0], "Failed");
                        } else {
                            this.toastr.success("Pack Move Successfully!");
                        }
                        for (var index = 0; index < this.itemListArray.length; ++index) {
                            if (this.itemListArray[index].LineNo == event.key["LineNo"]) {
                                this.dataSourcePICKADHQuantityToPick[index] = 0;
                                break;
                            }
                        }
                        this.gridContainerPA.instance.refresh();
                    });
            }
        }
    }

    PickOrderOperationsGo(selected: string) {
        if (selected == 'Post Ship') {
            this.checkForZeroShipping();
        } else if (selected == 'Print Order') {
            if (this.isPickLinesAdded) {
                this.httpDataService.openPickLines(["",
                    this.PickNumber])
                    .subscribe(dataLines => {
                        this.generateStdPDF(this.pickHeader, dataLines, this.columns1, "Pick / Delivery Information");
                    });
            } else {
                this.toastr.warning("There is No Lines To Print!!");
            }
        } else if (selected == 'Print Suggestions') {
            if (this.printPICKSUGG != null ? Object.keys(this.printPICKSUGG).length > 0 : false) {
                this.generateStdPDF(this.pickHeader, this.printPICKSUGG, this.columns2, "Pick Suggestions");
            } else {
                this.toastr.warning("There is No Lines To Print!!");
            }
        } else if (selected == 'Print Suggestion') {
            if (this.itemListArray != null ? Object.keys(this.itemListArray).length > 0 : false) {
                this.generateStdPDF(this.pickHeader, this.itemListArray, this.columns3, "Pick Adhoc");
            } else {
                this.toastr.warning("There is No Lines To Print!!");
            }
        } else if (selected == 'Confirm') {
            this.PickFromHandHeldConfirm();
        } else if (selected == 'Print Shipping Label') {
            this.openShippingLabelpop("label");
        } else if (selected == 'Allocate Lot') {
            this.PickAutoAllocateLot();
        } else if (selected == 'Undo') {
            this.PickAutoUndo();
        } else {
            this.toastr.warning("Please Select The Operation");
        }
    }

    OpenPopup(event) {
        var width = 500;
        var height = 600;
        var left = 0;
        var top = 0;
        const options = `width=${width},height=${height},left=${left},top=${top}`;

        if (this.document.location.hostname == 'localhost') {
            this.serverName = 'http://localhost:4200';
        } else if (this.document.location.hostname == '27.254.172.167') {
            this.serverName = 'http://27.254.172.167/dist';
        } else if (this.document.location.hostname == 'rhbuscloud.com') {
            this.serverName = 'https://rhbuscloud.com/';
        } else if (this.document.location.hostname == 'rhbussupport.com') {
            this.serverName = 'https://rhbussupport.com/dist';
        } else if (this.document.location.hostname == 'rihbus.com') {
            this.serverName = 'https://rihbus.com';
        } else {
            this.serverName = "https://" + this.document.location.hostname;
        }

        this.currentURL = this.serverName + "/assets/js/lazada_script.html";

        this.dataServices.getServerData("lazadaAuth", "getAppKey", [""])
            .subscribe(getAppKey => {
                this.clientID = getAppKey[0]["AppKey"];
                this.currentURL = this.currentURL + "?id=" + this.clientID;
                localStorage.setItem('LazobackURL', this.router.url);
                var that = this;
                window.addEventListener('storage', function (e) {
                    that.openShippingLabelpop(event);
                });
                window.open(this.currentURL, 'lazada', options);
            });

    }

    openShippingLabelpop(event) {
        this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
        if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
            this.OpenPopup(event);
        } else {
            this.generateAccessToken(event);
        }
    }

    generateAccessToken(event) {
        if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.httpDataService.generateAccessToken(["", this.codefromLAZO])
                .subscribe(generateAccessToken => {
                    this.tokenofLazofromBack = generateAccessToken["access_token"];
                    this.refreshTokenofLazofromBack = generateAccessToken["refresh_expires_in"];
                    this.refreshTimerofLazofromBack = generateAccessToken["refresh_token"];
                    UtilsForGlobalData.setLocalStorageKey("refresh_token", this.refreshTimerofLazofromBack);
                    UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
                    this.startCountdownTimer(this.refreshTokenofLazofromBack);
                    this.getshippinglabelsfromlazo();
                });
        } else {
            if (event == 'label') {
                this.getshippinglabelsfromlazo();
            } else if (event == 'shipmentmethod') {
                this.fetchShipmentmethodfromLazada();
            }

        }
    }


    getshippinglabelsfromlazo() {
        this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
        if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.generateAccessToken("label");
        } else {
            this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
            this.httpDataService.getDocument(["", this.tokenofLazofromBack, this.pickHeader["SourceNo"]])
                .subscribe(getOrders => {
                    this.shippinglabelbackfromLazo = getOrders["data"]["document"]["file"];
                    this.shippinglabelbackfromLazo = decodeURIComponent(atob(this.shippinglabelbackfromLazo).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    this.printShippinglabelfromHTML(this.shippinglabelbackfromLazo);
                });
        }
    }

    printShippinglabelfromHTML(html) {
        let printContents, popupWin;
        printContents = html;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <head>
        </head>
        <body onload="window.print();">${printContents}</body>
        </html>`
        );
    }

    startCountdownTimer(timer) {
        this.ifTimerExists = UtilsForGlobalData.retrieveLocalStorageKey("timerLazo");
        if (this.ifTimerExists == 'No' || this.ifTimerExists == '' || this.ifTimerExists == undefined || this.ifTimerExists == null) {
            UtilsForGlobalData.setLocalStorageKey("timerLazo", 'Yes');
            const interval = 1000;
            const duration = timer;
            const stream$ = Observable.timer(0, interval)
                .finally(() => this.timerfinish())
                .takeUntil(Observable.timer(duration + interval))
                .map(value => duration - value * interval);
            stream$.subscribe(value => {
                this.countdown = value;
            });
        }
    }

    timerfinish() {
        UtilsForGlobalData.setLocalStorageKey("timerLazo", 'No');
        this.refreshTokenbackfromLS = UtilsForGlobalData.retrieveLocalStorageKey("refresh_token");
        this.httpDataService.refreshAccessToken(["", this.refreshTokenbackfromLS])
            .subscribe(refreshAccessToken => {
                this.tokenofLazofromBack = refreshAccessToken["access_token"];
                this.refreshTokenofLazofromBack = refreshAccessToken["refresh_expires_in"];
                this.refreshTimerofLazofromBack = refreshAccessToken["refresh_token"];
                UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
                this.startCountdownTimer(this.refreshTokenofLazofromBack);
            });

    }

    PickAutoAllocateLot() {
        this.httpDataService.createPickLot(['',
            this.PickNumber,
            UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                if (dataStatus == 'DONE') {
                    this.gridContainerAP.instance.refresh();
                } else {
                    this.toastr.error("Something Went Wrong!! Error Status Code: " + dataStatus);
                }
            });
    }

    PickAutoUndo() {
        if (this.isPickLinesAdded) {
            this.httpDataService.btnUndo_clickHandler(['',
                this.PickNumber,
                UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                    this.dataSourcePICKADHQuantityToPick = [];
                    this.gridContainerAP.instance.refresh();
                });
        } else {
            this.toastr.warning("There is No Suggestion Lines!!");
        }
    }

    PickFromHandHeldConfirm() {
        if (this.checkQuantity()) {
            this.httpDataService.PickMovebutton1_clickHandler(['',
                this.PickNumber,
                UtilsForGlobalData.getUserId(),
                'No',
                this.pickHeader["DocumentDate"]]).subscribe(dataStatus => {
                    if (dataStatus[0] != 'MOVED') {
                        this.toastr.error("Confirm Failed! with Error Status Code :" + dataStatus[0], "Failed");
                    } else {
                        this.toastr.success("Status Updated Succesfully", "Confirmed");
                    }
                });
        }
    }

    checkQuantity(): Boolean {
        var qtyOk: Boolean = true;
        var totQty: Number = 0;
        if ((this.looseArr != null ? Object.keys(this.looseArr).length > 0 : false)) {
            for (var i = 0; i < Object.keys(this.looseArr).length; i++) {
                if (Number(this.looseArr[i].PickedQty) > Number(this.looseArr[i].PickQty)) {
                    qtyOk = false;
                    this.toastr.warning("Picked Qty. Can't be more than Requested Qty for Item " + this.looseArr[i].ItemCode, " NOT ALLOWED!");
                    return false;
                }
                totQty = Number(totQty) + Number(this.looseArr[i].PickedQty);
            }
            if (totQty == 0) {
                qtyOk = false;
                this.toastr.warning("There is Nothing to Confirm!");
                return false;
            }
            return qtyOk;
        }
    }

    checkForZeroShipping() {
        this.httpDataService.checkForZeroShipping(['',
            this.PickNumber]).subscribe(dataStatus => {
                if (dataStatus != null ? Object.keys(dataStatus).length > 0 : false) {
                    if (dataStatus[0].qty > 0) {
                        if (Object.keys(this.checkforAPINameLength).length > 0) {
                            if (this.checkforAPIName["SourceType"] == "API") {
                                if (this.checkforAPIName["RefName"] == "LAZADA") {
                                    if (this.duplicatePickHeader[0]["ShipmentMethodCode"] == '' || this.duplicatePickHeader[0]["ShipmentMethodCode"] == undefined || this.duplicatePickHeader[0]["ShipmentMethodCode"] == null) {
                                        this.toastr.error("Shipment method cannot be Blank!");
                                    } else {
                                        if (this.duplicatePickHeader[0]["TrackingID"] == '' || this.duplicatePickHeader[0]["TrackingID"] == undefined || this.duplicatePickHeader[0]["TrackingID"] == null) {
                                            this.toastr.error("Tracking ID cannot be Blank!");
                                        } else {
                                            this.httpDataService.SetStatusToReadyToShip(["",
                                                UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO"),
                                                this.pickHeader["SourceNo"],
                                                this.shipmentmethod,
                                                this.duplicatePickHeader[0]["TrackingID"]]).subscribe(SetStatusToReadyToShip => {
                                                    if (SetStatusToReadyToShip["data"] == undefined) {
                                                        this.toastr.error(SetStatusToReadyToShip["message"]);
                                                    } else {
                                                        this.httpDataService.postPickProcedure(['',
                                                            this.PickNumber,
                                                            this.pickHeader["DefPickStorage"],
                                                            this.pickHeader["SourceNo"],
                                                            this.pickHeader["DocumentDate"],
                                                            UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                                                                if (dataStatus[0] == 'POSTED') {
                                                                    this.router.navigate(['/warehouse/pick-list']);
                                                                    this.toastr.success("Pick Order " + this.PickNumber + " is successfully Posted and Archived", "Posted");
                                                                } else {
                                                                    this.toastr.error("Posting Failed! with Error status Code :" + dataStatus[0], "Try again");
                                                                }
                                                            });
                                                    }
                                                });


                                        }
                                    }
                                }
                            } else {
                                this.httpDataService.postPickProcedure(['',
                                    this.PickNumber,
                                    this.pickHeader["DefPickStorage"],
                                    this.pickHeader["SourceNo"],
                                    this.pickHeader["DocumentDate"],
                                    UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                                        if (dataStatus[0] == 'POSTED') {
                                            this.toastr.success("Pick Order " + this.PickNumber + " is successfully Posted and Archived", "Posted");
                                            this.router.navigate(['/warehouse/pick-list']);
                                        } else {
                                            this.toastr.error("Posting Failed! with Error status Code :" + dataStatus[0], "Try again");
                                        }
                                    });
                            }
                        } else {
                            this.httpDataService.postPickProcedure(['',
                                this.PickNumber,
                                this.pickHeader["DefPickStorage"],
                                this.pickHeader["SourceNo"],
                                this.pickHeader["DocumentDate"],
                                UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                                    if (dataStatus[0] == 'POSTED') {
                                        this.toastr.success("Pick Order " + this.PickNumber + " is successfully Posted and Archived", "Posted");
                                        this.router.navigate(['/warehouse/pick-list']);
                                    } else {
                                        this.toastr.error("Posting Failed! with Error status Code :" + dataStatus[0], "Try again");
                                    }
                                });
                        }
                    }
                    else {
                        this.toastr.warning("There is Nothing to Post", "Post Ship");
                    }
                }
            });
    }

    ItemDeatilsForPopUp(data) {
        this.itemDetails = data.data;
        this.itemDetails = UtilsForSuggestion.StandartNumberFormat(this.itemDetails, ["SOUnitPrice"]);
        this.itemDetailsPopup = true;
    }

    getShipToVendorDetail() {
        if (this.shipmentmethod == null || this.shipmentmethod == '' || this.shipmentmethod == undefined) {
            this.toastr.error("Please select Shipment Method");
        } else {
            this.httpDataService.SetStatusToPackedByMarketplace(["",
                UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO"),
                this.pickHeader["SourceNo"],
                this.shipmentmethod]).subscribe(dataStatus => {
                    this.trackingNumber = dataStatus["data"]["order_items"][0]["tracking_number"];
                    if (dataStatus["data"] == undefined) {
                        this.toastr.error(dataStatus["message"]);
                    } else {
                        this.httpDataService.genralPickUpdate(["",
                            this.PickNumber,
                            this.trackingNumber, "TrackingID"]).subscribe(dataStatus => {
                                this.errorHandlingToasterForUPDATE(dataStatus);
                            });
                    }
                });
        }

    }

    getShipToVendorDetail2() {
        this.popupShipToVendorDetails = true;
    }

    /* async onButtonClick(e) {
        try {
            navigator.bluetooth.requestDevice(
                { filters: [{ services: ['battery_service'] }] })
                .then(device => {
                    console.log('Connecting to GATT Server...');
                    return device.gatt.connect();
                })
                .then(server => {
                    console.log('Getting Battery Service...');
                    return server.getPrimaryService('battery_service');
                })
                .then(service => {
                    console.log('Getting Battery Level Characteristic...');
                    return service.getCharacteristic('battery_level');
                })
                .then(characteristic => {
                    console.log('Reading Battery Level...');
                    return characteristic.readValue();
                })
                .then(value => {
                    console.log(value);
                    let batteryLevel = value.getUint8(0);
                    this.gridContainerPA.instance.cellValue(e.rowIndex, "QuantityToPick", batteryLevel);
                    //console.log('> Battery Level is ' + batteryLevel + '%');
                    for (var index = 0; index < this.itemListArray.length; ++index) {
                        if (this.itemListArray[index].LotLineNo == e.key.LotLineNo && this.itemListArray[index].LineNo == e.key.LineNo) {
                            this.dataSourcePICKADHQuantityToPick[index].QuantityToPick = batteryLevel;
                            this.itemListArray[index].QuantityToPick = batteryLevel;
                            break;
                        }
                    }
                })
                .catch(error => {
                    console.log('Argh! ' + error);
                });
        } catch (error) {
            console.log('' + error);
        }
        /* try {
            console.log(e);
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{services: ['battery_service']}]});
        
                console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();
        
            console.log('Getting Battery Service...');
            const service = await server.getPrimaryService('battery_service');
        
            console.log('Getting Battery Level Characteristic...');
            const characteristic = await service.getCharacteristic('battery_level');
        
            console.log('Reading Battery Level...');
            const value = await characteristic.readValue();
        
            console.log('> Battery Level is ' + value.getUint8(0) + '%');
          } catch(error) {
            console.log('Argh! ' + error);
          } 
    } */

    public pdfFormate = {
        HeadTitleFontSize: 18,
        Head2TitleFontSize: 16,
        TitleFontSize: 14,
        SubTitleFontSize: 12,
        NormalFontSize: 10,
        SmallFontSize: 8,
        SetFont: "Garuda-Bold",
        SetFontType: "normal",
        NormalSpacing: 12,
        rightStartCol1: 420,
        rightStartCol2: 480,
        InitialstartX: 40,
        startX: 40,
        startXcol3: 400,
        InitialstartY: 50,
        startY: 0,
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

    generateStdPDF(printHeader, printLines, columHeader, title) {

        printHeader.TotalQty = 0;
        printHeader.BaseTotalQty = 0;
        printHeader.GrandTotalQty = 0;
        printHeader.ShippedTotalQty = 0;
        printHeader.SOTotalQty = 0;
        printHeader.RemarksExternalPrint = printHeader.RemarksExternal == null ? '' : printHeader.RemarksExternal;
        for (var i = 0; i < Object.keys(printLines).length; i++) {
            printLines[i].SnNo = i + 1;
            if (title == "Pick / Delivery Information") {
                printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
                printHeader.TotalQty = Number(printHeader.TotalQty) + Number(printLines[i].ShippingQty);
                printHeader.SOTotalQty = Number(printHeader.SOTotalQty) + Number(printLines[i].QtyinSOUOM);
                printHeader.ShippedTotalQty = Number(printHeader.ShippedTotalQty) + Number(printLines[i].ShippingQty);
                printHeader.GrandTotalQty = printHeader.TotalQty;
                printLines[i].SOUnitPrice = this.formatNumber(printLines[i].SOUnitPrice);
                printLines[i].ShippingQty = this.formatNumber(printLines[i].ShippingQty);
            } else if (title == "Pick Suggestions") {
                printLines[i].Stock = this.formatNumber(printLines[i].Stock);
                printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
                printHeader.SOTotalQty = Number(printHeader.SOTotalQty) + Number(printLines[i].QtyinSOUOM);
                printHeader.ShippedTotalQty = Number(printHeader.ShippedTotalQty) + Number(printLines[i].QtyinBaseUOM);
                printLines[i].QtyinBaseUOM = this.formatNumber(printLines[i].QtyinBaseUOM);
            } else if (title == "Pick Adhoc") {
                printLines[i].reqQty = this.formatNumber(printLines[i].reqQty);
                printLines[i].Available = this.formatNumber(printLines[i].Available);
                printLines[i].QuantityToPick = this.formatNumber(printLines[i].QuantityToPick);
            }
        }
        const doc = new jsPDF('p', 'pt', 'a4');


        doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
        doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
        doc.setFont(this.pdfFormate.SetFont);

        var tempY = this.pdfFormate.InitialstartY;

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SubTitleFontSize);
        doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY + 5);
        var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
        doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);

        tempY += (this.pdfFormate.NormalSpacing);
        doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 85, 50);
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.City + " " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Tax ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);

        /* doc.setFont(this.pdfFormate.SetFont);
         doc.setFontType(this.pdfFormate.SetFontType);
         doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);*/
        tempY += this.pdfFormate.NormalSpacing;
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("SHIP TO ", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("SHIP FROM ", { align: "left" }, this.pdfFormate.startXcol3, tempY);


        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("" + printHeader.ShiptoName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Location Code  : " + printHeader.LocationCode, { align: "left" }, this.pdfFormate.startXcol3, tempY);

        doc.textAlign("" + printHeader.ShiptoAddress, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("SU CODE         : " + printHeader.DefPickStorage, { align: "left" }, this.pdfFormate.startXcol3, tempY);

        doc.textAlign("" + printHeader.ShiptoAddress2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Handled By      : " + printHeader.HandledBy, { align: "left" }, this.pdfFormate.startXcol3, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("" + printHeader.ShiptoCity + " " + printHeader.ShiptoPostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.textAlign("Phone No.: " + this.ShiptoDetail.Phone, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Tax ID: " + this.ShiptoDetail.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        tempY += this.pdfFormate.NormalSpacing;
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);

        doc.autoTable(this.columHeader1, this.printHeader, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'left'
            }
        });


        tempY = doc.autoTable.previous.finalY + 10;
        const totalPagesExp = "{total_pages_count_string}";

        doc.autoTable(columHeader, printLines, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'left'
            },
            columnStyles: {
                SnNo: {
                    halign: 'left'
                },
                ItemCode: {
                    halign: 'left'
                },
                Description: {
                    halign: 'left'
                },
                SOUnitPrice: {
                    halign: 'right'
                },
                SOUOM: {
                    halign: 'right'
                },
                ShippingQty: {
                    halign: 'right'
                }
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
        var startY = doc.autoTable.previous.finalY + 5;
        doc.setDrawColor(0, 0, 0);
        doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
        doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("REMARK:" + printHeader.RemarksExternalPrint, { align: "left" }, this.pdfFormate.startX, startY);

        doc.setFontType(this.pdfFormate.SetFontType);
        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("TOTAL S.O. QTY:", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.SOTotalQty, { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("TOTAL SHIP QTY: ", { align: "left" }, rightcol1, startY);
        doc.textAlign("" + printHeader.ShippedTotalQty, { align: "right-align" }, rightcol2, startY);

        startY += this.pdfFormate.NormalSpacing * 2;
        doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("Approved By       ", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 3, doc);
        doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startX, startY);
        doc.textAlign("____/____/____", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

        doc.save("PickOrder" + this.PickNumber + ".pdf");
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
        } else if (options.align === "right-align") {

            x = this.internal.pageSize.width - 40 - txtWidth;
        } else if (options.align === "right-align") {

            x = x;
        } else if (options.align === "right-align-toleft") {
            if (410 + txtWidth > this.internal.pageSize.width - 40) {
                x = this.internal.pageSize.width - 40 - txtWidth;
            } else
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
