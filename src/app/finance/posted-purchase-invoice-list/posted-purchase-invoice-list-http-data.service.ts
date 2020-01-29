import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 31-08-2019
  * sends the POST request
  */

export class PostedPurchaseInvoiceListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPurchaseInvoices(parameter): any {
    return this.dataFromService.getServerData("PostedpurchInvoiceList", "getAllPurchaseInvoices", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
