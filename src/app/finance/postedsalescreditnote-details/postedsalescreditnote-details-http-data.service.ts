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

@Injectable({
  providedIn: 'root'
})
export class PostedsalescreditnoteDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getSaleInvoiceHeader(parameter): any {
    return this.dataFromService.getServerData("PostedSalesCreditNote", "getSaleInvoiceHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getSaleInvoiceLines(parameter): any {
    return this.dataFromService.getServerData("PostedSalesCreditNote", "getSaleInvoiceLines", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

}
