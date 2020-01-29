import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as events from "devextreme/events";
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { SalesreturnDetailsHttpDataService } from './salesreturn-details-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';


export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

/* @Author Ganesh
/* this is For Sales Return
/* On 19-02-2019
*/

@Component({
  selector: 'app-salesreturn-details',
  templateUrl: './salesreturn-details.component.html',
  styleUrls: ['./salesreturn-details.component.css']
})

export class SalesreturnDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerSO") gridContainerSO: DxDataGridComponent;
  @ViewChild('barcodediv') barcodediv: ElementRef;

  SRHeader: [];
  duplicateSRHeader: string[];
  SRNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('SRNumber');
  SRFlowResult: boolean = false;
  linetotal: Number = 0;
  InvoiceTotal: Number = 0;
  DiscountPerc: Number = 0;
  SubTotal: Number = 0;
  Tax: Number = 0;
  Total: Number = 0;
  lineTotal: Number = 0;
  amtincvatvalue: Number = 0;
  customerSuggestions: any = null;
  ShipFromSuggestions: any = null;
  dataSource: any = {};
  dataSourceSO: any = null;
  itemArray: any = [];
  printLines = null;
  companyHeader = null;
  SalesReturnOperations: any = [];
  SalesReturnLineOperations: any = [];
  isLinesExist: boolean = true;
  isCustCodeAdded: boolean = false;
  isDivVisible: boolean = false;
  barcode: string = '';
  phonePattern: any = /^[^a-z]+$/;
  phoneRules: any = {
    X: /[02-9]/
  };
  popupVisible: boolean = false;
  newCustomerDetail: [];
  customerValue: any;
  barcodeValue: any = {};
  columns1 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "UnitPrice", dataKey: "UnitPrice", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Amount", dataKey: "LineAmount", width: 40 }
  ];

  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalCurrencyLookupPopup: boolean = false;
  popupSelltoCustDetails: Boolean = false;
  popupBilltoCustDetails: Boolean = false;
  popupShiptoCustDetails: Boolean = false;
  customerDeatilsPerCustomer: any = {};
  globalCustomerLookupPopup: boolean = false;
  typeOfCustomer: String = '';
  gotpostedsalesinvoicelines: any;
  totalInvoiceDisocunt: string;
  TotalLineDiscountAmount: any;
  TotalQuantity: Number = 0;

  constructor(
    private httpDataService: SalesreturnDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.setQuantityValue = this.setQuantityValue.bind(this);
  }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "Description", "UOM", "UnitPrice", "LineDiscountAmount", "Quantity", "CostIncVAT"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.calculateForSummary();
        thisComponent.httpDataService.openLines(["",
          thisComponent.SRNumber])
          .subscribe(dataLines => {
            if ((dataLines ? Object.keys(dataLines).length > 0 : false)) {
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
        thisComponent.httpDataService.btnDELETE_clickHandler(["",
          thisComponent.SRNumber,
          key["LineNo"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
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
            thisComponent.httpDataService.insetLines(["",
              thisComponent.SRNumber,
              values["ItemCode"],
              values["UOM"],
              values["UnitPrice"],
              thisComponent.SRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
              values["Quantity"],
              disc,
              values["LineDiscountAmount"],
              thisComponent.SRHeader["OrderDate"]]).subscribe(data => {
                if (data[0] == 'DONE') {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + data[0]);
                }
              });
          });
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
            thisComponent.httpDataService.modifyLine(["",
              getUpdateValues(key, newValues, "Quantity"),
              getUpdateValues(key, newValues, "ItemCode"),
              getUpdateValues(key, newValues, "Description"),
              getUpdateValues(key, newValues, "UnitPrice"),
              getUpdateValues(key, newValues, "UOM"),
              getUpdateValues(key, newValues, "CostIncVAT"),
              getUpdateValues(key, newValues, "Quantity"),
              disc,
              getUpdateValues(key, newValues, "LineDiscountAmtText"),
              getUpdateValues(key, newValues, "LineNo"),
              thisComponent.SRNumber]).subscribe(dataStatus => {
                if (dataStatus > 0) {
                  devru.resolve(dataStatus);
                } else {
                  devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
                }
              });
          });
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    this.itemArray = new CustomStore({
      key: ["ItemCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getItemMaster([""]).subscribe(dataItem => {
          devru.resolve(dataItem);
        });
        return devru.promise();
      }
    });

    this.customerSuggestions = new CustomStore({
      key: ["CustCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getCustomerList([""]).subscribe(dataCust => {
          devru.resolve(dataCust);
        });
        return devru.promise();
      }
    });

    this.httpDataService.getLocationList1(['']).subscribe(getLoc => {
      this.ShipFromSuggestions = new DataSource({
        store: <String[]>getLoc,
        paginate: true,
        pageSize: 20
      });
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  calculateForSummary() {
    this.httpDataService.openHeader(["", this.SRNumber]).subscribe(gotSODetails => {
      this.assignToDuplicate(gotSODetails);
      this.SRHeader = gotSODetails[0];
      this.setTheSettingStatus();
      this.lineTotal = this.SRHeader["Amount"] == null ? 0 : this.SRHeader["Amount"];
      this.InvoiceTotal = this.SRHeader["InvDiscountAmount"];
      this.DiscountPerc = this.SRHeader["InvoiceCompoundDiscount"] == null ? 0 : this.SRHeader["InvoiceCompoundDiscount"];
      this.SubTotal = this.lineTotal;
      this.amtincvatvalue = this.SRHeader["AmountIncludingVAT"] == null ? 0 : this.SRHeader["AmountIncludingVAT"];
      this.Tax = Number(Number(this.amtincvatvalue) - Number(this.lineTotal));
      this.Total = Number(this.SRHeader["AmountIncludingVAT"]);
      this.httpDataService.getTotalLinesDiscAmt(['',
        this.SRNumber]).subscribe(getTotalLinesDiscAmt => {
          this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
          this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.SRHeader["InvDiscountAmount"])).toFixed(2);
        });
      this.httpDataService.getSumQuantityItem(['',
        this.SRNumber]).subscribe(getSumQuantityItem => {
          this.TotalQuantity = getSumQuantityItem[0]["ttlQuantity"];
        });
      if (this.SRHeader["AmtIncvat"] == 'Yes') {
        this.SRHeader["AmtIncvat"] = true;
      } else {
        this.SRHeader["AmtIncvat"] = false;
      }
      if (this.SRHeader["SendToStore"] == 'Yes') {
        this.SRHeader["SendToStore"] = true;
      } else {
        this.SRHeader["SendToStore"] = false;
      }
      if (this.SRHeader["SelltoCustomerNo"] != null ? this.SRHeader["SelltoCustomerNo"] != '' : false) {
        this.isCustCodeAdded = true;
        this.httpDataService.getAllLines(['',
          this.SRHeader["SelltoCustomerNo"]])
          .subscribe(dataSOLines => {
            this.dataSourceSO = dataSOLines;
          });
      } else {
        this.isCustCodeAdded = false;
      }

      this.httpDataService.getpostedsalesinvoicelines(['',
        this.SRHeader["BilltoCustomerNo"], this.SRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
        this.SRHeader["OrderDate"]])
        .subscribe(getpostedsalesinvoicelines => {
          this.gotpostedsalesinvoicelines = new DataSource({
            store: <String[]>getpostedsalesinvoicelines,
            paginate: true,
            pageSize: 20
          });
        });
    });
  }

  setTheSettingStatus() {
    if (this.SRHeader["FlowResult"] == 'Approved') {
      this.SRFlowResult = true;
      this.SalesReturnOperations = ['Print Order'];
    }
    else if (this.SRHeader["FlowResult"] == 'Rejected') {
      this.SRFlowResult = true;
      this.SalesReturnOperations = ['Print Order'];
    }
    else if (this.SRHeader["FlowResult"] == 'SENT FOR APPROVAL') {
      this.SRFlowResult = false;
      this.SalesReturnOperations = ['Approved', 'Rejected', 'Print Order', 'Delete All'];
    }
    else {
      this.SRFlowResult = false;
      this.SalesReturnOperations = ['SENT FOR APPROVAL', 'Print Order', 'Delete All'];
    }
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "ItemCode", "Description");
  }


  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  showNewCustomerCard(event) {
    this.popupVisible = true;
    this.newCustomerDetail = [];
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
          this.customerValue = getNewCustDetail;
          if (this.customerValue > 0) {
            this.toastr.success("Customer Added Sucessfully");
            this.openCustomerDetails(this.newCustomerDetail["CustomerID"]);
          } else {
            this.toastr.error("Error While Inserting Customer");
          }
        });
    } else {
      this.toastr.warning("CustomerCode is Empty")
    }
  }

  openCustomerDetails(custCode) {
    UtilsForGlobalData.setLocalStorageKey('CustCode', custCode);
    this.router.navigate(['/sales/customer-details']);
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (!this.isCustCodeAdded) {
      event.preventDefault();
      this.toastr.warning("Please Select The Customer Code!!");
    }
  }

  isAllowAdd() {
    if (!this.isCustCodeAdded)
      return false;
    else if (!this.SRFlowResult)
      return true;
  }

  BarcodetxtScan_enterHandler(eventValue) {
    if (eventValue.value != undefined ? eventValue.value != null : false) {
      this.httpDataService.txtScan_enterHandler(["",
        eventValue.value]).subscribe(data => {
          if ((data != null ? Object.keys(data).length > 0 : false)) {
            this.httpDataService.onGetBarcodeDetails(["",
              this.SRNumber,
              data[0]["ItemCode"],
              data[0]["UOM"],
              data[0]["UnitPrice"],
              'Yes', '1', '0', '0',
              this.SRHeader["OrderDate"]]).subscribe(data => {
                if ((data >= 0)) {
                  this.gridContainer.instance.refresh();
                } else {
                  this.toastr.error("Error while Inserting the Lines with Barcode: " + eventValue.value + ", Error Status Code is INSERT-ERR");
                }
              });
          } else {
            this.toastr.warning("Barcode Not Found while Adding the Lines with Barcode: " + eventValue.value);
          }
          this.barcodeValue.barcode = null;
        });
    }
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.UnitPriceFCY = currentData.UnitPrice;
    newData.LineDiscountAmount = '0.0';
    newData.Quantity = '1';
    newData.AmountIncludingVAT = (newData.UnitPrice * newData.Quantity) - newData.LineDiscountAmount;
    newData.LineAmount = newData.AmountIncludingVAT;
    (<any>this).defaultSetCellValue(newData, value);
  }

  setPriceValue(newData, value, currentData): void {
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
    if (currentData.OrderQuantity < value) {
      value = currentData.OrderQuantity;
      this.toastr.warning("Quantity is More then Order Quantity");
    }
    if (currentData.UnitPrice && currentData.LineDiscountAmount) {
      newData.AmountIncludingVAT = (value * currentData.UnitPrice) - currentData.LineDiscountAmount;
      newData.LineAmount = newData.AmountIncludingVAT;
    }
    newData.Quantity = value;
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
  }

  setPriceFCYValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    (<any>this).defaultSetCellValue(newData, value);
  }

  SalesReturnOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Order') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.SRHeader, this.printLines, "Sales Return Order");
      } else {
        this.toastr.warning("Please Add the Item to the Sales Return!");
      }
    } else if (userOption == 'Delete All') {
      this.srLinesDeleteAll();
    } else if (userOption == 'Active/Deactive Scan Mode') {
      this.isDivVisible = !this.isDivVisible;
    } else {
      this.OnUserActionGO(userOption);
    }
  }

  setFocus(e) {
    e.component.focus();
  }

  OnUserActionGO(userOption) {
    if (this.SRHeader['FlowCompleted'] == 'Yes') {
      this.toastr.error("Cannot Do this operation");
    }
    else if (!this.isCustCodeAdded) {
      this.toastr.warning("Please Select Sell to Customer Code", "Data");
    } else if (this.SRHeader["LocationCode"] == null) {
      this.toastr.warning("Please Select Location Code", "Data");
    } else {
      {
        var nextSequence: Number = 0;
        if (this.SRHeader['FlowResult'] == 'On-Hold') {
          nextSequence = this.SRHeader['CurrentSequence'];
        } else {
          nextSequence = Number(this.SRHeader['CurrentSequence']) + 1;
        }
        this.httpDataService.getProcessRole(["",
          UtilsForGlobalData.getUserRoleId(),
          nextSequence.toString()])
          .subscribe(data => {
            if ((data != null ? Object.keys(data).length > 0 : false)) {
              this.httpDataService.getProcessFlow(["",
                nextSequence.toString()])
                .subscribe(data => {
                  if (data[0]["ResultIsChoice"] == 'No') {
                    this.httpDataService.UPDATEStatus(["",
                      nextSequence.toString(),
                      data[0]["ActionType"],
                      data[0]["Result1"],
                      data[0]["FinalStep"],
                      data[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.SRNumber]).subscribe(data => {
                        if (data == 1) {
                          this.toastr.success("Status Updated Succesfully", userOption);
                          this.calculateForSummary();
                        }
                        else {
                          this.toastr.error("Error While Updating Status: " + userOption);
                        }
                      });
                  } else {
                    this.httpDataService.UPDATEStatus(["",
                      nextSequence.toString(),
                      data[0]["ActionType"],
                      userOption,
                      data[0]["FinalStep"],
                      data[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.SRNumber]).subscribe(data => {
                        if (data == 1) {
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

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == "DONE" || dataStatus[0] == "SOUPDATED") {
      this.calculateForSummary();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
    }
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
    this.calculateForSummary();
  }

  allowNewclick(args) {
    this.router.navigate(['/dashboard/customerlist']);
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForPaymentMethod(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForFromInvoiceNo(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "DocumentNo");
  }

  hoverforFromInvoiceNo(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "BillToName");
  }

  onCustomerSearchClicked(type) {
    this.typeOfCustomer = type;
    this.globalCustomerLookupPopup = true;
  }

  onCustomerRowClicked(event) {
    this.globalCustomerLookupPopup = false;
    this.httpDataService.updateCustCode(["", this.SRNumber, event.data.CustCode, this.typeOfCustomer,
      UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
        this.errorHandlingToaster(dataStatus);
      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateSRHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateSRHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateSRHeader[i][prop] = data[i][prop];
      }
    }
  }


  onBillToCustomerCodeChanged(event) {
    if (this.duplicateSRHeader[0]["BilltoCustomerNo"] != event.value) {
      event.value = (event.value == null ? '' : event.value);
      var json = this.customerSuggestions === null ? {} : this.customerSuggestions._store._array;
      for (var index = 0; index < json.length; ++index) {
        if (json[index].CustCode === event.value) {
          this.duplicateSRHeader[0]["BilltoCustomerNo"] = json[index].CustCode;
          this.duplicateSRHeader[0]["BilltoName"] = json[index].Name;
          this.duplicateSRHeader[0]["BilltoAddress"] = json[index].Address1;
          this.duplicateSRHeader[0]["BilltoCountry"] = json[index].Country;
          this.duplicateSRHeader[0]["PaymentTerm"] = json[index].PaymentTerm;
          this.duplicateSRHeader[0]["VATID"] = json[index].VATID;
          this.SRHeader["BilltoCustomerNo"] = json[index].CustCode;
          this.SRHeader["BilltoName"] = json[index].Name;
          this.SRHeader["BilltoAddress"] = json[index].Address1;
          this.SRHeader["BilltoCountry"] = json[index].Country;
          this.SRHeader["PaymentTerm"] = json[index].PaymentTerm;
          this.SRHeader["VATID"] = json[index].VATID;
          this.httpDataService.updateCustCode(["",
            this.SRNumber, event.value, 'BillTo',
            UtilsForGlobalData.getUserId()]).subscribe(callData3 => {
              //this.calculateForSummary();
            });
          break;
        }
      }
    }
  }

  onShipToCustomerCodeChanged(event) {
    if (this.duplicateSRHeader[0]["ShiptoCode"] != event.value) {
      event.value = (event.value == null ? '' : event.value);
      var json = this.customerSuggestions === null ? {} : this.customerSuggestions._store._array;
      for (var index = 0; index < json.length; ++index) {
        if (json[index].CustCode === event.value) {
          this.duplicateSRHeader[0]["ShiptoCode"] = json[index].CustCode;
          this.duplicateSRHeader[0]["ShiptoName"] = json[index].Name;
          this.duplicateSRHeader[0]["ShiptoAddress"] = json[index].Address1;
          this.duplicateSRHeader[0]["ShiptoCountryCode"] = json[index].ShiptoCountryCode;
          this.SRHeader["ShiptoCode"] = json[index].CustCode;
          this.SRHeader["ShiptoName"] = json[index].Name;
          this.SRHeader["ShiptoAddress"] = json[index].Address1;
          this.SRHeader["ShiptoCountryCode"] = json[index].ShiptoCountryCode;
          this.httpDataService.updateCustCode(["",
            this.SRNumber, event.value, 'ShipTo',
            UtilsForGlobalData.getUserId()])
            .subscribe(callData3 => {
              //this.openHeader();
            });
          break;
        }
      }
    }
  }

  onDropDownCodeChanged(event, dataField) {
    if (event.value ? this.duplicateSRHeader[0][dataField] != event.value : false) {
      if (dataField == 'LocationCode') {
        this.httpDataService.handleLocation(["",
          event.value, this.SRNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      } else if (dataField == 'FromInvoiceNo') {
        this.httpDataService.CreateSRFromSI2(["",
          this.SRNumber, event.value, UtilsForGlobalData.getUserId()])
          .subscribe(CreateSRFromSI2 => {
            this.gridContainer.instance.refresh();
            this.errorHandlingToaster(CreateSRFromSI2);
          });
      }
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'AmtIncvat') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if (this.duplicateSRHeader ? this.duplicateSRHeader[0]["AmtIncvat"] != temp : false) {
        this.httpDataService.AmtIncvat_clickHandler(["",
          this.SRNumber, UtilsForGlobalData.getUserId(),
          temp]).subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    } else if ((e.value != undefined || e.value != null) && this.duplicateSRHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'OrderDate') {
        this.httpDataService.orderDate_changeHandler(["",
          e.value, e.value,
          this.SRNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      } else {
        if (e.dataField != 'SendToStore') {
          if (e.dataField == 'ShipmentDate') {
            if (this.duplicateSRHeader[0][e.dataField] == null) {
              e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
            }
          }
          this.httpDataService.generalUPDATE(["",
            e.dataField, e.value, this.SRNumber])
            .subscribe(callData3 => {
              this.errorHandlingToasterForUpdate(callData3);
            });
        }
      }
    }
  }

  formBilling_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateSRHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'isAmountIncVat') { }
      else {
        this.httpDataService.generalUPDATE(["",
          e.dataField, e.value,
          this.SRNumber]).subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }

  formShipping_fieldDataChanged(e) {
    if (e.dataField == 'SendToStore') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if (this.duplicateSRHeader ? this.duplicateSRHeader[0]["SendToStore"] != temp : false) {
        this.httpDataService.generalUPDATE(["",
          e.dataField, e.value,
          this.SRNumber]).subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    } else {
      if ((e.value != undefined || e.value != null) && this.duplicateSRHeader[0][e.dataField] != e.value) {
        this.httpDataService.generalUPDATE(["",
          e.dataField, e.value, this.SRNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat' ? e.dataField != 'SendToStore' : false) {
      if ((e.value != undefined || e.value != null) && this.duplicateSRHeader[0][e.dataField] != e.value) {
        this.httpDataService.generalUPDATE(["",
          e.dataField, e.value, this.SRNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }

  getBillToCustomerDetail(event) {
    this.popupBilltoCustDetails = true;
  }

  getShipToCustomerDetail(event) {
    this.popupShiptoCustDetails = true;
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

  onUserRowSelect(event, type) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "UOM", event.data.SalesUOM);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "UnitPrice", event.data.UnitPrice);
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["UnitPrice", "QtytoShip", "QtytoInvoice", "VatAmount", "AmountIncludingVAT", "Quantity", "LineAmount"]);
    this.itemDetailsPopup = true;
  }

  srLinesDeleteAll() {
    if (this.isLinesExist) {
      /* for the Lines */
      for (var i = 0; i < Object.keys(this.printLines).length; i++) {
        this.httpDataService.btnDELETE_clickHandler(["",
          this.SRNumber, this.printLines[i].LineNo])
          .subscribe(data => {
            if (Object.keys(this.printLines).length == i)
              this.gridContainer.instance.refresh();
          });
      }
    }
  }

  btnAddLinePressed(data) {
    if (this.isLinesExist) {
      this.httpDataService.btnAddLinePressed(["",
        this.SRNumber, data.data.DocumentNo,
        data.data.LineNo]).subscribe(data => {
          if (data[0] == 'DONE') {
            this.gridContainerSO.instance.refresh();
          } else {
            this.toastr.error("Failed to Add line with Error Status Code : " + data[0], "Failed");
          }
        });
    } else {
      this.toastr.error("Already Lines Are Exist!!");
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
    rightStartCol1: 430,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    rightStartCentre: 240,
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, title) {

    printHeader.Remark = '';
    printHeader.VATAmount = this.formatNumber((Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount)));
    printHeader.TotalAmountinWords = "" + this.companyHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
    }
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? printHeader.InvDiscountAmount : 0;
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    let date = new Date(printHeader.OrderDate);
    printHeader.TotalQty = 0;
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printHeader.TotalQty += Number(printLines[i].Quantity);
      printLines[i].SnNo = i + 1;
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
      printLines[i].UnitPrice = this.formatNumber(printLines[i].UnitPrice);
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].LineAmount = this.formatNumber(printLines[i].LineAmount);
    }
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = (printLines[i].SnNo == null || printLines[i].SnNo == '') ? ' - ' : printLines[i].SnNo;
      printLines[i].ItemCode = (printLines[i].ItemCode == null || printLines[i].ItemCode == '') ? ' - ' : printLines[i].ItemCode;
      printLines[i].Description = (printLines[i].Description == null || printLines[i].Description == '') ? ' - ' : printLines[i].Description;
      printLines[i].UOM = (printLines[i].UOM == null || printLines[i].UOM == '') ? ' - ' : printLines[i].UOM;
      printLines[i].UnitPrice = (printLines[i].UnitPrice == null || printLines[i].UnitPrice == '') ? ' - ' : printLines[i].UnitPrice;
      printLines[i].LineDiscountAmount = (printLines[i].LineDiscountAmount == null || printLines[i].LineDiscountAmount == '') ? ' - ' : printLines[i].LineDiscountAmount;
      printLines[i].Quantity = (printLines[i].Quantity == null || printLines[i].Quantity == '') ? ' - ' : printLines[i].Quantity;
      printLines[i].LineAmount = (printLines[i].LineAmount == null || printLines[i].LineAmount == '') ? ' - ' : printLines[i].LineAmount;
    }
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    // doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', 450, 30, 80, 50); //variable.company_logo.src
    doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, 80);
    doc.line(this.pdfFormate.startX, 85, 550, 85);
    tempY += (this.pdfFormate.NormalSpacing + 15);
    var tempYC = tempY;
    var tempYR = tempY;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    //left
    this.companyHeader.Name = this.companyHeader.Name == null || this.companyHeader.Name == '' ? this.companyHeader.Name = ' - ' : this.companyHeader.Name;
    this.companyHeader.BranchName = this.companyHeader.BranchName == null || this.companyHeader.BranchName == '' ? this.companyHeader.BranchName = ' - ' : this.companyHeader.BranchName;
    doc.textAlign("" + this.companyHeader.Name + " ( " + this.companyHeader.BranchName + " )", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    this.companyHeader.Address1 = this.companyHeader.Address1 == null || this.companyHeader.Address1 == '' ? this.companyHeader.Address1 = ' - ' : this.companyHeader.Address1;
    this.companyHeader.Address2 = this.companyHeader.Address2 == null || this.companyHeader.Address2 == '' ? this.companyHeader.Address2 = ' - ' : this.companyHeader.Address2;
    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    this.companyHeader.City = this.companyHeader.City == null || this.companyHeader.City == '' ? this.companyHeader.City = ' - ' : this.companyHeader.City;
    this.companyHeader.PostCode = this.companyHeader.PostCode == null || this.companyHeader.PostCode == '' ? this.companyHeader.PostCode = ' - ' : this.companyHeader.PostCode;
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    this.companyHeader.Phone = this.companyHeader.Phone == null || this.companyHeader.Phone == '' ? this.companyHeader.Phone = ' - ' : this.companyHeader.Phone;
    this.companyHeader.Fax = this.companyHeader.Fax == null || this.companyHeader.Fax == '' ? this.companyHeader.Fax = ' - ' : this.companyHeader.Fax;
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    this.companyHeader.VATID = this.companyHeader.VATID == null || this.companyHeader.VATID == '' ? this.companyHeader.VATID = ' - ' : this.companyHeader.VATID;
    doc.textAlign("Tax ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    //centre
    this.companyHeader.BranchID = this.companyHeader.BranchID == null || this.companyHeader.BranchID == '' ? this.companyHeader.BranchID = ' - ' : this.companyHeader.BranchID;
    doc.textAlign("Branch ID   : " + this.companyHeader.BranchID, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);

    this.companyHeader.AccountNo = this.companyHeader.AccountNo == null || this.companyHeader.BranchID == '' ? this.companyHeader.AccountNo = ' - ' : this.companyHeader.AccountNo;
    doc.textAlign("Account No : " + this.companyHeader.AccountNo, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);

    this.companyHeader.EMail = this.companyHeader.EMail == null || this.companyHeader.EMail == '' ? this.companyHeader.EMail = ' - ' : this.companyHeader.EMail;
    doc.textAlign("Email         : " + this.companyHeader.EMail, { align: "left" }, this.pdfFormate.rightStartCentre, tempYC += this.pdfFormate.NormalSpacing);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    //right
    doc.setFontType(this.pdfFormate.SetFontType);
    // doc.textAlign("Date : " + date.toLocaleDateString('en-GB').replace('/', '-').replace('/', '-'), { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    printHeader.DocumentNo = printHeader.DocumentNo == null || printHeader.DocumentNo == '' ? printHeader.DocumentNo = ' - ' : printHeader.DocumentNo;
    doc.textAlign("Document No   : " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1 - 10, tempYR += this.pdfFormate.NormalSpacing);


    doc.textAlign("Document Date : " + date.toLocaleDateString('en-GB').replace('/', '-').replace('/', '-'), { align: "left" }, this.pdfFormate.rightStartCol1 - 10, tempYR += this.pdfFormate.NormalSpacing);
    //box2x2
    doc.line(this.pdfFormate.startX + 255, tempY + 15, this.pdfFormate.startX + 255, tempY + 35);//middle vertical
    doc.line(this.pdfFormate.startX, tempY + 15, 550, tempY + 15);//top-hor
    doc.line(this.pdfFormate.startX, tempY + 15, this.pdfFormate.startX, tempY + 35);//left vert
    doc.textAlign("Sell To", { align: "left" }, this.pdfFormate.startX + 10, tempY + 28);
    doc.line(550, tempY + 15, 550, tempY + 35);//left-vert
    doc.line(this.pdfFormate.startX, tempY + 35, 550, tempY + 35);//bottm-hor
    doc.textAlign("Ship To", { align: "left" }, this.pdfFormate.startX + 265, tempY + 28);
    var tempBoxY = tempY;
    //text in box1
    doc.setFontType(this.pdfFormate.SetFontType);
    printHeader.PayToVendor = printHeader.BilltoCustomerNo == null || printHeader.BilltoCustomerNo == '' ? printHeader.BilltoCustomerNo = ' - ' : printHeader.BilltoCustomerNo;
    doc.textAlign("Code:" + printHeader.BilltoCustomerNo, { align: "left" }, this.pdfFormate.startX + 10, tempY = tempY + 45);
    doc.textAlign("Code:" + printHeader.BilltoCustomerNo, { align: "left" }, this.pdfFormate.startX + 265, tempYC = tempYC + 68);

    printHeader.BuyFromName = printHeader.SelltoCustomerName == null || printHeader.SelltoCustomerName == '' ? printHeader.SelltoCustomerName = ' - ' : printHeader.SelltoCustomerName;
    doc.textAlign("Customer Name:" + printHeader.SelltoCustomerName, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Customer Name:" + printHeader.ShiptoName, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

    printHeader.BuyFromAddress = printHeader.SelltoAddress == null || printHeader.SelltoAddress == '' ? printHeader.SelltoAddress = ' - ' : printHeader.SelltoAddress;
    doc.textAlign("Address: " + printHeader.SelltoAddress, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Address:" + printHeader.ShiptoAddress, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

    printHeader.BuyFromAddress2 = printHeader.SelltoAddress2 == null || printHeader.SelltoAddress2 == '' ? printHeader.SelltoAddress2 = ' - ' : printHeader.SelltoAddress2;
    doc.textAlign("" + printHeader.SelltoAddress2, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.ShiptoAddress2, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

    printHeader.SelltoCity = printHeader.SelltoCity == null || printHeader.SelltoCity == '' ? printHeader.SelltoCity = ' - ' : printHeader.SelltoCity;
    printHeader.ShiptoPostCode = printHeader.ShiptoPostCode == null || printHeader.ShiptoPostCode == '' ? printHeader.ShiptoPostCode = ' - ' : printHeader.ShiptoPostCode;
    doc.textAlign("" + printHeader.SelltoCity + " " + printHeader.SelltoPostCode, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.ShiptoCity + " " + printHeader.ShiptoPostCode, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);


    printHeader.VATID = printHeader.VATID == null || printHeader.VATID == '' ? printHeader.VATID = ' - ' : printHeader.VATID;
    doc.textAlign("Tax ID :" + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Tax ID :" + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
    //box outline
    tempY += 10;
    doc.line(this.pdfFormate.startX, tempBoxY + 35, this.pdfFormate.startX, tempY);//vert-left
    doc.line(this.pdfFormate.startX + 255, tempBoxY + 35, this.pdfFormate.startX + 255, tempY);//vert-centre
    doc.line(550, tempBoxY + 35, 550, tempY);//vert-right
    doc.line(this.pdfFormate.startX, tempY, 550, tempY);
    //-------Customer Info Billing--------------------
    // columnStyles: {
    //   id: {fillColor: 255}
    // },

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns1, this.printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      }, columnStyles: {
        SNo: {
          halign: 'left'
        },
        Description: {
          halign: 'left',
          cellWidth: 160
        },
        UOM: {
          halign: 'left'
        },
        UnitPrice: {
          halign: 'right'
        },
        Discount: {
          halign: 'right'
        },
        Quantity: {
          halign: 'right'
        },
        LineAmount: {
          halign: 'right'
        },
        AmountIncludingVAT: {
          halign: 'right'
        }
      },
      headStyles: {
        fillColor: [64, 139, 202],
        halign: 'center'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          footerStr = footerStr;
        }
        footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId()
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
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);
    if (Number(printHeader.InvDiscountAmount) > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
      doc.textAlign("" + this.formatNumber(printHeader.InvDiscountAmount), { align: "right-align" }, rightcol2, startY);
    }

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("AMOUNT EX.TAX: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TAX AMOUNT: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.VATAmount, { align: "right-align" }, rightcol2, startY);


    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("AMOUNT INC.TAX:", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks " + printHeader.Remark, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(this.pdfFormate.startX, startY, 550, startY);

    startY += this.pdfFormate.NormalSpacing;
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 10, doc);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    //  doc.textAlign("Name      : ", { align: "left" }, this.pdfFormate.startX, startY+12);
    doc.textAlign("_______/______/_______", { align: "left" }, this.pdfFormate.startX, startY + 24);
    // doc.textAlign("Email Id   : ", { align: "left" }, this.pdfFormate.startX, startY+36);
    //doc.textAlign("Checked By", { align: "center" }, rightcol1, startY);
    //  doc.textAlign(""+this.companyHeader.Name,{align:"right-align"},rightcol2,startY);
    doc.textAlign("Approved By", { align: "left-align" }, rightcol2 - 25, startY);
    doc.textAlign("_______/______/_______", { align: "right-align" }, rightcol2, startY + 24);

    doc.save("SalesReturn" + this.SRNumber + ".pdf");
    this.gridContainer.instance.refresh();
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

      x = x - txtWidth;
    } else if (options.align === "right-align") {

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
