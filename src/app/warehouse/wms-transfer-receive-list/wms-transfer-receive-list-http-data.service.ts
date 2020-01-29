import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})
export class WmsTransferReceiveListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getHeaderList(parameter): any {
    return this.dataFromService.getServerData("wmsTransferReceiveList", "getHeaderList", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
