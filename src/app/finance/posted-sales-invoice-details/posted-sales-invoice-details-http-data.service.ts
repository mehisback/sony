import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 29-07-2019
  * sends the POST request
  */

@Injectable({
  providedIn: 'root'
})
export class PostedSalesInvoiceDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getSaleInvoiceHeader(parameter): any {
    return this.dataFromService.getServerData("PostedSaleInvoiceHeader", "getSaleInvoiceHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getSaleInvoiceLines(parameter): any {
    return this.dataFromService.getServerData("PostedSaleInvoiceHeader", "getSaleInvoiceLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getHSNSummaryLines(parameter): any {
    return this.dataFromService.getServerData("PostedSaleInvoiceHeader", "getHSNSummaryLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  alertListener2(parameter): any {
    return this.dataFromService.getServerData("PostedSaleInvoiceHeader", "alertListener2", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAllReportsSetup(parameter): any {
    return this.dataFromService.getServerData("reportssetup", "getAllReportsSetup", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
