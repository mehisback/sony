import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuoteListHttpDataService {

  constructor(private dataFromService: DataService) {

  }

  getAllPurchaseOrder(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuoteList", "getAllPurchaseQuote", parameter)
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
