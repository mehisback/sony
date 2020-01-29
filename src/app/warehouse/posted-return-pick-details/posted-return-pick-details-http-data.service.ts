import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})
export class PostedReturnPickDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  openPickOrder(parameter): any {
    return this.dataFromService.getServerData("wmsPostedPurchReturnPickCard", "openPickOrder", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  openPickLines(parameter): any {
    return this.dataFromService.getServerData("wmsPostedPurchReturnPickCard", "openPickLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }
}
