import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import * as events from "devextreme/events";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { CompundDiscountService } from '../../Utility/compund-discount.service';
import { SalesQuoteDetailsHttpDataService } from './sales-quote-details-http-data.service';
import { Observable } from 'rxjs';


export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}


/* @Author Abhijeet/Ganesh
/* this is For Sales Quotes
/* On 05-09-2019
*/

@Component({
  selector: 'app-sales-quote-details',
  templateUrl: './sales-quote-details.component.html',
  styleUrls: ['./sales-quote-details.component.css']
})

export class SalesQuoteDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerSQtoPQ") gridContainerSQtoPQ: DxDataGridComponent;
  @ViewChild("gridContainerSQtoPQEmail") gridContainerSQtoPQEmail: DxDataGridComponent;

  Customer: [];
  duplicateSalesHeader: string[];
  SONumber: string = UtilsForGlobalData.retrieveLocalStorageKey('SQNumber');
  SOFlowResult: boolean = false;
  GetSODetails: string;
  InvoiceTotal: Number = 0;
  DiscountPerc: Number = 0;
  SubTotal: Number = 0;
  Tax: Number = 0;
  Total: Number = 0;
  TotalQuantity: Number = 0;
  lineTotal: Number = 0;
  amtincvatvalue: Number = 0;
  customerSuggestions: any = null;
  receiveLocSuggestionsLookup: any = {};
  currencySuggestions: any = null;
  paymentMethodSuggestions: any = null;
  ShipFromSuggestions: any = null;
  SalesPersonSuggestions: any = null;
  dataSource: any = {};
  mailSource: CustomStore;
  itemArray: any = [];
  serviceitemArray: any = [];
  deposititemArray: any = [];
  SalesOrderOperations: any = [];
  printLines = null;
  printHeader = null;
  companyHeader = null;
  isLinesExist: boolean = false;
  isCustCodeAdded: boolean = false;
  phonePattern: any = /^[^a-z]+$/;
  phoneRules: any = {
    X: /[02-9]/
  };
  popupVisible: boolean = false;
  newCustomerDetail: any = {};
  customerValue: any;
  columnHeader1 = [
    { title: "Sales Person", dataKey: "SalespersonCodePrint", width: 40 },
    { title: "Currency", dataKey: "CurrencyCode", width: 40 },
    { title: "Exc. Rate", dataKey: "ExchangeRate", width: 40 },
    { title: "Due Date", dataKey: "FormtedDueDate", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Price", dataKey: "UnitPrice", width: 40 },
    { title: "Amount", dataKey: "LineAmount", width: 40 }
  ];
  columnHeader3 = [
    { title: "Prepared By", dataKey: "Prepared", width: 40 },
    { title: "Checked By", dataKey: "Checked", width: 40 },
    { title: "Approved By", dataKey: "Aproved", width: 40 },
    { title: "Authorized Sign", dataKey: "Authorized", width: 40 }
  ];
  columnHeader4 = [
    { Prepared: "", Checked: "", Aproved: "", Authorized: "" },
    { Prepared: "____/____/____", Checked: "____/____/____", Aproved: "____/____/____", Authorized: "____/____/____" }
  ];
  columnHeader5 = [
    { title: "#", dataKey: "SnNo", width: 90 },
    { title: "ITEMCODE", dataKey: "ItemCode", width: 40 },
    { title: "DESCRIPTION", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "QTY", dataKey: "Quantity", width: 40 },
    { title: "PRICE", dataKey: "UnitPrice", width: 40 },
    { title: "AMOUNT", dataKey: "Amount", width: 40 },
    { title: "AMT INC TAX", dataKey: "AmountIncludingVAT", width: 40 }
  ];
  reportCustom: any = [];
  LineTypeSuggestion: any = [{ Code: 'ITEM' }, { Code: 'SERVICEITEM' }, { Code: 'DEPOSIT' }];

  public pieChartLabels: string[] = [''];
  public pieChartData: number[] = [0];
  public pieChartType = 'pie';
  dataforstat: Object = [];

  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  itemLookupDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalServiceItemLookupPopup: boolean = false;
  globalDepositItemLookupPopup: boolean = false;
  globalCurrencyLookupPopup: boolean = false;
  popupSelltoCustDetails: Boolean = false;
  popupBilltoCustDetails: Boolean = false;
  customerDeatilsPerCustomer: any = {};
  globalCustomerLookupPopup: boolean = false;
  isFlowCompleted: boolean = false;
  typeOfCustomer: String = '';
  itemPopupName: string = "ITEM DETAILS";
  isIndian: boolean = false;
  TotalLineDiscountAmount: any;
  TotalItemQuantity: any;
  totalInvoiceDisocunt: Number = 0;
  SendMailForPQ: boolean = false;
  getCountryCodeListAll: DataSource;
  showPQfromSQ: boolean = false;
  PQlistfromSQ: { paginate: boolean; pageSize: number; loadMode: string; load: () => String[]; };
  ContactPersonSuggestions: DataSource;
  sendCustomerContactEmail: boolean = false;
  customerContactDS: { paginate: boolean; pageSize: number; loadMode: string; load: () => String[]; };
  waitingDialogue: boolean = false;

  constructor(
    private httpDataService: SalesQuoteDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService,
    private compoundDiscount: CompundDiscountService
  ) {
    if (UtilsForGlobalData.retrieveLocalStorageKey("accessToken") == null) {
      this.router.navigate(['/']);
    }
    this.setBaseUOMValueItemCode = this.setBaseUOMValueItemCode.bind(this);
    this.setDiscountValue = this.setDiscountValue.bind(this);
    this.setPriceValue = this.setPriceValue.bind(this);
    this.setQuantityValue = this.setQuantityValue.bind(this);
  }

  ngOnInit() {

    this.httpDataService.getItemList(['', UtilsForGlobalData.getCurrentDate()]).subscribe(callData3 => {
      this.itemArray = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>callData3
      }
    });

    this.httpDataService.VariantLookupgetList(['']).subscribe(getSItem => {
      this.serviceitemArray = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () => <String[]>getSItem
      }
    });

    this.httpDataService.getCustomerList([''])
      .subscribe(callData3 => {
        this.customerSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 10
        });
      });

    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["LineNo", "lineType", "ItemCode", "Description", "UOM", "UnitPrice", "AmountIncludingVAT", "Quantity", "Location",
        "QtytoShip", "UnitCost", "ItemCategorycode", "BrandCode", "LotNoRequired",
        "LineCompoundDiscount", "GPCode", "salesCode", "LineDiscountAmount", "CostIncVAT", "LineDiscountAmtText"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.openLines(["", thisComponent.SONumber])
          .subscribe(dataLines => {
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
        if (thisComponent.Customer["SalesType"] == "Normal") {
          thisComponent.httpDataService.btnDelete_clickHandler(["",
            key["LineNo"],
            thisComponent.SONumber]).subscribe(dataStatus => {
              if (dataStatus == 0) {
                devru.reject("Error while Updating the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
              } else {
                devru.resolve(dataStatus);
              }
            });
        } else {
          devru.reject("This SQ is created by a Product Request, Except G.P.,No Modifications allowed!!");
        }
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["ItemCode"] ? true : false) {
          thisComponent.httpDataService.btnAddItem_clickHandler(["",
            thisComponent.SONumber,
            thisComponent.Customer["SelltoCustomerNo"],
            thisComponent.Customer["LocationCode"],
            thisComponent.Customer["AmtIncvat"] ? 'Yes' : 'No',
            thisComponent.Customer["CurrencyCode"],
            thisComponent.Customer["ExchangeRate"]]).subscribe(dataStatus => {
              var GAmount: Number = (Number(values["Quantity"]) * Number(values["UnitPrice"]));
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
                  thisComponent.httpDataService.saveItemLine(["",
                    values["QtytoShip"],
                    values["ItemCode"],
                    values["Description"],
                    values["UnitPrice"],
                    values["AmountIncludingVAT"],
                    values["UOM"],
                    values["Quantity"],
                    disc,
                    values["Location"],
                    values["UnitCost"],
                    values["LotNoRequired"],
                    values["ItemCategorycode"],
                    values["VariantCode"],
                    values["BrandCode"],
                    values["LineDiscountAmount"],
                    values["GPCode"],
                    values["salesCode"],
                    dataStatus,
                    thisComponent.SONumber]).subscribe(data => {
                      if (data > 0) {
                        devru.resolve(data);
                      } else {
                        devru.reject("Error while Inserting the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is UPDATE-ERR");
                      }
                    });
                });
            });
        } else {
          devru.reject("Please Provide The Required Data!!");
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        var GAmount: Number = (Number(getUpdateValues(key, newValues, "Quantity")) * Number(getUpdateValues(key, newValues, "UnitPrice")));
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
            thisComponent.httpDataService.saveItemLine(["",
              getUpdateValues(key, newValues, "QtytoShip"),
              getUpdateValues(key, newValues, "ItemCode"),
              getUpdateValues(key, newValues, "Description"),
              getUpdateValues(key, newValues, "UnitPrice"),
              getUpdateValues(key, newValues, "AmountIncludingVAT"),
              getUpdateValues(key, newValues, "UOM"),
              getUpdateValues(key, newValues, "Quantity"),
              disc,
              getUpdateValues(key, newValues, "Location"),
              getUpdateValues(key, newValues, "UnitCost"),
              getUpdateValues(key, newValues, "LotNoRequired"),
              getUpdateValues(key, newValues, "ItemCategorycode"),
              getUpdateValues(key, newValues, "VariantCode"),
              getUpdateValues(key, newValues, "BrandCode"),
              getUpdateValues(key, newValues, "LineDiscountAmtText"),
              getUpdateValues(key, newValues, "GPCode"),
              getUpdateValues(key, newValues, "salesCode"),
              getUpdateValues(key, newValues, "LineNo"),
              thisComponent.SONumber]).subscribe(data => {
                if (data > 0) {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
                }
              });
          });
        return devru.promise();
      }
    });

    this.mailSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllMail(['', thisComponent.SONumber])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.sendMail(["",
          thisComponent.SONumber, key["PQDocumentNo"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Sending Mail For DocumentNo : " + key["PQDocumentNo"] + ", Error Status Code is PHPMAILER-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateEmailLines(["",
          Object.keys(newValues)[0],
          newValues[Object.keys(newValues)[0]],
          thisComponent.SONumber,
          key["PQDocumentNo"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines : " + Object.keys(newValues)[0] + " with : " + newValues[Object.keys(newValues)[0]] + ", Error Status Code is UPDATE-ERR");
            }
          });
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

    this.httpDataService.getLocationList1([''])
      .subscribe(getLocation => {
        this.ShipFromSuggestions = new DataSource({
          store: <String[]>getLocation,
          paginate: true,
          pageSize: 20
        });
      });

    this.httpDataService.getPaymentMethod(['']).subscribe(getPaymentMethod => {
      this.paymentMethodSuggestions = new DataSource({
        store: <String[]>getPaymentMethod,
        paginate: true,
        pageSize: 10
      });
    });

    this.httpDataService.getRecordList([''])
      .subscribe(getSalesperson => {
        this.SalesPersonSuggestions = new DataSource({
          store: <String[]>getSalesperson,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.getLocationListSO(['']).subscribe(getLocation => {
      this.receiveLocSuggestionsLookup = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>getLocation
      }
    });

    this.httpDataService.getCountryList(['']).subscribe(getCountryList => {
      this.getCountryCodeListAll = new DataSource({
        store: <String[]>getCountryList,
        paginate: true,
        pageSize: 20
      });
    });


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  calculateForSummary() {
    this.httpDataService.openHeader(["", this.SONumber]).subscribe(dataHeader => {
      this.assignToDuplicate(dataHeader);
      this.Customer = dataHeader[0];
      this.printHeader = dataHeader;
      this.setTheSettingStatus();
      this.InvoiceTotal = this.Customer["InvDiscountAmount"] ? this.Customer["InvDiscountAmount"] : 0;
      this.lineTotal = this.Customer["Amount"] ? this.Customer["Amount"] : 0;
      this.DiscountPerc = this.Customer["InvoiceCompoundDiscount"];
      this.SubTotal = Number(this.lineTotal) - Number(this.InvoiceTotal);
      this.amtincvatvalue = this.Customer["AmountIncludingVAT"] ? this.Customer["AmountIncludingVAT"] : 0;
      this.httpDataService.getTotalLinesDiscAmt(['',
        this.SONumber]).subscribe(getTotalLinesDiscAmt => {
          this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
          this.totalInvoiceDisocunt = Number(this.TotalLineDiscountAmount) + Number(this.InvoiceTotal);
        });
      this.httpDataService.getSumQuantityItem(['',
        this.SONumber]).subscribe(getSumQuantityItem => {
          this.TotalQuantity = getSumQuantityItem[0]["ttlQuantity"];
        });
      this.Tax = Number(Number(this.amtincvatvalue) - Number(this.Customer["Amount"]));
      this.Total = this.amtincvatvalue;

      if ((this.printLines != null ? Object.keys(this.printLines).length > 0 : false)) {
        this.isLinesExist = true;
      } else {
        this.isLinesExist = false;
      }
      if (this.Customer["AmtIncvat"] == 'Yes') {
        this.Customer["AmtIncvat"] = true;
      } else {
        this.Customer["AmtIncvat"] = false;
      }
      if (this.Customer["SelltoCustomerNo"] != null ? this.Customer["SelltoCustomerNo"] != '' : false) {
        this.isCustCodeAdded = true;
        this.graphdata(this.Customer["SelltoCustomerNo"]);
      }
      if (this.Customer["FlowCompleted"] == 'No') {
        this.isFlowCompleted = false;
      } else {
        this.isFlowCompleted = true;
      }

      this.httpDataService.getCustomerContactDetail(['', this.Customer["SelltoCustomerNo"]])
        .subscribe(getSalesperson => {
          this.ContactPersonSuggestions = new DataSource({
            store: <String[]>getSalesperson,
            paginate: true,
            pageSize: 10
          });
        });

      this.setTheFlowStatusClr();
    });
  }

  setTheSettingStatus() {
    if (this.Customer['FlowResult'] == 'Approved') {
      this.SOFlowResult = true;
      this.SalesOrderOperations = ['Print Quote', 'Convert to Purchase Quote', 'Convert to Sales Order', 'Send Email to Vendors', 'Send Email to Customer'];
    }
    else if (this.Customer['FlowResult'] == 'Rejected') {
      this.SOFlowResult = true;
      this.SalesOrderOperations = [];
    }
    else if (this.Customer['FlowResult'] == 'SENT FOR APPROVAL') {
      this.SOFlowResult = false;
      this.SalesOrderOperations = ['Approved', 'Rejected', 'Print Quote', 'Convert to Purchase Quote', 'Send Email to Vendors', 'Send Email to Customer'];
    }
    else {
      this.SOFlowResult = false;
      this.SalesOrderOperations = ['SENT FOR APPROVAL', 'Print Quote', 'Convert to Purchase Quote', 'Send Email to Vendors', 'Send Email to Customer'];
    }
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  itemLookup1(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Description");
  }
  formateForItemListSuggestion1(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Description");
  }
  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "Description", "UOM", "StockOnHand");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Description");
  }
  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }
  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForPaymentMethod(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormateForShippedby(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  suggestionFormateForSalesPerson(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hoversuggestionFormateForSalesPerson(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  suggestionFormateForContact(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "ContactID", "FirstName");
  }

  hoversuggestionFormateForContact(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "ContactID", "FirstName");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormateForLocationLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Location");
  }

  hoverFormateForLocationLookup(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Location", "Name");
  }

  suggestionFormateForVarientLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "VariantCode");
  }

  hoverFormateForVarientLookup(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "VariantCode", "BaseUOM");
  }

  suggestionFormatForCountryCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "countrycode", "countryname");
  }

  hoverFormateForCountryCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "countrycode", "countryname");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListHover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "ItemCode");
  }

  showNewCustomerCard(event) {
    this.popupVisible = true;
    this.newCustomerDetail = {};
  }

  SaveNewCustomer() {
    this.formWidget.instance.updateData(this.newCustomerDetail);
    var data: [] = null;
    data = this.formWidget.instance.option("formData");
    if (this.newCustomerDetail["CustomerID"]) {
      this.httpDataService.insertCustomer(["",
        this.newCustomerDetail["CustomerID"],
        this.newCustomerDetail["Name"],
        this.newCustomerDetail["Address"],
        this.newCustomerDetail["Address2"],
        this.newCustomerDetail["City"],
        this.newCustomerDetail["ZipCode"],
        this.newCustomerDetail["Phone"],
        this.newCustomerDetail["Email"]]).subscribe(getNewCustDetail => {
          if (getNewCustDetail > 0) {
            this.toastr.success("Customer Added Sucessfully!!");
            this.openCustomerDetails(this.newCustomerDetail["CustomerID"]);
          } else {
            this.toastr.error("Error While Inserting Customer!! Error Status Code: INSERT-ERR");
          }
        });
    } else {
      this.toastr.warning("CustomerCode is Empty!!");
    }
  }

  openCustomerDetails(custCode) {
    UtilsForGlobalData.setLocalStorageKey('CustCode', custCode);
    this.router.navigate(['/sales/customer-details']);
  }

  graphdata(custCode) {
    this.httpDataService.getGeneralStats(['',
      custCode]).subscribe(dataforKPI => {
        let numbers = dataforKPI;
        for (var i = 0; i < Object.keys(numbers).length; i++) {
          this.pieChartData[i] = Number(numbers[i]["Qty"]);
          this.pieChartLabels[i] = numbers[i]["LineCode"];
        }
      });
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (!this.isCustCodeAdded) {
      event.preventDefault();
      this.toastr.warning("Please Select The Customer Code!!");
    }
    if (event.nextId == 'Stats') {
      this.graphdata(this.Customer["SelltoCustomerNo"]);
      this.getstatdata(this.Customer["SelltoCustomerNo"]);
    }
  }

  isAllowAdd() {
    if (!this.isCustCodeAdded)
      return false;
    else if (!this.SOFlowResult)
      return true;
  }

  getstatdata(custCode) {
    this.dataforstat["Ongoing_order"] = 0;
    this.httpDataService.getStat1(['', custCode])
      .subscribe(dataforstat => {
        this.dataforstat = dataforstat[0];
      });
  }



  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.ItemCode = value;
    this.httpDataService.VariantLookupgetListWithFilter(['', value]).subscribe(getSItem => {
      this.serviceitemArray = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () => <String[]>getSItem
      }
    });
  }

  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    newData.LineDiscountAmtText = value;
    if (currentData.UnitPrice != undefined && currentData.Quantity != undefined) {
      var GAmount: Number = (currentData.Quantity * currentData.UnitPrice);
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
      newData.AmountIncludingVAT = (currentData.Quantity * currentData.UnitPrice) - value;
      newData.LineAmount = (currentData.Quantity * currentData.UnitPrice) - value;
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
    newData.UnitPrice = value;
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : 1;
    value = value != 0 ? value : 0.01;
    if (currentData.UnitPrice != undefined && currentData.LineDiscountAmount != undefined) {
      var GAmount: Number = (value * currentData.UnitPrice);
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
      console.log(currentData);
      newData.LineDiscountAmtText = disc;
      newData.LineDiscountAmount = disc;
      newData.AmountIncludingVAT = (value * currentData.UnitPrice) - newData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    newData.Quantity = value;
    newData.QtytoShip = value;
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
    if (currentData.UnitPrice && currentData.LineDiscountAmount) {
      newData.AmountIncludingVAT = (value * currentData.UnitPrice) - currentData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    newData.QtytoShip = value;
    (<any>this).defaultSetCellValue(newData, value);
  }

  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.UnitPrice && currentData.Quantity) {
      if ((currentData.Quantity * currentData.UnitPrice) >= value) {
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.UnitPrice) - value;
        newData.LineAmount = newData.AmountIncludingVAT;
      } else {
        value = (currentData.Quantity * currentData.UnitPrice);
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.UnitPrice) - value;
        newData.LineAmount = newData.AmountIncludingVAT;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  } */

  setPriceFCYValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    (<any>this).defaultSetCellValue(newData, value);
  }

  SalesOrderOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Quote') {
      this.httpDataService.getAllReportsSetupDefault(["", "SO"]).subscribe(callData3 => {
        this.reportCustom = callData3;
        this.fetchDataForInvoice();
      });
    } else if (userOption == 'Convert to Purchase Quote') {
      this.convertSQtoPQ();
    } else if (userOption == 'Convert to Sales Order') {
      this.convertSQtoSO();
    } else if (userOption == 'Send Email to Vendors') {
      this.showPQCreatedbySQ();
    } else if (userOption == 'Send Email to Customer') {
      this.showCustomersContactforEmail();
    } else {
      this.OnUserActionGo(userOption);
    }
  }

  convertSQtoSO() {
    if (this.Customer["forSynch"] == 'Yes') {
      this.httpDataService.btnConvert_clickHandler(["",
        this.SONumber,
        UtilsForGlobalData.getUserId()]).subscribe(data => {
          if (data[0] == 'DONE') {
            this.toastr.success("Document Converted Successfully with SO :" + data[1][0]["YourReference"]);
            this.calculateForSummary();
          } else {
            this.toastr.error("Error while converting it Into SO :" + data[0]);
          }
        });
    } else {
      this.toastr.warning("This Sales Quote is already converted. SO no. : " + this.Customer["YourReference"]);
    }
  }

  convertSQtoPQ() {
    if (this.Customer["HasPO"] == 'Yes') {
      this.toastr.error("Purchase Quote already Created!");
    } else {
      this.httpDataService.convertSQtoPQ(["",
        this.SONumber,
        'Local',
        UtilsForGlobalData.getUserRoleId()]).subscribe(data => {
          if (data[0] == 'DONE') {
            this.toastr.success("Document Converted Successfully");
            this.showPQfromSQ = true;
            this.showPQCreatedbySQ();
          } else {
            this.toastr.error(data[0]);
          }
        });
    }

  }

  addnewline(event) {
    this.waitingDialogue = true;
    this.httpDataService.sendMailSingle(["",
      event.key["DocumentNo"],
      this.SONumber]).subscribe(data => {
        if (data > 0) {
          this.waitingDialogue = false;
          this.httpDataService.getAllPQbySQ(["", this.SONumber])
            .subscribe(data => {
              this.PQlistfromSQ = {
                paginate: true,
                pageSize: 20,
                loadMode: "raw",
                load: () =>
                  <String[]>data
              }
            });
          this.toastr.success("Successfully Sent an Email to Respective Vendors", "DONE");
        } else {
          this.waitingDialogue = false;
          this.httpDataService.getAllPQbySQ(["", this.SONumber])
            .subscribe(data => {
              this.PQlistfromSQ = {
                paginate: true,
                pageSize: 20,
                loadMode: "raw",
                load: () =>
                  <String[]>data
              }
            });
          this.toastr.error("Failed to Send an Email");
        }
      });
  }

  SendEmailtoCustomer(event) {
    this.waitingDialogue = true;
    this.httpDataService.sendMailtoCustomer(["",
      event.key["DocumentNo"]])
      .subscribe(data => {
        if (data >= 1) {
          this.waitingDialogue = false;
          this.toastr.success("Mail Sent Successfully to Customer");
          this.httpDataService.getCustomerContactDG(["", this.Customer["CustomerContact"], this.SONumber])
            .subscribe(data => {
              this.customerContactDS = {
                paginate: true,
                pageSize: 20,
                loadMode: "raw",
                load: () =>
                  <String[]>data
              }
              this.gridContainerSQtoPQEmail.instance.refresh();
            });
        } else {
          this.httpDataService.getCustomerContactDG(["", this.Customer["CustomerContact"], this.SONumber])
            .subscribe(data => {
              this.customerContactDS = {
                paginate: true,
                pageSize: 20,
                loadMode: "raw",
                load: () =>
                  <String[]>data
              }
              this.gridContainerSQtoPQEmail.instance.refresh();
            });
          this.toastr.error("Failed to Send an Email");
        }
      });
  }

  showPQCreatedbySQ() {
    this.showPQfromSQ = true;
    this.httpDataService.getAllPQbySQ(["", this.SONumber])
      .subscribe(data => {
        this.PQlistfromSQ = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () =>
            <String[]>data
        }
        this.gridContainerSQtoPQ.instance.refresh();
      });
  }

  showCustomersContactforEmail() {
    if (this.Customer["CustomerContact"] == '' || this.Customer["CustomerContact"] == null || this.Customer["CustomerContact"] == undefined) {
      this.toastr.error("Please select the Customer Contact Person");
    } else {
      this.sendCustomerContactEmail = true;
      this.httpDataService.getCustomerContactDG(["", this.Customer["CustomerContact"], this.SONumber])
        .subscribe(data => {
          this.customerContactDS = {
            paginate: true,
            pageSize: 20,
            loadMode: "raw",
            load: () =>
              <String[]>data
          }
          this.gridContainerSQtoPQEmail.instance.refresh();
        });
    }

  }


  OnUserActionGo(userOption) {
    if (this.Customer['FlowCompleted'] == 'Yes') {
      this.toastr.error("Cannot Do this operation");
    }
    else if (!(this.printLines != null ? Object.keys(this.printLines).length > 0 : false)) {
      this.toastr.error("Please Add the Items To Sales Quotes");
    }
    else if (!this.isCustCodeAdded) {
      this.toastr.error("Please Select The Sellto Customer");
    }
    else {
      {
        var nextSequence: Number = 0;
        if (this.Customer['FlowResult'] == 'On-Hold') {
          nextSequence = this.Customer['CurrentSequence'];
        }
        else {
          nextSequence = Number(this.Customer['CurrentSequence']) + 1;
        }
        this.httpDataService.getProcessRole(["",
          UtilsForGlobalData.getUserRoleId(), nextSequence.toString()])
          .subscribe(dataProcess => {
            if ((dataProcess != null ? Object.keys(dataProcess).length > 0 : false)) {
              this.httpDataService.getProcessFlow(["",
                nextSequence.toString()]).subscribe(dataFlow => {
                  if (dataFlow[0]["ResultIsChoice"] == 'No') {
                    this.httpDataService.updateStatus(["",
                      nextSequence.toString(),
                      dataFlow[0]["ActionType"],
                      dataFlow[0]["Result1"],
                      dataFlow[0]["FinalStep"],
                      dataFlow[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.SONumber]).subscribe(dataStatus => {
                        if (dataStatus == 1) {
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
                      dataFlow[0]["ActionType"],
                      userOption,
                      dataFlow[0]["FinalStep"],
                      dataFlow[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.SONumber]).subscribe(dataStatus => {
                        if (dataStatus == 1) {
                          this.toastr.success("Status Updated Succesfully", userOption);
                          this.calculateForSummary();
                        }
                        else {
                          this.toastr.error("Error While Updating Status: " + userOption);
                        }
                      });
                  }
                });
            } else {
              this.toastr.warning("You Don't have permission to change Status");
            }
          });
      }
    }
  }

  allowNewclick(args) {
    this.router.navigate(['/dashboard/customerlist']);
  }

  visibilityTest(value) {
    var json = this.customerSuggestions == null ? {} : this.customerSuggestions._store._array;
    for (var index = 0; index < json.length; ++index) {
      if (json[index].CustCode == value) {
        return false;
      }
    }
    return true;
  }

  onCustomerSearchClicked(type) {
    this.typeOfCustomer = type;
    this.globalCustomerLookupPopup = true;
  }

  onCustomerRowClicked(event) {
    this.globalCustomerLookupPopup = false;
    this.httpDataService.updateCustCode(["", this.SONumber, event.data.CustCode, this.typeOfCustomer,
      UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
        this.errorHandlingToaster(dataStatus);
      });
  }

  onSellToCustomerCodeChanged(event) {
    if (this.Customer["SelltoCustomerNo"] != event.value) {
      var json = this.customerSuggestions == null ? {} : this.customerSuggestions._store._array;
      for (var index = 0; index < json.length; ++index) {
        if (json[index].CustCode == event.value) {
          this.httpDataService.updateCustCode(["",
            this.SONumber, event.value, 'SellTo',
            UtilsForGlobalData.getUserId()]).subscribe(callData3 => {
              this.calculateForSummary();
            });
          break;
        }
      }
    }
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


  onBillToCustomerCodeChanged(event) {
    if (event.value ? this.Customer["BilltoCustomerNo"] != event.value : false) {
      this.httpDataService.updateCustCode(["",
        this.SONumber, event.value, 'BillTo', UtilsForGlobalData.getUserId()])
        .subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onShipToCustomerCodeChanged(event) {
    if (event.value ? this.Customer["ShiptoCode"] != event.value : false) {
      this.httpDataService.updateCustCode(["",
        this.SONumber, event.value, 'ShipTo', UtilsForGlobalData.getUserId()])
        .subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  onDropDownCodeChanged(event, dataField) {
    if (dataField == 'AmtIncvat') { }
    else if (dataField == 'LocationCode') {
      event.value = (event.value == null ? '' : event.value);
      if (this.duplicateSalesHeader[0][dataField] != event.value) {
        this.httpDataService.generalUpdate(["",
          dataField, event.value,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    } else {
      if (event.value ? this.Customer[dataField] != event.value : false) {
        this.httpDataService.generalUpdate(["",
          dataField, event.value,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'AmtIncvat') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if (this.duplicateSalesHeader ? this.duplicateSalesHeader[0]["AmtIncvat"] != temp : false) {
        this.httpDataService.generalUpdate(["",
          e.dataField, temp,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    } else if ((e.value != undefined || e.value != null) && this.duplicateSalesHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DueDate' || e.dataField == 'OrderDate') {
        if (this.duplicateSalesHeader[0][e.dataField] == null) {
          temp = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
        } else {
          temp = e.value;
        }
        this.httpDataService.generalUpdate(["",
          e.dataField, temp,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      } else if (e.dataField == 'ShipmentDate') {
        if (this.duplicateSalesHeader[0][e.dataField] == null) {
          e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
        }
        if (UtilsForSuggestion.compareDate(this.Customer["OrderDate"], e.value) == 1) {
          this.toastr.warning("Shipping Date is Less then Order Date!!");
          this.calculateForSummary();
        } else {
          this.httpDataService.shipmentDate_changeHandler(["",
            e.value, this.SONumber])
            .subscribe(dataStatus => {
              this.errorHandlingToasterForUPDATE(dataStatus);
            });
        }
      } else {
        this.httpDataService.generalUpdate(["",
          e.dataField, e.value,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  formBilling_fieldDataChanged(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicateSalesHeader[0][e.dataField] != e.value) {
        if (e.dataField == 'InvoiceCompoundDiscount') {
          var GAmount: Number = 0;
          var amtIncVat = this.Customer["amtIncVAT"] == true ? 'Yes' : 'No'
          this.httpDataService.getToatalAmount(["",
            this.SONumber]).subscribe(getLines => {
              if (amtIncVat == 'Yes') {
                GAmount = Number(getLines[0].TotalAmount);
                GAmount = Number(GAmount) + Number(getLines[0].VatAmount);
              }
              else {
                GAmount = Number(getLines[0].TotalAmount);
              }
              var tempAmt: Number = Number((amtIncVat == 'Yes') ? (this.Customer["AmountIncludingVAT"]) : (this.Customer["Amount"]));
              var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(e.value, GAmount);
              if (amtafterDisc == "invalid value") {
                this.toastr.warning('Invaid Discount Value!!');
              }
              else {
                var disc = Number(GAmount) - Number(amtafterDisc);
                if (disc <= GAmount) {
                  disc = disc;
                } else {
                  this.toastr.warning('Total Discount is greater than Price!');
                  disc = 0;
                  this.duplicateSalesHeader[0]['' + e.dataField] = '0';
                  e.value = 0.0;
                }
                this.httpDataService.btnInvDiscount_clickHandler(["",
                  this.SONumber, disc, e.value])
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
        } else {
          this.httpDataService.generalUpdate(["",
            e.dataField, e.value,
            this.SONumber]).subscribe(dataStatus => {
              this.errorHandlingToasterForUPDATE(dataStatus);
            });
        }
      }
    }
  }

  setTheFlowStatusClr() {
    var doc = <HTMLSpanElement>document.getElementById("docStatus");
    if (this.Customer["FlowResult"] == 'Open' || this.Customer["FlowResult"] == 'OPEN') {
      doc != null ? doc.classList.add("label-success") : '';
    } else if (this.Customer["FlowResult"] == 'Approved' || this.Customer["FlowResult"] == 'APPROVED') {
      doc != null ? doc.classList.add("label-info") : '';
    } else if (this.Customer["FlowResult"] == 'Sent For Approval' || this.Customer["FlowResult"] == 'SENT FOR APPROVAL') {
      doc != null ? doc.classList.add("label-info") : '';
    } else if (this.Customer["FlowResult"] == 'Rejected' || this.Customer["FlowResult"] == 'REJECTED') {
      doc != null ? doc.classList.add("label-danger") : '';
    }
  }

  formShipping_fieldDataChanged(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicateSalesHeader[0][e.dataField] != e.value) {
        if (e.dataField == 'RequestedDeliveryDate') {
          if (this.duplicateSalesHeader[0][e.dataField] == null) {
            e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
          }
        }
        this.httpDataService.generalUpdate(["",
          e.dataField, e.value,
          this.SONumber]).subscribe(dataStatus => {
            this.calculateForSummary();
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicateSalesHeader[0][e.dataField] != e.value) {
        this.httpDataService.generalUpdate(["",
          e.dataField, e.value,
          this.SONumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  onDefaultDropDownvalueChanged(event, dataField) {
    if (event ? this.Customer[dataField] != event.value : false) {
      this.httpDataService.generalUpdate(["",
        dataField, event.value,
        this.SONumber]).subscribe(dataStatus => {
          this.errorHandlingToasterForUPDATE(dataStatus);
        });
    }
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }

  getBillToCustomerDetail(event) {
    this.popupBilltoCustDetails = true;
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == "DONE" || dataStatus[0] == "SOUPDATED") {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
    }
    this.calculateForSummary();
  }

  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus >= 0) {
      this.calculateForSummary();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToasterForUPDATESTATUS(dataStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "ItemCode") {
      let standardHandler = e.editorOptions.onValueChanged;
      let thisComponent = this;
      e.editorOptions.onValueChanged = function (event) {
        e.component.cellValue(e.row.rowIndex, "UOM", event.value.BaseUOM);
        e.component.cellValue(e.row.rowIndex, "Description", event.value.Description);
        e.component.cellValue(e.row.rowIndex, "CostIncVAT", thisComponent.Customer["AmtIncvat"] ? 'Yes' : 'No');
        e.component.cellValue(e.row.rowIndex, "UnitPrice", event.value.UnitPrice);
        e.component.cellValue(e.row.rowIndex, "UnitCost", event.value.UnitCostAVG);
        e.component.cellValue(e.row.rowIndex, "LotNoRequired", event.value.LotNoRequired);
        e.component.cellValue(e.row.rowIndex, "ItemCategorycode", event.value.Category);
        e.component.cellValue(e.row.rowIndex, "BrandCode", event.value.Brand);
        e.component.cellValue(e.row.rowIndex, "GPCode", event.value.GPCode);
        e.component.cellValue(e.row.rowIndex, "salesCode", event.value.SalesCode);
        e.component.cellValue(e.row.rowIndex, "Location", thisComponent.Customer["LocationCode"]);
        e.component.cellValue(e.row.rowIndex, "Quantity", '1');
        e.component.cellValue(e.row.rowIndex, "QtytoShip", '1');
        e.component.cellValue(e.row.rowIndex, "LineDiscountAmount", "0");
        e.component.cellValue(e.row.rowIndex, "AmountIncludingVAT", event.value.UnitPrice);
        e.component.cellValue(e.row.rowIndex, "LineAmount", event.value.UnitPrice);
        e.component.cellValue(e.row.rowIndex, "ItemCode", event.value.ItemCode);
      }
    }
  }

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", true);
    this.gridContainer.instance.columnOption("Details", "visible", false);
    if (event.data.lineType) {
      this.gridContainer.instance.columnOption("Location", "visible", true);
      this.gridContainer.instance.columnOption("lineType", "allowEditing", false);
    } else {
      this.gridContainer.instance.columnOption("Location", "visible", false);
      this.gridContainer.instance.columnOption("lineType", "allowEditing", true);
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
        this.gridContainer.instance.columnOption("Location", "visible", true);
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
        this.gridContainer.instance.columnOption("Location", "visible", true);
      });
    }
  };

  rowIndex: number = 0;
  ItemLookupvalueChanged(data) {
    this.rowIndex = data.rowIndex;
    /* if (data.row.data.lineType == 'SERVICEITEM') {
      this.globalServiceItemLookupPopup = true;
    } else if (data.row.data.lineType == 'DEPOSIT') {
      this.httpDataService.getDeposit(['',
        this.Customer["BilltoCustomerNo"],
        this.Customer["OrderDate"]]).subscribe(getDItem => {
          this.deposititemArray = <String[]>getDItem;
          this.globalDepositItemLookupPopup = true;
        });
    } else if (data.row.data.lineType == 'ITEM') { */
    this.globalItemLookupPopup = true;
    /* } else {
      this.toastr.warning("Please Select the Line Type!!");
    } */
  }

  onUserRowSelect(event, type) {
    //if (type == 'ITEM') {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "UOM", event.data.BaseUOM);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "UnitCost", event.data.UnitCostAVG);
    this.gridContainer.instance.cellValue(this.rowIndex, "UnitPrice", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "LotNoRequired", event.data.LotNoRequired);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCategorycode", event.data.Category);
    this.gridContainer.instance.cellValue(this.rowIndex, "BrandCode", event.data.Brand);
    this.gridContainer.instance.cellValue(this.rowIndex, "GPCode", event.data.GPCode);
    this.gridContainer.instance.cellValue(this.rowIndex, "salesCode", event.data.SalesCode);
    this.gridContainer.instance.cellValue(this.rowIndex, "Location", this.Customer["LocationCode"]);
    this.gridContainer.instance.cellValue(this.rowIndex, "LineDiscountAmount", "0"); //event.data.GPFormula
    this.gridContainer.instance.cellValue(this.rowIndex, "Quantity", '1');
    this.gridContainer.instance.cellValue(this.rowIndex, "QtytoShip", '1');
    this.gridContainer.instance.cellValue(this.rowIndex, "AmountIncludingVAT", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "LineAmount", event.data.UnitPrice);

    /* } else if (type == 'SERVICEITEM') {
      this.globalServiceItemLookupPopup = false;
      this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.Code);
      this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
      this.gridContainer.instance.cellValue(this.rowIndex, "UnitPrice", event.data.UnitPrice);
    } else {
      this.globalDepositItemLookupPopup = false;
      this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.DocumentNo);
      this.gridContainer.instance.cellValue(this.rowIndex, "UnitPrice", event.data.AmountIncludingVAT);
    } */
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["UnitPrice", "Amount", "LineAmount", "AmountIncludingVAT", "Quantity", "QtytoShip", "VATBaseAmount"]);
    if (data.data.lineType == 'ITEM') {
      this.itemDetailsPopup = true;
      this.itemPopupName = "ITEM DETAILS";
      /* } else if (data.data.lineType == 'SERVICEITEM') {
        this.itemDetailsPopup = true;
        this.itemPopupName = "SERVICE ITEM DETAILS";
      } else if (data.data.lineType == 'DEPOSIT') {
        this.itemDetailsPopup = true;
        this.itemPopupName = "DEPOSIT ITEM DETAILS"; */
    } else {
      this.itemPopupName = "ITEM DETAILS";
      this.httpDataService.getItemDetail(["", data.data.ItemCode]).subscribe(dataDetails => {
        this.itemDetails = UtilsForSuggestion.StandartNumberFormat(dataDetails[0], ["UnitPrice", "UnitCost"]);
        this.itemLookupDetailsPopup = true;
      });
    }
  }

  CurrencyCodeLookupClicked() {
    this.httpDataService.getCurrencyList(this.Customer["OrderDate"]).subscribe(getCurrency => {
      this.globalCurrencyLookupPopup = true;
      this.currencySuggestions = <String[]>getCurrency;
    });
  }

  onCurrencyCodeSelected(event) {
    this.globalCurrencyLookupPopup = false;
    this.httpDataService.handleCurrencyCode(["",
      event.data.CurrencyCode, event.data.ExchangeRate, this.SONumber]).subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  onClearHandleCurrencyCode() {
    this.httpDataService.handleRemoveCurrencyCode(["",
      this.SONumber, this.companyHeader.CurrencyCode]).subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  soLinesDeleteAll() {
    this.httpDataService.DelteAllSOLines(["",
      this.SONumber]).subscribe(data => {
        this.gridContainer.instance.refresh();
      });
  }

  // SendMailForAll(type) {
  //   this.httpDataService.sendMail(["",
  //     this.SONumber, 'ALL']).subscribe(data => {
  //       if (data > 0) {
  //         this.toastr.success("Successfully Sent an Email to Respective Vendors", "DONE");
  //       } else {
  //         this.toastr.error("Failed to Send an Email to Respective Vendors, Error Status Code: PHPMAILER-ERR");
  //       }
  //     });
  // }

  SendMailtoPQs() {
    this.waitingDialogue = true;
    this.httpDataService.SendMailtoPQBulkVendor(["",
      this.SONumber]).subscribe(data => {
        if (data > 0) {
          this.waitingDialogue = false;
          this.toastr.success("Successfully Sent an Email to Respective Vendors", "DONE");
          this.showPQfromSQ = false;
        } else {
          this.waitingDialogue = false;
          this.toastr.error("Failed to Send an Email");
        }
      });
  }

  fetchDataForInvoice() {
    if (this.isLinesExist && Object.keys(this.companyHeader).length) {
      this.generateStdPDF(this.Customer, this.printLines, "Sales Quote");
    } else {
      this.toastr.warning("Please Add the Item to the Sales Quote!");
    }
  }

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
    rightStartCol1: 400,
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
    centerX: 238,
    centerBOX: 258,
    InitialstartY: 40,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, title) {

    printHeader.TotalLineDiscount = 0;
    printHeader.TotalCGSTSGST = 0;
    printHeader.TotalIGST = 0;
    printHeader.TotalQty = 0;

    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount ? printHeader.InvDiscountAmount : 0;
    printHeader.TotalAmountinWords = printHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      if (Number(decimalAsInt) < 10) {
        printHeader.TotalAmountinWords += " and 0" + decimalAsInt + "/100";
      } else {
        printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
      }
    }

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      if (printLines[i].lineType == 'ITEM') {
        printHeader.TotalQty += Number(printLines[i].Quantity);
      }
      printLines[i].SnNo = i + 1;
      printHeader.TotalLineDiscount = Number(printHeader.TotalLineDiscount) + Number(printLines[i].LineDiscountAmount);
      printHeader.TotalCGSTSGST = Number(printHeader.TotalCGSTSGST) + Number(printLines[i].CGSTAmount) + Number(printLines[i].SGSTAmount);
      printHeader.TotalIGST = Number(printHeader.TotalIGST) + Number(printLines[i].IGSTAmount);
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
      printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
      printLines[i].VatAmount = this.formatNumber(printLines[i].VatAmount);
      printLines[i].LineAmount = this.formatNumber(printLines[i].LineAmount);
      printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      printLines[i].AmountIncludingVAT = this.formatNumber(printLines[i].AmountIncludingVAT);
      if (Number(printLines[i].LineDiscountAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "LineDiscountAmount") == undefined) {
          this.columnHeader5.splice(6, 0, { title: "LINE DISC.AMT", dataKey: "LineDiscountAmount", width: 40 });
        }
      }
      if (Number(printLines[i].SGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "SGSTAmount") == undefined) {
          this.columnHeader5.splice(this.columnHeader5.length - 2, 0, { title: "SGST", dataKey: "SGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].CGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "CGSTAmount") == undefined) {
          this.columnHeader5.splice(this.columnHeader5.length - 2, 0, { title: "CGST", dataKey: "CGSTAmount", width: 40 });
        }
      }
      if (Number(printLines[i].IGSTAmount) > 0) {
        if (this.columnHeader5.find(p => p.dataKey == "IGSTAmount") == undefined) {
          this.columnHeader5.splice(this.columnHeader5.length - 2, 0, { title: "IGST", dataKey: "IGSTAmount", width: 40 });
        }
      }
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].SGSTAmount = this.formatNumber(printLines[i].SGSTAmount) + "(" + Number(printLines[i].SGST) + "%)";
      printLines[i].CGSTAmount = this.formatNumber(printLines[i].CGSTAmount) + "(" + Number(printLines[i].CGST) + "%)";
      printLines[i].IGSTAmount = this.formatNumber(printLines[i].IGSTAmount) + "(" + Number(printLines[i].IGST) + "%)";
    }

    for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
      this.printHeader[i].ExchangeRate = this.formatNumber(this.printHeader[i].ExchangeRate);
      var salescode = this.printHeader[i].SalespersonCode ? this.printHeader[i].SalespersonCode : '';
      var salesname = this.printHeader[i].SalesPersonName ? this.printHeader[i].SalesPersonName : '';
      this.printHeader[i].SalespersonCodePrint = salescode + " " + salesname;
      this.printHeader[i].FormtedDueDate = this.printHeader[i].DueDate != null ?
        new Date(this.printHeader[i].DueDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-') : '-';
    }

    printHeader.AmountBeforeDisc = this.formatNumber(Number(printHeader.Amount) + Number(printHeader.InvDiscountAmount) + Number(printHeader.TotalLineDiscount));
    printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
    printHeader.TotalAmount = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.InvDiscountAmount));
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
    printHeader.Amount = this.formatNumber(printHeader.Amount);

    this.companyHeader = UtilsForSuggestion.StandardValueFormat(this.companyHeader,
      ["Address1", "Address2", "City", "PostCode", "Phone", "Fax", "VATID"]);

    printHeader = UtilsForSuggestion.StandardValueFormat(printHeader,
      ["BilltoCustomerNo", "BilltoName", "BilltoAddress", "BilltoAddress2", "BilltoCountry", "BilltoPostCode",
        "BilltoCity", "BilltoContact", "VATID", "ShiptoCode", "ShiptoName", "ShiptoAddress", "ShiptoAddress2",
        "ShiptoCounty", "ShiptoPostCode", "ShiptoCity", "ShiptoContact", "SelltoCustomerName", "SelltoAddress",
        "SelltoCity", "SelltoPostCode", "SelltoCountry", "SelltoContact", "SellToPhone", "LastModifiedEmail",
        "LastModifiedPhone", "CustomerBranchName", "BilltoContactPh", "ShiptoContactPh", "RemarksToPrint",
        "ExternalDocumentNo", "PaymentMethodCode", "EWayBill", "SOCreatedBy"]);
    printHeader.FormteddocumentDate = new Date(printHeader.OrderDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-');
    printHeader.FormtedDueDate = printHeader.DueDate ? new Date(printHeader.DueDate).toLocaleDateString('en-GB').replace('/', '-').replace('/', '-') : '-';

    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    if (this.companyHeader["CountryCode"] == 'THA' || this.companyHeader["CountryCode"] == 'SGP') {
      this.PrintReportForTHA(doc, printHeader, printLines, title);
    } else {
      this.PrintReportForIND(doc, printHeader, printLines, title);
    }

    doc.save("SalesQuotes" + this.SONumber + ".pdf");
    this.gridContainer ? this.gridContainer.instance.refresh() : '';

  }

  PrintReportForTHA(doc, printHeader, printLines, title) {

    var tempY = this.pdfFormate.InitialstartY;
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "right-align" }, this.pdfFormate.startX, tempY + 8);
    doc.setLineWidth(1);
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);


    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.NormalFontSize);
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, 100, 70);
    var splitTitle = doc.splitTextToSize(this.companyHeader.Name + "(" + this.companyHeader.BranchName + ")", 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    splitTitle = doc.splitTextToSize(this.companyHeader.Address1 + ",", 150);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    }
    splitTitle = doc.splitTextToSize(this.companyHeader.Address2, 150);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("" + this.companyHeader.City + ", " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("TAX ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);


    tempY += this.pdfFormate.NormalSpacing;
    var originalRect = tempY;
    var Documentallign = tempY;

    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Cust: " + printHeader.SelltoCustomerNo, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Ship: " + printHeader.ShiptoCode, { align: "left" }, this.pdfFormate.centerX, tempY);
    doc.textAlign("Document No:" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1 + 20, Documentallign += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.SelltoCustomerName + " (" + printHeader.CustomerBranchName + ")", 160);
    var tempWrapY1 = tempY;
    var tempWrapY2 = tempY;
    tempY += this.pdfFormate.NormalSpacing;
    doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, tempY);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX + 23, tempWrapY1 += this.pdfFormate.NormalSpacing);
    }

    var splitTitle = doc.splitTextToSize(printHeader.ShiptoName, 160);
    doc.textAlign("Name:", { align: "left" }, this.pdfFormate.centerX, tempY);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.centerX + 23, tempWrapY2 += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Document Date:" + printHeader.FormteddocumentDate, { align: "left" }, this.pdfFormate.rightStartCol1 + 20, Documentallign += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.SelltoAddress, 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    }

    var splitTitle = doc.splitTextToSize(printHeader.ShiptoAddress, 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Ext.Document No:" + printHeader.ExternalDocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1 + 20, Documentallign += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    var splitTitle = doc.splitTextToSize(printHeader.SelltoAddress2, 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    }

    var splitTitle = doc.splitTextToSize(printHeader.ShiptoAddress2, 160);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.SelltoCity + ", " + printHeader.SelltoPostCode, { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.ShiptoCity, { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.SelltoCountry, { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    doc.textAlign(" " + printHeader.ShiptoCounty, { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Contact : " + printHeader.SelltoContact, { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    doc.textAlign("Contact : " + printHeader.ShiptoContact, { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Ph : " + printHeader.SellToPhone, { align: "left" }, this.pdfFormate.startX, tempWrapY1 += this.pdfFormate.NormalSpacing);
    doc.textAlign("Ph : " + printHeader.ShiptoContactPh, { align: "left" }, this.pdfFormate.centerX, tempWrapY2 += this.pdfFormate.NormalSpacing);

    tempY = tempWrapY1 > tempWrapY2 ? tempWrapY1 : tempWrapY2;

    doc.rect(this.pdfFormate.startX - 2, originalRect, pageEnd - this.pdfFormate.MarginEndY + 4, tempY - originalRect + 5);
    /* doc.rect(this.pdfFormate.startX - 2, originalRect, this.pdfFormate.centerX - 50, tempY - originalRect + 5);
    doc.rect(this.pdfFormate.startX - 2, originalRect, this.pdfFormate.centerX + 150, tempY - originalRect + 5); */
    doc.rect(this.pdfFormate.centerX - 2, originalRect, 180, tempY - originalRect + 5);

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
        fontStyle: this.pdfFormate.SetFontType,
      },
      columnStyles: {
        SnNo: {
          halign: 'left'
        },
        ItemCode: {
          halign: 'left'
        },
        Description: {
          halign: 'left',
          cellWidth: 150
        },
        Quantity: {
          halign: 'right'
        },
        UnitPrice: {
          halign: 'right'
        },
        LineAmount: {
          halign: 'right'
        }
      },
      headStyles: {
        fillColor: [64, 139, 202],
        //halign: 'center'
      },
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

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setDrawColor(0, 0, 0);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("" + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    if (Number(printHeader.TotalLineDiscount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("LINE DISCOUNT :", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalLineDiscount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.InvDiscountAmount) > 0) {
      doc.setFontType(this.pdfFormate.SetFontType);
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT( " + printHeader.InvoiceCompoundDiscount + " ) :", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EXC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TAX AMOUNT :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setDrawColor(0, 0, 0);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.autoTable(this.columnHeader3, this.columnHeader4, {
      startX: this.pdfFormate.startX,
      startY: startY,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'center'
      },
      theme: 'grid',
      headStyles: {
        fillColor: [64, 139, 202]
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

    /* startY += this.pdfFormate.NormalSpacing * 2;
    doc.textAlign("Delivered By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Recieved By", { align: "left" }, this.pdfFormate.startXcol2Details - 50, startY);
    doc.textAlign("Approved By", { align: "left" }, this.pdfFormate.startXcol2Details + 50, startY);
    doc.textAlign("Authorized Sign", { align: "right-align" }, this.pdfFormate.startXcol3, startY);

    startY += this.pdfFormate.NormalSpacing * 3;
    doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startXcol2Details - 50, startY);
    doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startXcol2Details + 50, startY);
    doc.textAlign("____/____/____", { align: "right-align" }, this.pdfFormate.startXcol3, startY); */

  }

  getImageDimension(image): Observable<any> {
    return new Observable(observer => {
      const img = new Image();
      var varh, varw;
      img.onload = function () {
        varw = parseInt(img.width.toString());
        varh = parseInt(img.height.toString());
      }
      img.src = 'data:image/jpeg;base64,' + this.companyHeader.CompanyLogo;
      console.log(varw);
    });
  }


  PrintReportForIND(doc, printHeader, printLines, title) {

    var tempY = this.pdfFormate.InitialstartY;
    var titleAllign = 'left';
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.setFont(this.pdfFormate.SetFont);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "CompanyLogo")) {
      var num = UtilsForSuggestion.getReportsCustomsItems(this.reportCustom, "CompanyLogo");
      num = num[0]["MetaData"] ? (num[0]["MetaData"]).split(',') : (pageEnd - 70 + ",20").split(',');
      var varx = num.length > 1 ? parseInt(num[0]) : pageEnd - 70;
      var vary = num.length > 2 ? parseInt(num[1]) : 20;
      doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', varx, vary, 70, 65);
      tempY = this.pdfFormate.InitialstartY + 35;
      if (varx < pageEnd / 2) {
        titleAllign = "right-align";
      }
    }
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: titleAllign }, this.pdfFormate.startX, tempY + 8);
    doc.setLineWidth(1);
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);

    doc.setFontSize(this.pdfFormate.NormalFontSize);
    doc.textAlign(this.companyHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("State Code", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.StateCode, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Document No", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(":" + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("GST No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    doc.textAlign("Document Date", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    doc.textAlign(":" + printHeader.FormteddocumentDate, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);


    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.City + " - " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("PAN Number", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.PAN, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    /* if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "EWayBill")) {
      doc.textAlign("E-Bill", { align: "left" }, this.pdfFormate.startXcol3, tempY);
      doc.textAlign(":" + printHeader.EWayBill, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    } */
    //doc.textAlign("Cust PO No: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    //doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign(this.companyHeader.CountryName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    // doc.textAlign("PO Date: ", { align: "left" }, this.pdfFormate.startXcol3, tempY);
    // doc.textAlign(this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    doc.textAlign("Phone No", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.Phone, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    doc.textAlign(this.companyHeader.HomePage, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    //doc.textAlign("CIN: " + this.companyHeader.CIN, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Email", { align: "left" }, this.pdfFormate.startXcol2, tempY);
    doc.textAlign(":" + this.companyHeader.EMail, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);

    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "IEC")) {
      doc.textAlign("IEC Code", { align: "left" }, this.pdfFormate.startXcol2, tempY += this.pdfFormate.NormalSpacing);
      doc.textAlign(":" + this.companyHeader.IEC, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    }

    //box2x2
    var tempX = this.pdfFormate.startX + this.pdfFormate.NormalSpacing;
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 2));
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + this.pdfFormate.NormalSpacing);//top-hor
    doc.line(this.pdfFormate.startX, tempY + this.pdfFormate.NormalSpacing, this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2));//left vert
    doc.textAlign("Bill To/Buyer", { align: "left" }, tempX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    doc.line(pageEnd, tempY + this.pdfFormate.NormalSpacing, pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//left-vert
    doc.line(this.pdfFormate.startX, tempY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY + (this.pdfFormate.NormalSpacing * 2));//bottm-hor
    doc.textAlign("Ship To/Consignee", { align: "left" }, tempX + this.pdfFormate.centerBOX, tempY + (this.pdfFormate.NormalSpacing * 1.8));
    var tempBoxY = tempY;
    var tempYC = tempBoxY;

    //text in box1
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Code", { align: "left" }, tempX, tempY += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.BilltoCustomerNo, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    doc.textAlign("Name", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    var splitTitle = doc.splitTextToSize(printHeader.BilltoName, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BilltoAddress, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BilltoAddress2, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.BilltoCity + ", " + printHeader.BilltoPostCode + "-" + printHeader.BilltoCountry, { align: "left" }, this.pdfFormate.startXDetails, tempY);

    doc.textAlign("Contact", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BilltoContact, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("Phone", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.BilltoContactPh, 200);
    tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXDetails, tempY += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("GST No.", { align: "left" }, tempX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXDetails, tempY);

    //text in box2
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    var tempX = this.pdfFormate.startX + this.pdfFormate.centerBOX + this.pdfFormate.NormalSpacing;
    doc.textAlign("Code", { align: "left" }, tempX, tempYC += (this.pdfFormate.NormalSpacing * 3));
    doc.textAlign(":" + printHeader.ShiptoCode, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);
    doc.textAlign("Name", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.ShiptoName, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("Address", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.ShiptoAddress, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.ShiptoAddress2, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.ShiptoCity + ", " + printHeader.ShiptoPostCode + "-" + printHeader.ShiptoCounty, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);

    doc.textAlign("Contact", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.ShiptoContact, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("Phone", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    splitTitle = doc.splitTextToSize(printHeader.ShiptoContactPh, 200);
    tempYC -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign(":" + splitTitle[i], { align: "left" }, this.pdfFormate.startXcol4Details, tempYC += this.pdfFormate.NormalSpacing);
    }

    doc.textAlign("GST No.", { align: "left" }, tempX, tempYC += this.pdfFormate.NormalSpacing);
    doc.textAlign(":" + printHeader.VATID, { align: "left" }, this.pdfFormate.startXcol4Details, tempYC);


    //box outline
    tempY = tempY > tempYC ? tempY : tempYC;
    tempY += 10;
    doc.line(this.pdfFormate.startX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX, tempY);//vert-left
    doc.line(this.pdfFormate.startX + this.pdfFormate.centerBOX, tempBoxY + (this.pdfFormate.NormalSpacing * 2), this.pdfFormate.startX + this.pdfFormate.centerBOX, tempY);//vert-centre
    doc.line(pageEnd, tempBoxY + (this.pdfFormate.NormalSpacing * 2), pageEnd, tempY);//vert-right
    doc.line(this.pdfFormate.startX, tempY, pageEnd, tempY);



    /* tempY += this.pdfFormate.NormalSpacing * 2;
    doc.setFontType(this.pdfFormate.SetFontType);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "ConnectedOrder")) {
      doc.textAlign("Order No", { align: "left" }, this.pdfFormate.startX, tempY);
      doc.textAlign(":" + printHeader.ExternalDocumentNo, { align: "left" }, this.pdfFormate.startXDetails, tempY);
    }
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "DueDate")) {
      doc.textAlign("Due Date", { align: "left" }, this.pdfFormate.startXcol2, tempY);
      doc.textAlign(":" + printHeader.FormtedDueDate, { align: "left" }, this.pdfFormate.startXcol2Details, tempY);
    }
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PaymentMethod")) {
      doc.textAlign("Payment Method", { align: "left" }, this.pdfFormate.startXcol3, tempY);
      doc.textAlign(":" + printHeader.PaymentMethodCode, { align: "left" }, this.pdfFormate.startXcol3Details, tempY);
    } */

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader5, printLines, {
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
        ItemCode: {
          halign: 'left',
          cellWidth: 80
        },
        Description: {
          halign: 'left',
          cellWidth: 100
        },
        UOM: {
          halign: 'left'
        },
        Quantity: {
          halign: 'right'
        },
        UnitPrice: {
          halign: 'right'
        },
        LineDiscountAmount: {
          halign: 'right'
        },
        Amount: {
          halign: 'right'
        },
        SGSTAmount: {
          halign: 'right'
        },
        CGSTAmount: {
          halign: 'right'
        },
        IGSTAmount: {
          halign: 'right'
        },
        AmountIncludingVAT: {
          halign: 'right'
        }
      },
      headStyles: {
        halign: 'center'
      },
      didDrawPage: data => {
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
        //doc.text("Bank Name : Karnataka Bank Ltd, Bank AcNo : 0647000100245701, IFSC Code : KARB000006", data.settings.margin.left, doc.internal.pageSize.height - 10);
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
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("AMOUNT", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.AmountBeforeDisc, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    if (Number(printHeader.TotalLineDiscount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("LINE DISCOUNT", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalLineDiscount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.InvDiscountAmount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + ")", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.TotalCGSTSGST) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("CGST/SGST", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalCGSTSGST), { align: "right-align" }, rightcol2, startY);
    }

    if (Number(printHeader.TotalIGST) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("IGST", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.TotalIGST), { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EXC TAX", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL GST", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + this.formatNumber(this.Tax), { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC TAX", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.line(this.pdfFormate.startX, startY, pageEnd, startY);

    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "RemarksToPrint")) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.setFontType(this.pdfFormate.SetFontType);
      doc.textAlign("Remark :" + printHeader.RemarksToPrint, { align: "left" }, this.pdfFormate.startX, startY);
    }

    /* if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "TermsAndConditions")) {

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
      doc.textAlign("We certify that the particulars mentioned above are true and correct.", { align: "left" }, this.pdfFormate.startX, startY);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Payment terms- Card, online transfer, cash only.", { align: "left" }, this.pdfFormate.startX, startY);

      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("Goods one sold cannot be taken back or exchanged. Nature of the game being such, sports goods are not guaranteed.", { align: "left" }, this.pdfFormate.startX, startY);
    } */

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PreparedBy")) {
      doc.textAlign("Prepared By:", { align: "left" }, this.pdfFormate.startX, startY);
      doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    }
    doc.textAlign("Material Received & Accepted In", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol3, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "PreparedBy")) {
      doc.textAlign("Name:", { align: "left" }, this.pdfFormate.startX, startY);
      doc.textAlign("" + printHeader.SOCreatedBy, { align: "left" }, this.pdfFormate.startX + 25, startY);
    }
    doc.textAlign("Good Condition", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign(this.companyHeader.Name, { align: "right-align" }, this.pdfFormate.startXcol3Details, startY);

    /* startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Phone:", { align: "left" }, this.pdfFormate.startX, startY);
    //doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY); //+ printHeader.BillToName

    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("", { align: "left" }, this.pdfFormate.startXcol2Details, startY);
    doc.textAlign(this.companyHeader.Name, { align: "right-align" }, this.pdfFormate.startXcol3Details, startY); */

    //startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    //doc.textAlign("Email:", { align: "left" }, this.pdfFormate.startX, startY);
    // doc.textAlign("", { align: "left" }, this.pdfFormate.startX, startY);
    var tempstartY = startY;
    if (UtilsForSuggestion.ReportsCustoms(this.reportCustom, "SignatureSpace")) {
      var num = UtilsForSuggestion.getReportsCustomsItems(this.reportCustom, "SignatureSpace");
      num = num[0]["MetaData"] ? Number(num[0]["MetaData"]) : 3;
      startY = this.calculateThePageForSignature(tempstartY, startY += this.pdfFormate.NormalSpacing * num, doc, num);
    } else {
      startY = this.calculateThePageForSignature(tempstartY, startY += this.pdfFormate.NormalSpacing * 2, doc, 2);
    }
    doc.textAlign("Customer Signature", { align: "left" }, this.pdfFormate.startXcol2, startY);
    doc.textAlign("Authorised Signatory", { align: "right-align" }, this.pdfFormate.startXcol3Details, startY);
  }

  calculateThePage(startY, doc) {
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY;
    }
    return startY;
  }

  calculateThePageForSignature(currentY, startY, doc, noLines) {
    var lines = Math.ceil(Number(doc.internal.pageSize.height - this.pdfFormate.MarginEndY - currentY) / this.pdfFormate.NormalSpacing);
    if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
      doc.addPage();
      doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
      startY = this.pdfFormate.InitialstartY + (noLines - lines) * this.pdfFormate.NormalSpacing;
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

    if (options.align == "center") {

      // Calculate text's x coordinate
      x = (pageWidth - txtWidth) / 2;

    } else if (options.align == "centerAtX") { // center on X value

      x = x - (txtWidth / 2);

    } else if (options.align == "right") {

      x = x - txtWidth;
    } else if (options.align == "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;
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


