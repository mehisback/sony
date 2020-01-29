import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { SalesQuoteListHttpDataService } from './sales-quote-list-http-data.service';
import * as XLSX from 'xlsx';
var XLSXSample = require('xlsx');
import * as uuid from 'uuid';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';

@Component({
  selector: 'app-sales-quote-list',
  templateUrl: './sales-quote-list.component.html',
  styleUrls: ['./sales-quote-list.component.css']
})

export class SalesQuoteListComponent {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;

  documentNumber: any;
  soListSource: any = {};
  dataAttributes: any;
  attributesPopup: boolean = false;
  rowCount1: Number = 0;
  rowCount2: Number = 0;
  APIButtonFlag: boolean = false;
  ChoosefileFlag: boolean = false;
  importData: any = {};
  importFileData: any;
  importpopup: boolean = false;
  dataSourceIJ1: any;
  dataSourceIJ2: any;
  isFileSelected1: boolean = false;
  uuID: String;
  CustSuggestions: any;
  TypeSuggestions: any;
  attributeSuggestions: any;
  locationSuggestions: any;
  chooseImportFormat = ["API", "EXCEL/CSV"];

  constructor(
    private httpDataService: SalesQuoteListHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {

    var thisComponent = this;
    this.soListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllSalesOrder(["", ""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });

    this.dataSourceIJ1 = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getRecords(["",
          thisComponent.importData.uuID]).subscribe(data => {
            if (thisComponent.isFileSelected1) {
              thisComponent.rowCount1 = Object.keys(data).length;
              devru.resolve(data);
            } else
              devru.resolve();
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDeleteLine_clickHandler(["", key["LineNo"],
          thisComponent.importData.uuID])
          .subscribe(data => {
            if (data < 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      }
    });

    this.getDate2();

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SQNumber', this.documentNumber);
    this.router.navigate(['/sales/sales-quote-details']);

  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "FlowResult") {
      if (e.value == "Approved") {
        e.cellElement.className += "color-for-column-Approved fa fa-check";
        e.cellElement.title += "Approved";
      } else if (e.value == "OPEN") {
        e.cellElement.className += " color-for-column-OPEN fa fa-square-o";
        e.cellElement.title += "OPEN";
      } else if (e.value == "SENT FOR APPROVAL") {
        e.cellElement.className += " color-for-column-SFApproval fa fa-share-square-o";
        e.cellElement.title += "SENT FOR APPROVAL";
      } else if (e.value == "Rejected") {
        e.cellElement.className += " color-for-column-Rejected fa fa-times";
        e.cellElement.title += "Rejected";
      }
    }
  }

  onCreateNewSO() {

    this.httpDataService.getAttributeValue(["", "SALESQUOTE"])
      .subscribe(dataAttribute => {
        if (Object.keys(dataAttribute).length > 0) {
          this.dataAttributes = dataAttribute;
          this.attributesPopup = true;
        } else {
          this.createDoc('');
        }
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.createDoc(event.data.AttributeValue);
  }

  createDoc(att: String) {
    this.httpDataService.createNewDocument(["", "SALESQUOTE", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('SQNumber', data[0]);
          this.toastr.success("Sales Quote Created");
          this.router.navigate(['/sales/sales-quote-details']);
        } else {
          this.toastr.error("Error While Creating the Sales Quote, Error Status Code :", data[1]);
        }
      });
  }

  getDate2() {
    this.httpDataService.getCustomerList([''])
      .subscribe(callData3 => {
        this.CustSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
    this.httpDataService.getAllSetup([''])
      .subscribe(callData3 => {
        this.TypeSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
    this.httpDataService.getAttributeValue(["", "SALESQUOTE"])
      .subscribe(callData3 => {
        this.attributeSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
    this.httpDataService.getLocationList3([''])
      .subscribe(callData3 => {
        this.locationSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 20
        });
      });
  }


  import() {
    this.importData = {};
    this.importData.uuID = uuid();
    this.importData.DocumentFromDate = new Date().setDate(new Date().getDate() - 1);
    this.importpopup = true;
    this.isFileSelected1 = false;
    this.APIButtonFlag = false;
    this.ChoosefileFlag = false;
    this.clearFile();
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "CustCode");
  }

  hoverFormatForType(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Name");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Name");
  }

  hoverFormatForAttributes(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "AttributeValue");
  }

  suggestionFormateForAttributes(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "AttributeValue");
  }

  hoverFormatForLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  onCodeChanged(event, dataField) {
    if (event.value != undefined) {
      this.importData[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'API') {
          this.APIButtonFlag = true;
          this.ChoosefileFlag = false;
        } else {
          this.APIButtonFlag = false;
          this.ChoosefileFlag = true;
        }
      } else if (dataField == 'Type') {
        this.httpDataService.getSetup(['', event.value])
          .subscribe(callData3 => {
            this.importData["LocationCode"] = callData3[0].LocationCode;
            this.importData["AttirbuteCode"] = callData3[0].AttirbuteCode;
            this.importData["CustomerCode"] = callData3[0].CustomerCode;
            this.importData["RefNo"] = callData3[0].No;
          });
      }
    }
  }

  clearFile() {
    try {
      const file = document.querySelector('.selectedfile');
      file["value"] = '';
    } catch (Error) { }
  }

  StandardValueFormat(data: any, keys: any): any {
    for (var i = 0; i < keys.length; i++) {
      if (data["" + keys[i]] == undefined || data["" + keys[i]] == null || data["" + keys[i]] == '') {
        return false;
      }
    }
    return true;
  }

  onFileChange2(evt: any) {
    if (this.importData.Type ? this.importData.CustomerCode ? this.importData.AttirbuteCode ? this.importData.LocationCode : false : false : false) {
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        var sheet_name_list = wb.SheetNames;
        var isDone: boolean = true;
        var isCode = "";
        this.importFileData = XLSXSample.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);
        if (Object.keys(this.importFileData).length == 0) {
          isDone = false;
        } else {
          isDone = true;
        }
        if (isDone) {
          if (this.importData.Type === 'LAZADA') {
            this.importFileData = this.importFileData.map(function (obj) {
              return {
                OrderItemID: obj["Order Item Id"], ThirdPartyID: obj["Lazada Id"], CrossRefCode: obj["Seller SKU"],
                ThirdPartySKU: obj["Lazada SKU"], CreatedAT: obj["Created at"], OrderNumber: obj["Order Number"],
                CustomerName: obj["Customer Name"], ShippingName: obj["Shipping Name"], ShippingAddress: obj["Shipping Address"],
                ShippingPhoneNumber: obj["Shipping Phone Number"], ShippingCity: obj["Shipping City"], ShippingPostcode: obj["Shipping Postcode"],
                ShippingCountry: obj["Shipping Country"], TaxCode: obj["Tax Code"], PaymentMethod: obj["Payment Method"],
                PaidPrice: obj["Paid Price"], UnitPrice: obj["Unit Price"], Status: obj["Status"],
                CancelReturnInitiator: obj["Cancel / Return Initiator"], Reason: obj["Reason"],
                ShippingMode: obj["Shipping Provider (first mile)"], TrackingNo: obj["Tracking Code"]
              };
            });
          } else if (this.importData.Type === 'SHOPEE') {
            this.importFileData = this.importFileData.map(function (obj) {
              return {
                OrderItemID: obj["หมายเลขคำสั่งซื้อ"], CrossRefCode: obj["เลขอ้างอิง Parent SKU"],
                CreatedAT: obj["วันที่ทำการสั่งซื้อ"], OrderNumber: obj["หมายเลขคำสั่งซื้อ"],
                CustomerName: obj["ชื่อผู้ใช้ (ผู้ซื้อ)"], ShippingName: obj["ชื่อผู้รับ"], ShippingAddress: obj["ที่อยู่ในการจัดส่ง"],
                ShippingPhoneNumber: obj["หมายเลขโทรศัพท์"], ShippingCity: obj["เขต/อำเภอ"], ShippingPostcode: obj["รหัสไปรษณีย์"],
                ShippingCountry: obj["ประเทศ"], PaymentMethod: obj["ช่องทางการชำระเงิน"],
                PaidPrice: obj["จำนวนเงินทั้งหมด"], UnitPrice: obj["ราคาขาย"], Status: obj["สถานะการสั่งซื้อ"],
                Reason: obj["หมายเหตุจากผู้ซื้อ"], Quantity: obj["จำนวน"], ShippingMode: obj["วิธีการจัดส่ง"],
                TrackingNo: obj["หมายเลขติดตามพัสดุ"]
              };
            });
          }
          for (var i = 0; i < Object.keys(this.importFileData).length; i++) {
            this.importFileData[i].BatchID = this.importData.uuID;
            this.importFileData[i].CustomerCode = this.importData.CustomerCode;
            this.importFileData[i].RefNo = this.importData.RefNo;
            this.importFileData[i].RefName = this.importData.Type;
            this.importFileData[i].SourceType = this.importData.userselected;
            this.importFileData[i].CreatedAT = UtilsForGlobalData.getCurrentDate();
            if (this.StandardValueFormat(this.importFileData[i], ["ShippingName",
              "ShippingPhoneNumber", "ShippingAddress", "ShippingCity", "ShippingPostcode",
              "ShippingCountry", "ItemCode", "Quantity"])) {
            } else {
              isCode = i + 2 + ": " + this.importFileData[i].ItemCode;
              isDone = false;
            }
          }
          if (isDone) {
            this.httpDataService.btnImport_clickHandler()
              .subscribe(btnImportItem_clickHandler => {
                this.httpDataService.importJsonSample(this.importFileData)
                  .subscribe(importJson => {
                    if (importJson == true) {
                      this.httpDataService.onImport(["", this.importData.Type, this.importData.uuID])
                        .subscribe(data => {
                          if (data[0] == 'DONE') {
                            this.importpopup = false;
                            this.isFileSelected1 = true;
                            this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
                          } else {
                            this.toastr.error("Item Validation : " + data[0]);
                          }
                        });
                    } else {
                      this.toastr.error("Invalid Line where Order Number is " + importJson + ", Please Check For Chars: SPECIAL/BLANK/DUP/INVALID");
                    }
                  });
              });
          } else {
            const file = document.querySelector('.selectedfile');
            file["value"] = '';
            this.toastr.warning("Cannot Import, Importing Data are Not Correct at Line : " + isCode);
          }
        } else {
          this.toastr.warning("Import File Does not have any Rows!");
        }
      };
      reader.readAsBinaryString(target.files[0]);
    } else {
      this.toastr.warning("Cannot Import, Please Select all the Fields!!");
    }
  }

