import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 16-12-2019
  * sends the POST request
  */


export class ImportFinanceTransactionHttpDataService {

  constructor(private dataFromService: DataService) { }


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
    return this.dataFromService.getServerData("ImportFinanceTransaction", "btnImport_clickHandler", [""])
      .map(beforeImport => {
        return beforeImport;
      });
  }

  btnImport_clickHandler2() {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "btnImport_clickHandler2", [""])
      .map(beforeImport => {
        return beforeImport;
      });
  }

  importJsonSample(importFileData: any) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "importJsonSample", ["",
      importFileData])
      .map(onImport => {
        return onImport;
      });
  }

  onImport(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "onImport", parameter)
      .map(afterImport => {
        return afterImport;
      });
  }

  INSERTItems(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "INSERTItems", parameter)
      .map(importJson => {
        return importJson;
      });
  }

  INSERTItems2(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "INSERTItems2", parameter)
      .map(importJson => {
        return importJson;
      });
  }

  getRecords(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "getRecords", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getRecords2(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "getRecords2", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onGetRes(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "onGetRes", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeleteLine_clickHandler(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "btnDeleteLine_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeleteLine_clickHandler2(parameter) {
    return this.dataFromService.getServerData("ImportFinanceTransaction", "btnDeleteLine_clickHandler2", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


}
