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


export class PostedTransferListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllRecords(parameter): any {
    return this.dataFromService.getServerData("wmsPostedTrasnferList", "getAllRecords", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}

