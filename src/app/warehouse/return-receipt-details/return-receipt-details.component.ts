import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import * as events from "devextreme/events";
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ReturnReceiptDetailsHttpDataService } from './return-receipt-details-http-data.service';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-return-receipt-details',
  templateUrl: './return-receipt-details.component.html',
  styleUrls: ['./return-receipt-details.component.css']
})
export class ReturnReceiptDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;

  GRReceiptHeader: [];
  duplicateGRReceiptHeader: string[];
  companyHeader: any = {};
  GoodsReceiptReturnNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('GRReturnNumber');
  ShipFromSuggestions: any = {};
  SOForSuggestions: any = null;
  printLines: any = {};
  dataSource: any = {};
  dataSourceGRHH: any = {};
  dataSourceGRHH2: any = [];
  dataStore: any = [];
  isLinesExist: boolean = false;
  looseArr: any = {};
  isDivVisible: boolean = false;
  barcodeValue: any = {};
  GoodsReceiptOperation = ['Register', 'Print GoodsReceipt', 'Active/Deactive Scan Mode'];
  GoodsReceiptOperationHandHeld = ['Confirm'];
  columns3 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
    { title: "Base Qty", dataKey: "QtyinBaseUOM", width: 40 },
    { title: "POUOM", dataKey: "POUOM", width: 40 },
    { title: "QtyinPO", dataKey: "QtyinPOUOM", width: 40 },
    { title: "ReceiveQty", dataKey: "ReceivedQuantity", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalSOLookupPopup: boolean = false;
  globalStoreLookupPopup: boolean = false;
  isLocationCodeSelected: boolean = false;
  popupSelltoCustDetails: Boolean = false;

  constructor(
    private httpDataService: ReturnReceiptDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.httpDataService.getLocationList3([''])
      .subscribe(getLoc => {
        this.ShipFromSuggestions = new DataSource({
          store: <String[]>getLoc,
          paginate: true,
          pageSize: 20
        });
      });


    var thisComponent = this;
    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "ReceiveingQuantity", "BarcodeNo", "ReceivedQuantity", "QtyinPOUOM"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchOpenHeader();
        thisComponent.httpDataService.openGRLines(["",
          thisComponent.GoodsReceiptReturnNumber])
          .subscribe(dataLines => {
            thisComponent.printLines = dataLines;
            if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        switch (checkData(key, getUpdateValues(key, newValues, "ReceivedQuantity"))) {
          case 1: {
            devru.reject("Please enter a positive Number!");
            break;
          }
          case 2: {
            devru.reject("Receiving Quantity Should be less or Equal to Order Quantity");
            break;
          }
          case 3: {
            var recQty: any = Number(getUpdateValues(key, newValues, "ReceivedQuantity"));
            var ordQty: any = Number(getUpdateValues(key, newValues, "QtyinPOUOM"));
            var remQty: any = ordQty - recQty;
            thisComponent.httpDataService.grLineDG_itemEditEndHandlerRQ(["",
              getUpdateValues(key, newValues, "ReceivedQuantity"),
              remQty,
              thisComponent.GoodsReceiptReturnNumber,
              getUpdateValues(key, newValues, "LineNo")]).subscribe(data => {
                if (data >= 0) {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is UPDATE-ERR");
                }
              });
            break;
          }
          default: {
            break;
          }
        }
        return devru.promise();
      }
    });

    function checkData(previous: String, newData: String): Number {
      var receivedQty: Number = Number(previous["ReceivedQuantity"]);
      var ordQty: Number = Number(previous["QtyinPOUOM"]);
      var val: Number = Number(newData);
      if (val < 0 || (newData != "0" && val == 0)) {
        // reset the entered input
        return 1;
      }
      if ((Number(val) + Number(receivedQty)) > ordQty) {
        return 2;
      }
      return 3;
    }

    this.dataSourceGRHH.store = new CustomStore({
      key: ["LineNo", "ItemCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAdhocLines(["",
          thisComponent.GoodsReceiptReturnNumber])
          .subscribe(dataLines => {
            if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
              for (var i = 0; i < Object.keys(dataLines).length; i++) {
                dataLines[i].ReceivedQty = (dataLines[i].ReceivedQty != null) ? dataLines[i].PickedQty : 0;
              }
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }
  hover1(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerNo");
  }

  suggestionFormateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForSalesOrder(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerNo");
  }


  fetchOpenHeader() {
    this.httpDataService.openGROrder(["",
      this.GoodsReceiptReturnNumber]).subscribe(gotGRDetails => {
        this.assignToDuplicate(gotGRDetails);
        this.GRReceiptHeader = gotGRDetails[0];
        if (this.GRReceiptHeader["SentFromStore"] == 'Yes') {
          this.GRReceiptHeader["SentFromStore"] = true;
        } else {
          this.GRReceiptHeader["SentFromStore"] = false;
        }
        if (this.GRReceiptHeader["LocationCode"] ? this.GRReceiptHeader["LocationCode"] != '' : false) {
          this.isLocationCodeSelected = true;
          this.httpDataService.getAllReturnOrderFilter(['',
            this.GRReceiptHeader["LocationCode"],
            this.GRReceiptHeader["DocumentDate"]]).subscribe(dataSR => {
              this.SOForSuggestions = dataSR;
            });
        } else
          this.isLocationCodeSelected = false;
      });
  }

  onLocationCodeChanged(event) {
    if (this.duplicateGRReceiptHeader[0]["LocationCode"] != event.value) {
      /* event.value = (event.value == null ? '' : event.value);
      this.GRReceiptHeader["LocationCode"] = event.value;
      this.GRReceiptHeader["DefReceiveStorage"] = event.value;*/
      if (!event.value) {
        this.httpDataService.btnClearLoc_clickHandler(["",
          this.GoodsReceiptReturnNumber]).subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      } else {
        var json = this.ShipFromSuggestions == null ? {} : this.ShipFromSuggestions._store._array;
        for (var index = 0; index < json.length; ++index) {
          if (json[index].LocationCode == event.value) {
            this.httpDataService.handleLocation(["",
              event.value,
              json[index].DefReceiveStorage,
              this.GoodsReceiptReturnNumber]).subscribe(callData3 => {
                this.errorHandlingToasterForUpdate(callData3);
              });
            break;
          }
        }
      }
    }
  }

  SalesOrderLookupSearch() {
    if (this.isLocationCodeSelected) {
      this.globalSOLookupPopup = true;
    } else {
      this.toastr.warning("Please Select the Location Code!!");
    }
  }

  onSalesOrderClicked(event) {
    this.globalSOLookupPopup = false;
    this.httpDataService.handlePOLookUp(['',
      this.GoodsReceiptReturnNumber,
      event.data.DocumentNo,
      this.GRReceiptHeader["LocationCode"],
      this.GRReceiptHeader["DefReceiveStorage"]])
      .subscribe(callData3 => {
        if (callData3[0] == 'COMPLETED') {
          this.gridContainer.instance.refresh();
        } else {
          this.toastr.error("Failed to Update , Error Status Code : " + callData3[0]);
        }
      });
  }

  onSOChanged(event) {
    if (this.duplicateGRReceiptHeader[0]["SourceNo"] != event.value) {
      event.value = (event.value == null ? '' : event.value);
      this.GRReceiptHeader["SourceNo"] = event.value;
      this.duplicateGRReceiptHeader[0]["SourceNo"] = event.value;
      if (this.GRReceiptHeader["LocationCode"] != '') {
        this.httpDataService.handlePOLookUp(['',
          this.GoodsReceiptReturnNumber,
          event.value,
          this.GRReceiptHeader["LocationCode"],
          this.GRReceiptHeader["DefReceiveStorage"]])
          .subscribe(callData3 => {
            if (callData3[0] == 'COMPLETED') {
              this.fetchOpenHeader();
              this.gridContainer.instance.refresh();
            }
          });
      } else {
        this.GRReceiptHeader["SourceNo"] = '';
        this.toastr.warning("Please Select The Location Code");
      }
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'SentFromStore') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if (this.duplicateGRReceiptHeader ? this.duplicateGRReceiptHeader[0]["SentFromStore"] != temp : false) {
        if (temp == 'Yes') {
          this.httpDataService.chkShiptoStore_clickHandler(["",
            this.GRReceiptHeader["StoreID"],
            this.GoodsReceiptReturnNumber]).subscribe(callData3 => {
              this.errorHandlingToasterForUpdate(callData3);
            });
        } else {
          this.httpDataService.chkShiptoStore_clickHandler1(["",
            this.GoodsReceiptReturnNumber]).subscribe(callData3 => {
              this.errorHandlingToasterForUpdate(callData3);
            });
        }
      }
    }
    else if ((e.value != undefined || e.value != null) && this.duplicateGRReceiptHeader[0][e.dataField] != e.value) {
      this.duplicateGRReceiptHeader[0]["" + e.dataField] = e.value;
      if (e.dataField == 'DocumentDate') {
        this.httpDataService.DocumentDate_changeHandler(["",
          e.value,
          this.GoodsReceiptReturnNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      } else {
        this.httpDataService.genralGRUPDATE(["",
          e.dataField, e.value,
          this.GoodsReceiptReturnNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicatePickHeader
    this.duplicateGRReceiptHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateGRReceiptHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateGRReceiptHeader[i][prop] = data[i][prop];
      }
    }
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Register') {
      if (this.isLinesExist) {
        this.checkQtyToPost();
      } else
        this.toastr.warning("Please Add the Lines");
    } else if (selected == 'Print GoodsReceipt') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.GRReceiptHeader, this.printLines, this.columns3, "Goods Return Receipt");
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    } else if (selected == 'Confirm') {
      this.GRFromHandHeldConfirm();
    } else if (selected == 'Active/Deactive Scan Mode') {
      this.isDivVisible = !this.isDivVisible;
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  setFocus(e) {
    e.component.focus();
  }

  BarcodetxtScan_enterHandler(eventValue) {
    if (eventValue.value != undefined ? eventValue.value != null : false) {
      this.httpDataService.txtScan_enterHandler(["",
        this.GoodsReceiptReturnNumber,
        eventValue.value]).subscribe(data => {
          if ((data != null ? Object.keys(data).length > 0 : false)) {
            if (Number(data[0]["currQty"]) + 1 <= Number(data[0]["OrdQty"])) {
              this.httpDataService.onScan(["",
                this.GoodsReceiptReturnNumber,
                data[0]["LineNo"]]).subscribe(data => {
                  if ((data >= 0)) {
                    this.gridContainer.instance.refresh();
                  } else {
                    this.toastr.warning("Error while Inserting the Lines with Barcode: " + eventValue.value + ", Error Status Code is INSERT-ERR");
                  }
                });
            } else {
              this.toastr.warning("Can't Receive more than P.O Qty");
            }
          } else {
            this.toastr.warning("Barcode Not Found while Adding the Lines with Barcode: " + eventValue.value);
          }
          this.barcodeValue.barcode = null;
        });
    }
  }

  checkQtyToPost() {
    this.httpDataService.openGRLines(["",
      this.GoodsReceiptReturnNumber]).subscribe(gotGRDetails => {
        if (gotGRDetails[0].ReceivedQuantity > 0) {
          if (Number(gotGRDetails[0].PostingQty) != 0) {
            if (this.GRReceiptHeader["DocumentStatus"] != 'POSTED') {
              this.httpDataService.postGRProcedure(["",
                this.GoodsReceiptReturnNumber,
                this.GRReceiptHeader["DefReceiveStorage"],
                this.GRReceiptHeader["SourceNo"],
                this.GRReceiptHeader["DocumentDate"],
                UtilsForGlobalData.getUserId()]).subscribe(data => {
                  if (data[0] == 'POSTED') {
                    this.toastr.success("Goods Receipt " + this.GoodsReceiptReturnNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/warehouse/return-receipt-list']);
                  } else {
                    this.toastr.error("Posting Failed! with Error status Code :" + data[0], "Try again");
                  }
                });

            } else {
              this.toastr.warning("Nothing to Post!!", "Already Posted Error");
            }
          } else {
            this.toastr.warning("No Receiving Quantity Found!!");
          }
        } else {
          this.toastr.warning("Nothing to Post!!", "No Record found Error");
        }
      });
  }

  getTasksdataSourceGRHH(key) {
    var thisComponent = this;
    let item = this.dataSourceGRHH2.find((i) => i.key === key);
    if (!item) {
      item = {
        key: key,
        dataSourceInstance: new DataSource({
          store: new CustomStore({
            key: ["ItemCode"],
            load: function (loadOptions) {
              var devru = $.Deferred();
              thisComponent.httpDataService.looseDG_itemClickHandler(["",
                thisComponent.GoodsReceiptReturnNumber,
                key["ItemCode"]]).subscribe(dataLines => {
                  thisComponent.looseArr = dataLines;
                  devru.resolve(dataLines);
                });
              return devru.promise();
            },
            remove: function (key) {
              var devru = $.Deferred();
              thisComponent.httpDataService.DELETEDeviceLine(["",
                key["LineNo"],
                thisComponent.GoodsReceiptReturnNumber]).subscribe(dataStatus => {
                  if (dataStatus > 0) {
                    devru.resolve(dataStatus);
                  } else {
                    devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
                  }
                });
              return devru.promise();
            }
          })
        })
      };
      this.dataSourceGRHH2.push(item);
    }
    return item.dataSourceInstance;
  }

  GRFromHandHeldConfirm() {
    if (this.checkQuantity()) {
      this.httpDataService.button1_clickHandler(['',
        this.GoodsReceiptReturnNumber,
        UtilsForGlobalData.getUserId(),
        this.GRReceiptHeader["DocumentDate"]]).subscribe(callData3 => {
          if (callData3[0] != 'MOVED') {
            this.toastr.error("Confirm Failed! with Error Status Code :" + callData3[0], "Failed");
          } else {
            this.toastr.success("Status Updated Succesfully", "Confirmed");
          }
        });
    }
  }

  private checkQuantity(): Boolean {
    var qtyOk: Boolean = true;
    var totQty: Number = 0;
    if ((this.looseArr != null ? Object.keys(this.looseArr).length > 0 : false)) {
      for (var i = 0; i < Object.keys(this.looseArr).length; i++) {
        if (Number(this.looseArr[i].ReceivedQty) > Number(this.looseArr[i].ReceiveQty)) {
          qtyOk = false;
          this.toastr.warning("ReceivedQty Qty. Can't be more than Requested Qty for Item " + this.looseArr[i].ItemCode, " NOT ALLOWED!");
          return false;
        }
        totQty = Number(totQty) + Number(this.looseArr[i].ReceivedQty);
      }
      if (totQty == 0) {
        qtyOk = false;
        this.toastr.warning("There is Nothing to Confirm!");
        return false;
      }
      return qtyOk;
    }
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == 'DONE') {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'SentFromStore') {
      if ((e.value != undefined || e.value != null) && this.duplicateGRReceiptHeader[0][e.dataField] != e.value) {
        this.httpDataService.genralGRUPDATE(["",
          e.dataField, e.value,
          this.GoodsReceiptReturnNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }

  onStoreLookupClicked() {
    if (this.GRReceiptHeader["SentFromStore"]) {
      this.globalStoreLookupPopup = true;
      this.httpDataService.getList(["",
        this.GRReceiptHeader["Code"]])
        .subscribe(dataLines => {
          this.dataStore = dataLines;
        });
    } else {
      this.toastr.warning("Please Select the FromStore to YES!!");
    }
  }

  onStoreSelected(event) {
    this.globalStoreLookupPopup = false;
    this.httpDataService.handleStoreLookUp(["",
      event.data.StoreID,
      this.GoodsReceiptReturnNumber]).subscribe(callData3 => {
        this.errorHandlingToasterForUpdate(callData3);
      });
  }


  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
  }


  /* onTabChange(event: NgbTabChangeEvent) {
    if (!this.isLinesExist) {
      event.preventDefault();
      this.toastr.warning("Please Select The Location Code and Sales Order for the Lines");
    }
  } */

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
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, columHeader, title) {

    printHeader.BaseTotalQty = 0;
    printHeader.POTotalQty = 0;
    printHeader.ReceivedTotalQty = 0;
    printHeader.Comments = printHeader.Comments ? printHeader.Comments : '';

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyinPOUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ReceivedQuantity);
      printLines[i].QtyinBaseUOM = this.formatNumber(printLines[i].QtyinBaseUOM);
      printLines[i].QtyinPOUOM = this.formatNumber(printLines[i].QtyinPOUOM);
      printLines[i].ReceivedQuantity = this.formatNumber(printLines[i].ReceivedQuantity);
    }

    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50); //variable.company_logo.src
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address2 + "," + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document No : " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document Date : " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT :", { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.Code, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + printHeader.LocationCode, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address + " " + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("SU CODE : " + printHeader.DefReceiveStorage, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.City + " " + printHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Handled By: " + printHeader.HandledBy, { align: "right-align-toleft" }, this.pdfFormate.rightStartCol1, tempY);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columHeader, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing * 2,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          footerStr = footerStr;
        }
        footerStr += "  Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
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

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.O. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL RECEIVED QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks : " + printHeader.Comments, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(this.pdfFormate.startX, startY, 150, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("GoodsReceipt" + this.GoodsReceiptReturnNumber + ".pdf");
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
