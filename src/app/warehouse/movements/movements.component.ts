import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import * as events from "devextreme/events";
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { MovementsHttpDataService } from './movements-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var itemListArray: any = [];

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;
  @ViewChild("datagridforitems") datagridforitems: DxDataGridComponent;

  movementHeader: [];
  MovementNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('MovementNumber');
  duplicateMovementHeader: string[];
  LocationCodeSuggestions: any = {};
  ItemCodeSuggestions: any = {};
  SUCodeSuggestions: any = {};
  itemArray: any = {};
  dataSource: any = {};
  printLines: any;
  allowAdding: boolean = false;
  isFromStorageUnitCode: boolean = false;
  MovementOperations: any = ['Print', 'Post'];
  companyHeader: any = {};
  columns1 = function () {
    return [
      { title: "SNo", dataKey: "SnNo", width: 90 },
      { title: "ItemCode", dataKey: "ItemCode", width: 40 },
      { title: "Description", dataKey: "Description", width: 40 },
      { title: "FromStorageUnitCode", dataKey: "FromStorageUnitCode", width: 40 },
      { title: "ToStorageUnitCode", dataKey: "ToStorageUnitCode", width: 40 },
      { title: "Quantity", dataKey: "Quantity", width: 40 }
    ];
  }
  stockQuantity: any;
  StockAvailable: Number = 0;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalLocationLookupPopup: boolean = false;
  isLinesExist: boolean = false;
  typeOfLocation: String = '';

  constructor(
    private httpDataService: MovementsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "Description", "BaseUOM", "Quantity", "FromStorageUnitcode", "ToStorageUnitCode", "LotNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchMovementHeader();
        thisComponent.httpDataService.getMovementLines(["",
          thisComponent.MovementNumber]).subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.printLines = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.WMSDeleteMovLotLine(["",
          thisComponent.MovementNumber,
          key["LotNo"],
          key["LineNo"]]).subscribe(data => {
            if (data == 'DONE') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines " + key["ItemCode"] + " with LotNo: " + key["LotNo"] + ", Error Status Code is " + data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var fromArr: {} = thisComponent.movementHeader["FromStorageUnitCode"].split('-');
        var toArr: {} = thisComponent.movementHeader["ToStorageUnitCode"].split('-');
        var devru = $.Deferred();
        if (values["ItemCode"]) {
          thisComponent.httpDataService.getUnitsonLine(["",
            thisComponent.movementHeader["FromStorageUnitCode"],
            values["ItemCode"]]).subscribe((validationResult) => {
              for (var index = 0; index < itemListArray.length; ++index) {
                if (itemListArray[index].ItemCode == values["ItemCode"] && itemListArray[index].LotNumber == values["LotNo"]) {
                  thisComponent.StockAvailable = itemListArray[index].Stock;
                  var NoOfQty: Number = (Number(thisComponent.StockAvailable) - Number(validationResult[0]["qtyonLines"]))
                  if (Number(values["Quantity"]) <= NoOfQty) {
                    NoOfQty = values["Quantity"];
                    if (NoOfQty > 0) {
                      thisComponent.httpDataService.INSERTLine(["",
                        thisComponent.MovementNumber,
                        values["ItemCode"],
                        values["LotNo"],
                        values["BaseUOM"],
                        NoOfQty,
                        values["ExpiryDate"],
                        values["OriginDate"],
                        UtilsForGlobalData.getUserId()]).subscribe(dataStatus => {
                          if (dataStatus[0] == 'DONE') {
                            devru.resolve(dataStatus);
                          } else {
                            devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + dataStatus[0]);
                          }
                        });
                    } else {
                      devru.reject("Quantity is Less/Equal to Zero!, Quantity Cannot be Replaced");
                    }
                  } else {
                    devru.reject("Quantity is Greater than Stock Avalable( " + parseFloat(validationResult[0]["qtyonLines"]).toFixed(2) + " )!, Quantity Cannot be Replaced");
                  }
                  break;
                }
              }
            });
        } else {
          devru.reject("Select the Item Code!!!");
        }
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(companyData => {
      this.companyHeader = companyData[0];
    });

    this.httpDataService.AllLocation([""]).subscribe(dataLines => {
      this.LocationCodeSuggestions = new DataSource({
        store: <String[]>dataLines,
        paginate: true,
        pageSize: 10
      });
    });

    this.itemArray = new CustomStore({
      key: ["ItemCode", "LotNumber"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.movementHeader ? thisComponent.movementHeader["FromStorageUnitCode"] : false) {
          thisComponent.httpDataService.getItemLotAvailablityForMov(["",
            thisComponent.movementHeader["DocumentDate"],
            thisComponent.movementHeader["FromStorageUnitCode"]]).subscribe(dataLines => {
              itemListArray = dataLines;
              devru.resolve(dataLines);
            });
        } else {
          devru.resolve();
        }
        return devru.promise();
      }
    });


  }


  setQuantityValueItemCode(newData, value, currentData): void {
    value = value != null ? value : 1;
    value = value != 0 ? value : 1;
    (<any>this).defaultSetCellValue(newData, value);
  }


  onRowInserting(event) {
    var unitsAlreadySelected: any = 0;
    let result = this.httpDataService.getUnitsonLine(["",
      this.movementHeader["FromStorageUnitCode"], event.data.ItemCode]).toPromise();
    event.cancel = new Promise((resolve, reject) => {
      result.then((validationResult) => {
        for (var index = 0; index < itemListArray.length; ++index) {
          if (itemListArray[index].ItemCode == event.data.ItemCode) {
            this.StockAvailable = itemListArray[index].Quantity;
            if (Number(event.data.Quantity) >= (Number(this.StockAvailable) - Number(validationResult[0]["qtyonLines"]))) {
              resolve();
              //this.toastr.warning("Quantity is Greater than Stock Avalable!", "Quantity is Not Available");
            }
            else {
              resolve();
            }
            break;
          }
        }
      })
    });
  }




  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForLocListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  formateForSUListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "BaseUOM", "Quantity", "LotNo");
  }

  hoverLocList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  hoverSUList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  locLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  suLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  suggestionFormateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }
  suggestionFormateForSUCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  fetchMovementHeader() {
    this.httpDataService.getMovement(["",
      this.MovementNumber]).subscribe(dataHeader => {
        this.assignToDuplicate(dataHeader);
        this.movementHeader = dataHeader[0];
        if (this.movementHeader["FromLocationCode"]) {
          if (this.movementHeader["FromStorageUnitCode"]) {
            this.isFromStorageUnitCode = true;
            if (this.movementHeader["ToStorageUnitCode"]) {
              this.datagridforitems.instance.refresh();
            } else {
              this.allowAdding = false;
            }
          } else {
            this.isFromStorageUnitCode = false;
            this.allowAdding = false;
          }
          this.httpDataService.LocationStorageUnit(['',
            this.movementHeader["FromLocationCode"]]).subscribe(gotSUList => {
              this.SUCodeSuggestions = gotSUList;
            });
        } else {
          this.allowAdding = false;
        }
      });
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateMovementHeader[0][e.dataField] != e.value) {
      if (e.dataField == 'Reason' || e.dataField == 'DocumentDate') {
        this.httpDataService.UPDATEHeader(['',
          e.dataField, e.value,
          this.MovementNumber]).subscribe(addLocCode => {
            this.errorHandlingToasterForUPDATE(addLocCode);
          });
      }
    }
  }

  onLocationCodeChanged(event) {
    if (this.movementHeader['FromLocationCode'] != event.value) {
      this.httpDataService.UPDATEHeader(['',
        'FromLocationCode', event.value,
        this.MovementNumber]).subscribe(addLocCode => {
          this.errorHandlingToasterForUPDATE(addLocCode);
        });
    }
  }


  onSUCodeChanged(event) {
    if (this.movementHeader["FromStorageUnitCode"] != event.value) {
      this.httpDataService.UPDATEHeader(['',
        'FromStorageUnitCode', event.value,
        this.MovementNumber]).subscribe(addLocCode => {
          this.errorHandlingToasterForUPDATE(addLocCode);
        });
    }
  }


  onToSUCodeChanged(event) {
    //if (this.movementHeader["FromStorageUnitCode"] != null) {
    if (this.movementHeader["ToStorageUnitCode"] != event.value) {
      if (this.movementHeader["FromStorageUnitCode"] == event.value) {
        this.movementHeader["ToStorageUnitCode"] = '';
        this.toastr.error("From and TO Storage Units Can't be Same");
      } else {
        this.httpDataService.UPDATEHeader(['',
          'ToStorageUnitCode', event.value,
          this.MovementNumber]).subscribe(addLocCode => {
            this.errorHandlingToasterForUPDATE(addLocCode);
          });
      }
    }
    /* } else {
      this.movementHeader["ToStorageUnitCode"] = '';
      this.toastr.error("Select the From StorageUnitCode");
    }*/
  }

  assignToDuplicate(data) {
    this.duplicateMovementHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateMovementHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateMovementHeader[i][prop] = data[i][prop];
      }
    }
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
    this.httpDataService.getItemLotAvailablityForMov(["",
      this.movementHeader["FromStorageUnitCode"]]).subscribe(dataLines => {
        if (dataLines[0] == 'DONE') {
          itemListArray = dataLines[1];
          this.itemArray = dataLines[1];
        }
      });
  }

  onUserRowSelect(event, type) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "BaseUOM", event.data.UOM);
    this.gridContainer.instance.on("initNewRow", e => {
      e.data.ItemCode = event.data.ItemCode;
      e.data.Description = event.data.Description;
      e.data.BaseUOM = event.data.UOM;
      e.data.Quantity = event.data.Stock;
      e.data.LotNo = event.data.LotNumber;
      e.data.ExpiryDate = event.data.ExpiryDate;
      e.data.OriginDate = event.data.OriginDate;
      e.data.ExpiryHours = event.data.ExpiryHours;
    });
    this.gridContainer.instance.addRow();
  }

  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
  }

  MovementOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.movementHeader, this.printLines, this.columns1, "Movement");
      } else {
        this.toastr.warning("Please Add the Item to the Movement Lines!");
      }
    }
    else {
      if (this.isLinesExist) {
        this.httpDataService.Post_WmsMovementByLot(['',
          this.MovementNumber,
          UtilsForGlobalData.getUserId()]).subscribe(postData => {
            if (postData[0] == 'DONE') {
              this.toastr.success("Movement " + this.MovementNumber + " is successfully Posted and Archived", "Posted");
              this.router.navigate(['/warehouse/movement-list']);
            } else {
              this.toastr.error("Posting Failed! with Error status Code :" + postData[0], "Try again");
            }
          });
      } else {
        this.toastr.warning("Please Add the Item to the Movement Lines!");
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
    if (dataStatus >= 0) {
      this.fetchMovementHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
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
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, columHeader, title) {

    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
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

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address2 + "," + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document No  " + printHeader.DocumentNo, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Movements in Location  " + printHeader.FromLocationCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);



    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document Date  " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns1(), this.printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
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
    var startY = doc.autoTable.previous.finalY + 30;
    startY = this.calculateThePage(startY, doc);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 60, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Approved By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Delivered By", { align: "center" }, this.pdfFormate.rightStartCol1, startY);
    doc.textAlign("Received By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("PickOrder" + this.MovementNumber + ".pdf");
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
