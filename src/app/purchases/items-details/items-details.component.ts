import { Component, ViewChild, ChangeDetectorRef, ɵConsole, Inject } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { DatePipe, DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
var jsPDF = require('jspdf');
import * as html2canvas from "html2canvas";
let variable = require('../../../assets/js/rhbusfont.json');
import { DomSanitizer } from '@angular/platform-browser';
import { ItemDetailsHttpDataService } from './item-details-http-data.service';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { updateBinding } from '@angular/core/src/render3/instructions';
import { confirm } from 'devextreme/ui/dialog';
import '../../globals';
import '../../../assets/js/comboTreePlugin';
import { Observable } from 'rxjs';
import { DataService } from '../../data.service';

var barcodeDetailInit: any = [];
@Component({
    selector: 'app-items-details',
    templateUrl: './items-details.component.html',
    styleUrls: ['./items-details.component.css'],
    providers: [DatePipe]
})
export class ItemsDetailsComponent {
    @ViewChild(DxFormComponent) formWidget: DxFormComponent;
    @ViewChild("barcodegridContainer") gridContainer: DxDataGridComponent;
    @ViewChild("itempricegridContainer") itempricegridContainer: DxDataGridComponent;
    @ViewChild("gridContainerSU") gridContainerSU: DxDataGridComponent;
    @ViewChild("gridContainerICR") gridContainerICR: DxDataGridComponent;

    clientID: string;
    mainURL: string;
    currentURL = "https://rhbussupport.com/dist/lazada_script.html";
    serverName: string;

    currentRate: number;
    itemCode: string = UtilsForGlobalData.retrieveLocalStorageKey('ItemCode');
    formData: any = { min: 0, max: 500 };
    dataSource: any = [];
    suCodeList: any = [];
    barcodeDetail: any = [];
    itemIntegrationData: any = {};
    getTheItemLookup = ['LAZADA', 'WOOCOMMERCE', 'SHOPIFY', 'SHOPEE'];
    LazadaWarrantyLookup = ["No Warranty", "Local Manufacturer Warranty", "Warranty by Service Provider", "International Manufacturer Warranty", "Warranty by Seller", "Warranty Available", "Refurbish Warranty by Seller"];
    newCustomerDetail: any = [];
    newBarcodeDetails: any = {};
    ItemDetails: [] = null;
    woocommerceDetails: any = {};
    ItemIntegrationDetails: any;
    baseUOMList: [] = null;
    costDetails: {};
    updateItemSuCode: any = {};
    baseUomForThisItem: any = {};
    fifoCostForThisItem: any = {};
    avgCostDetails: {} = null;
    deleteSUCode: any;
    itemFamilySuggestions: any = null;
    itemSizeSuggestions: any = null;
    itemColorSuggestions: any = null;
    itemBaseUOMSuggestions: any = null;
    itemBaseUOMSuggestionsForDataGrid: any = null;
    itemPurchUOMSuggestions: any = null;
    itemSalesUOMSuggestions: any = null;
    itemPolicySuggestions: any = null;
    itemVatGroupSuggestions: any = null;
    bseUOMListSuggestions: any = null;
    itemSUCodeSuggestions: any = null;
    transData: {} = null;
    myDate: any = new Date();
    popupVisible: boolean = false
    popupVisible2: boolean = false;
    show: boolean = false;
    showbase: boolean = false;
    editMode: boolean = false;
    transDaysNumber = 0;
    visiblity: boolean = true;
    LOTDetail: Object;
    storageUnitData: any = {};
    selectedSuCode: String;
    addNewBarcodepopupVisible: boolean = false;
    barcodeSelected: boolean = false;
    dataBarcodeQuantityToPrint: any = [];
    isAutoBarcode: boolean = true;
    isDivVisible: boolean = false;
    popupVisibleAvgCost: boolean = false;
    popupVisibleFifo: boolean = false;
    defaultVisible: boolean = false;
    ShopifyDetails: any = {};
    LazadaDetails: any = {};
    shopeeDetails: any = {};
    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        barThickness: 10
    };

    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any = [];
    public barChartColors: Array<any> = [
        { backgroundColor: '#55ce63' },
        { backgroundColor: '#009efb' }
    ];
    itemArray: { paginate: boolean; pageSize: number; loadMode: string; load: () => String[]; };
    popupVisibleUnitPrice: boolean = false;
    itemPriceDetail: DataSource;
    base64image: any;
    CustImageData: any;
    itemImageData: any;
    itemimagePath: any;
    jsonSchema: JSON;
    valueforJson: any;
    keyforJson: any;
    getitemcrossreference: any;
    woocommercepopup: boolean = false;
    woocommerceCategorySuggestions: any;
    woocommerceSubCategorySuggestions: any;
    itemImageDetails: any = {};
    lazadapopup: boolean = false;
    shopeepopup: boolean = false;
    newCustomerDetail2: {};
    newIntegrationItemAdd: boolean;
    ImportTypeSuggestions: DataSource;
    WOOCOMMERCECreateItem: boolean = false;
    FLIPKARTCreateItem: boolean = false;
    SHOPIFYCreateItem: boolean = false;
    LAZADACreateItem: boolean = false;
    SHOPEECreateItem: boolean = false;
    ShopeeLogistics: DataSource;
    ShopeeCatgories: any;
    currentItem: any;
    waitingDialogue: boolean;
    shopeeLogisticsArray: any = {};
    codefromLAZO: string;
    tokenofLazofromBack: any;
    refreshTokenofLazofromBack: any;
    refreshTimerofLazofromBack: any;
    ifTimerExists: any;
    countdown: number;
    refreshTokenbackfromLS: any;
    brandsFromlazada: Object;
    CategoryFromlazada: Object;
    WooReferenceCode: any;
    ItemIntegrationDetails2: any;

    constructor(
        public router: Router,
        private httpDataService: ItemDetailsHttpDataService,
        private datePipe: DatePipe,
        public dataServices: DataService,
        @Inject(DOCUMENT) private document: Document,
        private toastr: ToastrService,
        public cdRef: ChangeDetectorRef,
        private _sanitizer: DomSanitizer
    ) {
        this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    }

    ngOnInit() {

        var ThisComponent = this;

        this.getImag();
        this.getItemDetails();
        this.getItemImageDetails();
        // this.getItemIntegrationDetails();
        this.getitemcrossreference = new CustomStore({
            key: ["ReferenceCode", "UnitPrice", "Description", "ReferenceType"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                ThisComponent.httpDataService.getitemcrossreferenceDetail(["", ThisComponent.itemCode])
                    .subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            insert: function (values) {
                var devru = $.Deferred();
                if (ThisComponent.itemImageDetails["ItemImageURL"] == "/assets/images/big/img.png") {
                    ThisComponent.toastr.warning("Please upload the image!");
                    devru.resolve();
                } else {
                    if (values["ReferenceType"] == 'WOOCOMMERCE') {
                        ThisComponent.httpDataService.UPDATEHeader(["", "Woocommerce", "Yes", ThisComponent.itemCode])
                            .subscribe(UPDATEHeader => {
                                if (UPDATEHeader == 1) {
                                    ThisComponent.httpDataService.woo_createProducts(["",
                                        ThisComponent.ItemDetails["ItemCode"],
                                        'simple',
                                        values["UnitPrice"],
                                        values["Description"],
                                        '',
                                        ThisComponent.itemImageDetails["ItemImageURL"]])
                                        .subscribe(getStatus => {
                                            ThisComponent.ItemIntegrationDetails = getStatus;
                                            ThisComponent.toastr.success("Item Added successfully, With the Id : " + getStatus.id);
                                            ThisComponent.httpDataService.INSERTNewItemcrossreference(["",
                                                ThisComponent.ItemDetails["ItemCode"],
                                                "WOOCOMMERCE",
                                                ThisComponent.ItemIntegrationDetails.permalink,
                                                ThisComponent.ItemIntegrationDetails.id,
                                                ThisComponent.ItemIntegrationDetails.name,
                                                ThisComponent.ItemIntegrationDetails.price])
                                                .subscribe(INSERTNewItemcrossreference => {
                                                    if (INSERTNewItemcrossreference == 1) {
                                                        devru.resolve(INSERTNewItemcrossreference);
                                                    } else {
                                                        devru.reject("Error while Inserting the Lines with ReferenceCode: " + values["ReferenceCode"] + ", Error Status Code is Insert Error");
                                                    }
                                                });
                                        });
                                } else {
                                    this.toastr.error("Something went wrong. Please try again!");
                                }
                            });
                    } else if (values["ReferenceType"] == 'SHOPIFY') {
                        ThisComponent.httpDataService.Create_product(["",
                            ThisComponent.ItemDetails["ItemCode"],
                            values["Description"],
                            ThisComponent.ItemDetails["Category"],
                            values["UnitPrice"],
                            ThisComponent.itemImageDetails["ItemImageURL"],
                            ThisComponent.ItemDetails["ItemCode"]
                        ]).subscribe(getStatus => {
                            ThisComponent.ItemIntegrationDetails = getStatus["product"];
                            ThisComponent.toastr.success("Item Added successfully, With the Id : " + ThisComponent.ItemIntegrationDetails.id);
                            ThisComponent.httpDataService.INSERTNewItemcrossreference(["",
                                ThisComponent.ItemDetails["ItemCode"],
                                "SHOPIFY",
                                '/products/' + ThisComponent.ItemIntegrationDetails.handle,
                                ThisComponent.ItemIntegrationDetails.id,
                                ThisComponent.ItemIntegrationDetails.body_html,
                                values["UnitPrice"]])
                                .subscribe(INSERTNewItemcrossreference => {
                                    if (INSERTNewItemcrossreference == 1) {
                                        devru.resolve(INSERTNewItemcrossreference);
                                    } else {
                                        devru.reject("Error while Inserting the Lines with ReferenceCode: " + values["ReferenceCode"] + ", Error Status Code is Insert Error");
                                    }
                                });
                        });
                    } else {
                        ThisComponent.httpDataService.INSERTNewItemcrossreference(["",
                            ThisComponent.itemCode,
                            "LAZADA",
                            "",
                            values["ReferenceCode"],
                            values["Description"],
                            values["UnitPrice"],
                        ]).subscribe(data => {
                            if (data >= 1) {
                                devru.resolve(data);
                            } else {
                                devru.reject("Error while Inserting the Lines with ReferenceCode: " + values["ReferenceCode"] + ", Error Status Code is Insert Error");
                            }
                        });
                    }
                }

                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                if (key["ReferenceType"] == 'WOOCOMMERCE') {
                    ThisComponent.httpDataService.UPDATEHeader(["", "Woocommerce", "No", ThisComponent.itemCode])
                        .subscribe(UPDATEHeader => {
                            if (UPDATEHeader == 1) {
                                ThisComponent.httpDataService.getitemcrossreferencecode2(["",
                                    ThisComponent.itemCode, 'WOOCOMMERCE']).subscribe(getitemcrossreferencecode2 => {
                                        ThisComponent.httpDataService.woo_deleteProduct(["",
                                            getitemcrossreferencecode2[0]["ReferenceCode"],
                                            'WOOCOMMERCE']).subscribe(woo_deleteProduct => {
                                                ThisComponent.toastr.success("Item Deleted Successfully");
                                                ThisComponent.httpDataService.deleteNewItemcrossreference(["",
                                                    ThisComponent.itemCode,
                                                    key["ReferenceType"],
                                                    key["ReferenceCode"]]).subscribe(deleteNewItemcrossreference => {
                                                        devru.resolve(deleteNewItemcrossreference);
                                                    });
                                            });
                                    });
                            } else {
                                this.toastr.success("Something went Wrong! Please try Again!");
                            }
                        });
                } else if (key["ReferenceType"] == 'SHOPIFY') {
                    ThisComponent.httpDataService.getitemcrossreferencecode2(["",
                        ThisComponent.itemCode, 'SHOPIFY']).subscribe(getitemcrossreferencecode2 => {
                            ThisComponent.httpDataService.Delete_product(["",
                                getitemcrossreferencecode2[0]["ReferenceCode"]
                            ]).subscribe(woo_deleteProduct => {
                            });
                            ThisComponent.toastr.success("Item Deleted Successfully");
                            ThisComponent.httpDataService.deleteNewItemcrossreference(["",
                                ThisComponent.itemCode,
                                key["ReferenceType"],
                                key["ReferenceCode"]]).subscribe(deleteNewItemcrossreference => {
                                    devru.resolve(deleteNewItemcrossreference);
                                });
                        });
                } else if (key["ReferenceType"] == 'SHOPEE') {
                    ThisComponent.httpDataService.getitemcrossreferencecode2(["",
                        ThisComponent.itemCode, 'SHOPEE']).subscribe(getitemcrossreferencecode2 => {
                            ThisComponent.httpDataService.delete(["",
                                getitemcrossreferencecode2[0]["ReferenceCode"]
                            ]).subscribe(woo_deleteProduct => {
                                ThisComponent.toastr.warning(woo_deleteProduct["msg"]);
                                ThisComponent.httpDataService.deleteNewItemcrossreference(["",
                                    ThisComponent.itemCode,
                                    key["ReferenceType"],
                                    key["ReferenceCode"]]).subscribe(deleteNewItemcrossreference => {

                                    });
                                devru.resolve();
                            });
                        });
                } else if (key["ReferenceType"] == 'LAZADA') {
                    ThisComponent.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
                    ThisComponent.httpDataService.remove_products(["",
                        ThisComponent.tokenofLazofromBack,
                        ThisComponent.itemCode
                    ]).subscribe(woo_deleteProduct => {
                        if (woo_deleteProduct["code"] == "0") {
                            ThisComponent.toastr.success("Product Deleted Successfully");
                            ThisComponent.httpDataService.deleteNewItemcrossreference(["",
                                ThisComponent.itemCode,
                                key["ReferenceType"],
                                key["ReferenceCode"]]).subscribe(deleteNewItemcrossreference => {

                                });
                            devru.resolve();
                        } else {
                            ThisComponent.toastr.error(woo_deleteProduct["code"]);
                            devru.resolve();
                        }

                    });
                }
                return devru.promise();
            },
            update: function (key, newValues) {
                var devru = $.Deferred();
                ThisComponent.httpDataService.updateItemcrossreference(["",
                    ThisComponent.itemCode,
                    getUpdateValues(key, newValues, "ReferenceType"),
                    getUpdateValues(key, newValues, "Description"),
                    getUpdateValues(key, newValues, "UnitPrice")]
                ).subscribe(data => {
                    if (data >= 1) {
                        devru.resolve(data);
                    } else {
                        devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is not updated");
                    }
                });
                return devru.promise();
            }
        });

        this.httpDataService.getAverageCost(["", this.itemCode,
            'Yes', this.myDate]).subscribe(GotCostDetails => {
                this.costDetails = GotCostDetails[1][0];
            });

        this.httpDataService.getItemDetail(["", this.itemCode])
            .subscribe(GotItemDetails => {
                barcodeDetailInit = GotItemDetails
            });


        this.httpDataService.handleConnecteditemFamily([""])
            .subscribe(getItemSizeGroup => {
                this.itemFamilySuggestions = new DataSource({
                    store: <String[]>getItemSizeGroup,
                    paginate: true,
                    pageSize: 10
                });

            });

        this.httpDataService.handleConnectedsize([""])
            .subscribe(getItemSizeGroup => {
                this.itemSizeSuggestions = new DataSource({
                    store: <String[]>getItemSizeGroup,
                    paginate: true,
                    pageSize: 10
                });

            });

        this.httpDataService.handleConnectedcolor([""])
            .subscribe(getItemColorGroup => {
                this.itemColorSuggestions = new DataSource({
                    store: <String[]>getItemColorGroup,
                    paginate: true,
                    pageSize: 10
                });
            });

        this.itemPriceDetail = new DataSource({
            store: new CustomStore({
                key: ["LineNo", "Barcode", "Description", "UOM", "UnitPrice", "ListPrice", "QuantityPrint",
                    "Size", "Brand", "ItemCode", "Description1", "Description2"],
                load: function (loadOptions) {
                    var devru = $.Deferred();
                    ThisComponent.httpDataService.getListForBarcode(["",
                        ThisComponent.itemCode]).subscribe(dataLines => {
                            if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
                                if (Object.keys(ThisComponent.dataBarcodeQuantityToPrint).length == 0) {
                                    for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                        ThisComponent.dataBarcodeQuantityToPrint.push(dataLines[i]);
                                    }
                                }
                                for (var i = 0; i < Object.keys(dataLines).length; i++) {
                                    dataLines[i].QuantityPrint = ThisComponent.dataBarcodeQuantityToPrint[i].QuantityPrint;
                                }
                            }
                            devru.resolve(dataLines);
                        });
                    return devru.promise();
                },
                update: function (key, newValues) {
                    var devru = $.Deferred();
                    for (var index = 0; index < Object.keys(ThisComponent.dataBarcodeQuantityToPrint).length; ++index) {
                        if (ThisComponent.dataBarcodeQuantityToPrint[index].LineNo == key.LineNo) {
                            ThisComponent.dataBarcodeQuantityToPrint[index].QuantityPrint = getUpdateValues(key, newValues, "QuantityPrint");
                            break;
                        }
                    }
                    ThisComponent.newBarcodeDetails = key;
                    ThisComponent.newBarcodeDetails.QuantityPrint = getUpdateValues(key, newValues, "QuantityPrint");
                    ThisComponent.barcodeSelected = true;
                    ThisComponent.isDivVisible = true;
                    if (newValues["Barcode"] == null || newValues["Barcode"] == '') {
                        ThisComponent.httpDataService.dg_itemEditEndHandler(["",
                            key["Barcode"],
                            getUpdateValues(key, newValues, "UnitPrice"),
                            getUpdateValues(key, newValues, "ListPrice"), ThisComponent.itemCode,
                            getUpdateValues(key, newValues, "LineNo")]).subscribe(updateItemPrice => {
                                if (updateItemPrice >= 0) {
                                    ThisComponent.getItemDetails();
                                    devru.resolve(updateItemPrice);
                                } else {
                                    devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
                                }
                            });
                    } else {
                        ThisComponent.httpDataService.validateBarcode(["", newValues["Barcode"]])
                            .subscribe(updateItemPrice => {
                                if (Object.keys(updateItemPrice).length == 0) {
                                    ThisComponent.httpDataService.dg_itemEditEndHandler(["",
                                        newValues["Barcode"],
                                        getUpdateValues(key, newValues, "UnitPrice"),
                                        getUpdateValues(key, newValues, "ListPrice"), ThisComponent.itemCode,
                                        getUpdateValues(key, newValues, "LineNo")]).subscribe(updateItemPrice => {
                                            if (updateItemPrice >= 0) {
                                                ThisComponent.getItemDetails();
                                                devru.resolve(updateItemPrice);
                                            } else {
                                                devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
                                            }
                                        });
                                }
                                else {
                                    devru.reject("Barcode: " + getUpdateValues(key, newValues, "Barcode") + " Already Exist!!");
                                }
                            });
                    }
                    return devru.promise();
                }
            })
        });

        this.suCodeList = new CustomStore({
            key: ["ItemCode", "StoreageUnitCode", "VariantCode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                ThisComponent.httpDataService.getAllLines(["", ThisComponent.itemCode])
                    .subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                ThisComponent.isDivVisible = false;
                ThisComponent.httpDataService.btnDelete_clickHandlerSUC(["",
                    key.ItemCode,
                    key.StoreageUnitCode]).subscribe(data => {
                        if (data > 0) {
                            devru.resolve(data);
                        } else {
                            devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
                        }
                    });
                return devru.promise();
            }
        });

        this.LOTDetail = new CustomStore({
            key: ["ItemCode", "LotNumber", "DocumentNo", "OriginDate", "ExpiryDate", "LotStatus"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                ThisComponent.httpDataService.getList(["",
                    ThisComponent.itemCode]).subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            }
        });

        this.itemIntegrationData = new CustomStore({
            load: function (loadOptions) {
                var devru = $.Deferred();
                ThisComponent.httpDataService.getAllLines(["", ThisComponent.itemCode])
                    .subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                ThisComponent.isDivVisible = false;
                ThisComponent.httpDataService.btnDelete_clickHandlerSUC(["",
                    key.ItemCode,
                    key.StoreageUnitCode]).subscribe(data => {
                        if (data > 0) {
                            devru.resolve(data);
                        } else {
                            devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
                        }
                    });
                return devru.promise();
            }
        });


        function getUpdateValues(key, newValues, field): String {
            return (newValues[field] == null) ? key[field] : newValues[field];
        }
    }

    getItemIntegrationDetails() {
        this.httpDataService.getItemDetail(["", this.itemCode])
            .subscribe(GotItemDetails => {
                this.ItemIntegrationDetails = GotItemDetails;
                this.ItemIntegrationDetails["Woocommerce"] = false;
            });
    }

    getItemImageDetails() {
        this.httpDataService.getItempicture(["", this.itemCode])
            .subscribe(data => {
                if (Object.keys(data).length > 0) {
                    data[0].ItemImageURL = this.httpDataService.getImageUrlPath() + data[0].imagepath + data[0].imagename;
                    this.itemImageDetails = data[0];
                } else {
                    this.itemImageDetails.ItemImageURL = '/assets/images/big/img.png';
                }
            });
    }

    getItemDetails() {
        this.httpDataService.getItemDetail(["", this.itemCode])
            .subscribe(GotItemDetails => {
                this.ItemDetails = GotItemDetails[0];
                if (this.ItemDetails["Description"] ? this.ItemDetails["Description"] != '' : false) {
                    this.editMode = false;
                } else {
                    this.editMode = true;
                }
                this.ItemDetails["UnitPrice"] = parseFloat(this.ItemDetails["UnitPrice"]).toFixed(2);
                this.ItemDetails["ListPrice"] = parseFloat(this.ItemDetails["ListPrice"]).toFixed(2);
                this.ItemDetails["Thickness"] = parseFloat(this.ItemDetails["Thickness"]).toFixed(2);
                this.ItemDetails["MaxStock"] = parseFloat(this.ItemDetails["MaxStock"]).toFixed(2);
                this.ItemDetails["MinStock"] = parseFloat(this.ItemDetails["MinStock"]).toFixed(2);
                this.ItemDetails["ReOrderPoint"] = parseFloat(this.ItemDetails["ReOrderPoint"]).toFixed(2);
                this.ItemDetails["Width"] = parseFloat(this.ItemDetails["Width"]).toFixed(2);
                this.ItemDetails["Height"] = parseFloat(this.ItemDetails["Height"]).toFixed(2);
                if (this.ItemDetails["Active"] == 'Yes' || this.ItemDetails["Active"] == 'yes') {
                    this.ItemDetails["Active"] = true;
                }
                else {
                    this.ItemDetails["Active"] = false;
                }
                if (this.ItemDetails["Woocommerce"] == 'Yes' || this.ItemDetails["Woocommerce"] == 'yes') {
                    this.ItemDetails["Woocommerce"] = true;
                }
                else {
                    this.ItemDetails["Woocommerce"] = false;
                }
                if (this.ItemDetails["Lazada"] == 'Yes' || this.ItemDetails["Lazada"] == 'yes') {
                    this.ItemDetails["Lazada"] = true;
                } else {
                    this.ItemDetails["Lazada"] = false;
                }
                if (this.ItemDetails["Shopee"] == 'Yes' || this.ItemDetails["Shopee"] == 'yes') {
                    this.ItemDetails["Shopee"] = true;
                } else {
                    this.ItemDetails["Shopee"] = false;
                }
                if (this.ItemDetails["LotNoRequired"] == "Yes" || this.ItemDetails["LotNoRequired"] == "yes") {
                    this.ItemDetails["LotNoRequired"] = true;
                }
                else {
                    this.ItemDetails["LotNoRequired"] = false;
                }
                this.getUOM();
            });
    }

    userdefinedrefresh() {
        this.jsonSchema = JSON.parse(null);
        this.httpDataService.getJSON2(['', 'ITEM'])
            .subscribe(getJSON2 => {
                var jsonSchema1 = JSON.parse(getJSON2[0]["attribute"]);
                this.httpDataService.getItemDetail(["", this.itemCode])
                    .subscribe(GotItemDetails => {
                        var jsonData = JSON.parse(GotItemDetails[0]["attribute"])["attribute"];
                        for (var i = 0; i < Object.keys(jsonSchema1['components']).length; i++) {
                            for (var j = 0; j < Object.keys(jsonData).length; j++) {
                                if (jsonSchema1['components'][i]["label"] == Object.keys(jsonData[j])) {
                                    jsonSchema1['components'][i]["defaultValue"] = jsonData[j][jsonSchema1['components'][i]["label"]];
                                }
                            }
                        }
                        this.jsonSchema = jsonSchema1;
                    });
            });
    }

    onEditNewRow(event) {
        this.gridContainerICR.instance.columnOption("ReferenceCode", "allowEditing", false);
        this.gridContainerICR.instance.columnOption("ReferenceType", "allowEditing", false);
    }

    onInitNewRow(event) {
        event.data.Description = this.ItemDetails["Description"];
        event.data.UnitPrice = this.ItemDetails["UnitPrice"];
        this.gridContainerICR.instance.columnOption("ReferenceCode", "allowEditing", true);
        this.gridContainerICR.instance.columnOption("ReferenceType", "allowEditing", true);

        this.httpDataService.getAllSetup([''])
            .subscribe(callData3 => {
                this.ImportTypeSuggestions = new DataSource({
                    store: <String[]>callData3,
                    paginate: true,
                    pageSize: 20
                });
            });

        this.newCustomerDetail2 = {};
        this.newIntegrationItemAdd = true;
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }

    onHiding(event) {
        this.gridContainerICR.instance.refresh();
    }

    onCodeChanged(event, dataField) {
        if (event.value != undefined) {
            this.newCustomerDetail2[dataField] = event.value;
            if (event.value == 'WOOCOMMERCE') {
                this.WOOCOMMERCECreateItem = true;
                this.FLIPKARTCreateItem = false;
                this.SHOPIFYCreateItem = false;
                this.LAZADACreateItem = false;
                this.SHOPEECreateItem = false;

                this.woocommerceDetails.Description = this.ItemDetails["Description"];
                this.woocommerceDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.woocommerceDetails.Description2 = this.ItemDetails["Description2"];
                this.woocommerceDetails.ItemCode = this.ItemDetails["ItemCode"];
                this.httpDataService.woo_listAllProdCategory([""])
                    .subscribe(getItemColorGroup => {
                        this.woocommerceCategorySuggestions = new DataSource({
                            store: <String[]>getItemColorGroup,
                            paginate: true,
                            pageSize: 10
                        });
                    });
            } else if (event.value == 'SHOPEE') {
                this.WOOCOMMERCECreateItem = false;
                this.FLIPKARTCreateItem = false;
                this.SHOPIFYCreateItem = false;
                this.LAZADACreateItem = false;
                this.SHOPEECreateItem = true;

                this.httpDataService.getLogistics([""])
                    .subscribe(getItemColorGroup => {
                        this.ShopeeLogistics = getItemColorGroup["logistics"];
                    });

                this.httpDataService.testingJson2([""])
                    .subscribe(testingJson2 => {
                        this.ShopeeCatgories = testingJson2["categories"];
                        this.ShopeeCatgories = this.convert(this.ShopeeCatgories);
                        this.currentItem = this.ShopeeCatgories[0];
                    });

                this.shopeeDetails.Description = this.ItemDetails["Description"];
                this.shopeeDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.shopeeDetails.ItemCode = this.ItemDetails["ItemCode"];
            } else if (event.value == 'LAZADA') {
                this.WOOCOMMERCECreateItem = false;
                this.FLIPKARTCreateItem = false;
                this.SHOPIFYCreateItem = false;
                this.LAZADACreateItem = true;
                this.SHOPEECreateItem = false;

                this.LazadaDetails.Description = this.ItemDetails["Description"];
                this.LazadaDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.LazadaDetails.ItemCode = this.ItemDetails["ItemCode"];

                this.getLazadaDataForProduct();
            } else if (event.value == 'SHOPIFY') {
                this.WOOCOMMERCECreateItem = false;
                this.FLIPKARTCreateItem = false;
                this.SHOPIFYCreateItem = true;
                this.LAZADACreateItem = false;
                this.SHOPEECreateItem = false;

                this.ShopifyDetails.Description = this.ItemDetails["Description"];
                this.ShopifyDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.ShopifyDetails.Description2 = this.ItemDetails["Description2"];
                this.ShopifyDetails.ItemCode = this.ItemDetails["ItemCode"];

            } else if (event.value == 'FLIPKART') {
                this.WOOCOMMERCECreateItem = false;
                this.FLIPKARTCreateItem = true;
                this.SHOPIFYCreateItem = false;
                this.LAZADACreateItem = false;
                this.SHOPEECreateItem = false;
            }
        }
    }

    getLazadaDataForProduct() {
        this.waitingDialogue = true;
        this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
        if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
            this.OpenPopup();
        } else {
            window.removeEventListener('storage', function (e) { });
            //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.generateAccessToken();
            //}
        }
    }

    OpenPopup() {
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
                    that.getLazadaDataForProduct();
                });
                window.open(this.currentURL, 'lazada', options);
            });

    }


    generateAccessToken() {
        this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
        if (this.tokenofLazofromBack == '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
            this.httpDataService.generateAccessToken(["", this.codefromLAZO])
                .subscribe(generateAccessToken => {
                    this.tokenofLazofromBack = generateAccessToken["access_token"];
                    this.refreshTokenofLazofromBack = generateAccessToken["refresh_expires_in"];
                    this.refreshTimerofLazofromBack = generateAccessToken["refresh_token"];
                    UtilsForGlobalData.setLocalStorageKey("refresh_token", this.refreshTimerofLazofromBack);
                    UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
                    this.startCountdownTimer(this.refreshTokenofLazofromBack);
                    this.getbrands();
                    this.getCategoriesFromLazada();
                });
        } else {
            this.getbrands();
            this.getCategoriesFromLazada();
        }
    }

    getbrands() {
        this.dataServices.getServerData("lazadaProducts", "GetBrands", [""])
            .subscribe(GetBrands => {
                if (Object.keys(GetBrands).length > 0) {
                    this.brandsFromlazada = new DataSource({
                        store: <String[]>GetBrands["data"],
                        paginate: true,
                        pageSize: 20
                    });
                    console.log(this.brandsFromlazada);
                    this.waitingDialogue = false;
                } else {
                    if (GetBrands == null) {
                        this.waitingDialogue = false;
                        this.toastr.warning("No brands are Available!");
                    } else {
                        this.waitingDialogue = false;
                        this.toastr.warning("No brands are Available!");
                    }
                }
            });
    }

    getCategoriesFromLazada() {
        this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
        this.dataServices.getServerData("lazadaProducts", "GetCategoryTree", ["",
            this.tokenofLazofromBack])
            .subscribe(GetCategoryTree => {
                if (Object.keys(GetCategoryTree).length > 0) {
                    this.CategoryFromlazada = GetCategoryTree["data"];
                    this.currentItem = this.CategoryFromlazada[0];
                    this.waitingDialogue = false;
                } else {
                    if (GetCategoryTree == null) {
                        this.waitingDialogue = false;
                        this.toastr.warning("No Categories are Available!");
                    } else {
                        this.waitingDialogue = false;
                        this.toastr.warning("No Categories are Available!");
                    }
                }
            });
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

    selectItem(event) {
        this.shopeeDetails.Category = event.itemData;
    }

    selectItem2(event) {
        this.LazadaDetails.Categoryarray = event.itemData;
        this.LazadaDetails.Category = this.LazadaDetails["Categoryarray"]["category_id"]
        console.log(this.LazadaDetails);
    }

    suggestionFormateForImportType(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Name");
    }

    convert(array) {
        var map = {};
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            obj.items = [];

            map[obj.category_id] = obj;

            var parent = obj.parent_id || '-';
            if (!map[parent]) {
                map[parent] = {
                    items: []
                };
            }
            map[parent].items.push(obj);
        }

        return map['-'].items;

    }

    hoverFormatForImportType(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Name");
    }

    onTabChange(event: NgbTabChangeEvent) {
        if (event.nextId == 'ItemOperations') {
            this.visiblity = true;
            if (this.itemPolicySuggestions == null) {
                this.httpDataService.handleConnectedGENPOLICY([""])
                    .subscribe(getItemPolicyGroup => {
                        this.itemPolicySuggestions = new DataSource({
                            store: <String[]>getItemPolicyGroup,
                            paginate: true,
                            pageSize: 10
                        });

                    });
            }
            if (this.itemVatGroupSuggestions == null) {
                this.httpDataService.handleConnectedvatPrdGrp([""])
                    .subscribe(getVatGroupGroup => {
                        this.itemVatGroupSuggestions = new DataSource({
                            store: <String[]>getVatGroupGroup,
                            paginate: true,
                            pageSize: 10
                        });

                    });
            }

            if (this.itemVatGroupSuggestions == null) {
                this.httpDataService.handleConnectedvatPrdGrp([""])
                    .subscribe(getVatGroupGroup => {
                        this.itemVatGroupSuggestions = new DataSource({
                            store: <String[]>getVatGroupGroup,
                            paginate: true,
                            pageSize: 10
                        });

                    });
            }
        }
        else if (event.nextId == 'LOT') {
            this.visiblity = false;
        }
        else if (event.nextId == 'ItemSUCode') {
            this.visiblity = false;
            if (this.itemSUCodeSuggestions == null) {
                this.httpDataService.getStoreageunitCodes([""])
                    .subscribe(getSuCodeGroup => {
                        this.itemSUCodeSuggestions = new DataSource({
                            store: <String[]>getSuCodeGroup,
                            paginate: true,
                            pageSize: 10
                        });
                    });
            }
        }

        else if (event.nextId == 'Analysis') {
            this.visiblity = false;
            this.httpDataService.getItemPriceLog(["", this.itemCode])
                .subscribe(dataForChart => {
                    this.barChartData = dataForChart;
                    for (var i = 0; i < this.barChartData.length; i++) {
                        this.barChartData[i]["PreviousPrice"] = parseFloat(this.barChartData[i]["PreviousPrice"]).toFixed(2);
                        this.barChartData[i]["NewPrice"] = parseFloat(this.barChartData[i]["NewPrice"]).toFixed(2);
                    }
                });

        }

        else if (event.nextId == 'ItemDetails' || event.nextId == 'ItemPriceDetails' || event.nextId == 'ItemDetails') {
            this.visiblity = true;
        }
        else {
            this.visiblity = false;
        }
        if (event.nextId == 'userDefined') {
            this.userdefinedrefresh(); // we Removed Because Its Not Using Here.
        }
        if (event.nextId == 'integration') {

        }

    }

    formateForWooCategorySuggestion(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "id", "name");
    }

    hoverformateForWooCategorySuggestion(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "id", "name");
    }

    formateForWooCategorySuggestion1(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "logistic_name", "logistic_id");
    }

    formateForWooCategorySuggestion2(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "name", "brand_id");
    }

    getDimensionsByFilter(logistic_id) {
        return this.ShopeeLogistics.filter(x => x.logistic_id === logistic_id);
    }

    hoverformateForWooCategorySuggestion1(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "logistic_name", "logistic_id");
    }

    hoverformateForWooCategorySuggestion2(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "name", "brand_id");
    }

    formateForItemListUOMSuggestion2(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "UOM");
    }

    suggestionFormatForItemSize(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "SizeCode", "Description");
    }

    suggestionFormatForItemFamily(data) {
        return data ? data.Code + " | " + data.Description : null;
    }

    suggestionFormatForItemColor(data) {
        return data ? data.ColorCode + " | " + data.Description : null;
    }

    suggestionFormatForItemBaseUOM(data) {
        return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "UOM");
    }

    hoverFormatForItemBaseUOM(data) {
        return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "UOM", "Description");
    }

    suggestionFormatForitemPolicy(data) {
        return data ? data.Code + " | " + data.Description : null;
    }

    suggestionFormatForitemVatGroup(data) {
        return data ? data.Code + " | " + data.Description : null;
    }

    suggestionFormatForBaseUOMList(data) {
        return data ? data.Code + " | " + data.Description : null;
    }

    getFormatOfNumber(e) {
        return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }


    suggestionFormatForitemSUCode(data) {
        return data ? data.StorageUnitCode + " | " + data.LocationCode : null;
    }
    onitemFamilyChanged(event: any) {
        this.ItemDetails["FamilyCode"] = event.value;
    }


    onitemSizeChanged(event: any) {
        this.ItemDetails["Size"] = event.value;
    }

    onitemColorChanged(event: any) {
        this.ItemDetails["Color"] = event.value;
    }

    onitemBaseUOMChanged(event: any) {
        if (event.event != undefined ? event.value != event.previousValue : false) {
            this.httpDataService.UPDATEHeader(["", 'BaseUOM',
                event.value, this.itemCode]).subscribe(dataStatus => {
                    if (dataStatus > 0) {
                        this.ItemDetails["BaseUOM"] = event.value;
                        this.ItemDetails["PurchUOM"] = event.value;
                        this.ItemDetails["SalesUOM"] = event.value;
                    }
                });
        }
    }

    baseUOMchange(event: any) {

    }

    onitemPurchUOMChanged(event: any) {
        this.ItemDetails["PurchUOM"] = event.value;
    }

    onitemSalesUOMChanged(event: any) {
        this.ItemDetails["SalesUOM"] = event.value;
    }

    onitemPolicyChanged(event: any) {
        this.ItemDetails["GenPolicyGroup"] = event.value;
    }

    onitemVatGroupChanged(event: any) {
        this.ItemDetails["VatProdPostGroup"] = event.value;
    }
    onUOMChanged(event: any) {
        this.baseUOMList["Code"] = event.value;
    }


    onItemDescriptionChanged(event: any) {
        this.ItemDetails["Description"] = event.value;
        this.editMode = false;
    }

    onitemSUCodeChanged(event: any) {
        this.storageUnitData["StorageUnitCode"] = event.value;
        for (var index = 0; index < Object.keys(this.itemSUCodeSuggestions._store._array).length; ++index) {
            if (this.itemSUCodeSuggestions._store._array[index].StorageUnitCode == event.value) {
                this.selectedSuCode = this.itemSUCodeSuggestions._store._array[index].LocationCode;
            }
        }
    }

    onEnterKey(event) {
        this.editMode = false;
    }
    onClickedOutside(e: Event) {
        this.editMode = false;
    }
    transactionDays_value(event) {
        if (event.value != event.previousValue) {
            this.transDaysNumber = Math.round(event.value);
            this.httpDataService.numHistDays_changeHandler(["",
                this.itemCode,
                this.transDaysNumber.toString()]).subscribe(transactionHistoryData => {
                    this.transData = transactionHistoryData[1];
                });
        }
    }

    form_fieldDataChanged(event) {
        if (event.dataField == 'Thickness' || event.dataField == 'Width' || event.dataField == 'Height' || event.dataField == 'UnitPrice' || event.dataField == 'ListPrice'
            || event.dataField == 'MaxStock' || event.dataField == 'MinStock' || event.dataField == 'ReOrderPoint') {
            this.ItemDetails["" + event.dataField] = parseFloat(this.ItemDetails["" + event.dataField]).toFixed(2);
        }
    }



    addStorageUnitCode() {
        this.editMode = false;
        this.formWidget.instance.updateData(this.storageUnitData);
        var data = this.formWidget.instance.option("formData");
        if (data.StorageUnitCode == undefined) {
            this.toastr.error("Please select SU COde");
        } else {
            this.httpDataService.btnADD_clickHandler(["",
                this.itemCode,
                this.selectedSuCode]).subscribe(countValue => {
                    if (countValue[0]["Lcount"] == 0) {
                        this.addRecord(data.StorageUnitCode);
                    } else {
                        this.toastr.error("Only One Storage Unit Code Allowed Per Location!!");
                    }
                });
        }
    }

    addRecord(data) {
        this.httpDataService.addRecord(["",
            this.itemCode, data,
            this.selectedSuCode]).subscribe(insertSuCode => {
                this.updateItemSuCode = insertSuCode;
                if (this.updateItemSuCode == true) {
                    this.gridContainerSU.instance.refresh();
                }
            });
    }

    toggleDefault() {
        this.defaultVisible = !this.defaultVisible;
    }

    update() {
        this.editMode = false;
        this.formWidget.instance.updateData(this.ItemDetails);
        var data = this.formWidget.instance.option("formData");
        if (data.Active == false) {
            data.Active = "No";
        }
        else {
            data.Active = "Yes";
        }
        if (data.LotNoRequired == false) {
            data.LotNoRequired = "No";
        }
        else {
            data.LotNoRequired = "Yes";
        }
        this.httpDataService.update(["",
            data.Description, data.BaseUOM, data.PurchUOM,
            data.VatProdPostGroup, data.ListPrice, data.UnitPrice,
            data.SalesUOM, data.GenPolicyGroup, data.Width,
            data.Height, data.Thickness, data.LotNoRequired,
            data.Size, data.Color, data.HSNCode,
            data.Active, data.FamilyCode,
            data.MinStock, data.MaxStock,
            data.ShelfDays, data.ExpiryDays, data.ReOrderPoint,
            data.ItemCode]).subscribe(updateItemdata => {
                this.errorHandlingToasterForUPDATE(updateItemdata);
            });
        this.httpDataService.getitemcrossreferencecode2(["",
            this.itemCode, 'WOOCOMMERCE']).subscribe(getitemcrossreferencecode2 => {
                if (Object.keys(getitemcrossreferencecode2).length != 0) {
                    this.WooReferenceCode = getitemcrossreferencecode2[0]["ReferenceCode"];
                    this.httpDataService.updateProducttoSOCreated(["",
                        data.UnitPrice,
                        data.Description,
                        this.itemImageDetails["ItemImageURL"],
                        this.WooReferenceCode
                    ]).subscribe(getitemcrossreferencecode2 => {
                        this.toastr.success("Woocommerce Item Updated!");
                        this.httpDataService.updateItemcrossreference(["",
                            this.ItemDetails["ItemCode"],
                            "WOOCOMMERCE",
                            getitemcrossreferencecode2["description"],
                            getitemcrossreferencecode2["regular_price"]])
                            .subscribe(INSERTNewItemcrossreference => {
                            });
                    });
                }
            });
    }


    routeBack() {
        this.router.navigate(['/purchases/items-list']);
    }



    settingsClick(itemCode: string) {
        this.popupVisible = true;
        this.baseUOMList = [];
        this.httpDataService.titlewindow1_initializeHandler([""])
            .subscribe(getBaseUOMList => {
                this.bseUOMListSuggestions = new DataSource({
                    store: <String[]>getBaseUOMList,
                    paginate: true,
                    pageSize: 10
                });
                this.showbase = true;
            });
        this.getbaseUomForThisItem();
    }

    getbaseUomForThisItem() {
        this.getUOM();
        this.dataBarcodeQuantityToPrint = [];
        this.httpDataService.onResponse(["",
            this.itemCode]).subscribe(UomforthisItem => {
                this.baseUomForThisItem = UomforthisItem;
            });
    }

    avgCostDetailsClick() {
        this.popupVisibleAvgCost = true;
        this.httpDataService.getCostDetails(["", this.itemCode])
            .subscribe(GotItemCostDetails => {
                this.avgCostDetails = GotItemCostDetails;
            });
    }

    UnitPriceSettingsClick() {
        this.popupVisibleUnitPrice = true;
        this.itemPriceDetail.reload();
    }

    fifoDetails() {
        this.popupVisibleFifo = true;
        this.httpDataService.FIFOCostgetCostDetails(["", this.itemCode])
            .subscribe(GotItemDetails => {
                this.fifoCostForThisItem = GotItemDetails;
            });
    }



    addUOM() {
        this.formWidget.instance.updateData(this.baseUOMList);
        if (this.baseUOMList["Code"] && this.baseUOMList["QtyPerUOM"]) {
            this.httpDataService.btnAdd_clickHandler(["",
                this.itemCode, this.baseUOMList["Code"],
                Math.round(this.baseUOMList["QtyPerUOM"])]).subscribe(setUOM => {
                    if (setUOM == 1) {
                        this.toastr.success("Unit of Measure added Successfully", "DONE");
                        this.getbaseUomForThisItem();
                    } else {
                        this.toastr.error("Error while Inserting UOM , Error Status Code : INSERT-ERR");
                    }
                });
        }
        else {
            this.toastr.error("Please Select BaseUOM and Quantity to add!!")
        }
    }

    logEvent(event: any) {
        var devru = $.Deferred();
        this.httpDataService.btnDELETE_clickHandler(["",
            event.data.ItemCode,
            event.data.UOM]).subscribe(deleteUOMforthisItem => {
                if (deleteUOMforthisItem > 0) {
                    this.getUOM();
                    this.toastr.success("Deleted Successfully");
                } else {
                    this.toastr.error("Error while Deleting , Error Status Code : DELETE-ERR");
                    //this.getUOM();
                }
                this.getbaseUomForThisItem();
            });
    }

    suCodeListDelete(event: any) {
        this.httpDataService.btnDelete_clickHandlerSUC(["",
            event.data.ItemCode,
            event.data.StoreageUnitCode]).subscribe(deleteSUCodeforthisItem => {
                this.deleteSUCode = deleteSUCodeforthisItem;
                if (this.deleteSUCode > 0) {
                    this.settingsClick(event.data.ItemCode);
                    this.toastr.success("Deleted Successfully");
                    this.userdefinedrefresh();
                }
                else {
                    this.toastr.error("Error while Deleting");
                    this.settingsClick(event.data.ItemCode);
                    this.getUOM();
                }
            });
    }

    getUOM() {
        this.itemBaseUOMSuggestions = [];
        this.itemPurchUOMSuggestions = [];
        this.itemSalesUOMSuggestions = [];

        this.httpDataService.handleConnectedBASEUOM(["", this.itemCode])
            .subscribe(getItemBaseUOMGroup => {
                this.itemBaseUOMSuggestions = new DataSource({
                    store: <String[]>getItemBaseUOMGroup,
                    paginate: true,
                    pageSize: 10
                });
                this.itemBaseUOMSuggestionsForDataGrid = <String[]>getItemBaseUOMGroup;
            });


        this.httpDataService.handleConnectedPURCHUOM(["", this.itemCode])
            .subscribe(getItemPurchUOMGroup => {
                this.itemPurchUOMSuggestions = new DataSource({
                    store: <String[]>getItemPurchUOMGroup,
                    paginate: true,
                    pageSize: 10
                });
            });

        this.httpDataService.handleConnectedSALESUOM(["", this.itemCode])
            .subscribe(getSalesUOMGroup => {
                this.itemSalesUOMSuggestions = new DataSource({
                    store: <String[]>getSalesUOMGroup,
                    paginate: true,
                    pageSize: 10
                });
            });
    }

    values(value: string): string[] {
        value = value == undefined ? '' : value;
        return value.split('\n');
    }

    public pdfFormate = {
        HeadTitleFontSize: 18,
        Head2TitleFontSize: 16,
        TitleFontSize: 14,
        SubTitleFontSize: 12,
        NormalFontSize: 10,
        SmallFontSize: 8,
        BarcodeFont: 7,
        SetFont: "Garuda-Bold", //leelawad
        SetFontType: "normal",
        NormalSpacing: 12,
        rightStartCol1: 390,
        rightStartCol2: 480,
        InitialstartX: 40,
        startX: 40,
        startXDetails: 95,
        startXcol2: 220,
        startXcol2Details: 280,
        startXcol3: 400,
        startXcol3Details: 460,
        startXcol4: 300,
        startXcol4Details: 355,
        centerX: 240,
        centerBOX: 255,
        InitialstartY: 40,
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

    onBarcodeRowEditingStart(event) {
        this.newBarcodeDetails = event.key;
        this.barcodeSelected = true;
        this.isDivVisible = true;
    }

    printSelecteBarcode(id: string) {
        if (this.barcodeSelected) {
            let pdf = new jsPDF('p', 'pt', 'a4');//new jsPDF('p', 'cm', [250, 25]); //new jsPDF('p', 'pt', 'a4');
            pdf.addFileToVFS("Garuda-Bold.tff", variable.thai6);
            pdf.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
            pdf.setFont(this.pdfFormate.SetFont);
            pdf.setFontType(this.pdfFormate.SetFontType);
            var data = document.getElementById(id);
            html2canvas(data).then(canvas => {
                const contentDataURL = canvas.toDataURL('assets/images/background/user-bg');
                for (let i = 0; i < Math.ceil(this.newBarcodeDetails["QuantityPrint"] / 2); ++i) {
                    // Few necessary setting options 
                    var imgWidth = 100;
                    var imgHeight = 35;
                    var pageStartX = 10;
                    var pageStartY = 5;
                    var pageStartX2 = 155;
                    var LineSpace = 10;
                    pdf.setFontSize(this.pdfFormate.SmallFontSize);
                    pdf.text('' + UtilsForGlobalData.getCompanyName(), pageStartX, pageStartY += LineSpace);
                    pdf.text('' + UtilsForGlobalData.getCompanyName(), pageStartX2, pageStartY);
                    pdf.setFontSize(this.pdfFormate.BarcodeFont);
                    pdf.text('Desc:' + this.newBarcodeDetails["Description1"], pageStartX, pageStartY += LineSpace);
                    pdf.text('Desc:' + this.newBarcodeDetails["Description1"], pageStartX2, pageStartY);
                    pdf.text('' + this.newBarcodeDetails["Description2"], pageStartX, pageStartY += LineSpace);
                    pdf.text('' + this.newBarcodeDetails["Description2"], pageStartX2, pageStartY);
                    pdf.text('MRP:' + this.formatNumber(this.newBarcodeDetails["UnitPrice"]), pageStartX, pageStartY += LineSpace);
                    pdf.text('SIZE:' + this.newBarcodeDetails["Size"], pageStartX + 70, pageStartY);
                    pdf.text('MRP:' + this.formatNumber(this.newBarcodeDetails["UnitPrice"]), pageStartX2, pageStartY);
                    pdf.text('SIZE:' + this.newBarcodeDetails["Size"], pageStartX2 + 70, pageStartY);
                    pdf.addImage(contentDataURL, 'JPG', pageStartX, pageStartY += 5, imgWidth, imgHeight);
                    pdf.addImage(contentDataURL, 'JPG', pageStartX2, pageStartY, imgWidth, imgHeight);
                    pdf.text('' + this.newBarcodeDetails["ItemCode"], pageStartX, imgHeight += pageStartY);
                    pdf.text('' + this.newBarcodeDetails["Brand"], pageStartX + 70, imgHeight);
                    pdf.text('' + this.newBarcodeDetails["ItemCode"], pageStartX2, imgHeight);
                    pdf.text('' + this.newBarcodeDetails["Brand"], pageStartX2 + 70, imgHeight);
                    pdf.line(pageStartX2 - 5, 5, pageStartX2 - 5, imgHeight);
                    //pdf.text("Page " + pdf.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, pdf.internal.pageSize.height - 10);
                    if (Number(i + 1) == Math.ceil(this.newBarcodeDetails["QuantityPrint"] / 2)) {
                        pdf.output("dataurlnewwindow");
                        this.isDivVisible = false;
                    } else {
                        pdf.addPage();
                    }
                }
            });
        } else {
            this.toastr.warning("Please select The Barcode!!");
            this.isDivVisible = false;
        }
    }

    onChange(event) {
        this.isAutoBarcode = event.value;
    }

    getisAutoBarcode() {
        return !this.isAutoBarcode;
    }

    SaveNewBarcode() {
        this.formWidget.instance.updateData(this.newBarcodeDetails);
        var data: [] = null;
        data = this.formWidget.instance.option("formData");
        if (data["isAutoBarcode"]) {
            //data["Barcode"]= ;
        }
        if (Object.keys(data).length != 0) {
            if (data["Barcode"] && data["Description"] && data["BaseUOM"]) {
                if (this.barcodeSelected) {
                    this.httpDataService.processEdit(["",
                        data["Barcode"], data["Description"],
                        data["BaseUOM"]]).subscribe(getNewCustDetail => {
                            if (getNewCustDetail >= 0) {
                                this.addNewBarcodepopupVisible = false;
                                this.gridContainer.instance.refresh();
                            } else {
                                this.toastr.error("Error while Updating the Barcode");
                            }
                        });
                } else {
                    this.httpDataService.barcodeListvalidateBarcode(["",
                        data["Barcode"]]).subscribe(getNewCustDetail => {
                            if ((getNewCustDetail != null ? Object.keys(getNewCustDetail).length > 0 : false)) {
                                this.toastr.warning("Barcode is Already Existed!!");
                            } else {
                                this.httpDataService.INSERTBarcode(["",
                                    data["Barcode"], this.itemCode,
                                    data["Description"], data["BaseUOM"],
                                    data["UnitPrice"]]).subscribe(getNewCustDetail => {
                                        if (getNewCustDetail == 1) {
                                            this.addNewBarcodepopupVisible = false;
                                            this.gridContainer.instance.refresh();
                                        } else {
                                            this.toastr.error("Error while Inserting the Barcode");
                                        }
                                    });
                            }
                        });
                }
            }
            else {
                this.toastr.warning("Some Fields are Empty!!");
            }
        }
        else {
            this.toastr.warning("Barcode Data is Empty")
        }
    }

    barcodeOnEditing(event) {
        event.component.columnOption("Barcode", "allowEditing", false);
    }

    CancelNewBarcode() {
        this.addNewBarcodepopupVisible = false;
    }


    setBaseUOMValueItemCode(newData, value, currentData): void {
        for (var index = 0; index < Object.keys(barcodeDetailInit).length; ++index) {
            newData.Description = barcodeDetailInit[index].Description;
            newData.UnitPrice = barcodeDetailInit[index].UnitPrice;
            break;

        }
        (<any>this).defaultSetCellValue(newData, value);
    }

    showInfo() {
        this.popupVisible2 = true;
    }

    processFile(imageInput) {
        var files = imageInput.files;
        var file = files[0];

        var t = file.type.split('/').pop().toLowerCase();
        if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
            this.toastr.error("Please select a valid image file");
        }
        else if (file.size > 1024000) {
            this.toastr.error("Max Upload size is 1MB only");
        } else {
            this.httpDataService.getBase64(files[0])
                .then(gotbase64backimg => {
                    this.base64image = gotbase64backimg;
                    this.base64image = this.base64image.split(",")[1];
                    this.httpDataService.updateImage(["", this.itemCode, this.base64image])
                        .subscribe(getSubAreacode => {
                            this.popupVisible2 = false;
                            this.getImag();
                            this.getItemImageDetails();
                        });
                }
                );
        }
    }


    getImag() {
        this.httpDataService.getItemImage(["", this.itemCode])
            .subscribe(getCustImage => {
                this.itemImageData = getCustImage[0];
                if (this.itemImageData != undefined)
                    this.itemimagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,'
                        + this.itemImageData["ItemImageText"]);
            });
    }

    onEcomCategoryChnage(event: any) {
        if (event.event != undefined ? event.value != event.previousValue : false) {
            this.woocommerceDetails.Category = event.value;
        }
    }

    onLazadaBrandChange(event: any) {
        if (event.event != undefined ? event.value != event.previousValue : false) {
            this.LazadaDetails.brand = event.value;
        }
    }

    onLazadaWarrantyChange(event: any) {
        if (event.event != undefined ? event.value != event.previousValue : false) {
            this.LazadaDetails.warranty = event.value;
        }
    }

    onShopeelogisticsChange(event: any) {
        if (event.event != undefined ? event.value != event.previousValue : false) {
            this.shopeeDetails.Logistics = event.value;
            this.shopeeLogisticsArray = this.getDimensionsByFilter(this.shopeeDetails.Logistics);
            if (this.shopeeLogisticsArray[0]['enabled'] == true) {
                delete this.shopeeLogisticsArray[0]['weight_limits'];
                delete this.shopeeLogisticsArray[0]['item_max_dimension'];
                delete this.shopeeLogisticsArray[0]['has_cod'];
                delete this.shopeeLogisticsArray[0]['sizes'];
                delete this.shopeeLogisticsArray[0]['logistic_name'];
                delete this.shopeeLogisticsArray[0]['preferred'];
                delete this.shopeeLogisticsArray[0]['fee_type'];

                this.shopeeLogisticsArray[0]['shipping_fee'] = 0.0;
                this.shopeeLogisticsArray[0]['is_free'] = true;
            } else {
                this.toastr.error("Logistics not Enabled. Please Enable it.");
            }

        }
    }

    onIntegrationFieldsChanges(event) {
        if (event.dataField == 'Woocommerce') {
            if (event.value) {
                this.woocommercepopup = true;
                this.woocommerceDetails.Description = this.ItemDetails["Description"];
                this.woocommerceDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.woocommerceDetails.Description2 = this.ItemDetails["Description2"];
                this.woocommerceDetails.ItemCode = this.ItemDetails["ItemCode"];
                this.httpDataService.woo_listAllProdCategory([""])
                    .subscribe(getItemColorGroup => {
                        this.woocommerceCategorySuggestions = new DataSource({
                            store: <String[]>getItemColorGroup,
                            paginate: true,
                            pageSize: 10
                        });
                    });
            } else {
                let result = confirm("<p>Are you sure want to Inactive this Item?</p>", "IN-ACTIVE");
                result.then((dialogResult) => {
                    if (dialogResult) {
                        this.httpDataService.UPDATEHeader(["", "Woocommerce", "No", this.itemCode])
                            .subscribe(UPDATEHeader => {
                                if (UPDATEHeader == 1) {
                                    this.httpDataService.getitemcrossreferencecode2(["",
                                        this.itemCode, 'WOOCOMMERCE']).subscribe(getitemcrossreferencecode2 => {
                                            this.httpDataService.woo_deleteProduct(["",
                                                getitemcrossreferencecode2[0]["ReferenceCode"]]).subscribe(woo_deleteProduct => {
                                                    this.toastr.success("Item Deleted Successfully");
                                                    this.httpDataService.deleteNewItemcrossreference(["",
                                                        this.itemCode]).subscribe(deleteNewItemcrossreference => {
                                                            this.gridContainerICR.instance.refresh();
                                                        });
                                                });
                                        });
                                } else {
                                    this.toastr.success("Something went Wrong! Please try Again!");
                                }
                            });
                    }
                });
            }
        } else if (event.dataField == 'Lazada') {
            if (event.value) {
                this.ItemIntegrationDetails = {};
                this.lazadapopup = true;
                this.ItemIntegrationDetails.Description = this.ItemDetails["Description"];
                this.ItemIntegrationDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.ItemIntegrationDetails.Description2 = this.ItemDetails["Description2"];
                this.ItemIntegrationDetails.ItemCode = this.ItemDetails["ItemCode"];

                /* this.httpDataService.GetCategoryTree(["", ""])
                    .subscribe(getSubAreacode => {
                        var data = JSON.parse(getSubAreacode["data"][0], function(k, v) {
                            if (k === "category_id")
                                this.id = v;
                            else if (k === "children")
                                this.sub = v;
                            else if (k === "name")
                                this.title = v;
                            else
                                return v;
                        });
                        console.log(data);
                        var comboTree;
                        //comboTree = (<any>$('#example')).comboTree('loadData', data);
                        comboTree = (<any>$('#example')).comboTree({
                            source: data,
                            isMultiple: false
                        });
                    }); */

            } else {
                let result = confirm("<p>Are you sure want to Inactive this Item?</p>", "IN-ACTIVE");
                result.then((dialogResult) => {
                    if (dialogResult) {
                        this.httpDataService.deleteItemcrossreference(["",
                            this.itemCode, "LAZADA"]).subscribe(deleteItemcrossreference => {
                                if (deleteItemcrossreference > 0) {
                                    this.httpDataService.UPDATEHeader(["", "Lazada", "No", this.itemCode])
                                        .subscribe(UPDATEHeader => { });
                                }
                                this.gridContainerICR.instance.refresh();
                            });
                    }
                });
            }
        } else if (event.dataField == 'Shopee') {
            if (event.value) {
                this.ItemIntegrationDetails = {};
                this.shopeepopup = true;
                this.ItemIntegrationDetails.Description = this.ItemDetails["Description"];
                this.ItemIntegrationDetails.UnitPrice = this.ItemDetails["UnitPrice"];
                this.ItemIntegrationDetails.Description2 = this.ItemDetails["Description2"];
                this.ItemIntegrationDetails.ItemCode = this.ItemDetails["ItemCode"];
            } else {
                let result = confirm("<p>Are you sure want to Inactive this Item?</p>", "IN-ACTIVE");
                result.then((dialogResult) => {
                    if (dialogResult) {
                        this.httpDataService.deleteItemcrossreference(["",
                            this.itemCode, "SHOPEE"]).subscribe(deleteItemcrossreference => {
                                if (deleteItemcrossreference > 0) {
                                    this.httpDataService.UPDATEHeader(["", "Shopee", "No", this.itemCode])
                                        .subscribe(UPDATEHeader => { });
                                }
                                this.gridContainerICR.instance.refresh();
                            });
                    }
                });
            }
        }
    }

    OnclickItemAdd(party) {
        if (this.itemImageDetails["ItemImageURL"] == "/assets/images/big/img.png") {
            this.toastr.warning("Please upload the image!");
        } else {
            if (party == 'WOOCOMMERCE') {
                this.waitingDialogue = true;
                this.httpDataService.UPDATEHeader(["", "Woocommerce", "Yes", this.itemCode])
                    .subscribe(UPDATEHeader => {
                        if (UPDATEHeader == 1) {
                            this.httpDataService.woo_createProducts(["",
                                this.woocommerceDetails["ItemCode"],
                                'simple',
                                this.woocommerceDetails["UnitPrice"],
                                this.woocommerceDetails["Description"],
                                this.woocommerceDetails["Category"],
                                this.itemImageDetails["ItemImageURL"]])
                                .subscribe(getStatus => {
                                    this.ItemIntegrationDetails = getStatus;
                                    this.toastr.success("Item Added successfully, With the Id : " + getStatus.id);
                                    this.httpDataService.INSERTNewItemcrossreference(["",
                                        this.ItemDetails["ItemCode"],
                                        "WOOCOMMERCE",
                                        this.ItemIntegrationDetails.permalink,
                                        this.ItemIntegrationDetails.id,
                                        this.ItemIntegrationDetails.name,
                                        this.ItemIntegrationDetails.price])
                                        .subscribe(INSERTNewItemcrossreference => {
                                            this.newIntegrationItemAdd = false;
                                            this.waitingDialogue = false;
                                            this.gridContainerICR.instance.refresh();
                                            if (INSERTNewItemcrossreference == 1) {

                                            } else {
                                                this.toastr.error("Item Already Exists!");
                                            }
                                        });
                                });
                        } else {
                            this.toastr.error("Something went wrong. Please try again!");
                        }
                    });
            } else if (party == 'SHOPIFY') {
                this.waitingDialogue = true;
                this.httpDataService.Create_product(["",
                    this.ShopifyDetails["ItemCode"],
                    this.ShopifyDetails["Description"],
                    this.ItemDetails["Category"],
                    this.ShopifyDetails["UnitPrice"],
                    this.itemImageDetails["ItemImageURL"],
                    this.ItemDetails["ItemCode"]
                ]).subscribe(getStatus => {
                    this.ItemIntegrationDetails = getStatus["product"];
                    this.toastr.success("Item Added successfully, With the Id : " + this.ItemIntegrationDetails.id);
                    this.httpDataService.INSERTNewItemcrossreference(["",
                        this.ItemDetails["ItemCode"],
                        "SHOPIFY",
                        '/products/' + this.ItemIntegrationDetails.handle,
                        this.ItemIntegrationDetails.id,
                        this.ItemIntegrationDetails.body_html,
                        this.ShopifyDetails["UnitPrice"]])
                        .subscribe(INSERTNewItemcrossreference => {
                            this.newIntegrationItemAdd = false;
                            this.waitingDialogue = false;
                            this.gridContainerICR.instance.refresh();
                            if (INSERTNewItemcrossreference == 1) {

                            } else {
                                this.toastr.error("Item Already Exists!");
                            }
                        });
                });

            } else if (party == 'SHOPEE') {
                this.waitingDialogue = true;
                if (this.shopeeDetails["Logistics"] == '' || this.shopeeDetails["Logistics"] == null || this.shopeeDetails["Logistics"] == undefined) {
                    this.toastr.error("Please Select Logistic!");
                    this.waitingDialogue = false;
                } else {
                    if (this.shopeeDetails["Category"] == '' || this.shopeeDetails["Category"] == null || this.shopeeDetails["Category"] == undefined) {
                        this.toastr.error("Please Select Category!");
                        this.waitingDialogue = false;
                    } else {
                        this.httpDataService.add(["",
                            this.shopeeDetails["Category"]["category_id"],
                            this.shopeeDetails["Description"],
                            this.shopeeDetails["ItemCode"],
                            this.shopeeLogisticsArray,
                            +this.shopeeDetails["UnitPrice"],
                            this.shopeeDetails["Description"],
                        ]).subscribe(INSERTNewItemcrossreference => {
                            this.waitingDialogue = false;
                            this.newIntegrationItemAdd = false;
                            if (INSERTNewItemcrossreference["item_id"]) {
                                this.toastr.success(INSERTNewItemcrossreference["msg"]);
                                this.httpDataService.INSERTNewItemcrossreference(["",
                                    this.ItemDetails["ItemCode"],
                                    "SHOPEE",
                                    "",
                                    INSERTNewItemcrossreference["item_id"],
                                    this.shopeeDetails["Description"],
                                    this.shopeeDetails["UnitPrice"]])
                                    .subscribe(INSERTNewItemcrossreference => {
                                        this.gridContainerICR.instance.refresh();
                                        if (INSERTNewItemcrossreference < 0) {
                                            this.toastr.error("Item Already Exists!", "Duplicate");
                                        }
                                    });
                            } else {
                                this.toastr.error(INSERTNewItemcrossreference["msg"]);
                            }
                        });
                    }
                }
            } else if (party == 'LAZADA') {
                this.waitingDialogue = true;
                if (this.LazadaDetails["brand"] == '' || this.LazadaDetails["brand"] == null || this.LazadaDetails["brand"] == undefined) {
                    this.toastr.error("Please Select brand!");
                    this.waitingDialogue = false;
                } else {
                    if (this.LazadaDetails["Category"] == '' || this.LazadaDetails["Category"] == null || this.LazadaDetails["Category"] == undefined) {
                        this.toastr.error("Please Select Category!");
                        this.waitingDialogue = false;
                    } else {
                        if (this.LazadaDetails["warranty"] == '' || this.LazadaDetails["warranty"] == null || this.LazadaDetails["warranty"] == undefined) {
                            this.toastr.error("Please Select Warranty!");
                            this.waitingDialogue = false;
                        } else {
                            this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
                            this.httpDataService.create_Product(["",
                                this.tokenofLazofromBack,
                                this.LazadaDetails["ItemCode"],
                                this.LazadaDetails["Category"],
                                this.LazadaDetails["brand"],
                                this.LazadaDetails["ItemCode"],
                                this.LazadaDetails["warranty"],
                                this.LazadaDetails["ItemCode"],
                            ]).subscribe(INSERTNewItemcrossreference => {
                                this.waitingDialogue = false;
                                this.newIntegrationItemAdd = false;
                                if (INSERTNewItemcrossreference["code"] == "500") {
                                    this.toastr.error("Create Item Failed. Please try again!");
                                } else if (INSERTNewItemcrossreference["code"] == "0") {
                                    this.toastr.success(INSERTNewItemcrossreference["data"]["item_id"]);
                                    this.httpDataService.INSERTNewItemcrossreference(["",
                                        this.ItemDetails["ItemCode"],
                                        "LAZADA",
                                        "",
                                        INSERTNewItemcrossreference["data"]["sku_list"][0]["shop_sku"],
                                        this.LazadaDetails["Description"],
                                        this.LazadaDetails["UnitPrice"]])
                                        .subscribe(INSERTNewItemcrossreference => {
                                            this.gridContainerICR.instance.refresh();
                                            if (INSERTNewItemcrossreference < 0) {
                                                this.toastr.error("Item Already Exists!", "Duplicate");
                                            }
                                        });
                                } else {
                                    this.toastr.error("Create Item Failed. Please try again!");
                                }
                            });
                        }
                    }
                }
            } else if (party == 'FLIPKART') {

            }
        }
    }

    onLazadaSaveButtonClick() {
        this.httpDataService.INSERTNewItemcrossreference(["",
            this.ItemDetails["ItemCode"],
            "LAZADA",
            "",
            this.ItemIntegrationDetails["ReferenceId"],
            this.ItemIntegrationDetails["Description"],
            this.ItemIntegrationDetails["UnitPrice"]])
            .subscribe(INSERTNewItemcrossreference => {
                this.lazadapopup = false;
                this.gridContainerICR.instance.refresh();
                if (INSERTNewItemcrossreference < 0) {
                    this.toastr.error("Item Already Exists!", "Duplicate");
                }
                this.httpDataService.UPDATEHeader(["", "Lazada", "Yes", this.itemCode])
                    .subscribe(UPDATEHeader => { });
            });
        /* if (this.itemImageDetails["ItemImageURL"] == "/assets/images/big/img.png") {
            this.toastr.warning("Please upload the image!");
        } else {
            this.httpDataService.LazadaCreateProduct(["",
                UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO"),
                12,
                this.woocommerceDetails["Description"],
                this.woocommerceDetails["Description2"],
                this.woocommerceDetails["Brand"],
                this.woocommerceDetails["Model"],
                this.woocommerceDetails["kid_years"],
                this.woocommerceDetails["SellerSku"],
                this.woocommerceDetails["color_family"],
                this.woocommerceDetails["size"],
                this.woocommerceDetails["quantity"],
                this.woocommerceDetails["UnitPrice"],
                this.woocommerceDetails["package_length"],
                this.woocommerceDetails["package_height"],
                this.woocommerceDetails["package_weight"],
                this.woocommerceDetails["package_width"],
                this.woocommerceDetails["package_width"],
                this.itemImageDetails["ItemImageURL"],
                this.itemImageDetails["ItemImageURL"]])
                .subscribe(getStatus => {
                    this.ItemIntegrationDetails = getStatus;
                    this.toastr.success("Item Added successfully, With the Id : " + getStatus.id);
                    this.httpDataService.INSERTNewItemcrossreference(["",
                        this.ItemDetails["ItemCode"],
                        "LAZADA",
                        this.ItemIntegrationDetails.permalink,
                        this.ItemIntegrationDetails.id,
                        this.ItemIntegrationDetails.name,
                        this.ItemIntegrationDetails.price])
                        .subscribe(INSERTNewItemcrossreference => {
                            this.woocommercepopup = false;
                            this.gridContainerICR.instance.refresh();
                            if (INSERTNewItemcrossreference < 0) {
                                this.toastr.error("Item Already Exists!");
                            }
                            this.httpDataService.UPDATEHeader(["", "Lazada", "Yes", this.itemCode]).subscribe(UPDATEHeader => { });
                        });
                });
        } */
    }

    onShopeeSaveButtonClick() {
        this.httpDataService.INSERTNewItemcrossreference(["",
            this.ItemDetails["ItemCode"],
            "SHOPEE",
            "",
            this.ItemIntegrationDetails["ReferenceId"],
            this.ItemIntegrationDetails["Description"],
            this.ItemIntegrationDetails["UnitPrice"]])
            .subscribe(INSERTNewItemcrossreference => {
                this.shopeepopup = false;
                this.gridContainerICR.instance.refresh();
                if (INSERTNewItemcrossreference < 0) {
                    this.toastr.error("Item Already Exists!", "Duplicate");
                }
                this.httpDataService.UPDATEHeader(["", "Shopee", "Yes", this.itemCode])
                    .subscribe(UPDATEHeader => { });
            });
    }


    onChange1(event) {
        if (event.changed != undefined) {
            switch (event.changed.component.type) {
                // this is for feature work for the other components
                /* case "":
                    //this.valueforJson = event.changed.component.checked;
                    break; */
                default:
                    this.valueforJson = event.changed.value;
            }
            this.keyforJson = event.changed.component.label;

            this.httpDataService.getJSON3(["", this.itemCode])
                .subscribe(getJSON3 => {
                    var jsonStr = getJSON3[0]["attribute"];
                    var obj = JSON.parse(jsonStr);

                    var thisC = this;
                    obj['attribute'] = obj['attribute'].filter(function (item) {
                        return (Object.keys(item) != thisC.keyforJson);
                    });
                    obj['attribute'].push({ [this.keyforJson]: this.valueforJson });
                    jsonStr = JSON.stringify(obj);

                    this.httpDataService.storeJsonAtrributeByJson(["", jsonStr, this.itemCode])
                        .subscribe(storeJsonAtrribute => {
                        });
                });
        }
    }


    errorHandlingToasterForUPDATE(dataStatus) {
        if (dataStatus >= 0) {
            this.toastr.success("Successfully Updated", "DONE");
        } else {
            this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
        }
        this.getItemDetails();
    }

}
