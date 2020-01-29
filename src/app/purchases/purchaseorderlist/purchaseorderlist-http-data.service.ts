import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 12-07-2019
  * sends the POST request
  */


export class PurchaseorderlistHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPurchaseOrder(parameter): any {
    return this.dataFromService.getServerData("poList", "getAllPurchaseOrder", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("poList", "createNewDocument", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getAttributeValue(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "getAttributeValue", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

}
