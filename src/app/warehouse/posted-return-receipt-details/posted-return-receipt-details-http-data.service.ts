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


export class PostedReturnReceiptDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  openGROrder(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "openGROrder", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  openGRLines(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "openGRLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }
}
