import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef, ReflectiveInjector } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
var jsPDF = require('jspdf');
import * as html2canvas from "html2canvas";
let variable = require('../../../assets/js/rhbusfont.json');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import { confirm } from 'devextreme/ui/dialog';
import * as events from "devextreme/events";
import { PurchaseOrderHttpDataService } from './purchaseorder-http-data.service';
import { CompundDiscountService } from '../../Utility/compund-discount.service';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})
export class PurchaseorderComponent implements OnInit, AfterViewInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;
  @ViewChild("gridContainerSUCodeAdd") gridContainerSUCodeAdd: DxDataGridComponent;
  @ViewChild("gridContainerItemListOnWarehouse") gridContainerItemListOnWarehouse: DxDataGridComponent;
  @ViewChild('pdf1', { read: ViewContainerRef }) pdf1: ViewContainerRef;

  Vendor: any = {};
  dataSource: any = {};
  PONumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PONumber');
  isLinesExist: boolean = false;
  POFlowResult: boolean = true;
  POFlowResult2: boolean = true;
  POFlowResult3: boolean = true;
  isFlowCompleted: boolean = false;
  printLines = null;
  printHeader = null;
  companyHeader = null;
  linetotal: Number = 0;
  InvoiceTotal: Number = 0;
  DiscountPerc: Number = 0;
  SubTotal: Number = 0;
  Tax: Number = 0;
  Total: Number = 0;
  TotalDeposit: Number = 0;
  lineTotal: Number = 0;
  amtincvatvalue: Number = 0;
  TotalQuantity: Number = 0;

  isPoLineAdded: boolean = true;
  isVendCodeAdded: boolean = false;
  isQuotelinesPopUP: boolean = false;
  isConvertSOPopUP: boolean = false;
  isAddSUCodePopUP: boolean = false;
  isSUCodeLinesExist: boolean = false;

  itemArray: any = [];
  serviceitemArray: any = [];
  deposititemArray: any = [];
  poLineSUDG: any = {};
  addedSuCodeItem: {} = null;
  duplicatePurchHeader: string[];
  vendorSuggestions: any = null;
  receiveLocSuggestions: any = null;
  receiveLocSuggestionsLookup: any = {};
  custListSuggestions: any = null;
  storeListSuggestions: any = null;
  suListSuggestions: any = null;
  currencySuggestions: any = null;
  PurchaseOrderOperations: any = [];
  LineTypeSuggestion: any = [{ Code: 'ITEM' }, { Code: 'SERVICEITEM' }, { Code: 'DEPOSIT' }];
  quoteList: any = {};
  barcodeList: any;
  dataSourceBarcodeToPrint: any = [];
  barcodeSelected: boolean = false;
  newBarcodeDetails: any = {};
  customerList: any = {};
  suList: any = {};
  pieChartData: any = [];
  columnHeader1 = [
    { title: "Purchaser", dataKey: "OurPurchaser", width: 40 },
    { title: "Currency", dataKey: "CurrencyCode", width: 40 },
    { title: "Exc. Rate", dataKey: "ExchangeRate", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 }
  ];
  columnHeader2 = [
    { title: "ItemCode", dataKey: "ItemCode", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Cost", dataKey: "DirectUnitCost", width: 40 },
    { title: "Line.Disc", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Amount", dataKey: "LineAmount", width: 40 }
  ];
  columnHeader3 = [
    { title: "Prepared By", dataKey: "Prepared", width: 40 },
    { title: "Checked By", dataKey: "Checked", width: 40 },
    { title: "Approved By", dataKey: "Aproved", width: 40 },
    { title: "Authorized Sign", dataKey: "Authorized", width: 40 }
  ];
  columnRow3 = [
    { Prepared: "", Checked: "", Aproved: "", Authorized: "" },
    { Prepared: "....../......./.......", Checked: "....../......./.......", Aproved: "....../......./.......", Authorized: "....../......./......." }
  ];
  columnHeader4 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "HSN", dataKey: "HSNCode", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "Price", dataKey: "DirectUnitCost", width: 40 },
    { title: "Line.Disc", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Amount", dataKey: "LineAmount", width: 40 },
  ];
  columnHeader5 = [
    { title: "HSN/SAC", dataKey: "PayToName", width: 40 },
    { title: "Taxable Value", dataKey: "CurrencyCode", width: 40 },
    { title: "IGST%", dataKey: "ExchangeRate", width: 40 },
    { title: "IGST Amount", dataKey: "DueDate", width: 40 },
    { title: "Total GST Amount", dataKey: "DueDate", width: 40 }
  ];

  eventsArray: Array<string> = [];
  isBarCodePopUP: boolean = false;
  isDivVisible: boolean = false;
  Check: boolean = false;
  selectedItemCode: String = null;
  popupVisible: boolean;
  newVendorDetail: any[];
  addNewVendValue: Object;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  itemLookupDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalServiceItemLookupPopup: boolean = false;
  globalDepositItemLookupPopup: boolean = false;
  globalCurrencyLookupPopup: boolean = false;
  popupBuyVendorDetails: Boolean = false;
  popupPayVendorDetails: Boolean = false;
  globalVendorLookupPopup: boolean = false;
  globalExpectedReciptDatepopup: boolean = false;
  isGRCreated: boolean = false;
  ExpectedReciptDate: any = {};
  typeOfVendor: String = '';
  itemPopupName: string = "ITEM DETAILS";
  isIndian: boolean = false;
  TAX;
  TotalLineDiscountAmount: any;
  totalInvoiceDisocunt: string;
  dataBarcodeQuantityToPrint: any = [];
  itemLookupSuggestionDataGrid: any = [];


  constructor(
    private httpDataService: PurchaseOrderHttpDataService,
    public router: Router,
    private toastr: ToastrService,
    private compoundDiscount: CompundDiscountService
  ) {
    this.getTheItemLookup = this.getTheItemLookup.bind(this);
    this.setDiscountValue = this.setDiscountValue.bind(this);
    this.setPriceValue = this.setPriceValue.bind(this);
    this.setQuantityValue = this.setQuantityValue.bind(this);
  }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "Description", "UOM", "DirectUnitCost", "Quantity", "LineDiscountAmount",
        "location", "LineType", "LineDiscountAmtText", "CostIncVAT", "VatAmount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.openPOLines(thisComponent.PONumber).subscribe(dataLines => {
          if (Object.keys(dataLines).length > 0) {
            thisComponent.isLinesExist = true;
          } else {
            thisComponent.isLinesExist = false;
          }
          thisComponent.printLines = dataLines;
          thisComponent.calculateForSummary();
          for (var i = 0; i < Object.keys(dataLines).length; i++) {
            dataLines[i]["LineDiscountAmount"] = parseFloat(dataLines[i]["LineDiscountAmount"]).toFixed(2);
          }
          devru.resolve(dataLines);
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        if (Number(thisComponent.Vendor["InvDiscountAmount"]) == 0) {
          if (key["LineType"] == 'DEPOSIT') {
            thisComponent.httpDataService.deleteDepositItemLines1(thisComponent.PONumber,
              key["LineNo"], key["ItemCode"]).subscribe(dataStatus => {
                if (dataStatus[0] == 'DONE') {
                  devru.resolve(dataStatus);
                } else {
                  devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
                }
              });
          } else {
            thisComponent.httpDataService.deleteItemLines1(key["LineNo"]).subscribe(dataStatus => {
              if (dataStatus == 0) {
                devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
              } else {
                devru.resolve(dataStatus);
              }
            });
          }
        } else {
          devru.resolve();
          thisComponent.toastr.warning("Line Operation cannot be performed, as INVOICE DISCOUNT IS APPLIED");
        }
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["LineType"] == 'ITEM') {
          var GAmount: Number = (Number(values["Quantity"]) * Number(values["DirectUnitCost"]));
          thisComponent.httpDataService.CompoundDiscountP(["", GAmount, values["LineDiscountAmount"]])
            .subscribe(dataDiscLines => {
              var disc = 0;
              if (dataDiscLines[0] == "invalid value") {
                values["LineDiscountAmount"] = 0;
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
              thisComponent.httpDataService.itemInsertClickHandler(thisComponent.PONumber,
                values["ItemCode"],
                thisComponent.Vendor["AmtIncvat"] == true ? 'Yes' : 'No',
                values["DirectUnitCost"],
                values["Quantity"],
                disc.toString(),
                values["LineDiscountAmount"],
                values["UOM"],
                thisComponent.Vendor["ReceiveToLocation"]).subscribe(dataStatus => {
                  if (dataStatus[0] == 'DONE') {
                    devru.resolve(dataStatus);
                  } else {
                    devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
                  }
                });
            });
        }
        else if (values["LineType"] == 'SERVICEITEM') {
          thisComponent.httpDataService.addServiceLine(["", thisComponent.PONumber,
            values["ItemCode"],
            values["DirectUnitCost"]]).subscribe(dataStatus => {
              if (dataStatus[0] == 'DONE') {
                devru.resolve(dataStatus);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
              }
            });
        }
        else {
          thisComponent.httpDataService.depsoitDG_itemDoubleClickHandler(["", thisComponent.PONumber,
            values["ItemCode"]]).subscribe(dataStatus => {
              if (dataStatus[0] == 'DONE') {
                devru.resolve(dataStatus);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
              }
            });
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        if (Number(thisComponent.Vendor["InvDiscountAmount"]) == 0) {
          var GAmount: Number = (Number(getUpdateValues(key, newValues, "Quantity")) * Number(getUpdateValues(key, newValues, "DirectUnitCost")));
          newValues["LineDiscountAmtText"] = newValues["LineDiscountAmount"] != null ? newValues["LineDiscountAmount"] : getUpdateValues(key, newValues, "LineDiscountAmtText");
          thisComponent.httpDataService.CompoundDiscountP(["", GAmount, getUpdateValues(key, newValues, "LineDiscountAmount")])
            .subscribe(dataDiscLines => {
              var disc = 0;
              if (dataDiscLines[0] == "invalid value") {
                newValues["LineDiscountAmtText"] = 0;
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
              thisComponent.httpDataService.itemUpdateClickHandler(thisComponent.PONumber,
                getUpdateValues(key, newValues, "ItemCode"),
                getUpdateValues(key, newValues, "LineNo"),
                getUpdateValues(key, newValues, "Quantity"),
                getUpdateValues(key, newValues, "DirectUnitCost"),
                disc.toString(),
                getUpdateValues(key, newValues, "LineDiscountAmtText"),
                getUpdateValues(key, newValues, "Description"),
                getUpdateValues(key, newValues, "location")).subscribe(dataStatus => {
                  if (dataStatus[0] == 'DONE') {
                    devru.resolve(dataStatus);
                  } else {
                    devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is " + dataStatus[0]);
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

    this.httpDataService.getCompanyInfo().subscribe(getCompany => {
      this.companyHeader = getCompany[0];
      if (this.companyHeader["CountryCode"] == 'IND') {
        if (this.companyHeader["HasINLocalization"] == 'Yes') {
          this.isIndian = true;
        }
      }

    });

    this.vendorSuggestions = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getVendorList().subscribe(getVendor => {
          devru.resolve(getVendor);
        });
        return devru.promise();
      }
    });

    this.itemArray = new CustomStore({
      key: ["ItemCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.GetSOItemList(thisComponent.PONumber, '1').subscribe(getItem => {
          devru.resolve(getItem);
        });
        return devru.promise();
      }
    });

    this.serviceitemArray = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getServiceItems().subscribe(getSItem => {
          devru.resolve(getSItem);
        });
        return devru.promise();
      }
    });

    this.httpDataService.getLocationList3().subscribe(getLocation => {
      this.receiveLocSuggestions = new DataSource({
        store: <String[]>getLocation,
        paginate: true,
        pageSize: 20
      });
    });

    this.httpDataService.getLocationList4().subscribe(getLocation => {
      this.receiveLocSuggestionsLookup = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () => <String[]>getLocation
      }
    });

    this.httpDataService.getCustomerList([""])
      .subscribe(gotCustList => {
        this.custListSuggestions = new DataSource({
          store: <String[]>gotCustList,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.handleConnectedconsstore([""])
      .subscribe(gotStoreList => {
        this.storeListSuggestions = new DataSource({
          store: <String[]>gotStoreList,
          paginate: true,
          pageSize: 10
        });
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.poLineSUDG.store = new CustomStore({
      key: ["ItemCode", "Description", "UOM", "location"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.openPONoSULines(["", thisComponent.PONumber, 'ITEM']).subscribe(dataLines => {
          if (Object.keys(dataLines).length > 0) {
            thisComponent.isSUCodeLinesExist = true;
          } else {
            thisComponent.isSUCodeLinesExist = false;
          }
          devru.resolve(dataLines);
        });
        return devru.promise();
      }
    });

    this.quoteList = new DataSource({
      store: new CustomStore({
        load: function (loadOptions) {
          var devru = $.Deferred();
          thisComponent.httpDataService.getAllLines(["",
            thisComponent.Vendor["BuyFromVendor"]]).subscribe(dataLines => {
              if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
                if (Object.keys(thisComponent.dataBarcodeQuantityToPrint).length == 0) {
                  for (var i = 0; i < Object.keys(dataLines).length; i++) {
                    thisComponent.dataBarcodeQuantityToPrint.push(dataLines[i]);
                  }
                }
                for (var i = 0; i < Object.keys(dataLines).length; i++) {
                  dataLines[i].Qty = thisComponent.dataBarcodeQuantityToPrint[i].Qty;
                }
              }
              devru.resolve(dataLines);
            });
          return devru.promise();
        },
        update: function (key, newValues) {
          var devru = $.Deferred();
          for (var index = 0; index < Object.keys(thisComponent.dataBarcodeQuantityToPrint).length; index++) {
            if (thisComponent.dataBarcodeQuantityToPrint[index].LineNo == key.LineNo) {
              thisComponent.dataBarcodeQuantityToPrint[index].Qty = newValues[Object.keys(newValues)[0]];
              break;
            }
          }
          devru.resolve(newValues);
          return devru.promise();
        }
      })
    });

  }

  ngAfterViewInit() {
    //this.addQuotesLinestoPO();
  }

  onHiding(e){
    this.gridContainer ? this.gridContainer.instance.refresh() : "";
  }


  addQuotesLinestoPOByLine(data) {
    if ((data.key["Quantity"] >= data.key["Qty"]) && (data.key["Qty"] > 0)) {
      this.httpDataService.btnAddLinePressed(["",
        this.PONumber, this.Vendor["BuyFromVendor"],
        data.key["DocumentNo"],
        data.key["LineNo"],
        data.key["Qty"]]).subscribe(data2 => {
          if (data2[0] == 'DONE') {
            this.dataBarcodeQuantityToPrint = [];
            this.gridContainer3.instance.refresh();
            this.toastr.success("Line Added Successfully, Summary : 1");
            this.gridContainer ? this.gridContainer.instance.refresh() : "";
          } else {
            this.toastr.error("Line Adding Failed : " + data2[0]);
          }
        });
    } else {
      this.toastr.warning("Qty should be between 1 to " + data.key["Quantity"] + " For :" + data.key["DocumentNo"] + " ItemCode " + data.key["ItemCode"]);
    }
  }

  addQuotesLinestoPOSelected() {
    var data = this.gridContainer3.instance.getSelectedRowKeys();
    var count = 0;
    let loop = (Loopdata: any) => {
      if ((data[0]["Quantity"] >= data[0]["Qty"]) && (data[0]["Qty"] > 0)) {
        this.httpDataService.btnAddLinePressed(["",
          this.PONumber, this.Vendor["BuyFromVendor"],
          data[0]["DocumentNo"],
          data[0]["LineNo"],
          data[0]["Qty"]]).subscribe(data2 => {
            if (data2[0] != 'DONE') {
              this.toastr.error("Failed For : " + data[0]["DocumentNo"] + " ItemCode " + data[0]["ItemCode"] + " Error " + data2[0])
            } else count++;
            if (Object.keys(data).length > 1) {
              loop(data.shift());
            } else {
              this.dataBarcodeQuantityToPrint = [];
              this.gridContainer3.instance.refresh();
              this.isQuotelinesPopUP = false;
              this.toastr.success("Line Added Successfully, Summary : "+ count);
              this.gridContainer ? this.gridContainer.instance.refresh() : "";
            }
          });
      } else {
        if (Object.keys(data).length > 1) {
          loop(data.shift());
        } else {
          this.dataBarcodeQuantityToPrint = [];
          this.gridContainer3.instance.refresh();
          this.isQuotelinesPopUP = false;
          this.toastr.success("Line Added Successfully, Summary : "+ count);
          this.gridContainer ? this.gridContainer.instance.refresh() : "";
        }
        this.toastr.warning("Qty should be between 1 to " + data[0]["Quantity"] + " For :" + data[0]["DocumentNo"] + " ItemCode " + data[0]["ItemCode"]);
      }
    }
    loop(data);
  }

  suggestionFormateForVendor(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "VendCode");
  }

  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  hoverFormateForLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForLocationLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "location");
  }

  hoverFormateForLocationLookup(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "location", "Name");
  }

  suggestionFormatForStoreList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "StoreID", "Name");
  }
  suggestionFormatForsuList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "StorageUnitCode", "LocationCode");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "VendCode");
  }

  itemLookup2(data) {
    //return data ? data["ItemCode"] : "ItemCode";
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListHover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "ItemCode");
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "Description", "UOM", "StockOnHand");
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  suggestionFormatForCustList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  onReceiveLocationChanged(event) {
    if (this.Vendor["ReceiveToLocation"] != event.value) {
      if (event.value != null) {
        this.httpDataService.handleLocation(this.PONumber, '3', '',
          event.value, UtilsForGlobalData.getUserId()).subscribe(handleLocation => {
            if (handleLocation == 'DONE') {
              this.toastr.success("Successfully Updated", "DONE");
              this.gridContainer ? this.gridContainer.instance.refresh() : this.calculateForSummary();
            } else {
              this.toastr.error('Updated Failed!', "Try Again");
            }
          });
      } else {
        this.httpDataService.btnClearLoc_clickHandler(this.PONumber).subscribe(handleLocation => {
          this.errorHandlingToasterForUPDATE(handleLocation);
        });
      }
    }
  }

  onVendorSearchClicked(type) {
    this.typeOfVendor = type;
    this.globalVendorLookupPopup = true;
  }

  onVendorRowClicked(event) {
    this.globalVendorLookupPopup = false;
    this.httpDataService.updateVendorCode(this.PONumber, event.data.VendCode, this.typeOfVendor,
      UtilsForGlobalData.getUserId()).subscribe(dataStatus => {
        this.calculateForSummary();
        if (dataStatus[0] == 'POUPDATED' ? this.typeOfVendor == 'BuyFrom' : false) {
          this.getLookupForDataGrid(event.data.VendCode, this.Vendor["DocumentDate"]);
        } else {
          this.toastr.warning("Vendor Updation Failed!!, Error Status Code : " + dataStatus[0]);
        }
      });
  }

  CurrencyCodeLookupClicked() {
    this.httpDataService.getCurrencyList(this.Vendor["DocumentDate"]).subscribe(getCurrency => {
      this.globalCurrencyLookupPopup = true;
      this.currencySuggestions = <String[]>getCurrency;
    });
  }

  onCurrencyCodeSelected(event) {
    this.globalCurrencyLookupPopup = false;
    this.httpDataService.handleCurrencyCode(["",
      event.data.CurrencyCode, event.data.ExchangeRate, this.PONumber]).subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  onClearHandleCurrencyCode() {
    this.httpDataService.handleRemoveCurrencyCode(["",
      this.companyHeader.CurrencyCode, this.PONumber]).subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  PurchaseOrderOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Order') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.Vendor, this.printLines, "Purchase Order");
      } else {
        this.toastr.warning("Please add The Lines!!");
      }
    } else if (userOption == 'Get Quote Lines') {
      this.isQuotelinesPopUP = true;
      this.dataBarcodeQuantityToPrint = [];
      this.gridContainer3.instance.refresh();
    } else if (userOption == 'Convert To SO') {
      this.onConvertToSO();
    } else if (userOption == 'BarCode') {
      var thisComponent = this;
      this.isBarCodePopUP = true;
      thisComponent.httpDataService.getList(["",
        thisComponent.PONumber])
        .subscribe(dataLines => {
          this.barcodeList = dataLines;
        });
      /* this.barcodeList = new CustomStore({
        key: ["QuantityPrint", "ItemCode", "Barcode"],
        load: function (loadOptions) {
          var devru = $.Deferred();
          thisComponent.httpDataService.getList(["",
            thisComponent.PONumber])
            .subscribe(dataLines => {

              devru.resolve(dataLines);
            });
          return devru.promise();
        },
        update: function (key, newValues) {
          var devru = $.Deferred();
          devru.resolve(newValues);
          return devru.promise();
        }
      }); */
    } else {
      if (this.isLinesExist) {
        this.OnUserActionGo(userOption);
      } else {
        this.toastr.warning("Please add The Lines!!");
      }
    }
  }

  onConvertToSO() {
    if (this.Vendor["DocumentStatus"] == 'GRCOMPLETE' || this.Vendor["DocumentStatus"] == 'GRPARTIAL') {
      if (this.Vendor["HasSO"] == 'NO' || this.Vendor["HasSO"] == 'No') {
        this.isConvertSOPopUP = true;
      } else {
        this.toastr.warning("This P.O. is already converted to SalesOrder" + this.Vendor["ConnectedSONo"] + "SO EXISTS");
      }
    } else {
      this.toastr.warning("Goods Should be Received to create SO !!");
    }
  }

  OnUserActionGo(userOption) {
    if (this.Vendor['FlowCompleted'] == 'Yes') {
      this.toastr.error("Cannot Do those operation");
    }
    else if (this.Vendor['BuyFromVendor'].length == 0 || this.Vendor['BuyFromVendor'] == null) {
      this.toastr.error("Please Select The Vendor");
    }
    else {
      {
        var nextSequence: Number = 0;
        if (this.Vendor['FlowResult'] == 'On-Hold') {
          nextSequence = this.Vendor['CurrentSequence'];
        }
        else {
          nextSequence = Number(this.Vendor['CurrentSequence']) + 1;
        }
        if (false) { //this.Vendor["ConnectedCustCode"]
          this.httpDataService.checkCustomerCreditLimit(["",
            this.PONumber, this.Vendor["ConnectedCustCode"],
            this.Vendor["DocumentDate"]]).subscribe(creditLimit => {
              if (creditLimit[0] == 'CREDITAVAILABLE') {
                this.getProcessRole(userOption, nextSequence);
              } else {
                creditLimit[1] = creditLimit[1] ? creditLimit[1] : '';
                let result = confirm("<p>CREDIT LIMIT NOT AVAILAVLE, DO YOU STILL WANT TO CONTINUE?</p>", "OVER BALANCE : " + creditLimit[1]);
                result.then((dialogResult) => {
                  dialogResult ? this.getProcessRole(userOption, nextSequence) : "Canceled";
                });
              }
            });
        } else {
          this.getProcessRole(userOption, nextSequence);
        }
      }
    }
  }

  getProcessRole(userOption, nextSequence) {
    this.httpDataService.getProcessRole(UtilsForGlobalData.getUserRoleId(), nextSequence.toString()).subscribe(getProcessRole => {
      if (Object.keys(getProcessRole).length > 0) {
        this.httpDataService.getProcessFlow(nextSequence.toString()).subscribe(getProcessFlow => {
          if (getProcessFlow[0]["ResultIsChoice"] == 'No') {
            this.httpDataService.updateStatus(["",
              nextSequence.toString(),
              getProcessFlow[0]["ActionType"],
              getProcessFlow[0]["Result1"],
              getProcessFlow[0]["FinalStep"],
              getProcessFlow[0]["FlowLevel"],
              UtilsForGlobalData.getUserId(),
              this.PONumber
            ]).subscribe(updateStatus => {
              if (updateStatus == 1) {
                this.toastr.success("Status Updated Succesfully", userOption);
                this.calculateForSummary();
              }
              else {
                this.toastr.error("Error While Updating Status: " + userOption);
              }
            });
          } else {
            this.httpDataService.updateStatus(["",
              nextSequence.toString(),
              getProcessFlow[0]["ActionType"],
              userOption,
              getProcessFlow[0]["FinalStep"],
              getProcessFlow[0]["FlowLevel"],
              UtilsForGlobalData.getUserId(),
              this.PONumber]).subscribe(updateStatus => {
                if (updateStatus == 1) {
                  this.toastr.success("Status Updated Succesfully", userOption);
                  this.calculateForSummary();
                }
                else {
                  this.toastr.error("Error While Updating Status: " + userOption);
                }
              });
          }
        });
      }
      else {
        this.toastr.error("You Don't have permission to change Status");
      }
    });
  }

  barcodeValue(value: string): string[] {
    value = value == undefined ? '' : value;
    return value.split('\n');
  }

  onCustChanged(event: any) {
    this.customerList["CustCode"] = event.value;
  }

  onSUListChanged(event: any) {
    this.suList["StorageUnitCode"] = event.value;
  }

  onClickcustCode(event) {
    this.isConvertSOPopUP = false;
    this.httpDataService.handleSellToLookUpManager(["",
      this.PONumber, event.data.CustCode,
      UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
        if (dataStatus[0] == 'DONE') {
          this.gridContainer ? this.gridContainer.instance.refresh() : this.calculateForSummary();
          this.toastr.success("Sales Order successfully " + dataStatus[1] + " Created");
        } else {
          this.toastr.warning("Sales Order Creation Failed!!, Error Status Code : " + dataStatus[0]);
        }
      });
  }

  onConnectedCustCode(e) {
    if (e.value != null) {
      this.httpDataService.UPDATEHeader(["",
        'ConnectedCustCode', e.value, this.PONumber])
        .subscribe(dataStatus => {
          this.errorHandlingToasterForUPDATE(dataStatus);
        });
    }
  }

  onConsStoreChange(e) {
    if (e.value != null) {
      this.httpDataService.UPDATEHeader(["",
        'ConsignmentStore', e.value, this.PONumber])
        .subscribe(dataStatus => {
          this.errorHandlingToasterForUPDATE(dataStatus);
        });
    }
  }

  customizeLabel(arg) {
    return arg.argumentText + " ( " + arg.percentText + ")";
  }

  getBuyFromVendorDetail(event) {
    this.popupBuyVendorDetails = true;
  }

  getPayToVendorDetail(event) {
    this.popupPayVendorDetails = true;
  }

  onShown(evt: any) {
    var content = $(evt.component.content()[0]);
    var lookup = $(content.find('pdf1')[0]);
    //lookup.dxLookup('instance').option('value', 2);
  }

  onBarcodeRowEditingStart(event) {
    this.newBarcodeDetails = event.key;
    this.barcodeSelected = true;
    this.isDivVisible = true;
  }

  values(value: string): string[] {
    value = value == undefined ? '' : value;
    return value.split('\n');
  }

  printBarcode() {
    if (this.barcodeSelected) {
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.addFileToVFS("Garuda-Bold.tff", variable.thai6);
      pdf.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
      pdf.setFont(this.pdfFormate.SetFont);
      pdf.setFontType(this.pdfFormate.SetFontType);
      var data = document.getElementById('pdf1');
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
          pdf.text('' + this.companyHeader["Name"], pageStartX, pageStartY += LineSpace);
          pdf.text('' + this.companyHeader["Name"], pageStartX2, pageStartY);
          pdf.setFontSize(this.pdfFormate.BarcodeFont);
          pdf.text('Desc:' + this.newBarcodeDetails["Description1"], pageStartX, pageStartY += LineSpace);
          pdf.text('Desc:' + this.newBarcodeDetails["Description1"], pageStartX2, pageStartY);
          pdf.text('' + this.newBarcodeDetails["Description2"], pageStartX, pageStartY += LineSpace);
          pdf.text('' + this.newBarcodeDetails["Description2"], pageStartX2, pageStartY);
          pdf.text('MRP:' + this.formatNumber(this.newBarcodeDetails["UnitPrice"]), pageStartX, pageStartY += LineSpace);
          pdf.text('SIZE:' + this.newBarcodeDetails["Size"], pageStartX + 70, pageStartY);
          pdf.text('MRP:' + this.formatNumber(this.newBarcodeDetails["UnitPrice"]), pageStartX2, pageStartY);
          pdf.text('SIZE:' + this.newBarcodeDetails["Size"], pageStartX2 + 70, pageStartY);
          pdf.text('PO:' + this.newBarcodeDetails["DocumentNo"], pageStartX, pageStartY += LineSpace);
          pdf.text('PO:' + this.newBarcodeDetails["DocumentNo"], pageStartX2, pageStartY);
          pdf.addImage(contentDataURL, 'JPG', pageStartX, pageStartY += 5, imgWidth, imgHeight);
          pdf.addImage(contentDataURL, 'JPG', pageStartX2, pageStartY, imgWidth, imgHeight);
          pdf.text('' + this.newBarcodeDetails["ItemCode"], pageStartX, imgHeight += pageStartY);
          pdf.text('' + this.newBarcodeDetails["Brand"], pageStartX + 70, imgHeight);
          pdf.text('' + this.newBarcodeDetails["ItemCode"], pageStartX2, imgHeight);
          pdf.text('' + this.newBarcodeDetails["Brand"], pageStartX2 + 70, imgHeight);
          pdf.line(pageStartX2 - 5, 5, pageStartX2 - 5, imgHeight);
          //pdf.text("Page " + pdf.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, pdf.internal.pageSize.height - 10);
          if (Number(i + 1) == Math.ceil(this.newBarcodeDetails["QuantityPrint"] / 2)) {
            //pdf.output("dataurlnewwindow");
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
    //printDoc.output("dataurlnewwindow"); autoPrint();
    //} 

    /*var printDoc = new jsPDF();
    printDoc.fromHTML(hello, 10, 10, { 'width': 180 });
    printDoc.autoPrint();
    printDoc.output("dataurlnewwindow");*/
  }



  logEvent(eventName) {
    this.eventsArray.unshift(eventName);
    if (eventName == 'RowUpdated') {
      this.httpDataService.btnAddLinePressed(["",
        this.PONumber, this.Vendor["BuyFromVendor"],
        this.quoteList[0]["DocumentNo"],
        this.quoteList[0]["LineNo"],
        this.quoteList[0]["currQty"]])
        .subscribe(dataStatus => {
          if (dataStatus == 'DONE') {
            this.ngOnInit();
          } else {
            this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus, "Try Again");
          }
        });
    }
  }

  prepareFunc(e) {
    // console.log(e);
    if (e.dataField == "currQty") {
      e.editorOptions.disabled = false;
      //If e.row.inserted is true, means that the row is in the inserting mode. Otherwise the row in the updating mode.
      //In addition, you can check the e.dataField option to determine the name of the column.
    }
    else {
      e.editorOptions.disabled = true;
    }
  }

  calculateForSummary() {
    this.httpDataService.getPurchaseHeader(this.PONumber).subscribe(dataHeader => {
      this.assignToDuplicate(dataHeader);
      this.Vendor = dataHeader[0];
      this.printHeader = dataHeader;
      this.lineTotal = this.Vendor["Amount"] == null ? 0 : this.Vendor["Amount"];
      this.InvoiceTotal = this.Vendor["InvDiscountAmount"];
      this.DiscountPerc = this.Vendor["InvoiceCompoundDiscount"];
      this.SubTotal = this.lineTotal;
      this.setTheSettingStatus();
      this.httpDataService.getTotalLinesDiscAmt(['',
        this.PONumber]).subscribe(getTotalLinesDiscAmt => {
          this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
          this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.Vendor["InvDiscountAmount"])).toFixed(2);
        });
      this.httpDataService.getSumQuantityItem(['', this.PONumber]).subscribe(getSumQuantityItem => {
        this.TotalQuantity = getSumQuantityItem[0]["ttlQuantity"];
      });
      this.TAX = this.Vendor["AmountIncludingVAT"] - this.Vendor["Amount"];
      this.amtincvatvalue = this.Vendor["AmountIncludingVAT"] == null ? 0 : this.Vendor["AmountIncludingVAT"];
      this.Tax = Number(Number(this.amtincvatvalue) - Number(this.lineTotal));
      this.Total = Number(this.Vendor["AmountIncludingVAT"]);
      this.TotalDeposit = this.Vendor["DepositAmount"] == null ? 0 : this.Vendor["DepositAmount"];
      if ((this.printLines != null ? Object.keys(this.printLines).length > 0 : false)) {
        this.isPoLineAdded = true;
      } else {
        this.isPoLineAdded = false;
      }
      if (this.Vendor["AmtIncvat"] == 'Yes') {
        this.Vendor["AmtIncvat"] = true;
      } else {
        this.Vendor["AmtIncvat"] = false;
      }
      if (this.Vendor["BuyFromVendor"] != null) {
        if (this.Vendor["BuyFromVendor"] != '') {
          this.isVendCodeAdded = true;
        }
      }
      if (this.Vendor["FlowResult"] == 'Open' || this.Vendor["FlowResult"] == 'OPEN') {
        this.POFlowResult = true;
      }
      else {
        if (this.isPoLineAdded == false) {
          this.Check = true;
        }
      }
      this.setTheFlowStatusClr();

      if (Object.keys(this.itemLookupSuggestionDataGrid).length == 0) {
        this.getLookupForDataGrid(this.Vendor["PayToVendor"], this.Vendor["DocumentDate"]);
      }
    });
  }

  setTheFlowStatusClr() {
    var doc = <HTMLSpanElement>document.getElementById("docStatus");
    if (this.Vendor["FlowResult"] == 'Open' || this.Vendor["FlowResult"] == 'OPEN') {
      doc != null ? doc.classList.add("label-success") : '';
    } else if (this.Vendor["FlowResult"] == 'Approved' || this.Vendor["FlowResult"] == 'APPROVED') {
      doc != null ? doc.classList.add("label-info") : '';
    } else if (this.Vendor["FlowResult"] == 'Sent For Approval' || this.Vendor["FlowResult"] == 'SENT FOR APPROVAL') {
      doc != null ? doc.classList.add("label-info") : '';
    } else if (this.Vendor["FlowResult"] == 'Rejected' || this.Vendor["FlowResult"] == 'REJECTED') {
      doc != null ? doc.classList.add("label-danger") : '';
    }
  }


  setTheSettingStatus() {
    if (this.Vendor['FlowResult'] == 'Approved') {
      this.POFlowResult = false;
      this.PurchaseOrderOperations = ['Print Order', 'Convert To SO', 'Convert To CONS.', 'BarCode'];
    }
    else if (this.Vendor['FlowResult'] == 'Rejected') {
      this.POFlowResult = false;
      this.PurchaseOrderOperations = ['Print Order', 'Convert To SO', 'Convert To CONS.', 'BarCode'];
    }
    else if (this.Vendor['FlowResult'] == 'SENT FOR APPROVAL') {
      this.POFlowResult = true;
      this.PurchaseOrderOperations = ['Approved', 'Rejected', 'Print Order', 'Get Quote Lines', 'Convert To SO', 'Convert To CONS.', 'BarCode'];
    }
    else {
      this.POFlowResult = true;
      this.PurchaseOrderOperations = ['SENT FOR APPROVAL', 'Print Order', 'Get Quote Lines', 'Convert To SO', 'Convert To CONS.', 'BarCode'];
    }

    if (this.Vendor["BuyFromVendor"] != null ? this.Vendor["BuyFromVendor"] != '' : false) {
      this.POFlowResult2 = true;
    } else {
      this.POFlowResult2 = false;
    }

    if (this.Vendor["DocumentStatus"] == 'GRCOMPLETE' || this.Vendor["DocumentStatus"] == 'GRPARITIAL') {
      this.POFlowResult2 = false;
    } else {
      if (this.Vendor["BuyFromVendor"] != null ? this.Vendor["BuyFromVendor"] != '' : false) {
        this.POFlowResult2 = true;
        if (this.Vendor["FlowResult"] == 'Approved' || this.Vendor["FlowResult"] == 'Rejected') {
          this.POFlowResult2 = false;
        } else {
          this.POFlowResult2 = true;
        }
      } else {
        this.POFlowResult2 = false;
      }
    }

    if (this.Vendor["FlowCompleted"] == 'No') {
      this.isFlowCompleted = false;
      this.isGRCreated = false;
    } else {
      this.isFlowCompleted = true;
      if (this.Vendor["DocumentStatus"] == 'GRCREATED' || this.Vendor["DocumentStatus"] == 'GRCOMPLETE' || this.Vendor["DocumentStatus"] == 'GRPARITIAL') {
        this.isGRCreated = true;
      } else {
        this.isGRCreated = false;
      }
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'AmtIncvat') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if (this.duplicatePurchHeader ? this.duplicatePurchHeader[0]["AmtIncvat"] != temp : false) {
        this.httpDataService.AmtIncvat_clickHandler(["",
          this.PONumber, temp])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
    else if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DueDate') {
        if (this.duplicatePurchHeader[0][e.dataField] == null) {
          temp = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
        }
        else {
          temp = e.value;
        }
        if (this.POFlowResult == true) {
          this.httpDataService.DueDate_changeHandler(["",
            temp, this.PONumber])
            .subscribe(dataStatus => {
              this.errorHandlingToasterForUPDATE(dataStatus);
            });
        }
        else {
          this.toastr.error("Document Can't be edited after Flow is completed")
        }
      } else if (e.dataField == 'InvoiceCompoundDiscount') {
        if (this.isLinesExist) {
          this.httpDataService.getToatalAmount(["",
            this.PONumber]).subscribe(getLines => {
              var GAmount = Number(getLines[0].TotalAmount);
              this.httpDataService.CompoundDiscountP(["", GAmount, e.value])
                .subscribe(dataDiscLines => {
                  var disc = 0;
                  if (dataDiscLines[0] == "invalid value") {
                    this.calculateForSummary();
                    this.toastr.warning('Invaid Discount Value!!');
                  } else {
                    var disc = Number(GAmount) - Number(dataDiscLines[1]);
                    if (disc <= GAmount) {
                      disc = disc;
                    } else {
                      this.toastr.warning('Total Discount is geater than Amount!');
                      disc = 0;
                      this.duplicatePurchHeader[0]['' + e.dataField] = 0.0;
                      e.value = 0.0;
                    }
                    this.httpDataService.btnInvDiscount_clickHandler(["",
                      this.PONumber, disc, e.value])
                      .subscribe(dataStatus => {
                        if (dataStatus[0] == 'DONE') {
                          this.calculateForSummary();
                          this.toastr.success("Successfully Updated", "DONE");
                        } else {
                          this.toastr.error('Total Discount Calculation Failed! Error Status Code :' + dataStatus[0]);
                        }
                      });
                  }
                });
            });
        } else {
          this.calculateForSummary();
          this.toastr.warning("Please add the Lines!!");
        }
      } else if (e.dataField == 'ExpectedReciptDate') {
        if (this.duplicatePurchHeader[0][e.dataField] == null) {
          temp = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');
        } else {
          temp = e.value;
        }
        this.httpDataService.UPDATEHeader(["",
          e.dataField,
          temp, this.PONumber])
          .subscribe(dataStatus => {
            if (dataStatus == 1) {
              this.logExpectedDate(temp);
            }
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      } else if (e.dataField == 'DocumentDate') {
        if (this.duplicatePurchHeader[0][e.dataField] == null) {
          temp = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');
        } else {
          temp = e.value;
        }
        this.httpDataService.UPDATEHeader(["",
          e.dataField, temp, this.PONumber])
          .subscribe(dataStatus => {
            if (dataStatus == 1) {
              this.getLookupForDataGrid(this.Vendor["PayToVendor"], temp);
            }
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      } else {
        this.httpDataService.UPDATEHeader(["", e.dataField, e.value, this.PONumber])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }


  }

  errorHandlingToaster(callData) {
    if (callData[0] == "DONE") {
      this.calculateForSummary();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + callData[0], "Try Again");
    }
  }

  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus >= 0) {
      this.calculateForSummary();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  formOtherDetails_fieldDataChanged(e) {
    if (e.dataField == 'VendorInvoiceNo' || e.dataField == 'RemarksToPrint') {
      if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
        this.httpDataService.UPDATEHeader(["", e.dataField, e.value, this.PONumber])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  formWarehouse_fieldDataChanged(e) {
    if (e.dataField == 'ReceiveToAddress' || e.dataField == 'ReceiveToAddress2' || e.dataField == 'ReceiveToCity'
      || e.dataField == 'ReceiveToZip' || e.dataField == 'ETD' || e.dataField == 'ShipBy') {
      if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
        var temp;
        if (e.dataField == 'ETD') {
          if (this.duplicatePurchHeader[0][e.dataField] == null) {
            temp = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');
          } else {
            temp = e.value;
          }
        }
        temp = (e.dataField == 'ETD') ? temp : e.value;
        this.httpDataService.UPDATEHeader(["", e.dataField, temp, this.PONumber])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  onVendorDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
        this.httpDataService.UPDATEHeader(["", e.dataField, e.value, this.PONumber])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  logExpectedDate(expDate: string) {
    this.httpDataService.logExpectedDate(["",
      this.PONumber, expDate, UtilsForGlobalData.getUserId()])
      .subscribe(dataStatus => {
        if (dataStatus == 1) {
          this.calculateForSummary();
        }
      });
  }

  onExpectedReciptDateClicked() {
    this.globalExpectedReciptDatepopup = true;
    this.httpDataService.POExpectedgetList(["", this.PONumber]).subscribe(dataStatus => {
      this.ExpectedReciptDate = dataStatus;
    });
  }

  onExpectedReciptDateRowClicked(event) {
    this.globalExpectedReciptDatepopup = false;
    this.httpDataService.UPDATEHeader(["", "ExpectedReciptDate", event.data.ExpectedDate, this.PONumber])
      .subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", true);
    this.gridContainer.instance.columnOption("Details", "visible", false);
    if (event.data.LineType) {
      this.gridContainer.instance.columnOption("location", "visible", true);
      this.gridContainer.instance.columnOption("LineType", "allowEditing", false);
    } else {
      this.gridContainer.instance.columnOption("location", "visible", false);
      this.gridContainer.instance.columnOption("LineType", "allowEditing", true);
    }
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "ItemCode") {
      let standardHandler = e.editorOptions.onValueChanged;
      let thisComponent = this;
      e.editorOptions.onValueChanged = function (event) {
        e.component.cellValue(e.row.rowIndex, "UOM", event.value.PurchUOM);
        e.component.cellValue(e.row.rowIndex, "Description", event.value.Description);
        e.component.cellValue(e.row.rowIndex, "CostIncVAT", thisComponent.Vendor["AmtIncvat"] ? 'Yes' : 'No');
        e.component.cellValue(e.row.rowIndex, "DirectUnitCost", event.value.LastCost);
        e.component.cellValue(e.row.rowIndex, "LineDiscountAmount", '0');
        e.component.cellValue(e.row.rowIndex, "Quantity", '1');
        e.component.cellValue(e.row.rowIndex, "AmountIncludingVAT", event.value.LastCost);
        e.component.cellValue(e.row.rowIndex, "LineAmount", event.value.LastCost);
        e.component.cellValue(e.row.rowIndex, "ItemCode", event.value.ItemCode);
        //e.setValue(event.value["ItemCode"]);
        //standardHandler(e); // Calls the standard handler to save the edited value
      }
    }
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
        this.gridContainer.instance.columnOption("location", "visible", false);
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
        this.gridContainer.instance.columnOption("location", "visible", false);
      });
    }
  };

  rowIndex: number = 0;

  ItemLookupvalueChanged(data) {
    this.rowIndex = data.rowIndex;
    if (data.row.data.LineType == 'SERVICEITEM') {
      this.globalServiceItemLookupPopup = true;
    } else if (data.row.data.LineType == 'DEPOSIT') {
      this.httpDataService.getDeposit(this.Vendor["PayToVendor"], this.Vendor["DocumentDate"]).subscribe(getDItem => {
        this.deposititemArray = <String[]>getDItem;
        this.globalDepositItemLookupPopup = true;
      });
    } else if (data.row.data.LineType == 'ITEM') {
      this.globalItemLookupPopup = true;
    } else {
      this.toastr.warning("Please Select the Line Type!!");
    }
  }

  onUserRowSelect(event, type) {
    if (type == 'ITEM') {
      this.globalItemLookupPopup = false;
      this.gridContainer.instance.cellValue(this.rowIndex, "UOM", event.data.PurchUOM);
      this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
      this.gridContainer.instance.cellValue(this.rowIndex, "DirectUnitCost", event.data.LastCost);
      this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
      this.gridContainer.instance.cellValue(this.rowIndex, "CostIncVAT", this.Vendor["AmtIncvat"] ? 'Yes' : 'No');
      this.gridContainer.instance.cellValue(this.rowIndex, "LineDiscountAmount", '0');
      this.gridContainer.instance.cellValue(this.rowIndex, "Quantity", '1');
      this.gridContainer.instance.cellValue(this.rowIndex, "AmountIncludingVAT", event.data.LastCost);
      this.gridContainer.instance.cellValue(this.rowIndex, "LineAmount", event.data.LastCost);
    } else if (type == 'SERVICEITEM') {
      this.globalServiceItemLookupPopup = false;
      this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
      this.gridContainer.instance.cellValue(this.rowIndex, "DirectUnitCost", event.data.UnitPrice);
      this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.Code);
      this.gridContainer.instance.cellValue(this.rowIndex, "CostIncVAT", this.Vendor["AmtIncvat"] ? 'Yes' : 'No');
      this.gridContainer.instance.cellValue(this.rowIndex, "LineDiscountAmount", '0');
      this.gridContainer.instance.cellValue(this.rowIndex, "Quantity", '1');
      this.gridContainer.instance.cellValue(this.rowIndex, "AmountIncludingVAT", event.data.UnitPrice);
      this.gridContainer.instance.cellValue(this.rowIndex, "LineAmount", event.data.UnitPrice);
    } else {
      this.globalDepositItemLookupPopup = false;
      this.gridContainer.instance.cellValue(this.rowIndex, "DirectUnitCost", event.data.AmountIncludingVAT);
      this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.DocumentNo);
      this.gridContainer.instance.cellValue(this.rowIndex, "CostIncVAT", this.Vendor["AmtIncvat"] ? 'Yes' : 'No');
      this.gridContainer.instance.cellValue(this.rowIndex, "LineDiscountAmount", '0');
      this.gridContainer.instance.cellValue(this.rowIndex, "Quantity", 1);
      this.gridContainer.instance.cellValue(this.rowIndex, "AmountIncludingVAT", event.data.AmountIncludingVAT);
      this.gridContainer.instance.cellValue(this.rowIndex, "LineAmount", event.data.AmountIncludingVAT);
    }
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["DirectUnitCost", "Amount", "LineAmount", "AmountIncludingVAT", "LineDiscountAmount", "LineDiscountAmtText"]);
    if (data.data.LineType == 'ITEM') {
      this.itemPopupName = "ITEM DETAILS";
      this.itemDetailsPopup = true;
    } else if (data.data.LineType == 'SERVICEITEM') {
      this.itemPopupName = "SERVICE ITEM DETAILS";
      this.itemDetailsPopup = true;
    } else if (data.data.LineType == 'DEPOSIT') {
      this.itemPopupName = "DEPOSIT ITEM DETAILS";
      this.itemDetailsPopup = true;
    } else {
      this.itemPopupName = "ITEM DETAILS";
      this.httpDataService.getItemDetail(["", data.data.ItemCode]).subscribe(dataDetails => {
        this.itemDetails = UtilsForSuggestion.StandartNumberFormat(dataDetails[0], ["UnitPrice", "UnitCost"]);
        this.itemLookupDetailsPopup = true;
      });
    }
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.ItemCode = value;
    (<any>this).defaultSetCellValue(newData, value);
  }


  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    newData.LineDiscountAmtText = value;
    if (currentData.DirectUnitCost != undefined && currentData.Quantity != undefined) {
      var GAmount: Number = (currentData.Quantity * currentData.DirectUnitCost);
      if (currentData.CostIncVAT == 'Yes') {
        var vat: Number = currentData.VatAmount ? currentData.VatAmount : 0;
        GAmount = Number(GAmount) + Number(vat);
      }
      var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(value, GAmount);
      var disc = 0;
      if (amtafterDisc == "invalid value") {
        disc = 0;
      } else {
        disc = Number(GAmount) - Number(amtafterDisc);
        if (disc <= GAmount) {
          disc = Number(disc.toFixed(2));
        } else {
          this.toastr.warning('Line Discount is greater than Price!');
          disc = 0;
        }
      }
      value = disc;
      newData.LineDiscountAmount = disc;
      newData.AmountIncludingVAT = (currentData.Quantity * currentData.DirectUnitCost) - value;
      newData.LineAmount = (currentData.Quantity * currentData.DirectUnitCost) - value;
    }
    newData.LineDiscountAmount = value;
  }

  setPriceValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    if (currentData.Quantity != undefined && currentData.LineDiscountAmount != undefined) {
      var GAmount: Number = (currentData.Quantity * value);
      if (currentData.CostIncVAT == 'Yes') {
        var vat: Number = currentData.VatAmount ? currentData.VatAmount : 0;
        GAmount = Number(GAmount) + Number(vat);
      }
      var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(currentData.LineDiscountAmount, GAmount);
      var disc = 0;
      if (amtafterDisc != "invalid value") {
        disc = Number(GAmount) - Number(amtafterDisc);
        if (disc <= GAmount) {
          disc = disc;
        } else {
          disc = 0;
        }
      }
      newData.LineDiscountAmtText = disc;
      newData.LineDiscountAmount = disc;
      newData.AmountIncludingVAT = (currentData.Quantity * value) - newData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    newData.DirectUnitCost = value;
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : 1;
    value = value != 0 ? value : 0.01;
    if (currentData.DirectUnitCost != undefined && currentData.LineDiscountAmount != undefined) {
      var GAmount: Number = (value * currentData.DirectUnitCost);
      if (currentData.CostIncVAT == 'Yes') {
        var vat: Number = currentData.VatAmount ? currentData.VatAmount : 0;
        GAmount = Number(GAmount) + Number(vat);
      }
      var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(currentData.LineDiscountAmount, GAmount);
      var disc = 0;
      if (amtafterDisc != "invalid value") {
        disc = Number(GAmount) - Number(amtafterDisc);
        if (disc <= GAmount) {
          disc = disc;
        } else {
          disc = 0;
        }
      }
      newData.LineDiscountAmtText = disc;
      newData.LineDiscountAmount = disc;
      newData.AmountIncludingVAT = (value * currentData.DirectUnitCost) - newData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    newData.Quantity = value;
  }

  /* setPriceValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.Quantity && currentData.LineDiscountAmount) {
      newData.AmountIncludingVAT = (value * currentData.Quantity) - currentData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : '1';
    value = value != 0 ? value : '0.01';
    if (currentData.DirectUnitCost && currentData.LineDiscountAmount) {
      newData.AmountIncludingVAT = (value * currentData.DirectUnitCost) - currentData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.DirectUnitCost && currentData.Quantity) {
      if ((currentData.Quantity * currentData.DirectUnitCost) >= value) {
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.DirectUnitCost) - value;
        newData.LineAmount = newData.AmountIncludingVAT;
      } else {
        value = (currentData.Quantity * currentData.DirectUnitCost);
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.DirectUnitCost) - value;
        newData.LineAmount = newData.AmountIncludingVAT;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  } */

  assignToDuplicate(data) {
    // copy properties from Vendor to duplicateSalesHeader
    this.duplicatePurchHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatePurchHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatePurchHeader[i][prop] = data[i][prop];
      }
    }
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'otherPODetails') {
      this.httpDataService.getGraphData(["", this.Vendor["BuyFromVendor"]])
        .subscribe(gotGraphData => {
          this.pieChartData = new DataSource({
            store: <String[]>gotGraphData,
            paginate: true,
            pageSize: 10
          });
        });
    }
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  selectedItem(e) {
    this.selectedItemCode = e.data.ItemCode;
  }

  btnItemSU_clickHandler(e) {
    if (this.selectedItemCode != null) {
      this.isAddSUCodePopUP = true;
      this.suList = [];
      this.httpDataService.getStoreageunitCodes([""])
        .subscribe(gotSUList => {
          this.suListSuggestions = new DataSource({
            store: <String[]>gotSUList,
            paginate: true,
            pageSize: 10
          });
        });
      this.addedSUList();
    } else {
      this.toastr.warning("Please select the ItemCode before Adding the SUCode!!");
    }

  }

  addedSUList() {
    var thisComponent = this;
    this.addedSuCodeItem = new CustomStore({
      key: ["ItemCode", "VariantCode", "StoreageUnitCode", "LastModifiedOn"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.ItemstoreageunitgetAllLines(["",
          thisComponent.selectedItemCode]).subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDelete_clickHandler(["", key["ItemCode"],
          key["StoreageUnitCode"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      }
    });
  }

  addSU() {
    if (this.companyHeader["OneSUperLocation"] == "Yes") {
      if (this.suList["StorageUnitCode"].length > 0) {
        var SplitLocationCode = this.suList["StorageUnitCode"].split('-');
        var LocationCodeSplited = SplitLocationCode[0];
        this.httpDataService.btnADD_clickHandler(["",
          this.selectedItemCode,
          LocationCodeSplited]).subscribe(CountLocation => {
            if (Object.keys(CountLocation).length > 0) {
              this.addSUCodeRecord()
            }
            else {
              this.toastr.error("Only One Storage Unit Code Allowed Per Location");
            }
          });
      }
    }
    else {
      this.addSUCodeRecord()
    }
  }

  addSUCodeRecord() {
    var SplitLocationCode = this.suList["StorageUnitCode"].split('-');
    var LocationCodeSplited = SplitLocationCode[0];
    this.httpDataService.addRecord(["",
      this.selectedItemCode,
      this.suList["StorageUnitCode"],
      LocationCodeSplited]).subscribe(insertData => {
        if (insertData == 1) {
          this.addedSUList();
        } else {
          this.addedSUList();
          this.toastr.error("Please select Storage Unit Code to Insert!!");
        }
      });
  }

  btnAddAll_clickHandler(e) {
    this.httpDataService.btnAddAll_clickHandler(["",
      this.Vendor["ReceiveToLocation"],
      this.PONumber, 'PO']).subscribe(insertData => {
        this.toastr.success("Updated All with Default!!");
        this.gridContainerItemListOnWarehouse.instance.refresh();
      });
  }

  legendClickHandler(e) {
    let arg = e.target,
      item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    if (item.isVisible()) {
      item.hide();
    } else {
      item.show();
    }
  }

  showNewVendorCard(event) {
    this.newVendorDetail = [];
    this.httpDataService.createNewDocument(["", "VENDOR", UtilsForGlobalData.getUserId()]).subscribe(createdNew => {
      if (createdNew[1] == 'CREATED') {
        UtilsForGlobalData.setLocalStorageKey('VendCode', createdNew[0]);
        this.router.navigate(['/purchases/vendor-details']);
      } else if (createdNew[1] == 'SETUPNOTFOUND') {
        this.toastr.warning("Vendor No. Series Setup is missing!");
      } else {
        this.toastr.warning("Process Failed!")
      }
    })
  }

  getLookupForDataGrid(PayToVendor: String, DocumentDate: String) {
    this.httpDataService.GetSOItemList(this.PONumber, '1').subscribe(itemLookupSuggestionDataGrid => {
      for (var i = 0; i < Object.keys(itemLookupSuggestionDataGrid).length; i++) {
        itemLookupSuggestionDataGrid[i]["LineType"] = "ITEM";
      }
      this.httpDataService.getServiceItems().subscribe(serviceLookupSuggestionDataGrid => {
        var currentIndex = Object.keys(itemLookupSuggestionDataGrid).length;
        for (var i = 0; i < Object.keys(serviceLookupSuggestionDataGrid).length; i++) {
          itemLookupSuggestionDataGrid.push({});
          itemLookupSuggestionDataGrid[currentIndex + i]["LineType"] = "SERVICEITEM";
          itemLookupSuggestionDataGrid[currentIndex + i]["ItemCode"] = serviceLookupSuggestionDataGrid[i]["Code"];
          itemLookupSuggestionDataGrid[currentIndex + i]["Description"] = serviceLookupSuggestionDataGrid[i]["Description"];
          itemLookupSuggestionDataGrid[currentIndex + i]["LastCost"] = serviceLookupSuggestionDataGrid[i]["UnitPrice"];
          itemLookupSuggestionDataGrid[currentIndex + i]["PurchUOM"] = "UNITS";
        }
        this.httpDataService.getDeposit(PayToVendor,
          DocumentDate).subscribe(depositLookupSuggestionDataGrid => {
            var currentIndex = Object.keys(itemLookupSuggestionDataGrid).length;
            for (var i = 0; i < Object.keys(depositLookupSuggestionDataGrid).length; i++) {
              itemLookupSuggestionDataGrid.push({});
              itemLookupSuggestionDataGrid[currentIndex + i]["LineType"] = "DEPOSIT";
              itemLookupSuggestionDataGrid[currentIndex + i]["ItemCode"] = depositLookupSuggestionDataGrid[i]["DocumentNo"];
              itemLookupSuggestionDataGrid[currentIndex + i]["Description"] = depositLookupSuggestionDataGrid[i]["DocumentDate"];
              itemLookupSuggestionDataGrid[currentIndex + i]["LastCost"] = serviceLookupSuggestionDataGrid[i]["AmountIncludingVAT"];
              itemLookupSuggestionDataGrid[currentIndex + i]["PurchUOM"] = "UNITS";
            }
            this.itemLookupSuggestionDataGrid = itemLookupSuggestionDataGrid;
            /* this.itemLookupSuggestionDataGrid = {
              paginate: true,
              pageSize: 20,
              loadMode: "raw",
              load: () => <String[]>itemLookupSuggestionDataGrid
            } */
          });
      });
    });
  }

  getTheItemLookup(options) {
    /* console.log(options);
    if (options.data) {
      if (options.data.LineType == 'ITEM')
        return this.itemLookupSuggestionDataGrid;
      else if (options.data.LineType == 'SERVICEITEM')
        return this.serviceLookupSuggestionDataGrid;
      else
        return this.depositLookupSuggestionDataGrid;
    } else {
      return [];
    } */
    var lookup = this.itemLookupSuggestionDataGrid;
    return {
      paginate: true,
      pageSize: 20,
      loadMode: "raw",
      load: () => options.data ? lookup.filter(i => i.LineType === options.data.LineType) : lookup
    };
  }

  alertCode(error: any): any {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Server Error");
    }

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

  generateStdPDF(printHeader, printLines, title) {

    printHeader.TotalQty = 0;
    printHeader.AmountExcVat = 0;
    printHeader.TotalAmount = 0;

    printHeader.TotalAmountinWords = printHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      if (Number(decimalAsInt) < 10) {
        printHeader.TotalAmountinWords += " and 0" + decimalAsInt + "/100";
      } else {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
      }
    }
    printHeader.AmountBeforeDisc = this.formatNumber(Number(printHeader.Amount) + Number(printHeader.InvDiscountAmount));
    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? printHeader.InvDiscountAmount : 0;
    printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
    printHeader.TotalAmount = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.InvDiscountAmount));
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
    printHeader.RemarksToPrint = printHeader.RemarksToPrint == null ? '' : printHeader.RemarksToPrint;


    for (var i = 0; i < Object.keys(printLines).length; i++) {
      if (printLines[i].LineType == 'ITEM') {
        printHeader.TotalQty += Number(printLines[i].Quantity);
      }
      printLines[i].SnNo = i + 1;
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
      printLines[i].DirectUnitCost = this.formatNumber(printLines[i].DirectUnitCost);
      printLines[i].LineAmount = this.formatNumber(printLines[i].LineAmount);
      if (Number(printLines[i].LineDiscountAmount) > 0) {
        if (this.columnHeader4.find(p => p.dataKey == "LineDiscountAmount") == undefined) {
          this.columnHeader4.push({ title: "Line Disc.Amt", dataKey: "LineDiscountAmount", width: 40 });
        }
      }
      if (Number(printLines[i].SGSTAmount) > 0) {
        if (this.columnHeader4.find(p => p.dataKey == "SGSTAmount") == undefined) {
          this.columnHeader4.push({ title: "SGST", dataKey: "SGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].CGSTAmount) > 0) {
        if (this.columnHeader4.find(p => p.dataKey == "CGSTAmount") == undefined) {
          this.columnHeader4.push({ title: "CGST", dataKey: "CGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].IGSTAmount) > 0) {
        if (this.columnHeader4.find(p => p.dataKey == "IGSTAmount") == undefined) {
          this.columnHeader4.push({ title: "IGST", dataKey: "IGSTAmount", width: 40 });
        }
      }
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].SGSTAmount = this.formatNumber(printLines[i].SGSTAmount) + "(" + Number(printLines[i].SGST) + "%)";
      printLines[i].CGSTAmount = this.formatNumber(printLines[i].CGSTAmount) + "(" + Number(printLines[i].CGST) + "%)";
      printLines[i].IGSTAmount = this.formatNumber(printLines[i].IGSTAmount) + "(" + Number(printLines[i].IGST) + "%)";
    }
    for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
      this.printHeader[i].ExchangeRate = this.formatNumber(this.printHeader[i].ExchangeRate);
    }


    printHeader = UtilsForSuggestion.StandardValueFormat(printHeader,
      ["BuyFromVendor", "BuyFromName", "BuyFromAddress", "BuyFromAddress2", "BuyFromCity", "ContactName", "BuyFromPhone", "VATID",
        "BuyFromCountry", "BuyFromZip", "PayToVendor", "PayToName", "PayToAddress", "PayToAddress2", "PayToCity",
        "PayToCountry", "PayToZip", "PayToPhone", "PaymentTerm"]);
    printHeader = UtilsForSuggestion.StandardDateFormat(printHeader, ["OrderDate"]);

    const doc = new jsPDF('p', 'pt', 'a4');

    /* doc.addFileToVFS("leelawad.ttf", variable.leelawad);
    doc.addFont('leelawad.ttf', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont); */

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    if (this.companyHeader["CountryCode"] == 'THA' || this.companyHeader["CountryCode"] == 'SGP') {
      this.PrintReportForTHA(doc, printHeader, printLines, title);
    } else {
      this.PrintReportForIND(doc, printHeader, printLines, title);
    }

    doc.save("PuchaseOrder" + this.PONumber + ".pdf");
    this.gridContainer ? this.gridContainer.instance.refresh() : '';
  }

  PrintReportForTHA(doc, printHeader, printLines, title) {
    var tempY = this.pdfFormate.InitialstartY;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "right-align" }, this.pdfFormate.startX, tempY);
    doc.setLineWidth(1);
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);


    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, 100, 70);
    doc.textAlign("" + this.companyHeader.Name + "(" + this.companyHeader.BranchName + ")", { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + ", " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("TAX ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    var originalRect = tempY;

    var tempBoxY = tempY;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Vendor Code:" + printHeader.BuyFromVendor, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Document No    :" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromName, 300);
    var tempWrapY1 = tempY;
    tempY += this.pdfFormate.NormalSpacing;
    doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, tempY);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX + 20, tempWrapY1 += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Document Date :" + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    tempY = tempWrapY1;
    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress, 300);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress2, 300);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BuyFromCity + ", " + printHeader.BuyFromZip, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.BuyFromCountry, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Contact : " + printHeader.ContactName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Ph : " + printHeader.BuyFromPhone, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.rect(this.pdfFormate.startX - 2, originalRect, pageEnd - this.pdfFormate.MarginEndY + 4, tempY - originalRect + 5);
    doc.rect(this.pdfFormate.startX - 2, originalRect, this.pdfFormate.centerBOX + (this.pdfFormate.NormalSpacing * 6), tempY - originalRect + 5);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.autoTable(this.columnHeader1, this.printHeader, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      },
      theme: 'grid',
      headStyles: {
        fillColor: [64, 139, 202],
      },
    });

    tempY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;
    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader2, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType
      },
      columnStyles: {
        ItemCode: {
          halign: 'left'
        },
        ExtraDescription: {
          halign: 'left',
          cellWidth: 150
        },
        Quantity: {
          halign: 'right'
        },
        DirectUnitCost: {
          halign: 'right'
        },
        LineDiscountAmount: {
          halign: 'right'
        },
        LineAmount: {
          halign: 'right'
        }
      },
      headStyles: {
        fillColor: [64, 139, 202],
        halign: 'left',
        //textColor: 0
      },
      /* bodyStyles: {
        textColor: 0
      }, */
      theme: 'grid',
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
    var startY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.textAlign("" + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    if (Number(printHeader.InvDiscountAmount) > 0) {
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT( " + printHeader.InvoiceCompoundDiscount + " ) :", { align: "left" }, rightcol1, startY);
      doc.textAlign(this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EX.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.autoTable(this.columnHeader3, this.columnRow3, {
      startX: this.pdfFormate.startX,
      startY: startY,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      },
      theme: 'grid',
      headStyles: {
        fillColor: [64, 139, 202]
      }
    });
  }

  PrintReportForIND(doc, printHeader, printLines, title) {

    var tempY = this.pdfFormate.InitialstartY;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);

    doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, tempY + 45);
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', pageEnd - 85, tempY, 85, 50);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, tempY += 50, pageEnd, tempY);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("StateCode", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.StateCode, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Purch Ord No", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign(":" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("GST No", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Order Date", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign(":" + printHeader.OrderDate, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("PAN No", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.PAN, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Payment Terms", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign(":" + printHeader.PaymentTerm + " Days", { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.textAlign("" + this.companyHeader.CountryName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("IEC Code", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.IEC, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("REV", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);
    doc.textAlign(":", { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.textAlign("" + this.companyHeader.HomePage, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone No", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.Phone, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    //doc.textAlign("Payment Terms: " + printHeader.PaymentTerm, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    doc.textAlign("CIN: " + this.companyHeader.CIN, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("E-Mail", { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign(":" + this.companyHeader.EMail, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    //doc.textAlign("REV : ", { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);


    //box2x2
    var tempX = this.pdfFormate.startX + this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 2));
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + this.pdfFormate.NormalSpacing);//top-hor
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2));//left vert
    doc.textAlign("Buy From", { align: "left" }, tempX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    doc.line(pageEnd, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//left-vert
    doc.line(this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//bottm-hor
    doc.textAlign("Pay To", { align: "left" }, tempX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    var tempBoxY = tempY;
    var tempYC = tempBoxY;

    //text in box1
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Code", { align: "left" }, tempX, tempY += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.BuyFromVendor, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Name", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromName, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress2, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.BuyFromCity + ", " + printHeader.BuyFromCountry + "-" + printHeader.BuyFromZip, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Contact", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.ContactName + " Ph: " + printHeader.BuyFromPhone, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("GST No.", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXDetails, tempY);

    //text in box2
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    var tempX = this.pdfFormate.startX + this.pdfFormate.centerBOX + this.pdfFormate.NormalSpacing;
    doc.textAlign("Code", { align: "left" }, tempX, tempYC += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);
    doc.textAlign("Name", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.PayToName, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.PayToAddress, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.PayToAddress2, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.PayToCity + ", " + printHeader.PayToCountry + "-" + printHeader.PayToZip, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);
    doc.textAlign("Contact:", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.ContactName + " Ph: " + printHeader.PayToPhone, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);
    doc.textAlign("GST No.", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

    tempY = tempY > tempYC ? tempY : tempYC;
    //box outline
    tempY += 10;
    doc.line(this.pdfFormate.startX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX, tempY);//vert-left
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY);//vert-centre
    doc.line(pageEnd, tempBoxY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY);//vert-right
    doc.line(this.pdfFormate.startX, tempY, pageEnd, tempY);


    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader4, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType,
      },
      columnStyles: {
        SnNo: {
          halign: 'left'
        },
        Description: {
          halign: 'left',
          cellWidth: 150
        },
        HSNCode: {
          halign: 'left'
        },
        Quantity: {
          halign: 'right'
        },
        UOM: {
          halign: 'left'
        },
        DirectUnitCost: {
          halign: 'right'
        },
        LineDiscountAmount: {
          halign: 'right'
        },
        LineAmount: {
          halign: 'right'
        },
        IGSTAmount: {
          halign: 'right'
        },
        CGSTAmount: {
          halign: 'right'
        },
        SGSTAmount: {
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
    var startY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;

    startY = this.calculateThePage(startY, doc);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL QTY :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    if (Number(printHeader.InvDiscountAmount) > 0) {
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT( " + printHeader.InvoiceCompoundDiscount + " ) :", { align: "left" }, rightcol1, startY);
      doc.textAlign(this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EX.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);
    //doc.rect(this.pdfFormate.startX, startY, pageEnd - this.pdfFormate.MarginEndY, 2);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("We Certified that Particulars Above are true and correct, Terms And Conditions Over Leaf", { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Notes :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("Clarification On This Invoice", { align: "left" }, this.pdfFormate.centerX, startY);
    doc.textAlign("" + this.companyHeader.Name, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("Name : " + printHeader.CreatedBy, { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("Name : ", { align: "left" }, this.pdfFormate.centerX, startY);

    //startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Phone: ", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("Phone: ", { align: "left" }, this.pdfFormate.centerX, startY);

    //startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Email : ", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("Email : ", { align: "left" }, this.pdfFormate.centerX, startY);
    doc.textAlign("Authorised Signatory", { align: "right-align" }, rightcol2, startY);
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
