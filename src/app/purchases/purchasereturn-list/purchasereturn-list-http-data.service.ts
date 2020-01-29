import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 05-08-2019
  * sends the POST request
  */


export class PurchasereturnListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPurchasereturn(parameter): any {
    return this.dataFromService.getServerData("purchaseReturnList", "getAllPurchasereturn", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("purchaseReturnList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAttributeValue(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "getAttributeValue", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }
}
