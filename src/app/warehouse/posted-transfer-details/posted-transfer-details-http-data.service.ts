import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 24-09-2019
  * sends the POST request
  */

export class PostedTransferDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  openTransHeader(parameter): any {
    return this.dataFromService.getServerData("wmsPostedTrasnfer", "openTransHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openTransferLines(parameter): any {
    return this.dataFromService.getServerData("wmsPostedTrasnfer", "openTransferLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }
}
