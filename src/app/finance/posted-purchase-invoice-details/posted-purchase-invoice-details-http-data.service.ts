import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})
export class PostedPurchaseInvoiceDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }


  getPurchaseInvoiceHeader(parameter): any {
    return this.dataFromService.getServerData("PosedPurchaseInvoiceHeader", "getPurchaseInvoiceHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getPurchaseInvoiceLines(parameter): any {
    return this.dataFromService.getServerData("PosedPurchaseInvoiceHeader", "getPurchaseInvoiceLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("PosedPurchaseInvoiceHeader", "getPurchaseInvoiceLinesDiscount", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getPurchaseInvoiceLinesQuantity(parameter): any {
    return this.dataFromService.getServerData("PosedPurchaseInvoiceHeader", "getPurchaseInvoiceLinesQuantity", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

}
