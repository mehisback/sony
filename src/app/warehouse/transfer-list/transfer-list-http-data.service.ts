import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 01-08-2019
  * sends the POST request
  */


export class TransferListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllRecords(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferList", "getAllRecords", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}