  btnImport_clickHandler2() {
    if (this.isFileSelected1) {
      this.httpDataService.getRecords2(["",
        this.importData.uuID]).subscribe(data => {
          if (Object.keys(data).length == 0) {
            this.importData.CustomerCode = this.importData.CustomerCode ? this.importData.CustomerCode : '';
            this.httpDataService.INSERTItems(["", this.importData.uuID,
              this.importData.CustomerCode,
              this.importData.LocationCode, this.importData.AttirbuteCode,
              UtilsForGlobalData.getUserId()])
              .subscribe(importJson => {
                if (importJson[0] == 'DONE') {
                  this.httpDataService.onGetRes(["",
                    this.importData.uuID]).subscribe(data => {
                      if (Object.keys(data).length != 0) {
                        this.isFileSelected1 = false;
                        this.toastr.success("ORDERS PROCESSED TO RHBUS", "Success");
                      } else {
                        this.toastr.error("Import Failed, PLEASE CHECK DATA AND SETUP");
                      }
                    });
                } else {
                  this.toastr.error("Import Failed with Error Status Code : " + importJson[0]);
                }
                this.gridContainer ? this.gridContainer.instance.refresh() : '';
                this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
              });
          } else {
            this.toastr.warning("Please Check and Delete the Invalid Lines!!", "DUPLICATE/INVALID");
          }
        });
    } else {
      this.toastr.warning("Please Check the Line!!", "STATUS");
    }
  }

  onDeleteClicked() {
    var data = this.gridContainer2.instance.getSelectedRowKeys();
    var count = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
      this.httpDataService.btnDeleteLine_clickHandler(["", data[i]["LineNo"],
        this.importData.uuID]).subscribe(data2 => {
          count++;
          if (Number(Object.keys(data).length) == Number(count)) {
            this.gridContainer2.instance.refresh();
            this.toastr.success("Line Successfully Deleted!");
          }
        });
    }
  }

}

