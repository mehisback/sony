import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})
export class PostedMovementDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }


  getMovement(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovementsPosted", "getMovement", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getMovementLines(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovementsPosted", "getMovementLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }
}
