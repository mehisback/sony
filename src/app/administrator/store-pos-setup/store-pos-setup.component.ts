import { Component, OnInit, ViewChild } from '@angular/core';
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
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import * as events from "devextreme/events";
import { DxDataGridComponent } from 'devextreme-angular';
var itemListArray: any = [];

@Component({
    selector: 'app-store-pos-setup',
    templateUrl: './store-pos-setup.component.html',
    styleUrls: ['./store-pos-setup.component.css']
})

export class StorePosSetupComponent implements OnInit {
    @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
    @ViewChild("gridContainer1") gridContainer1: DxDataGridComponent;
    @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
    @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;

    continents: any = {};
    dataSourcePOS: any = {};
    dataSourceTender: any = {};
    dataSourceRetail: any = {};
    StoreID: String = null;
    StoreDetails: any = {};
    POSID: String = null;
    PosDetails: any = {};
    UserID: String = null;
    UserDetails: any = {};
    duplicateRetail: any = [];
    AttributeArray: any;
    currLookUpID: string;
    error: any;
    getStoreVATBus: any;
    getDefaultPriceGroup: any;
    getCustCode: any;
    getStoreLocation: any;
    getStorageUnit: any;
    getIntrasnit: any;
    visiblitySTORE: Boolean = false;
    visiblityPOS: Boolean = false;
    tenderTypeSuggestion: any;
    tenderCodeSuggestion: any;
    tendorTypeGlobal: any;
    getcategory: any;
    getbrand: any;
    abbSalesNoArr: any = {};
    duplicateabbSalesNoArr: any = [];
    abbVoidNoArr: any = {};
    duplicateabbVoidNoArr: any = [];
    recpNoArr: any = {};
    duplicaterecpNoArr: any = [];
    retailuserSuggestions: any;
    groupSuggestion: any;
    areaSuggestion: any;
    subareaSuggestion: any;
    optionSuggestion: any = [{ Code: '0', Name: 'No' }, { Code: '1', Name: 'Yes' }];

    constructor(private dataFromService: DataService,
        public router: Router,
        private toastr: ToastrService) {
        this.setTenderType = this.setTenderType.bind(this);
    }

