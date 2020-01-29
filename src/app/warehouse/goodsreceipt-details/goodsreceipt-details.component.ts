import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { GoodsreceiptDetailsHttpDataService } from './goodsreceipt-details-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

/* @Author Ganesh
/* this is For Goods Receipt
/* On 15-02-2019
*/

@Component({
  selector: 'app-goodsreceipt-details',
  templateUrl: './goodsreceipt-details.component.html',
  styleUrls: ['./goodsreceipt-details.component.css']
})
export class GoodsreceiptDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;

  ReceiveDetail: any = {};
  GRHeader: [];
  duplicateGRHeader: string[];
  companyHeader: any = {};
  GoodsReceiptNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('GoodsReceiptNumber');
  ShipFromSuggestions: any = null;
  SOForSuggestions: any = null;
  SUCodeSuggestions: any = {};
  printLines: any = {};
  printHeader: any = {};
  dataSource: any = {};
  dataSourceGRHH: any = {};
  dataSourceGRHH2: any = [];
  looseArr: any = {};
  isDivVisible: boolean = false;
  barcodeValue: any = {};
  goodsReceiptOperation: any = ['Register', 'Print GoodsReceipt', 'Active/Deactive Scan Mode'];
  columns3 = [
    { title: "ITEMCODE", dataKey: "ItemCode", width: 40 },
    { title: "DESCRIPTION", dataKey: "Description", width: 40 },
    { title: "BASE UOM", dataKey: "BaseUOM", width: 40 },
    { title: "BASE QTY", dataKey: "QtyinBaseUOM", width: 40 },
    { title: "POUOM", dataKey: "POUOM", width: 40 },
    { title: "QTYinPO", dataKey: "QtyinPOUOM", width: 40 },
    { title: "RECEIVE QTY", dataKey: "ReceiveingQuantity", width: 40 }
  ];
  columHeader1 = [
    { title: "DOCUMENT NO", dataKey: "DocumentNo", width: 80 },
    { title: "DOCUMENT DATE", dataKey: "DocumentDate", width: 80 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalPOLookupPopup: Boolean = false;
  globalVendorDetailsPopup: Boolean = false;
  vendorDeatilsPerVendor: any = {};
  isLinesExist: Boolean = false;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: GoodsreceiptDetailsHttpDataService) { }

  ngOnInit() {

    this.httpDataService.getLocationList3().subscribe(getLocation => {
      this.ShipFromSuggestions = new DataSource({
        store: <String[]>getLocation,
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
          thisComponent.GoodsReceiptNumber])
          .subscribe(dataLines => {
            thisComponent.printLines = dataLines;
            if (Object.keys(dataLines).length > 0) {
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
        switch (checkData(key, getUpdateValues(key, newValues, "ReceiveingQuantity"))) {
          case 1: {
            devru.reject("Please enter a positive Number!");
            break;
          }
          case 2: {
            devru.reject("Receiving Quantity Should be less or Equal to Order Quantity");
            break;
          }
          case 3: {
            thisComponent.httpDataService.grLineDG_itemEditEndHandler(["",
              getUpdateValues(key, newValues, "ReceiveingQuantity"),
              thisComponent.GoodsReceiptNumber,
              getUpdateValues(key, newValues, "LineNo")
            ]).subscribe(dataStatus => {
              if (dataStatus >= 0) {
                devru.resolve(dataStatus);
              } else {
                devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
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
          thisComponent.GoodsReceiptNumber])
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

    this.httpDataService.getCompanyInfo().subscribe(getCompany => {
      this.companyHeader = getCompany[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }
  hover1(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "BuyFromVendor");
  }

  suggestionFormateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  suggestionFormateForSalesOrder(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "DocumentNo", "BuyFromVendor");
  }

  suggestionFormateForSUCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }
  
  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  fetchOpenHeader() {
    this.httpDataService.openGROrder(["",
      this.GoodsReceiptNumber]).subscribe(dataHeader => {
        this.assignToDuplicate(dataHeader);
        this.printHeader = dataHeader;
        this.GRHeader = dataHeader[0];
        if (typeof this.GRHeader["LocationCode"] != null || this.GRHeader["LocationCode"] != '') {
          this.httpDataService.LocationStorageUnit(['', this.GRHeader["LocationCode"]])
            .subscribe(gotSUList => {
              this.SUCodeSuggestions = gotSUList;
            });
        }
        this.httpDataService.getVendorDetailPerVendor(["", this.GRHeader["Code"]])
          .subscribe(GotVenDetail => {
            this.ReceiveDetail = GotVenDetail[0];
          });
      });
  }

  POLookupClicked() {
    if (this.GRHeader["LocationCode"] ? this.GRHeader["LocationCode"] != '' : false) {
      this.globalPOLookupPopup = true;
      this.httpDataService.getAllPurchaseOrderTypeOne(['',
        this.GRHeader["LocationCode"],
        this.GRHeader["DocumentDate"]]).subscribe(dataPO => {
          if (dataPO[0] == 'DONE') {
            this.SOForSuggestions = dataPO[1];
          } else {
            this.toastr.error("Error While Getting the Purchase Order Status Code :" + dataPO[0]);
          }
        });
    } else {
      this.toastr.warning("Please Select the Location Code !!");
    }
  }

  purchaseOrderOnClicked(event) {
    this.globalPOLookupPopup = false;
    if (this.GRHeader["LocationCode"] ? this.GRHeader["LocationCode"] != '' : false) {
      if (this.GRHeader["DefReceiveStorage"] != null ? this.GRHeader["DefReceiveStorage"] != '' : false) {
        this.httpDataService.handlePOLookUp(['',
          this.GoodsReceiptNumber,
          event.data.DocumentNo,
          this.GRHeader["LocationCode"],
          this.GRHeader["DefReceiveStorage"]]).subscribe(dataStatus => {
            if (dataStatus[0] == 'COMPLETED') {
              this.gridContainer.instance.refresh();
            } else {
              this.toastr.error("Error While Adding PO, Error Status Code: " + dataStatus[0]);
            }
          });
      } else {
        this.toastr.warning("Please Select The Storage Unit");
      }
    } else {
      this.toastr.warning("Please Select The Location Code");
    }
  }

  onLocationCodeChanged(event) {
    if (event.value ? this.GRHeader["LocationCode"] != event.value : false) {
      var json = this.ShipFromSuggestions == null ? {} : this.ShipFromSuggestions._store._array;
      for (var index = 0; index < json.length; ++index) {
        if (json[index].LocationCode == event.value) {
          this.duplicateGRHeader[0]["LocationCode"] = json[index].LocationCode;
          if (this.companyHeader["OneSUperLocation"] == 'Yes') {
            this.duplicateGRHeader[0]["DefReceiveStorage"] = json[index].DefStoreageUnit;
            this.GRHeader["DefReceiveStorage"] = json[index].DefStoreageUnit;
          } else {
            this.duplicateGRHeader[0]["DefReceiveStorage"] = json[index].DefReceiveStorage;
            this.GRHeader["DefReceiveStorage"] = json[index].DefReceiveStorage;
          }
          this.httpDataService.handleLocation(["",
            event.value,
            this.GRHeader["DefReceiveStorage"],
            this.GoodsReceiptNumber]).subscribe(dataStatus => {
              this.errorHandlingToasterForUPDATE(dataStatus);
            });
          this.httpDataService.LocationStorageUnit(['',
            event.value]).subscribe(gotSUList => {
              this.SUCodeSuggestions = gotSUList;
            });
          break;
        }
      }
    } else if (event.value == null ? this.GRHeader["LocationCode"] != event.value : false) {
      this.httpDataService.btnClearLoc_clickHandler(["",
        this.GoodsReceiptNumber]).subscribe(dataStatus => {
          this.fetchOpenHeader();
        });
    }
  }

  onToSUCodeChanged(event) {
    if (event.value ? this.GRHeader["DefReceiveStorage"] != event.value : false) {
      this.httpDataService.genralGRUPDATE(['',
        "DefReceiveStorage",
        event.value,
        this.GoodsReceiptNumber]).subscribe(dataStatus => {
          this.errorHandlingToasterForUPDATE(dataStatus);
        });
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateGRHeader[0][e.dataField] != e.value) {
      this.duplicateGRHeader[0]["" + e.dataField] = e.value;
      if (e.dataField == 'DocumentDate') {
        this.httpDataService.DocumentDate_changeHandler(["",
          e.value,
          this.GoodsReceiptNumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      } else {
        this.httpDataService.genralGRUPDATE(["",
          e.dataField,
          e.value,
          this.GoodsReceiptNumber]).subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == "DONE") {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus[0], "Try Again");
    }
  }

  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus > 0) {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToasterForUPDATESTATUS(dataStatus) {
    if (dataStatus == true) {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicatePickHeader
    this.duplicateGRHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateGRHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateGRHeader[i][prop] = data[i][prop];
      }
    }
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Register') {
      if (this.isLinesExist) {
        if (this.GRHeader["DefReceiveStorage"] != null ? this.GRHeader["DefReceiveStorage"] != '' : false) {
          this.checkQtyToPost();
        } else {
          this.toastr.warning("DefReceiveStorage is not Present!");
        }
      } else
        this.toastr.warning("Please Add the Lines");
    } else if (selected == 'Print GoodsReceipt') {
      if (Object.keys(this.printLines).length > 0) {
        this.generateStdPDF(this.GRHeader, this.printLines, this.columns3, "Goods Receipt");
      } else {
        this.toastr.warning("There is No Lines to Print!!");
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
        this.GoodsReceiptNumber,
        eventValue.value]).subscribe(dataLines => {
          if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
            if (Number(dataLines[0]["currQty"]) + 1 <= Number(dataLines[0]["OrdQty"])) {
              this.httpDataService.onScan(["",
                this.GoodsReceiptNumber,
                dataLines[0]["LineNo"]]).subscribe(dataStatus => {
                  if ((dataStatus >= 0)) {
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
    this.httpDataService.checkQtyToPost(["",
      this.GoodsReceiptNumber]).subscribe(gotGRDetails => {
        if (Object.keys(gotGRDetails).length > 0) {
          if (Number(gotGRDetails[0].PostingQty) != 0) {
            if (this.GRHeader["DocumentStatus"] != 'POSTED') {
              this.httpDataService.postGRProcedure(["",
                this.GoodsReceiptNumber,
                UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                  if (dataStatus[0] == 'POSTED') {
                    this.toastr.success("Goods Receipt " + this.GoodsReceiptNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/warehouse/goodsreceipt-list']);
                  } else {
                    this.toastr.error("Posting Failed! with Error status Code :" + dataStatus[0], "Try again");
                  }
                });
            } else {
              this.toastr.warning("Nothing to Post", "Already Posted!!");
            }
          } else {
            this.toastr.warning("No Receiving Quantity Found!!");
          }
        } else {
          this.toastr.warning("Nothing to Post", "No Record found!!");
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
            key: ["ItemCode", "LineNo"],
            load: function (loadOptions) {
              var devru = $.Deferred();
              thisComponent.httpDataService.looseDG_itemClickHandler(["",
                thisComponent.GoodsReceiptNumber,
                key["ItemCode"]])
                .subscribe(dataLines => {
                  thisComponent.looseArr = dataLines;
                  devru.resolve(dataLines);
                });
              return devru.promise();
            },
            remove: function (key) {
              var devru = $.Deferred();
              thisComponent.httpDataService.DELETEDeviceLine(["", key["LineNo"], thisComponent.GoodsReceiptNumber])
                .subscribe(dataStatus => {
                  if (dataStatus == 0) {
                    devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
                  } else {
                    devru.resolve(dataStatus);
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
        this.GoodsReceiptNumber,
        UtilsForGlobalData.getUserId(),
        this.GRHeader["DocumentDate"]]).subscribe(dataStatus => {
          if (dataStatus[0] != 'MOVED') {
            this.toastr.error("Confirm Failed! with Error Status Code :" + dataStatus[0], "Failed");
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


  onTabChange(event: NgbTabChangeEvent) {
    if (!this.isLinesExist) {
      event.preventDefault();
      this.toastr.warning("Please Select The Location Code and Sales Order for the Lines");
    }
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetailsPopup = true;
    this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data,
      ["InvoicedQuantity", "ReceivedQuantity", "ReceivedQuantity", "ReceiveingQuantity"]);
  }

  getBuyFromVendorDetail() {
    this.httpDataService.getVendorDetailPerVendor(["",
      this.GRHeader["Code"]]).subscribe(dataVendor => {
        this.vendorDeatilsPerVendor = dataVendor[0];
        this.globalVendorDetailsPopup = true;
      });
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
    rightStartCol1: 420,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    startXDetails: 95,
    startXcol3: 400,
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, columHeader2, title) {

    printHeader.BaseTotalQty = 0;
    printHeader.POTotalQty = 0;
    printHeader.ReceivedTotalQty = 0;
    printHeader.VATID = printHeader.VATID == null ? '' : printHeader.VATID;

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyinBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyinPOUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ReceiveingQuantity);
      printLines[i].QtyinBaseUOM = this.formatNumber(printLines[i].QtyinBaseUOM);
      printLines[i].QtyinPOUOM = this.formatNumber(printLines[i].QtyinPOUOM);
      printLines[i].ReceiveingQuantity = this.formatNumber(printLines[i].ReceiveingQuantity);
    }

    const doc = new jsPDF('p', 'pt', 'a4'); //'p', 'pt' {filters: ['ASCIIHexEncode']}

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY + 5);
    doc.line(40, tempY += this.pdfFormate.NormalSpacing, 560, tempY);

    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50);
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Tax ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.startXcol3, tempY += this.pdfFormate.NormalSpacing);

    //tempY += (this.pdfFormate.NormalSpacing);


    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM ", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT ", { align: "left" }, this.pdfFormate.startXcol3, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.Code, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Location Code  : " + printHeader.LocationCode, { align: "left" }, this.pdfFormate.startXcol3, tempY);

    //doc.textAlign("" + printHeader.Address, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    var splitTitle = doc.splitTextToSize(printHeader.Address, 200);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    }
    doc.textAlign("SU CODE         : " + printHeader.DefReceiveStorage, { align: "left" }, this.pdfFormate.startXcol3, tempY);

   // doc.textAlign("" + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
   var splitTitle = doc.splitTextToSize(printHeader.Address2, 200);
    for (var i = 0; i < splitTitle.length; i++) {
      doc.textAlign("" + splitTitle[i], { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    } 
   doc.textAlign("Handled By      : " + printHeader.HandledBy, { align: "left" }, this.pdfFormate.startXcol3, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.City + " " + printHeader.PostCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Tax ID: " + this.ReceiveDetail.VATID, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    //-------Customer Info Billing---------------------
    var startBilling = this.pdfFormate.startY;
    tempY += 25;


    // columnStyles: {
    //   id: {fillColor: 255}
    // },

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

    doc.autoTable(columHeader2, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'left'
      },
      columnStyles: {
        ItemCode: {
          halign: 'left'
        },
        Description: {
          halign: 'left'
        },
        BaseUOM: {
          halign: 'right'
        },
        QtyinBaseUOM: {
          halign: 'right'
        },
        POUOM: {
          halign: 'right'
        },
        QtyinPOUOM: {
          halign: 'right'
        },
        ReceiveingQuantity: {
          halign: 'right'
        }
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

    startY += this.pdfFormate.NormalSpacing;
    doc.line(40, startY, 560, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("External Doc. No:" + printHeader.RefDocNo, { align: "left" }, this.pdfFormate.startX, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.O. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL RECEIVE QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(40, startY, 560, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 60, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By     ", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.textAlign("____/____/____", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("____/____/____", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("GoodsReceipt" + this.GoodsReceiptNumber + ".pdf");
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
