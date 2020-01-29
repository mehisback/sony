import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 26-09-2019
  * sends the POST request
  */


export class SalesJournalListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("SalesJournalList", "getHeaderList", parameter)
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
    return this.dataFromService.getServerData("SalesJournalList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}

