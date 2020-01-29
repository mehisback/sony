import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 08-08-2019
  * sends the POST request
  */


export class GenJournalListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("GenJournalList", "getHeaderList", parameter)
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
    return this.dataFromService.getServerData("GenJournalList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}
