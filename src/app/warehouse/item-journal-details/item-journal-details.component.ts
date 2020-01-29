import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxDataGridComponent,
  DxFormComponent,
} from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import 'devextreme/data/odata/store';
var itemListArray: any = [];
var jsPDF = require('jspdf');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
let variable = require('../../../assets/js/rhbusfont.json');
require('jspdf-autotable');
import CustomStore from 'devextreme/data/custom_store';
import * as XLSX from 'xlsx';
import { MatStepper } from '@angular/material';
import * as events from "devextreme/events";
import { ItemJournalDetailsHttpDataService } from './item-journal-details-http-data.service';
var XLSXSample = require('xlsx');
var itemListArray: any = [];
var LocationArray: any = [];
var LotNumberArray: any = [];

/* @Author Ganesh
/* this is For Item Journal
/* On 13-03-2019
*/

@Component({
  selector: 'app-item-journal-details',
  templateUrl: './item-journal-details.component.html',
  styleUrls: ['./item-journal-details.component.css']
})

export class ItemJournalDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("stepper") stepper: MatStepper;

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];


  IJHeader: {};
  dataSource: any = {};
  ItemJournalCode: string = UtilsForGlobalData.retrieveLocalStorageKey('ItemJournalCode');
  PRFlowResult: boolean = true;
  printLines = null;
  printHeader = null;
  companyHeader = null;
  itemArray: any = [];
  receiveLocSuggestions: any = null;
  LotNoSuggestions: any = null;
  storeListSuggestions: any = null;
  ItemJournalOperations: any = ['Print Details', 'Import', 'Post'];
  EntryTypeSuggestion: any = [{ Code: 'Positive' }, { Code: 'Negative' }];
  pieChartData: any = [];
  barcodeValue: any = {};
  popupVisible: boolean = false;
  onCreateGLBuffResultSet: any = {};
  balanceforpost;

  importFileData: any;
  importJsonback: Object;
  importpopup: boolean = false;
  dataSourceIJ: any = {};
  isFileSelected1: boolean = false;
  isFileSelected2: boolean = false;
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  itemLookupDetailsPopup: Boolean = false;
  rowCount1: Number = 0;

  columnHeader2 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "DocumentNo", dataKey: "DocumentNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 90 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "UOM", dataKey: "BaseUOM", width: 40 },
    { title: "Cost", dataKey: "UnitCost", width: 40 },
    { title: "Quantity", dataKey: "Quantity", width: 40 },
    { title: "Amount", dataKey: "UnitAmount", width: 40 }
  ];

  isDivVisible: boolean = false;
  receiveStorageLocSuggestions: { paginate: boolean; pageSize: number; loadMode: string; load: () => String[]; };
  globalItemLookupPopup: boolean = false;
  ItemLookupSelectedItemCode: any;
  isLinesExist: Boolean = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: ItemJournalDetailsHttpDataService) {
    this.setEntryType = this.setEntryType.bind(this);
    this.setBaseUOMValueItemCode = this.setBaseUOMValueItemCode.bind(this);
    this.setLocationCode = this.setLocationCode.bind(this);
    this.setLotNumber = this.setLotNumber.bind(this);
  }

  ngOnInit() {
    var thisComponent = this;

    this.httpDataService.getItemMaster(UtilsForGlobalData.getCurrentDate()).subscribe(callData3 => {
      this.itemArray = <String[]>callData3;
      itemListArray = callData3;
    });


    this.dataSource.store = new CustomStore({
      key: ["LineNo", "EntryType", "Description", "BaseUOM", "UnitCost", "Quantity", "ItemCode", "UnitAmount", "Location", "StorageCode", "DocumentNo", "DocumentDate", "getAvgCost", "LotNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.setTheSettingStatus();
        thisComponent.httpDataService.getAllLines(thisComponent.ItemJournalCode).subscribe(dataLines => {
          if (Object.keys(dataLines).length > 0) {
            thisComponent.isLinesExist = true;
          } else {
            thisComponent.isLinesExist = false;
          }
          thisComponent.printLines = dataLines;
          devru.resolve(dataLines);
        });
        thisComponent.httpDataService.getLocationList5().subscribe(getLocation => {
          thisComponent.receiveStorageLocSuggestions = {
            paginate: true,
            pageSize: 20,
            loadMode: "raw",
            load: () =>
              <String[]>getLocation
          }
        });
        thisComponent.httpDataService.getAllTheLotList().subscribe(dataLot => {
          thisComponent.LotNoSuggestions = {
            paginate: true,
            pageSize: 20,
            loadMode: "raw",
            load: () =>
              <String[]>dataLot
          }
          LotNumberArray = dataLot;
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.alertCloseHandler(thisComponent.ItemJournalCode, key["LineNo"]).subscribe(dataStatus => {
          if (dataStatus > 0) {
            devru.resolve(dataStatus);
          } else {
            devru.reject("Error while DEleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ER");
          }
        });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["EntryType"] ? values["ItemCode"] ? values["Location"] ? true : false : false : false) {
          thisComponent.httpDataService.getAverageCost(values["ItemCode"],
            'No', UtilsForGlobalData.getCurrentDate()).subscribe(dataCost => {
              for (var index = 0; index < itemListArray.length; ++index) {
                if (itemListArray[index].ItemCode == values["ItemCode"]) {
                  if (itemListArray[index].UnitCostAVG == values["UnitCost"]) {
                    //values["UnitCost"] = dataCost[0].UnitCost;
                  }
                  break;
                }
              }
              if (values["EntryType"] == 'Negative') {
                if (Math.sign(values["Quantity"]) == 1) {
                  values["Quantity"] = - values["Quantity"];
                } else {
                  values["Quantity"] = values["Quantity"];
                }
              }
              else {
                if (Math.sign(values["Quantity"]) == 1) {
                  values["Quantity"] = values["Quantity"];
                } else {
                  values["Quantity"] = - values["Quantity"];
                }
              }
              if (values["EntryType"] == 'Negative' ? values["LotNo"] ? values["LotNo"] != '' ? true : false : false : true) {
                values["UnitAmount"] = Number(Number(values["UnitCost"]) * Number(values["Quantity"]));
                thisComponent.httpDataService.btnSave_clickHandlerINSERT(thisComponent.ItemJournalCode,
                  values["EntryType"],
                  thisComponent.ItemJournalCode + thisComponent.IJHeader["RunningNo"],
                  UtilsForGlobalData.getUserId(),
                  values["ItemCode"],
                  values["Description"],
                  values["BaseUOM"],
                  values["Quantity"],
                  thisComponent.IJHeader["DocumentDate"],
                  values["Location"],
                  values["StorageCode"],
                  values["UnitCost"],
                  values["UnitAmount"],
                  values["LotNo"]).subscribe(dataStatus => {
                    if (dataStatus > 0) {
                      devru.resolve(dataStatus);
                    } else {
                      devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is INSERT-ERR");
                    }
                  });
              } else {
                thisComponent.toastr.warning("Please Select the Lot Number!");
                devru.resolve();
              }
            });
        } else {
          thisComponent.toastr.warning("Failed to Insert!! Please Select the All the Fields!");
          devru.resolve();
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnSave_clickHandlerModify(
          getUpdateValues(key, newValues, "EntryType"),
          getUpdateValues(key, newValues, "ItemCode"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "BaseUOM"),
          getUpdateValues(key, newValues, "Quantity"),
          getUpdateValues(key, newValues, "Location"),
          getUpdateValues(key, newValues, "StorageCode"),
          getUpdateValues(key, newValues, "UnitCost"),
          getUpdateValues(key, newValues, "UnitAmount"),
          thisComponent.ItemJournalCode,
          getUpdateValues(key, newValues, "LineNo"),
          getUpdateValues(key, newValues, "LotNo") ? key.LotNo : getUpdateValues(key, newValues, "LotNo"))
          .subscribe(dataStatus => {
            if (dataStatus >= 0) {
              devru.resolve();
            } else {
              devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(getCompany => {
      this.companyHeader = getCompany[0];
    });

    this.httpDataService.getLocationList3().subscribe(getLocation => {
      this.receiveLocSuggestions = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>getLocation
      }
      LocationArray = getLocation;
    });


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.dataSourceIJ.store = new CustomStore({
      key: ["Line"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount1 = 0;
        thisComponent.httpDataService.getRecords([""]).subscribe(data => {
          thisComponent.isFileSelected1 = true;
          if (thisComponent.isFileSelected2) {
            for (var i = 0; i < Object.keys(data).length; i++) {
              if (data[i].BatchID == null) {
                data[i].BatchID = "ITEMNOTEXISTS";
                thisComponent.isFileSelected1 = false;
              }
            }
            thisComponent.rowCount1 = Object.keys(data).length;
            devru.resolve(data);
          } else
            devru.resolve();
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.btnDelete_clickHandler(["", key["Line"]])
          .subscribe(data => {
            if (data < 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateItemLines(["",
          Object.keys(newValues)[0],
          newValues[Object.keys(newValues)[0]],
          key["Line"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines : " + Object.keys(newValues)[0] + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });
  }

  valuechange(event) {
    console.log(event);
  }

  ngAfterViewInit() {
  }

  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }
  suggestionFormateForStorageLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "StorageCode");
  }


  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormateForLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  hoverFormateForStorageLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "StorageCode");
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "ItemCode", "Description");
  }

  suggestionFormateForLotNo(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LotNo");
  }

  hoverFormateForLotNo(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LotNo", "Stock");
  }

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", true);
    this.gridContainer.instance.columnOption("Details", "visible", false);
    if (event.data.LotNo) {
      event.data.LotNo != "" ? this.gridContainer.instance.columnOption("LotNo", "visible", true) : '';
    }
    if (event.data.EntryType) {
      this.gridContainer.instance.columnOption("EntryType", "allowEditing", false);
      if (event.data.EntryType == 'Negative') {
        this.LotNumberHandler(event.data.ItemCode, this.IJHeader["DocumentDate"], event.data.Location)
      }
    } else {
      this.gridContainer.instance.columnOption("EntryType", "allowEditing", true);
    }
  }

  onRowInserted(event) {
    this.gridContainer.instance.columnOption("Lookup", "visible", false);
    this.gridContainer.instance.columnOption("Details", "visible", true);
    this.gridContainer.instance.columnOption("LotNo", "visible", false);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.command == "edit") {
      let cellElement = e.cellElement,
        cancelLink = cellElement.querySelector(".dx-link-cancel"),
        saveLink = cellElement.querySelector(".dx-link-save");
      //events.off(editLink);
      events.on(cancelLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
        this.gridContainer.instance.columnOption("LotNo", "visible", false);
        this.gridContainer.instance.refresh();
      });
      events.on(saveLink, "dxclick", (args) => {
        this.gridContainer.instance.columnOption("Lookup", "visible", false);
        this.gridContainer.instance.columnOption("Details", "visible", true);
        this.gridContainer.instance.columnOption("LotNo", "visible", false);
      });
    }
  };

  rowIndex: number = 0;

  ItemLookupvalueChanged(data) {
    this.rowIndex = data.rowIndex;
    this.globalItemLookupPopup = true;
  }

  popupButtonClicked(event) {
    UtilsForGlobalData.setLocalStorageKey('ItemCode', event.key["ItemCode"]);
  }

  onUserRowSelect(event) {
    this.globalItemLookupPopup = false;
    this.gridContainer.instance.cellValue(this.rowIndex, "BaseUOM", event.data.BaseUOM);
    this.gridContainer.instance.cellValue(this.rowIndex, "ItemCode", event.data.ItemCode);
    /* var EntryType = this.gridContainer.instance.cellValue(this.rowIndex, "EntryType");
    var Location = this.gridContainer.instance.cellValue(this.rowIndex, "Location");
    var StorageCode = this.gridContainer.instance.cellValue(this.rowIndex, "StorageCode");
    this.gridContainer.instance.on("initNewRow", e => {
      e.data.ItemCode = event.data.ItemCode;
      e.data.EntryType = EntryType;
      e.data.Location = Location;
      e.data.StorageCode = StorageCode;
      for (var index = 0; index < itemListArray.length; ++index) {
        if (itemListArray[index].ItemCode == e.data.ItemCode) {
          e.data.BaseUOM = itemListArray[index].PurchUOM;
          e.data.Description = itemListArray[index].Description;
          e.data.UnitCost = itemListArray[index].UnitCostAVG;
          e.data.Quantity = '1';
          e.data.UnitAmount = (e.data.UnitCost * e.data.Quantity);
          break;
        }
      } 
    });
    this.gridContainer.instance.addRow();*/
  }

  setLocationCode(newData, value, currentData): void {
    for (var index = 0; index < LocationArray.length; ++index) {
      if (LocationArray[index].LocationCode == value) {
        this.httpDataService.getLocationList4(LocationArray[index].LocationCode).subscribe(getLocation => {
          this.receiveStorageLocSuggestions = {
            paginate: true,
            pageSize: 20,
            loadMode: "raw",
            load: () =>
              <String[]>getLocation
          }
        });
        newData.StorageCode = LocationArray[index].DefStoreageUnit;
        newData.Location = LocationArray[index].LocationCode;
        break;
      }
    }
    this.LotNumberHandler(currentData.ItemCode, currentData.DocumentDate, value);
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    this.LotNumberHandler(value, currentData.DocumentDate, currentData.Location);
    for (var index = 0; index < itemListArray.length; ++index) {
      if (itemListArray[index].ItemCode == value && itemListArray[index].BaseUOM == currentData.BaseUOM) {
        newData.ItemCode = itemListArray[index].ItemCode;
        newData.Description = itemListArray[index].Description;
        newData.UnitCost = itemListArray[index].UnitCostAVG;
        newData.Quantity = '1';
        newData.UnitAmount = (newData.UnitCost * newData.Quantity);
        /* this.httpDataService.getAverageCost(value,
          'No', UtilsForGlobalData.getCurrentDate()).subscribe(dataCost => {
            newData.UnitCost = dataCost[0].UnitCost;
            newData.Quantity = '1';
            currentData.Quantity = '1';
            newData.UnitAmount = (newData.UnitCost * newData.Quantity);
            if (currentData.EntryType == 'Negative') {
              newData.Quantity = - newData.Quantity;
              newData.UnitAmount = - newData.UnitAmount;
            }
          }); */
        break;
      }
    }
  }

  setPriceValue(newData, value, currentData): void {
    value = value != null ? value : '0';
    if (currentData.EntryType == 'Negative') {
      if (Math.sign(currentData.Quantity) == 1) {
        currentData.Quantity = -currentData.Quantity;
      } else {
        currentData.Quantity = currentData.Quantity;
      }
    }
    if (currentData.Quantity != null) {
      newData.UnitAmount = (value * currentData.Quantity);
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setQuantityValue(newData, value, currentData): void {
    value = value != null ? value == 0 ? 0.1 : value : 1;
    if (currentData.EntryType == 'Negative') {
      if (Math.sign(value) == 1) {
        value = -value;
      } else {
        value = value
      }
    } else {
      if (Math.sign(value) == 1) {
        value = value;
      } else {
        value = - value;
      }
    }
    if (currentData.UnitCost != null) {
      newData.UnitAmount = (value * currentData.UnitCost);
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  setEntryType(newData, value, currentData): void {
    newData.EntryType = value;
    if (value == 'Negative') {
      this.LotNumberHandler(currentData.ItemCode, currentData.DocumentDate, currentData.Location)
      this.gridContainer.instance.columnOption("LotNo", "visible", true);
    } else {
      this.gridContainer.instance.columnOption("LotNo", "visible", false);
    }
  }

  setLotNumber(newData, value, currentData): void {
    var LotNumber = '';
    var qty = 1;
    if (currentData.EntryType == 'Negative') {
      if (Math.sign(currentData.Quantity) == 1) {
        qty = currentData.Quantity;
      } else {
        qty = - currentData.Quantity;
      }
    }
    for (var index = 0; index < Object.keys(LotNumberArray).length; ++index) {
      if (LotNumberArray[index].LotNo == value) {
        if (Number(qty) <= Number(LotNumberArray[index].Stock)) {
          LotNumber = value;
        } else {
          this.toastr.warning("Stock Is not sufficent in this Lot");
        }
        break;
      }
    }
    newData.LotNo = LotNumber;
  }

  LotNumberHandler(itemFilter, dateFilter, locFilter) {
    itemFilter = itemFilter ? itemFilter : '';
    dateFilter = dateFilter ? dateFilter : this.IJHeader["DocumentDate"],
      locFilter = locFilter ? locFilter : '';
    this.httpDataService.getLotList(itemFilter, dateFilter, locFilter).subscribe(dataLot => {
      this.LotNoSuggestions = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>dataLot
      }
      LotNumberArray = dataLot;
    });
  }

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

  ItemJournalOperationsGo(userOption) {
    if (userOption == '') {
      this.toastr.error("Please Select The Operation");
    } else if (userOption == 'Print Details') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.IJHeader, this.printLines, "Item Journal");
      } else {
        this.toastr.warning("Please add The Lines!!");
      }
    } else if (userOption == 'Import') {
      if (!this.isLinesExist) {
        this.importpopup = true;
        this.isFileSelected1 = false;
        var thisComponent = this;
        setTimeout(() => {
          thisComponent.stepper.selectedIndex = 0;
        }, 10);
      } else {
        this.toastr.warning("Lines Are Already Present!!", "NOT ALLOWED");
      }
    } else if (userOption == 'Post') {
      if (this.isLinesExist) {
        this.postClick();
      } else {
        this.toastr.warning("Please add The Lines!!");
      }
    }
  }

  ItemDeatilsForPopUp(data, type) {
    if (type == 'Item') {
      this.httpDataService.getItemDetail(data.data.ItemCode).subscribe(itemDetails => {
        this.itemLookupDetailsPopup = true;
        this.itemDetails = itemDetails[0];
      });
    } else {
      this.itemDetailsPopup = true;
      this.itemDetails = UtilsForSuggestion.StandartNumberFormat(data.data, ["UnitCost", "UnitAmount", "Quantity"]);
    }
  }

  postClick() {
    this.popupVisible = true;
    this.httpDataService.createGLBufferLines(this.ItemJournalCode).subscribe(dataBufferLines => {
      if (dataBufferLines[0] == 'DONE') {
        if (Object.keys(dataBufferLines[1]).length > 0) {
          this.onCreateGLBuffResultSet = dataBufferLines[1];
          this.httpDataService.onCreateGLBuffResultSet(this.ItemJournalCode).subscribe(dataBuffer => {
            this.balanceforpost = dataBuffer[0].Balance;
          });
        }
      }
    });
  }

  PostBtn() {
    if (this.balanceforpost == '0.00000') {
      this.httpDataService.btnPost_clickHandler(this.ItemJournalCode).subscribe(onPostingAccountValidatation => {
        if (onPostingAccountValidatation != null) {
          if (onPostingAccountValidatation[0]["AccCount"] == '0') {
            this.httpDataService.onPostingAccountValidatation(this.ItemJournalCode, UtilsForGlobalData.getUserId()).subscribe(onPostingAccount => {
              if (onPostingAccount[0] == 'POSTED') {
                this.popupVisible = false;
                this.toastr.success("Item Journal " + this.ItemJournalCode + " is successfully Posted and Archived", "Posted");
                this.router.navigate(['/warehouse/item-journal-list']);
              } else {
                this.popupVisible = false;
                this.toastr.error("Posting Failed" + onPostingAccount[0]);
              }
            });
          } else {
            this.toastr.error("Account Code is Null or Not Found for " + onPostingAccountValidatation[0]["AccCount"] + "Records");
          }
        }
        else {
          this.toastr.error("Validation Failed, No Buffer Entry Found Error!");
        }
      });
    } else {
      this.toastr.error("Balance is not zero");
    }
  }

  setTheSettingStatus() {
    this.httpDataService.getHeader(this.ItemJournalCode).subscribe(dataHeader => {
      this.IJHeader = dataHeader[0];
    });
  }

  clearFile() {
    const file = document.querySelector('.selectedfile');
    file["value"] = '';
  }

  onFileChange2(evt: any) {
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
      var itemCode: String = "";
      this.importFileData = XLSXSample.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);
      for (var i = 0; i < Object.keys(this.importFileData).length; i++) {
        this.importFileData[i].DocumentDate = UtilsForGlobalData.getCurrentDate();
        this.importFileData[i].UserID = UtilsForGlobalData.getUserId();
        if (this.importFileData[i].unitcost != undefined ? this.importFileData[i].unitcost != null ? this.importFileData[i].unitcost < 0 : true : true) {
          isDone = false;
          itemCode = this.importFileData[i].Itemcode;
        }
        if (this.importFileData[i].Quantity != undefined ? this.importFileData[i].Quantity == null : true) {
          isDone = false;
          itemCode = this.importFileData[i].Itemcode;
        }
      }
      if (isDone) {
        this.isFileSelected1 = true;
        this.httpDataService.btnImportClicked(UtilsForGlobalData.getUserId())
          .subscribe(btnImportItem_clickHandler => {
            this.httpDataService.importJsonSample(this.importFileData)
              .subscribe(importJson => {
                if (importJson == true) {
                  this.httpDataService.onImport(this.ItemJournalCode)
                    .subscribe(importJson => {
                      this.gridContainer2.instance.refresh();
                      this.isFileSelected2 = true;
                      var thisComponent = this;
                      setTimeout(() => {
                        thisComponent.stepper.selectedIndex = 1;
                      }, 10);
                      if (Number(Object.keys(this.importFileData).length) - Number(importJson) == 0) {

                      } else {
                        const file = document.querySelector('.selectedfile');
                        file["value"] = '';
                        this.toastr.warning("Items are not Present the Item Table!! Please Check In Validate");
                      }
                    });
                } else {
                  const file = document.querySelector('.selectedfile');
                  file["value"] = '';
                  this.toastr.error("Invalid Line in Code:" + importJson + ", Please Check For Chars: SPECIAL/BLANK/DUP/INVALID", "INSERT-ERR");
                }
              });
          });
      } else {
        this.toastr.warning("Cannot Import, Item :" + itemCode + "  Unit Cost/ Quantity are Not Correct!!");
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  btnImport_clickHandler2() {
    if (this.isFileSelected1) {
      this.httpDataService.btnImport_clickHandler().subscribe(btnImportItem_clickHandler => {
        if (btnImportItem_clickHandler[0].NOUOMCOUNT == 0) {
          this.httpDataService.INSERTItems(this.ItemJournalCode)
            .subscribe(importJson => {
              if (importJson[0] == 'DONE') {
                if (Object.keys(importJson[1]).length == 0) {
                  const file = document.querySelector('.selectedfile');
                  file["value"] = '';
                  this.toastr.success("Insert Records Completed!.", "Success");
                  this.importpopup = false;
                  this.gridContainer.instance.refresh();
                } else {
                  this.gridContainer2.instance.refresh();
                  this.toastr.error("Insert Failed for Code : " + importJson[1][0].Itemcode + " with error " + importJson[1][0].lineStatus, "LINESTATUS");
                }
              } else {
                this.toastr.error("Insert Failed with Code : " + importJson[0]);
              }
            });
        } else {
          this.toastr.warning("There are " + btnImportItem_clickHandler[0].NOUOMCOUNT + " lines With NO Base Unit of Measure,Import Not allowed!");
        }
      });
    } else {
      this.toastr.warning("Please Check the LineStatus OR BatchID", "STATUS");
    }
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
    printHeader.TotalAmount = 0;
    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.TotalQty += Number(printLines[i].Quantity);
      printHeader.TotalAmount += Number(printLines[i].UnitAmount);
      printLines[i].Quantity = this.formatNumber(printLines[i].Quantity);
      printLines[i].UnitCost = this.formatNumber(printLines[i].UnitCost);
      printLines[i].UnitAmount = this.formatNumber(printLines[i].UnitAmount);
    }

    printHeader.TotalQty = this.formatNumber(printHeader.TotalQty);
    printHeader.TotalAmount = this.formatNumber(printHeader.TotalAmount);
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
    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 80, 50);
    doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("VAT ID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    doc.textAlign("Batch No :" + printHeader.Code, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Document Date :" + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol2, tempY += this.pdfFormate.NormalSpacing);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columnHeader2, printLines, {
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
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.TotalQty, { align: "right-align" }, rightcol2, startY);
    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("AMOUNT:", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.TotalAmount, { align: "right-align" }, rightcol2, startY);

    doc.save("ItemJournal" + this.ItemJournalCode + ".pdf");
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