    ngOnInit() {
        var dummyDataServive = this.dataFromService;
        var thisComponent = this;

        this.continents = new CustomStore({
            key: ["StoreID", "Name"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("storeCard", "getStoreList", [""]).subscribe(data => {
                    for (var i = 0; i < Object.keys(data).length; i++) {
                        data[i]["RequireManageronReturn"] = data[i]["RequireManageronReturn"] == 'Yes' ? true : false;
                        data[i]["RequireManageronCancel"] = data[i]["RequireManageronCancel"] == 'Yes' ? true : false;
                        data[i]["IsConsignmentStore"] = data[i]["IsConsignmentStore"] == 'Yes' ? true : false;
                    }
                    devru.resolve(data);
                });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("newStorePosForm", "validateStore", ["",
                    key["StoreID"]]).subscribe(data => {
                        if (data <= 0) {
                            devru.reject("Error while Deleting the Lines with StoreID: " + key["StoreID"] + ", Error Status Code is DELETE-ERR");
                        } else {
                            devru.resolve(data);
                        }
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                if (values["StoreID"] != null) {
                    dummyDataServive.getServerData("newStorePosForm", "validateStore", ["",
                        values["StoreID"]]).subscribe(dataStatus => {
                            if (Object.keys(dataStatus).length == 0) {
                                dummyDataServive.getServerData("newStorePosForm", "insertStore", ["",
                                    values["StoreID"]]).subscribe(dataStatus => {
                                        if (dataStatus == 'DONE') {
                                            devru.resolve(dataStatus);
                                        } else {
                                            devru.reject("Error while Adding the Store : " + values["StoreID"] + ", Error Status Code is INSERT-ERR");
                                        }
                                    });
                            } else {
                                devru.reject("Store Already Exists : " + values["StoreID"]);
                            }
                        });
                } else {
                    devru.resolve();
                }
                return devru.promise();
            }
        });

        this.dataSourcePOS = new CustomStore({
            key: ["POSID", "Name"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("storeCard", "openPosTerminals", ["",
                    thisComponent.StoreID]).subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                if (values["POSID"] != null) {
                    dummyDataServive.getServerData("newStorePosForm", "validatePos", ["",
                        thisComponent.StoreID,
                        values["POSID"]]).subscribe(dataStatus => {
                            if (Object.keys(dataStatus).length == 0) {
                                dummyDataServive.getServerData("newStorePosForm", "insertPos", ["",
                                    values["POSID"],
                                    thisComponent.StoreID]).subscribe(dataStatus => {
                                        if (dataStatus > 0) {
                                            devru.resolve(dataStatus);
                                        } else {
                                            devru.reject("Error while Adding the POSID : " + values["POSID"] + ", Error Status Code is INSERT-ERR");
                                        }
                                    });
                            } else {
                                devru.reject("POSID Already Exists : " + values["POSID"]);
                            }
                        });
                } else
                    devru.resolve();
                return devru.promise();
            }
        });

        this.dataSourceTender = new CustomStore({
            key: ["TenderType", "TenderCode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("StoreTender", "getStoreTenderList", ["",
                    thisComponent.StoreID]).subscribe(data => {
                        devru.resolve(data);
                    });
                thisComponent.dataFromService.getServerData("StoreTender", "getAllTenderCards", [''])
                    .subscribe(getTenderMasterList => {
                        thisComponent.tenderCodeSuggestion = {
                            paginate: true,
                            pageSize: 20,
                            loadMode: "raw",
                            load: () => <String[]>getTenderMasterList
                        }
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("StoreTender", "btnDelete_clickHandler", ["",
                    thisComponent.StoreID, key["TenderCode"]]).subscribe(data => {
                        if (data <= 0) {
                            devru.reject("Error while Deleting the Lines with TenderCode: " + key["TenderCode"] + ", Error Status Code is DELETE-ERR");
                        } else {
                            devru.resolve(data);
                        }
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                for (var i = 0; i < Object.keys(thisComponent.tendorTypeGlobal).length; i++) {
                    if (thisComponent.tendorTypeGlobal[i].TenderType == values["TenderType"]) {
                        thisComponent.tendorTypeGlobal[i].PromptforNo = thisComponent.tendorTypeGlobal[i].PromptforNo ? thisComponent.tendorTypeGlobal[i].PromptforNo : '';
                        thisComponent.tendorTypeGlobal[i].PromptText = thisComponent.tendorTypeGlobal[i].PromptText ? thisComponent.tendorTypeGlobal[i].PromptText : '';
                        dummyDataServive.getServerData("StoreTender", "btnSave_clickHandler", ["",
                            thisComponent.StoreID, values["TenderCode"], values["TenderType"],
                            thisComponent.tendorTypeGlobal[i].Name, thisComponent.tendorTypeGlobal[i].PromptforNo,
                            thisComponent.tendorTypeGlobal[i].PromptText,
                            values["FloatTender"], values["ChangeAllowed"]]).subscribe(dataStatus => {
                                if (dataStatus > 0) {
                                    devru.resolve(dataStatus);
                                } else {
                                    devru.reject("Error while Adding the TenderCode : " + values["TenderCode"] + ", Error Status Code is INSERT-ERR");
                                }
                            });
                        break;
                    }
                }
                return devru.promise();
            }
        });

        this.dataSourceRetail = new CustomStore({
            key: ["UserID"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                dummyDataServive.getServerData("retailUsers", "getRetailUserList", ["",
                    thisComponent.StoreID, thisComponent.POSID]).subscribe(data => {
                        for (var i = 0; i < Object.keys(data).length; i++) {
                            data[i]["CanReturn"] = data[i]["CanReturn"] == 'Yes' ? true : false;
                            data[i]["CanCancel"] = data[i]["CanCancel"] == 'Yes' ? true : false;
                            data[i]["CanFloatTender"] = data[i]["CanFloatTender"] == '1' ? true : false;
                            data[i]["CanRemoveTender"] = data[i]["CanRemoveTender"] == '1' ? true : false;
                            data[i]["CanChangePrice"] = data[i]["CanChangePrice"] == 'Yes' ? true : false;
                            data[i]["NeedManagertoChangePrice"] = data[i]["NeedManagertoChangePrice"] == 'Yes' ? true : false;
                            data[i]["IsPriceChangeManager"] = data[i]["IsPriceChangeManager"] == 'Yes' ? true : false;
                        }
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                if (values["UserID"] != null) {
                    dummyDataServive.getServerData("retailUsers", "validateNewUser", ["",
                        thisComponent.StoreID, thisComponent.POSID,
                        values["UserID"]]).subscribe(dataStatus => {
                            if (Object.keys(dataStatus).length == 0) {
                                dummyDataServive.getServerData("retailUsers", "inserRetailUser", ["",
                                    values["UserID"],
                                    thisComponent.StoreID,
                                    thisComponent.POSID]).subscribe(dataStatus => {
                                        if (dataStatus > 0) {
                                            devru.resolve(dataStatus);
                                        } else {
                                            devru.reject("Error while Adding the UserID : " + values["UserID"] + ", Error Status Code is INSERT-ERR");
                                        }
                                    });
                            } else {
                                devru.reject("UserID Already Exists : " + values["UserID"]);
                            }
                        });
                } else
                    devru.resolve();
                return devru.promise();
            }
        });

        function getUpdateValues(key, newValues, field): String {
            return (newValues[field] == null) ? key[field] : newValues[field];
        }

        this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", [''])
            .subscribe(getStoreVATBus => {
                this.getStoreVATBus = new DataSource({
                    store: <String[]>getStoreVATBus,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("globalLookup", "handleConnectedcustPriceGrp", [''])
            .subscribe(getDefaultPriceGroup => {
                this.getDefaultPriceGroup = new DataSource({
                    store: <String[]>getDefaultPriceGroup,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("globalLookup", "handleConnectedcust", [''])
            .subscribe(getCustCode => {
                this.getCustCode = new DataSource({
                    store: <String[]>getCustCode,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("wmsMasterLookUp", "Location", [''])
            .subscribe(getStoreLocation => {
                this.getStoreLocation = new DataSource({
                    store: <String[]>getStoreLocation,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("wmsMasterLookUp", "DepositInTransitCode", [''])
            .subscribe(getIntrasnit => {
                this.getIntrasnit = new DataSource({
                    store: <String[]>getIntrasnit,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("StoreTender", "getTenderMasterList", [''])
            .subscribe(getTenderMasterList => {
                this.tenderTypeSuggestion = {
                    paginate: true,
                    pageSize: 20,
                    loadMode: "raw",
                    load: () => <String[]>getTenderMasterList
                }
                this.tendorTypeGlobal = getTenderMasterList;
            });

        this.dataFromService.getServerData("globalLookup", "handleConnectedbrand", [''])
            .subscribe(getIntrasnit => {
                this.getbrand = new DataSource({
                    store: <String[]>getIntrasnit,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("globalLookup", "handleConnectedcategory", [''])
            .subscribe(getIntrasnit => {
                this.getcategory = new DataSource({
                    store: <String[]>getIntrasnit,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("StoreGroupArea", "getGroups", [''])
            .subscribe(groupSuggestion => {
                this.groupSuggestion = new DataSource({
                    store: <String[]>groupSuggestion,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("StoreGroupArea", "getArea", [''])
            .subscribe(areaSuggestion => {
                this.areaSuggestion = new DataSource({
                    store: <String[]>areaSuggestion,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.dataFromService.getServerData("globalLookup", "handleConnectedusers",
            ['']).subscribe(users => {
                this.retailuserSuggestions = {
                    paginate: true,
                    pageSize: 10,
                    loadMode: "raw",
                    load: () => <String[]>users
                }
            });

    }

    suggestionFormatForStoreVATBus(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
    }

    hoverFormatForStoreVATBus(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description")
    }

    suggestionFormatForPriceGroup(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "SalesCode", "Description");
    }

    hoverFormatForPriceGroup(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "SalesCode", "Description")
    }

    suggestionFormatForCustCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
    }

    hoverFormatForStoreCustCode(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name")
    }

    suggestionFormatForBrandCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "BrandCode", "Description");
    }

    hoverFormatForStoreBrandCode(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "BrandCode", "Description")
    }

    suggestionFormatForCategory(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
    }

    hoverFormatForCategory(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description")
    }

    suggestionFormatForCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
    }

    hoverFormatForCode(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name")
    }

    suggestionFormatForUser(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "userid");
    }

    hoverFormatForStoreUser(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "userid", "userName");
    }

    suggestionFormateForType(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "TenderType");
    }

    suggestionFormateForCode(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
    }

    suggestionFormatForGroup(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "GroupCode", "Description");
    }

    hoverFormatForGroup(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "GroupCode", "Description");
    }

    onDropDownvalueChanged(e, dataField) {
        if (e.value != null) {
            if (dataField == "StoreLocation") {
                this.dataFromService.getServerData("wmsMasterLookUp", "LocationStorageUnit", ['',
                    e.value]).subscribe(getStorageUnit => {
                        this.getStorageUnit = new DataSource({
                            store: <String[]>getStorageUnit,
                            paginate: true,
                            pageSize: 20
                        });
                    });
            }
            else if (dataField == "StoreGroup" || dataField == "SubAreaCode") {
                if (dataField == "StoreGroup") {
                    for (var index = 0; index < this.groupSuggestion._store._array.length; ++index) {
                        if (this.groupSuggestion._store._array[index].GroupCode == e.value) {
                            this.StoreDetails["DefaultPriceGroup"] = this.groupSuggestion._store._array[index].PriceGroup;
                            break;
                        }
                    }
                } else if (dataField == "SubAreaCode") {
                    for (var index = 0; index < this.subareaSuggestion._store._array.length; ++index) {
                        if (this.subareaSuggestion._store._array[index].Code == e.value) {
                            this.StoreDetails["DefaultPriceGroup"] = this.subareaSuggestion._store._array[index].PriceGroup;
                            break;
                        }
                    }
                }
            }
            else if (dataField == "AreaCode") {
                this.dataFromService.getServerData("StoreGroupArea", "getSubArea", ['',
                    this.StoreDetails.AreaCode])
                    .subscribe(subareaSuggestion => {
                        this.subareaSuggestion = new DataSource({
                            store: <String[]>subareaSuggestion,
                            paginate: true,
                            pageSize: 20
                        });
                    });
            }
            else if (dataField == 'BrandFilter' || dataField == 'CategoryFilter') {
                if (this.UserDetails[dataField] != e.value) {
                    this.dataFromService.getServerData("retailUsers", "updateRetailUser", ["",
                        dataField, e.value,
                        this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.errorHandlingToaster(dataStatus);
                        });
                }
            }
            if (dataField == "StoreVATBus_Post_Gr" || dataField == "DefaultPriceGroup" || dataField == "Def_CustCode" ||
                dataField == "StoreLocation" || dataField == "StoreDefaultStoageUnit" || dataField == "StoreDefaultIntransit" ||
                dataField == "AreaCode" || dataField == "SubAreaCode" || dataField == "StoreGroup") {
                this.StoreDetails[dataField] = e.value;
            }
        }
    }

    transform(time: any, index: any): any {
        if (time != null) {
            try {
                time = time.toLocaleTimeString('it-IT');
            } catch (Error) {
                time = time;
            }
        } else
            time = '00:00:00';
        return (time.split(':'))[index];
    }

    onUserRowSelect(event) {
        this.StoreID = event.data.StoreID;
        var hours = this.transform(event.data["StoreOpenfrom"], 0);
        var minute = this.transform(event.data["StoreOpenfrom"], 1);
        event.data["StoreOpenfrom"] = new Date(1111, 1, hours, minute);
        var hours = this.transform(event.data["StoreOpento"], 0);
        var minute = this.transform(event.data["StoreOpento"], 1);
        event.data["StoreOpento"] = new Date(1111, 1, hours, minute);
        this.StoreDetails = event.data;
        this.visiblitySTORE = true;
        this.visiblityPOS = false;
        this.dataFromService.getServerData("wmsMasterLookUp", "LocationStorageUnit", ['',
            this.StoreDetails.StoreLocation])
            .subscribe(getStorageUnit => {
                this.getStorageUnit = new DataSource({
                    store: <String[]>getStorageUnit,
                    paginate: true,
                    pageSize: 20
                });
            });
        this.dataFromService.getServerData("StoreGroupArea", "getSubArea", ['',
            this.StoreDetails.AreaCode])
            .subscribe(subareaSuggestion => {
                this.subareaSuggestion = new DataSource({
                    store: <String[]>subareaSuggestion,
                    paginate: true,
                    pageSize: 20
                });
            });
        this.POSID = null;
        this.UserID = null;
        this.gridContainer1 ? this.gridContainer1.instance.refresh() : '';
        this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
        this.gridContainer3 ? this.gridContainer3.instance.refresh() : '';
        //this.UserDetails = null;
    }

    onUserRowSelect2(event) {
        this.POSID = event.data.POSID;
        this.PosDetails = event.data;
        this.getRecpNoSeriesSetup();
        this.getAbbNoVoidSetup();
        this.getAbbNoSalesSetup();

        this.visiblitySTORE = false;
        this.visiblityPOS = true;
        this.gridContainer3 ? this.gridContainer3.instance.refresh() : '';
        this.UserID = null;
        //this.UserDetails = null;
    }

    onUserRowSelect3(event) {
        this.UserID = event.data.UserID;
        this.UserDetails = event.data;
        var result = [];
        result.push(this.UserDetails);
        this.assignToDuplicate(result);
        this.visiblitySTORE = false;
        this.visiblityPOS = true;
    }

    getAbbNoSalesSetup() {
        this.dataFromService.getServerData("storeCard", "getAbbNoSalesSetup", ['',
            this.StoreID, this.POSID]).subscribe(result => {
                this.assignToDuplicate2(result);
                if (Object.keys(result).length > 0)
                    this.abbSalesNoArr = result[0];
            });
    }

    getAbbNoVoidSetup() {
        this.dataFromService.getServerData("storeCard", "getAbbNoVoidSetup", ['',
            this.StoreID, this.POSID]).subscribe(result => {
                this.assignToDuplicate3(result);
                if (Object.keys(result).length > 0)
                    this.abbVoidNoArr = result[0];
            });
    }

    getRecpNoSeriesSetup() {
        this.dataFromService.getServerData("storeCard", "getRecpNoSeriesSetup", ['',
            this.StoreID, this.POSID]).subscribe(result => {
                this.assignToDuplicate4(result);
                if (Object.keys(result).length > 0)
                    this.recpNoArr = result[0];
            });
    }

    onTabChange(event) {
        if (!this.StoreID) {
            event.preventDefault();
            this.toastr.warning("Please Select The Store!!");
        }
    }

    onCellPrepared(e) {
        if (e.rowType == "data" && e.column.command == "edit") {
            let cellElement = e.cellElement,
                cancelLink = cellElement.querySelector(".dx-link-cancel"),
                saveLink = cellElement.querySelector(".dx-link-save");
            events.on(cancelLink, "dxclick", (args) => {
                this.gridContainer1.instance.refresh();
            });
            events.on(saveLink, "dxclick", (args) => {
            });
        }
    };

    onTabChangePOSDetais(event) {
        if (!this.POSID) {
            event.preventDefault();
            this.toastr.warning("Please Select The POS Terminal!!");
        }
    }

    update() {
        var time1: String = this.StoreDetails.StoreOpenfrom.toLocaleTimeString('it-IT');
        var time2: String = this.StoreDetails.StoreOpento.toLocaleTimeString('it-IT');
        var consStore: String = (this.StoreDetails.IsConsignmentStore == true) ? 'Yes' : 'No';
        var RequireManageronReturnString: String = (this.StoreDetails.RequireManageronReturn == true) ? 'Yes' : 'No';
        var RequireManageronCancelString: String = (this.StoreDetails.RequireManageronCancel == true) ? 'Yes' : 'No';
        this.dataFromService.getServerData("storeCard", "saveStoreValues", ['',
            this.StoreDetails.Name, this.StoreDetails.Address, this.StoreDetails.Address2, this.StoreDetails.Address3,
            this.StoreDetails.City, this.StoreDetails.PostCode, this.StoreDetails.StoreManagerName, time1,
            time2, this.StoreDetails.PhoneNo, this.StoreDetails.FaxNo, this.StoreDetails.StoreVATBus_Post_Gr,
            this.StoreDetails.ReturnTenderType, this.StoreDetails.ChangeTender, this.StoreDetails.ReturnBefore, this.StoreDetails.Def_CustCode,
            RequireManageronReturnString, RequireManageronCancelString, this.StoreDetails.StoreDefaultStoageUnit,
            this.StoreDetails.StoreLocation, this.StoreDetails.StoreDefaultIntransit, consStore, this.StoreDetails.DefaultPriceGroup,
            this.StoreID]).subscribe(dataStatus => {
                this.dataFromService.getServerData("StoreGroupArea", "btnSave_clickHandler", ['',
                    this.StoreDetails.StoreGroup, this.StoreDetails.AreaCode, this.StoreDetails.SubAreaCode,
                    this.StoreDetails.DefaultPriceGroup,
                    this.StoreID]).subscribe(dataStatus => {
                        this.dataFromService.getServerData("storeCard", "updateRetailUsersStore", ['',
                            this.StoreID]).subscribe(dataStatus => {
                                this.gridContainer.instance.refresh();
                                this.errorHandlingToaster(dataStatus);
                            });
                    });
            });
    }

    UpdatePOS() {
        this.dataFromService.getServerData("storeCard", "updatePos", ['',
            this.PosDetails.Description, this.PosDetails.Placement,
            this.StoreID, this.POSID]).subscribe(dataStatus => {
                if (dataStatus > 0) {
                    this.dataFromService.getServerData("storeCard", "updateRetailUsersPos", ['',
                        this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.errorHandlingToaster(dataStatus);
                        });
                }
            });
    }

    errorHandlingToaster(dataStatus) {
        if (dataStatus >= 0) {
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
        }
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

    setTenderType(newData, value, currentData): void {
        newData.TenderType = value;
        currentData.TenderType = value;
        this.dataFromService.getServerData("StoreTender", "getTenderCards", ['', value])
            .subscribe(getTenderMasterList => {
                this.tenderCodeSuggestion = {
                    paginate: true,
                    pageSize: 20,
                    loadMode: "raw",
                    load: () => <String[]>getTenderMasterList
                }
            });
    }

    assignToDuplicate(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicateRetail = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicateRetail["" + i] = {};
            for (var prop in data[i]) {
                this.duplicateRetail[i][prop] = data[i][prop];
            }
        }
    }

    assignToDuplicate2(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicateabbSalesNoArr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicateabbSalesNoArr = [];
            this.duplicateabbSalesNoArr["" + i] = {};
            for (var prop in data[i]) {
                this.duplicateabbSalesNoArr[i][prop] = data[i][prop];
            }
        }
    }

    assignToDuplicate3(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicateabbVoidNoArr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicateabbVoidNoArr = [];
            this.duplicateabbVoidNoArr["" + i] = {};
            for (var prop in data[i]) {
                this.duplicateabbVoidNoArr[i][prop] = data[i][prop];
            }
        }
    }

    assignToDuplicate4(data) {
        // copy properties from Customer to duplicateSalesHeader
        this.duplicaterecpNoArr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.duplicaterecpNoArr = [];
            this.duplicaterecpNoArr["" + i] = {};
            for (var prop in data[i]) {
                this.duplicaterecpNoArr[i][prop] = data[i][prop];
            }
        }
    }

    formPOS_fieldDataChanged1(e) {
        if (e.dataField == 'prefix') {
            if (Object.keys(this.duplicaterecpNoArr).length > 0 ? this.duplicaterecpNoArr[0][e.dataField] != e.value : e.value != null) {
                if (Object.keys(this.duplicaterecpNoArr).length == 0) {
                    this.dataFromService.getServerData("storeCard", "updateRecpNoSeriesIns", ["",
                        e.value,
                        this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.getRecpNoSeriesSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                } else {
                    this.dataFromService.getServerData("storeCard", "updateRecpNoSeriesUpd", ["",
                        e.value, this.StoreID,
                        this.POSID, this.duplicaterecpNoArr[0][e.dataField]]).subscribe(dataStatus => {
                            this.getRecpNoSeriesSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                }
            }
        }
    }

    formPOS_fieldDataChanged2(e) {
        if (e.dataField == 'prefix') {
            if (Object.keys(this.duplicateabbVoidNoArr).length > 0 ? this.duplicateabbVoidNoArr[0][e.dataField] != e.value : e.value != null) {
                if (Object.keys(this.duplicateabbVoidNoArr).length == 0) {
                    this.dataFromService.getServerData("storeCard", "updateAbbVoidSeriesIns", ["",
                        e.value,
                        this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.getAbbNoVoidSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                } else {
                    this.dataFromService.getServerData("storeCard", "updateAbbVoidSeriesUpd", ["",
                        e.value, this.StoreID,
                        this.POSID, this.duplicateabbVoidNoArr[0][e.dataField]]).subscribe(dataStatus => {
                            this.getAbbNoSalesSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                }
            }
        }
    }

    formPOS_fieldDataChanged3(e) {
        if (e.dataField == 'prefix') {
            if (Object.keys(this.duplicateabbSalesNoArr).length > 0 ? this.duplicateabbSalesNoArr[0][e.dataField] != e.value : e.value != null) {
                if (Object.keys(this.duplicateabbSalesNoArr).length == 0) {
                    this.dataFromService.getServerData("storeCard", "updateAbbNoSeriesIns", ["",
                        e.value,
                        this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.getAbbNoSalesSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                } else {
                    this.dataFromService.getServerData("storeCard", "updateAbbNoSeriesUpd", ["",
                        e.value, this.StoreID,
                        this.POSID, this.duplicateabbSalesNoArr[0][e.dataField]]).subscribe(dataStatus => {
                            this.getAbbNoSalesSetup();
                            this.errorHandlingToaster(dataStatus);
                        });
                }
            }
        }
    }

    formSummary_fieldDataChanged(e) {
        if (this.duplicateRetail.length > 0 ? this.duplicateRetail[0][e.dataField] != e.value : false) {
            if (this.checkUserIDSelected()) {
                if (e.dataField == 'CanReturn' || e.dataField == 'CanCancel') {
                    var temp = (e.value == true ? 'Yes' : 'No');
                    this.duplicateRetail[0][e.dataField] == e.value;
                    this.dataFromService.getServerData("retailUsers", "updateRetailUser", ["",
                        e.dataField, temp,
                        this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.getRetailsUserDetails();
                            this.errorHandlingToaster(dataStatus);
                        });
                }
                else if (e.dataField == 'CanFloatTender' || e.dataField == 'CanRemoveTender') {
                    var temp = (e.value == true ? '1' : '0');
                    this.duplicateRetail[0][e.dataField] == e.value;
                    this.dataFromService.getServerData("retailUsers", "updateRetailUser", ["",
                        e.dataField, temp,
                        this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                            this.getRetailsUserDetails();
                            this.errorHandlingToaster(dataStatus);
                        });
                }
                else if (e.dataField == 'CanChangePrice') {
                    var temp = (e.value == true ? 'Yes' : 'No');
                    this.duplicateRetail[0][e.dataField] == e.value;
                    if (e.value) {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans1", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    } else {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans2", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    }
                }
                else if (e.dataField == 'NeedManagertoChangePrice') {
                    var temp = (e.value == true ? 'Yes' : 'No');
                    this.duplicateRetail[0][e.dataField] == e.value;
                    if (e.value) {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans3", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    } else {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans4", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    }
                }
                else if (e.dataField == 'IsPriceChangeManager') {
                    var temp = (e.value == true ? 'Yes' : 'No');
                    this.duplicateRetail[0][e.dataField] == e.value;
                    if (e.value) {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans5", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    } else {
                        this.dataFromService.getServerData("retailUsers", "saveBooleans6", ["",
                            this.UserID, this.StoreID, this.POSID]).subscribe(dataStatus => {
                                this.getRetailsUserDetails();
                                this.errorHandlingToaster(dataStatus);
                            });
                    }
                }
            }
        }
    }

    checkUserIDSelected(): Boolean {
        if (this.UserID != null) {
            return true;
        } else {
            this.toastr.warning("Please Select the UserID First!!");
            return false;
        }
    }

    getRetailsUserDetails() {
        this.dataFromService.getServerData("retailUsers", "getRetailUserDetails", ["",
            this.StoreID, this.POSID, this.UserID]).subscribe(data => {
                var i = 0;
                data[i]["CanReturn"] = data[i]["CanReturn"] == 'Yes' ? true : false;
                data[i]["CanCancel"] = data[i]["CanCancel"] == 'Yes' ? true : false;
                data[i]["CanFloatTender"] = data[i]["CanFloatTender"] == '1' ? true : false;
                data[i]["CanRemoveTender"] = data[i]["CanRemoveTender"] == '1' ? true : false;
                data[i]["CanChangePrice"] = data[i]["CanChangePrice"] == 'Yes' ? true : false;
                data[i]["NeedManagertoChangePrice"] = data[i]["NeedManagertoChangePrice"] == 'Yes' ? true : false;
                data[i]["IsPriceChangeManager"] = data[i]["IsPriceChangeManager"] == 'Yes' ? true : false;
                this.assignToDuplicate(data);
                this.UserDetails = data[0];
            });
    }

}
