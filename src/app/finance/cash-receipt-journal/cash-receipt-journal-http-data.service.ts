import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PARAMETERS } from '@angular/core/src/util/decorators';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Abhijeet
  * On 30-07-2019
  * sends the POST request
  */


export class CashReceiptJournalHttpDataService {

  constructor(private dataFromService: DataService) { }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournalLIst", "getHeaderList", parameter)
      .map(getHeaderList => {
        return getHeaderList;
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
    return this.dataFromService.getServerData("CashReceiptJournalLIst", "createNewDocument", parameter)
      .map(createNewDocument => {
        return createNewDocument;
      });
  }
}
