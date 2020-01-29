import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import 'devextreme/data/odata/store';
import * as events from "devextreme/events";
var jsPDF = require('jspdf');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
let variable = require('../../../assets/js/rhbusfont.json');
require('jspdf-autotable');
var writtenNumber = require('written-number');
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { PurchasereturnDetailsHttpDataService } from './purchasereturn-details-http-data.service';

/* @Author Ganesh
/* this is For Purchase Return
/* On 25-02-2019
*/

@Component({
  selector: 'app-purchasereturn-details',
  templateUrl: './purchasereturn-details.component.html',
  styleUrls: ['./purchasereturn-details.component.css']
})

export class PurchasereturnDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;


  PRHeader: [];
  dataSource: any = {};
  PRNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PRNumber');
  PRFlowResult: boolean = true;
  dataSourceComment: any = {};
  printLines = null;
  printHeader = null;
  companyHeader: any = {};
  linetotal: Number = 0;
  InvoiceTotal: Number = 0;
  DiscountPerc: Number = 0;
  SubTotal: Number = 0;
  Tax: Number = 0;
  Total: Number = 0;
  lineTotal: Number = 0;
  amtincvatvalue: Number = 0;
  TotalQuantity: Number = 0;
  TotalLineDiscountAmount: any;
  totalInvoiceDisocunt: string;
  isLinesExist: boolean = false;
  isVendCodeAdded: boolean = false;
  itemArray: any = [];
  poLineSUDG: {} = null;
  duplicatePurchHeader: string[];
  vendorSuggestions: any = null;
  receiveLocSuggestions: any = null;
  custListSuggestions: any = null;
  gotpostedpurchinvoicelines: any = null;
  PurchaseReturnOperations: any = [];
  barcodeValue: any = {};
  columnHeader1 = [
    // { title: "For Customer", dataKey: "ConnectedCustCode", width: 40 },
    { title: "Payment Term", dataKey: "PaymentTerm", width: 40 },
    { title: "Due Date", dataKey: "DueDate", width: 40 },
    { title: "Invoice No", dataKey: "FromInvoiceNo", width: 40 }
  ];
  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "UOM", width: 40 },
    { title: "Cost", dataKey: "DirectUnitCost", width: 40 },
    { title: "Discount", dataKey: "LineDiscountAmount", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Amount", dataKey: "Amount", width: 40 }
  ];
  isDivVisible: boolean = false;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  popupBuyVendorDetails: Boolean = false;
  popupPayVendorDetails: Boolean = false;
  globalCustomerLookupPopup: boolean = false;
  vendorDeatilsPerVendor: any = {};
  globalVendorLookupPopup: boolean = false;
  typeOfVendor: String = '';
  Comment: any = {};

  constructor(
    private httpDataService: PurchasereturnDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "Description", "UOM", "DirectUnitCost", "Quantity", "LineDiscountAmount", "LineDiscountAmtText"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.calculateForSummary();
        thisComponent.httpDataService.openPOLines(["", thisComponent.PRNumber])
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
        thisComponent.httpDataService.deleteItemLines(["",
          key["LineNo"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
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
            thisComponent.httpDataService.insetLines(["",
              thisComponent.PRNumber,
              values["ItemCode"],
              thisComponent.PRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
              values["DirectUnitCost"],
              values["Quantity"],
              disc,
              values["LineDiscountAmount"],
              thisComponent.PRHeader["ReceiveToLocation"]]).subscribe(data => {
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
            thisComponent.httpDataService.modifyLine(["",
              getUpdateValues(key, newValues, "Quantity"),
              getUpdateValues(key, newValues, "ItemCode"),
              getUpdateValues(key, newValues, "Description"),
              getUpdateValues(key, newValues, "DirectUnitCost"),
              getUpdateValues(key, newValues, "UOM"),
              thisComponent.PRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
              getUpdateValues(key, newValues, "ItemCode"),
              getUpdateValues(key, newValues, "Quantity"),
              disc,
              getUpdateValues(key, newValues, "LineDiscountAmtText"),
              getUpdateValues(key, newValues, "LineNo"),
              thisComponent.PRNumber]).subscribe(data => {
                if (data >= 0) {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
                }
              });
          });
        return devru.promise();
      }
    });

    this.dataSourceComment.store = new CustomStore({
      key: ["CommentDate", "CommentTime", "UserID", "Comment"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.openPRCommentLines(["", thisComponent.PRNumber])
          .subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateComment(["",
          values["UserID"],
          values["Comment"],
          thisComponent.PRNumber]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with Comment: " + values["Comment"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    this.httpDataService.getLocationList3([''])
      .subscribe(callData3 => {
        this.receiveLocSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.vendorSuggestions = new CustomStore({
      key: ["VendCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getVendorList([""])
          .subscribe(gotVendList => {
            devru.resolve(gotVendList);
          });
        return devru.promise();
      }
    });

    this.itemArray = new CustomStore({
      key: ["ItemCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getItemMaster([""])
          .subscribe(gotItemList => {
            devru.resolve(gotItemList);
          });
        return devru.promise();
      }
    });

    this.custListSuggestions = new CustomStore({
      key: ["CustCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getCustomerList([""])
          .subscribe(gotCustList => {
            devru.resolve(gotCustList);
          });
        return devru.promise();
      }
    });
  }

  ngAfterViewInit() {
    //this.addQuotesLinestoPO();
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  hoverFormateForCustomer(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForVendor(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "VendCode", "Name");
  }
  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormatForStoreList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "StoreID", "Name");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "VendCode", "Name");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "Description", "UOM", "StockOnHand");
  }

  suggestionFormateForFromInvoiceNo(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "DocumentNo", "DocumentDate");
  }

  hoverforFromInvoiceNo(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "DocumentDate");
  }


  onVendorSearchClicked(type) {
    this.typeOfVendor = type;
    this.globalVendorLookupPopup = true;
  }

  onVendorRowClicked(event) {
    this.globalVendorLookupPopup = false;
    if (this.typeOfVendor == 'BuyFromVendor') {
      this.httpDataService.UPDATEVendorCodeBuyFrom(["",
        event.data.VendCode,
        this.PRNumber]).subscribe(dataStatus => {
          this.errorHandlingToasterForUpdate(dataStatus);
        });
    } else {
      this.httpDataService.UPDATEVendorCodePayTo(["",
        event.data.VendCode,
        this.PRNumber]).subscribe(dataStatus => {
          this.errorHandlingToasterForUpdate(dataStatus);
        });
    }
  }

  onReceiveLocationChanged(event) {
    if (this.duplicatePurchHeader[0]["ReceiveToLocation"] != event.value) {
      this.httpDataService.handleLocation(["",
        this.PRNumber,
        event.value]).subscribe(dataStatus => {
          this.errorHandlingToasterForUpdate(dataStatus);
        });
    }
  }

  onDropDownCodeChanged(event, dataField) {
    if (event.value ? this.PRHeader["" + dataField] != event.value : false) {
      if (dataField == "FromInvoiceNo") {
        this.httpDataService.CreatePRFromPI2(["",
          this.PRNumber,
          event.value,
          UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
            this.gridContainer.instance.refresh();
            this.errorHandlingToaster(dataStatus);
          });
      }
    }
  }

  onCustomerSearchClicked() {
    this.globalCustomerLookupPopup = true;
  }

  onConnectedCustCodeChanged(event) {
    this.globalCustomerLookupPopup = false;
    this.httpDataService.UPDATEHeader(["",
      "ConnectedCustCode", event.data.CustCode,
      this.PRNumber]).subscribe(callData3 => {
        this.errorHandlingToasterForUpdate(callData3);
      });
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.LineDiscountAmount = '0.0';
    newData.Quantity = '1';
    newData.AmountIncludingVAT = (currentData.DirectUnitCost * newData.Quantity) - newData.LineDiscountAmount;
    newData.Amount = newData.AmountIncludingVAT;
    (<any>this).defaultSetCellValue(newData, value);
  }

  setPriceValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.Quantity != null && currentData.LineDiscountAmount != null) {
      newData.AmountIncludingVAT = (value * currentData.Quantity) - currentData.LineDiscountAmount;
      newData.Amount = newData.AmountIncludingVAT;
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value : '1';
    value = value != 0 ? value : '0.01';
    if (currentData.DirectUnitCost != null && currentData.LineDiscountAmount != null) {
      newData.AmountIncludingVAT = (value * currentData.DirectUnitCost) - currentData.LineDiscountAmount;
      newData.Amount = newData.AmountIncludingVAT;
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.DirectUnitCost != null && currentData.Quantity != null) {
      if ((currentData.Quantity * currentData.DirectUnitCost) >= value) {
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.DirectUnitCost) - value;
        newData.Amount = newData.AmountIncludingVAT;
      } else {
        value = (currentData.Quantity * currentData.DirectUnitCost);
        newData.AmountIncludingVAT = (currentData.Quantity * currentData.DirectUnitCost) - value;
        newData.Amount = newData.AmountIncludingVAT;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  PurchaseReturnOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Order') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.PRHeader, this.printLines, "Purchase Return");
      } else {
        this.toastr.warning("Please add the Lines !!");
      }
    } else if (userOption == 'Delete All') {
      //this.soLinesDeleteAll();
    } else if (userOption == 'Active/Deactive Scan Mode') {
      this.isDivVisible = !this.isDivVisible;
    } else {
      if (this.isLinesExist) {
        this.onUserActionGo(userOption);
      } else {
        this.toastr.warning("Please add the Lines !!");
      }
    }
  }

  onUserActionGo(userOption) {
    if (this.PRHeader['FlowCompleted'] == 'Yes') {
      this.toastr.error("Cannot Do those operation");
    }
    else if (this.PRHeader['BuyFromVendor'].length == 0 || this.PRHeader['BuyFromVendor'] == null) {
      this.toastr.error("Please Select The Vendor");
    }
    else {
      {
        var nextSequence: Number = 0;
        if (this.PRHeader['FlowResult'] == 'On-Hold') {
          nextSequence = this.PRHeader['CurrentSequence'];
        }
        else {
          nextSequence = Number(this.PRHeader['CurrentSequence']) + 1;
        }
        this.httpDataService.getProcessRole(["",
          UtilsForGlobalData.getUserRoleId(),
          nextSequence.toString(),])
          .subscribe(data => {
            if (Object.keys(data).length > 0) {
              this.httpDataService.getProcessFlow(["",
                nextSequence.toString(),])
                .subscribe(data => {
                  if (data[0]["ResultIsChoice"] == 'No') {
                    this.httpDataService.updateStatus(["",
                      nextSequence.toString(),
                      data[0]["ActionType"],
                      data[0]["Result1"],
                      data[0]["Result1"],
                      data[0]["FinalStep"],
                      data[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.PRNumber]).subscribe(data => {
                        if (data == 1) {
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
                      data[0]["ActionType"],
                      userOption,
                      userOption,
                      data[0]["FinalStep"],
                      data[0]["FlowLevel"],
                      UtilsForGlobalData.getUserId(),
                      this.PRNumber]).subscribe(data => {
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
            }
            else {
              this.toastr.error("CREDIT LIMIT NOT AVAILAVLE");
            }
          });
      }
    }
  }

  customizeLabel(arg) {
    return arg.argumentText + " ( " + arg.percentText + ")";
  }

  calculateForSummary() {
    this.httpDataService.getPurchaseHeader([
      "", this.PRNumber]).subscribe(gotPODetails => {
        this.assignToDuplicate(gotPODetails);
        this.PRHeader = gotPODetails[0];
        this.setTheSettingStatus();
        this.printHeader = gotPODetails;
        this.lineTotal = this.PRHeader["Amount"] == null ? 0 : this.PRHeader["Amount"];
        this.InvoiceTotal = this.PRHeader["InvDiscountAmount"];
        this.DiscountPerc = this.PRHeader["InvoiceCompoundDiscount"] == null ? 0 : this.PRHeader["InvoiceCompoundDiscount"];
        this.SubTotal = this.lineTotal;
        this.httpDataService.getTotalLinesDiscAmt(['',
          this.PRNumber]).subscribe(getTotalLinesDiscAmt => {
            this.TotalLineDiscountAmount = getTotalLinesDiscAmt[0]["TotalLineDiscountAmount"];
            this.totalInvoiceDisocunt = Number(Number(this.TotalLineDiscountAmount) + Number(this.PRHeader["InvDiscountAmount"])).toFixed(2);
          });
        this.httpDataService.getSumQuantityItem(['', this.PRNumber]).subscribe(getSumQuantityItem => {
          this.TotalQuantity = getSumQuantityItem[0]["ttlQuantity"];
        });
        this.amtincvatvalue = this.PRHeader["AmountIncludingVAT"] == null ? 0 : this.PRHeader["AmountIncludingVAT"];
        this.Tax = Number(Number(this.amtincvatvalue) - Number(this.lineTotal));
        this.Total = Number(this.PRHeader["AmountIncludingVAT"]);
        if (this.PRHeader["AmtIncvat"] == 'Yes') {
          this.PRHeader["AmtIncvat"] = true;
        } else {
          this.PRHeader["AmtIncvat"] = false;
        }
        if (this.PRHeader["BuyFromVendor"] ? this.PRHeader["BuyFromVendor"] != '' : false) {
          this.isVendCodeAdded = true;
        } else {
          this.isVendCodeAdded = false;
        }
        this.httpDataService.getpostedpurchaseinvoicelines(['',
          this.PRHeader["PayToVendor"],
          this.PRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
          this.PRHeader["DocumentDate"]]).subscribe(gotpostedpurchinvoicelines => {
            this.gotpostedpurchinvoicelines = new DataSource({
              store: <String[]>gotpostedpurchinvoicelines,
              paginate: true,
              pageSize: 20
            });
          });
      });
    this.httpDataService.getLMORemark(['', this.PRNumber]).subscribe(getLMORemark => {
      if (Object.keys(getLMORemark).length > 0) {
        this.Comment = getLMORemark[0];
      } else {
        this.Comment.comment = "";
      }
    });
  }


  setTheSettingStatus() {
    if (this.PRHeader['FlowResult'] == 'Approved') {
      this.PRFlowResult = false;
      this.PurchaseReturnOperations = ['Print Order'];
    }
    else if (this.PRHeader['FlowResult'] == 'Rejected') {
      this.PRFlowResult = false;
      this.PurchaseReturnOperations = ['Print Order'];
    }
    else if (this.PRHeader['FlowResult'] == 'SENT FOR APPROVAL') {
      this.PRFlowResult = true;
      this.PurchaseReturnOperations = ['Approved', 'Rejected', 'Print Order', 'Active/Deactive Scan Mode'];
    }
    else {
      this.PRFlowResult = true;
      this.PurchaseReturnOperations = ['SENT FOR APPROVAL', 'Print Order', 'Active/Deactive Scan Mode'];
    }
  }

  isAllowAdd() {
    if (this.isVendCodeAdded) {
      return this.PRFlowResult;
    } else {
      return false;
    }
  }

  BarcodetxtScan_enterHandler(eventValue) {
    if (eventValue.value != undefined ? eventValue.value != null : false) {
      this.httpDataService.txtBarcode_enterHandler(["",
        eventValue.value]).subscribe(data => {
          if ((data != null ? Object.keys(data).length > 0 : false)) {
            this.httpDataService.onGetBarcode(["",
              data[0]["ItemCode"]]).subscribe(data => {
                this.getAverageCost(data[0]["ItemCode"]);
              });
          } else {
            this.toastr.warning("No Such Barcode is Registered while Adding the Lines with Barcode: " + eventValue.value);
          }
          this.barcodeValue.barcode = null;
        });
    }
  }

  setFocus(e) {
    e.component.focus();
  }

  getAverageCost(selectedItemCode) {
    this.httpDataService.getAverageCost(["",
      selectedItemCode, 'No',
      this.PRHeader["DocumentDate"]]).subscribe(data => {
        this.httpDataService.insetLines(["",
          this.PRNumber,
          selectedItemCode,
          this.PRHeader["AmtIncvat"] == true ? 'Yes' : 'No',
          data[0]["UnitCost"],
          '1', '0', '0', ''
        ]).subscribe(data => {
          this.gridContainer.instance.refresh();
        });
      });
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'AmtIncvat') { }
    else if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'DocumentDate' || e.dataField == 'ExpectedReciptDate') {
        if (this.duplicatePurchHeader[0][e.dataField] == null) {
          e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-')
        }
      }
      this.httpDataService.UPDATEHeader(["",
        e.dataField, e.value,
        this.PRNumber]).subscribe(callData3 => {
          this.errorHandlingToasterForUpdate(callData3);
        });
    }
  }

  onVendorDetailsFieldsChanges(e) {
    if (e.dataField != 'AmtIncvat') {
      if ((e.value != undefined || e.value != null) && this.duplicatePurchHeader[0][e.dataField] != e.value) {
        this.httpDataService.UPDATEHeader(["", e.dataField, e.value, this.PRNumber])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUpdate(dataStatus);
          });
      }
    }
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus > 0) {
      this.calculateForSummary();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == 'DONE') {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus, "Try Again");
    }
  }

  tableOnEditing(event) {
    event.component.columnOption("ItemCode", "allowEditing", false);
  }

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

  onInitNewCommentRow(event) {
    event.data.CommentDate = UtilsForGlobalData.getCurrentDate();
    event.data.CommentTime = UtilsForGlobalData.getCurrentTime();
    event.data.UserID = UtilsForGlobalData.getUserId();
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
    this.gridContainer.instance.cellValue(this.rowIndex, "UOM", event.data.PurchUOM);
    this.gridContainer.instance.cellValue(this.rowIndex, "Description", event.data.Description);
    this.gridContainer.instance.cellValue(this.rowIndex, "DirectUnitCost", event.data.UnitPrice);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data, ["DirectUnitCost", "AmountIncludingVAT", "Amount"]);
    this.itemDetailsPopup = true;
  }

  getBuyFromVendorDetail() {
    this.popupBuyVendorDetails = true;
  }

  getPayToVendorDetail() {
    this.popupPayVendorDetails = true;
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
    printHeader.InvDiscountAmount = printHeader.InvDiscountAmount != null ? this.formatNumber(printHeader.InvDiscountAmount) : '0';
    printHeader.TotalAmountinWords = this.companyHeader.CurrencyCode + " " + (writtenNumber(parseInt(printHeader.AmountIncludingVAT), { lang: 'enIndian' }));
    var decimalAsInt = Math.round((printHeader.AmountIncludingVAT - parseInt(printHeader.AmountIncludingVAT)) * 100);
    if (Number(decimalAsInt) >= 0) {
      printHeader.TotalAmountinWords += " and " + decimalAsInt + "/100";
    }
    printHeader.AmountExcVat = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.Amount));
    printHeader.TotalAmount = this.formatNumber(Number(printHeader.AmountIncludingVAT) - Number(printHeader.InvDiscountAmount));
    printHeader.Amount = this.formatNumber(printHeader.Amount);
    printHeader.AmountIncludingVAT = this.formatNumber(printHeader.AmountIncludingVAT);
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
      printLines[i].DirectUnitCost = this.formatNumber(printLines[i].DirectUnitCost);
      printLines[i].LineDiscountAmount = this.formatNumber(printLines[i].LineDiscountAmount);
      printLines[i].Amount = this.formatNumber(printLines[i].Amount);
      printHeader.TotalQty += Number(printLines[i].Quantity);
    }

    for (var i = 0; i < Object.keys(this.printHeader).length; i++) {
      // this.printHeader[i].ConnectedCustCode= ( this.printHeader[i].ConnectedCustCode==null || this.printHeader[i].ConnectedCustCode=='') ? ' - ':this.printHeader[i].ConnectedCustCode;
      this.printHeader[i].PaymentTerm = (this.printHeader[i].PaymentTerm == null || this.printHeader[i].PaymentTerm == '') ? ' - ' : this.printHeader[i].PaymentTerm;
      this.printHeader[i].DueDate = (this.printHeader[i].DueDate == null || this.printHeader[i].DueDate == '') ? ' - ' : this.printHeader[i].DueDate;
      this.printHeader[i].VendorInvoiceNo = (this.printHeader[i].VendorInvoiceNo == null || this.printHeader[i].VendorInvoiceNo == '') ? ' - ' : this.printHeader[i].VendorInvoiceNo;
    }

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = (printLines[i].SnNo == null || printLines[i].SnNo == '') ? ' - ' : printLines[i].SnNo;
      printLines[i].ItemCode = (printLines[i].ItemCode == null || printLines[i].ItemCode == '') ? ' - ' : printLines[i].ItemCode;
      printLines[i].ExtraDescription = (printLines[i].ExtraDescription == null || printLines[i].ExtraDescription == '') ? ' - ' : printLines[i].ExtraDescription;
      printLines[i].UOM = (printLines[i].UOM == null || printLines[i].UOM == '') ? ' - ' : printLines[i].UOM;
      printLines[i].DirectUnitCost = (printLines[i].DirectUnitCost == null || printLines[i].DirectUnitCost == '') ? ' - ' : printLines[i].DirectUnitCost;
      printLines[i].LineDiscountAmount = (printLines[i].LineDiscountAmount == null || printLines[i].LineDiscountAmount == '') ? ' - ' : printLines[i].LineDiscountAmount;
      printLines[i].Quantity = (printLines[i].Quantity == null || printLines[i].Quantity == '') ? ' - ' : printLines[i].Quantity;
      printLines[i].Amount = (printLines[i].Amount == null || printLines[i].Amount == '') ? ' - ' : printLines[i].Amount;
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

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', 450, 30, 80, 50);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
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
    //right
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    printHeader.DocumentNo = printHeader.DocumentNo == null || printHeader.DocumentNo == '' ? printHeader.DocumentNo = ' - ' : printHeader.DocumentNo;
    doc.textAlign("Document No   : " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.rightStartCol1, tempYR += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    printHeader.DocumentDate = printHeader.DocumentDate == null || printHeader.DocumentDate == '' ? printHeader.DocumentDate = ' - ' : printHeader.DocumentDate;
    doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "left" }, this.pdfFormate.rightStartCol1, tempYR += this.pdfFormate.NormalSpacing);
    //box2x2
    doc.line(this.pdfFormate.startX + 255, tempY + 15, this.pdfFormate.startX + 255, tempY + 35);//middle vertical
    doc.line(this.pdfFormate.startX, tempY + 15, 550, tempY + 15);//top-hor
    doc.line(this.pdfFormate.startX, tempY + 15, this.pdfFormate.startX, tempY + 35);//left vert
    doc.textAlign("Buy From", { align: "left" }, this.pdfFormate.startX + 10, tempY + 28);
    doc.line(550, tempY + 15, 550, tempY + 35);//left-vert
    doc.line(this.pdfFormate.startX, tempY + 35, 550, tempY + 35);//bottm-hor
    doc.textAlign("Pay To", { align: "left" }, this.pdfFormate.startX + 265, tempY + 28);
    var tempBoxY = tempY;

    doc.setFontType(this.pdfFormate.SetFontType);

    printHeader.PayToVendor = printHeader.PayToVendor == null || printHeader.PayToVendor == '' ? printHeader.PayToVendor = ' - ' : printHeader.PayToVendor;
    doc.textAlign("Code: " + printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startX + 10, tempY = tempY + 45);
    doc.textAlign("Code: " + printHeader.PayToVendor, { align: "left" }, this.pdfFormate.startX + 265, tempYC = tempYC + 68);

    printHeader.BuyFromName = printHeader.BuyFromName == null || printHeader.BuyFromName == '' ? printHeader.BuyFromName = ' - ' : printHeader.BuyFromName;
    doc.textAlign("Name: " + printHeader.BuyFromName, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Name: " + printHeader.BuyFromName, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

    printHeader.BuyFromAddress = printHeader.BuyFromAddress == null || printHeader.BuyFromAddress == '' ? printHeader.BuyFromAddress = ' - ' : printHeader.BuyFromAddress;
    doc.textAlign("Address: " + printHeader.BuyFromAddress, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);

    printHeader.BuyFromAddress2 = printHeader.BuyFromAddress2 == null || printHeader.BuyFromAddress2 == '' ? printHeader.BuyFromAddress2 = ' - ' : printHeader.BuyFromAddress2;
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress2, 200);
    //  tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    }
    // doc.textAlign(""+  printHeader.BuyFromAddress2,{ align: "left" }, this.pdfFormate.startX+10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Address: " + printHeader.BuyFromAddress, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
    var splitTitle = doc.splitTextToSize(printHeader.BuyFromAddress2, 200);
    //  tempY -= this.pdfFormate.NormalSpacing;
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
    }
    //doc.textAlign("" + printHeader.BuyFromAddress2, { align: "left" }, this.pdfFormate.startX+265, tempYC += this.pdfFormate.NormalSpacing);
    doc.setFontType(this.pdfFormate.SetFontType);

    printHeader.BuyFromCity = printHeader.BuyFromCity == null || printHeader.BuyFromCity == '' ? printHeader.BuyFromCity = ' - ' : printHeader.BuyFromCity;
    doc.textAlign("" + printHeader.BuyFromCity + ", " + printHeader.BuyFromZip, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.BuyFromCity + ", " + printHeader.BuyFromZip, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    printHeader.VATID = printHeader.VATID == null || printHeader.VATID == '' ? printHeader.VATID = ' - ' : printHeader.VATID;
    doc.textAlign("Tax ID: " + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 10, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Tax ID :" + printHeader.VATID, { align: "left" }, this.pdfFormate.startX + 265, tempYC += this.pdfFormate.NormalSpacing);
    //box outline
    tempY += 10;
    doc.line(this.pdfFormate.startX, tempBoxY + 35, this.pdfFormate.startX, tempY);//vert-left
    doc.line(this.pdfFormate.startX + 255, tempBoxY + 35, this.pdfFormate.startX + 255, tempY);//vert-centre
    doc.line(550, tempBoxY + 35, 550, tempY);//vert-right
    doc.line(this.pdfFormate.startX, tempY, 550, tempY);
    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.autoTable(this.columnHeader1, this.printHeader, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,

      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'center'
      }
    });

    tempY = doc.autoTable.previous.finalY + 10;
    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader2, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'center'
      }, columnStyles: {
        SNo: {
          halign: 'left'
        },
        ItemCode: {
          halign: 'center'
        },
        Description: {
          halign: 'left'
        },
        UOM: {
          halign: 'center'
        },
        Cost: {
          halign: 'right'
        },
        Discount: {
          halign: 'right'
        },
        Quantity: {
          halign: 'center'
        },
        Amount: {
          halign: 'center'
        },

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
    doc.textAlign("In Words : " + printHeader.TotalAmountinWords, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setFontType(this.pdfFormate.SetFontType);

    var startY = doc.autoTable.previous.finalY + 30;
    startY = this.calculateThePage(startY, doc);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT:", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalAmount, { align: "right-align" }, rightcol2, startY);
    if (printHeader.InvDiscountAmount > 0) {
      startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
      doc.textAlign("DISCOUNT(" + printHeader.InvoiceCompoundDiscount + "):", { align: "left" }, rightcol1, startY);
      doc.textAlign(printHeader.InvDiscountAmount, { align: "right-align" }, rightcol2, startY);
    }

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT EX.TAX :", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.Amount, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TAX:", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountExcVat, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT INC.TAX:", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.AmountIncludingVAT, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.textAlign("Remarks: " + this.Comment.comment, { align: "left" }, this.pdfFormate.startX, startY);
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

    doc.save("PuchaseReturn" + this.PRNumber + ".pdf");
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

      x = (pageWidth - txtWidth) / 2;

    } else if (options.align === "centerAtX") {

      x = x - (txtWidth / 2);

    } else if (options.align === "right") {

      x = txtWidth - x;

    } else if (options.align === "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;

    } else if (options.align === "right-align-toleft") {
      if (430 + txtWidth > this.internal.pageSize.width - 40) {
        x = this.internal.pageSize.width - 40 - txtWidth;
      } else
        x = x;

    }
    this.text(txt, x, y);
  };

  API.getLineHeight = function (txt) {
    return this.internal.getLineHeight();
  };

})(jsPDF.API);

