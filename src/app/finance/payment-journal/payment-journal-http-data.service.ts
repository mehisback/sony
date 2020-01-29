import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 30-07-2019
  * sends the POST request
  */

export class PaymentJournalHttpDataService {

  constructor(private dataFromService: DataService) { }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalList", "getHeaderList", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}
