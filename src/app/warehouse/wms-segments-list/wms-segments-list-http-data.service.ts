import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 18-07-2019
  * sends the POST request
  */

export class WmsSegmentsListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getRecList(parameter): any {
    return this.dataFromService.getServerData("WMSSegmentList", "getRecList", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  validateLocationCode(parameter): any {
    return this.dataFromService.getServerData("newlocation", "validateLocationCode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertLocation(parameter): any {
    return this.dataFromService.getServerData("newlocation", "insertLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
