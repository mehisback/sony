import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 24-07-2019
  * sends the POST request
  */


export class SalesorderListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllSalesOrder(parameter): any {
    return this.dataFromService.getServerData("SOList", "getAllSalesOrder", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
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

  // getCustomerList(parameter): any {
  //   return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
  //     .map(getCustomer => {
  //       return getCustomer;
  //     });
  // }

  // getAllSetup(parameter): any {
  //   return this.dataFromService.getServerData("ecommerceSetup", "getAllSetup", parameter)
  //     .map(getCustomer => {
  //       return getCustomer;
  //     });
  // }

  // getSetup(parameter): any {
  //   return this.dataFromService.getServerData("ecommerceSetup", "getSetup", parameter)
  //     .map(getCustomer => {
  //       return getCustomer;
  //     });
  // }

  // btnImport_clickHandler() {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "btnImport_clickHandler", [""])
  //     .map(beforeImport => {
  //       return beforeImport;
  //     });
  // }

  // importJsonSample(importFileData: any) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "importJsonSample", ["",
  //     importFileData])
  //     .map(onImport => {
  //       return onImport;
  //     });
  // }

  // onImport(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "onImport", parameter)
  //     .map(afterImport => {
  //       return afterImport;
  //     });
  // }

  // INSERTItems(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "INSERTItems", parameter)
  //     .map(importJson => {
  //       return importJson;
  //     });
  // }

  // getRecords(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "getRecords", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // getRecords2(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "getRecords2", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // onGetRes(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "onGetRes", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // btnDeleteLine_clickHandler(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "btnDeleteLine_clickHandler", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // importOrdersTemp(parameter) {
  //   return this.dataFromService.getServerData("lazadaOrder", "importOrdersTemp", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // woo_listAllOrders1(parameter) {
  //   return this.dataFromService.getServerData("Woo_StandardAllInOne", "woo_listAllOrders1", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // TransferFromOrdertoSoImport(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "TransferFromOrdertoSoImport", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // btnDeleteLine_clickHandlerSOImportB(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "btnDeleteLine_clickHandlerSOImportB", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // ValidateImportedSOfromBuffer(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "ValidateImportedSOfromBuffer", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // ConvertallordersfromSOImporttoSO(parameter) {
  //   return this.dataFromService.getServerData("ImportLazadaSO", "ConvertallordersfromSOImporttoSO", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

  // updateOrdertoSOCreated(parameter) {
  //   return this.dataFromService.getServerData("Woo_StandardAllInOne", "updateOrdertoSOCreated", parameter)
  //     .map(dataStatus => {
  //       return dataStatus;
  //     });
  // }

}
