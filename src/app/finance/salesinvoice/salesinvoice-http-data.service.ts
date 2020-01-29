import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 29-07-2019
  * sends the POST request
  */

export class SalesinvoiceHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllSalesInvoices(parameter): any {
    return this.dataFromService.getServerData("SalesInvoiceList", "getAllSalesInvoices", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleConnectedBU(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedBU", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }
}
