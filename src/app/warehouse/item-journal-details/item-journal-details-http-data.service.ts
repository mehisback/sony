import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 09-07-2019
  * sends the POST request
  */

export class ItemJournalDetailsHttpDataService {


  constructor(private dataFromService: DataService) {
  }


  getItemMaster(date): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getUnitAverageCost", ['',date])
      .map(getItem => {
        return getItem;
      });
  }

  
  getItemMasterLookup(): any {
    return this.dataFromService.getServerData("itemLookUP", "getItemList", [''])
      .map(getItem => {
        return getItem;
      });
  }


  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getLocationList3(): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", [''])
      .map(getLocation => {
        return getLocation;
      });
  }

  getLocationList4(locationCode): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getStorageUnitCode", ['',locationCode])
      .map(getStorageUnitCode => {
        return getStorageUnitCode;
      });
  }

  getLocationList5(): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getAllStorageUnitCode", [''])
      .map(getStorageUnitCode => {
        return getStorageUnitCode;
      });
  }

  getHeader(ItemJournalCode: String): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getHeader", ["",
      ItemJournalCode]).map(dataHeader => {
        return dataHeader;
      });
  }

  getAllLines(ItemJournalCode: String): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getAllLines", ["", ItemJournalCode])
      .map(dataLines => {
        return dataLines;
      });
  }

  alertCloseHandler(ItemJournalCode: String, LineNo: String) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "alertCloseHandler", ["",
      ItemJournalCode, LineNo])
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAverageCost(ItemCode: String, type: String, date: String) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "getAverageCost", ["",
      ItemCode, type, date])
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandlerINSERT(ItemJournalCode: String, EntryType: String, RunningNo: String, Userid: String,
    ItemCode: String, Description: String, BaseUOM: String, Quantity: String, DocumentDate: String,
    Location: String, StorageCode: String, UnitCost: String, UnitAmount: String, LotNo: String) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "btnSave_clickHandlerINSERT", ["",
      ItemJournalCode, EntryType, RunningNo, Userid,
      ItemCode, Description, BaseUOM, Quantity, DocumentDate,
      Location, StorageCode, UnitCost, UnitAmount, LotNo])
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandlerModify(EntryType: String, ItemCode: String, Description: String, BaseUOM: String,
    Quantity: String, Location: String, StorageCode: String, UnitCost: String, UnitAmount: String,
    ItemJournalCode: String, LineNo: String, LotNo: String): any {
    return this.dataFromService.getServerData("wmsItemJournalCard", "btnSave_clickHandlerModify", ["",
      EntryType, ItemCode, Description, BaseUOM, Quantity, Location, StorageCode, UnitCost, UnitAmount,
      ItemJournalCode, LineNo, LotNo])
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getLotList(itemFilter: String, dateFilter: String, locFilter: String) {
    return this.dataFromService.getServerData("LotLookUpList", "getLotListForIJ", ["",
      itemFilter, dateFilter, locFilter])
      .map(dataLot => {
        return dataLot;
      });
  }

  getAllTheLotList() {
    return this.dataFromService.getServerData("LotLookUpList", "getAllTheLotList", [""])
      .map(dataLot => {
        return dataLot;
      });
  }

  createGLBufferLines(ItemJournalCode: String) {
    return this.dataFromService.getServerData("wmsItemJournalPostConfirm", "createGLBufferLines", ["",
      ItemJournalCode])
      .map(dataBufferLines => {
        return dataBufferLines;
      });
  }

  onCreateGLBuffResultSet(ItemJournalCode: String) {
    return this.dataFromService.getServerData("wmsItemJournalPostConfirm", "onCreateGLBuffResultSet", ["",
      ItemJournalCode])
      .map(dataBuffer => {
        return dataBuffer;
      });
  }

  btnPost_clickHandler(ItemJournalCode: String) {
    return this.dataFromService.getServerData("wmsItemJournalPostConfirm", "btnPost_clickHandler", ["",
      ItemJournalCode])
      .map(onPostingAccountValidatation => {
        return onPostingAccountValidatation;
      });
  }

  onPostingAccountValidatation(ItemJournalCode: String, Userid: String) {
    return this.dataFromService.getServerData("wmsItemJournalPostConfirm", "onPostingAccountValidatation", ["",
      ItemJournalCode, Userid])
      .map(onPostingAccount => {
        return onPostingAccount;
      });
  }

  btnImportClicked(Userid: String) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "btnImportClicked", ["",
      Userid])
      .map(beforeImport => {
        return beforeImport;
      });
  }

  importJsonSample(importFileData: any) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "importJsonSample", ["",
      importFileData])
      .map(onImport => {
        return onImport;
      });
  }

  onImport(ItemJournalCode: String) {
    return this.dataFromService.getServerData("wmsItemJournalCard", "onImport", ["",
    ItemJournalCode])
      .map(afterImport => {
        return afterImport;
      });
  }

  btnImport_clickHandler() {
    return this.dataFromService.getServerData("WmsItemJounralImportBuffer", "btnImport_clickHandler", [""])
      .map(btnImport => {
        return btnImport;
      });
  }

  INSERTItems(ItemJournalCode: String) {
    return this.dataFromService.getServerData("WmsItemJounralImportBuffer", "INSERTItems", ["",
    ItemJournalCode])
      .map(importJson => {
        return importJson;
      });
  }

  getItemDetail(ItemCode: String) {
    return this.dataFromService.getServerData("itemJournalItemDetails", "getItemDetail", ["",
    ItemCode])
      .map(item => {
        return item;
      });
  }

  getRecords(parameter) {
    return this.dataFromService.getServerData("WmsItemJounralImportBuffer", "getRecords", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDelete_clickHandler(parameter) {
    return this.dataFromService.getServerData("WmsItemJounralImportBuffer", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateItemLines(parameter) {
    return this.dataFromService.getServerData("WmsItemJounralImportBuffer", "updateItemLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}