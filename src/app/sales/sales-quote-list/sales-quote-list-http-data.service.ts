import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 05-09-2019
  * sends the POST request
  */


export class SalesQuoteListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllSalesOrder(parameter): any {
    return this.dataFromService.getServerData("SalesQuoteList", "getAllSalesOrder", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SalesQuoteList", "createNewDocument", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getAttributeValue(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "getAttributeValue", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("SalesQuoteList", "getAllCustomerList", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  getAllSetup(parameter): any {
    return this.dataFromService.getServerData("ecommerceSetup", "getAllSetup", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  getLocationList3(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  getSetup(parameter): any {
    return this.dataFromService.getServerData("ecommerceSetup", "getSetup", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  btnImport_clickHandler() {
    return this.dataFromService.getServerData("ImportSalesQuotes", "btnImport_clickHandler", [""])
      .map(beforeImport => {
        return beforeImport;
      });
  }

  importJsonSample(importFileData: any) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "importJsonSample", ["",
      importFileData])
      .map(onImport => {
        return onImport;
      });
  }

  onImport(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "onImport", parameter)
      .map(afterImport => {
        return afterImport;
      });
  }

  INSERTItems(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "INSERTItems", parameter)
      .map(importJson => {
        return importJson;
      });
  }

  getRecords(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "getRecords", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getRecords2(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "getRecords2", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onGetRes(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "onGetRes", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeleteLine_clickHandler(parameter) {
    return this.dataFromService.getServerData("ImportSalesQuotes", "btnDeleteLine_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


}
