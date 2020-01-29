import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 06-08-2019
  * sends the POST request
  */


export class ReturnReceiptListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllGR(parameter): any {
    return this.dataFromService.getServerData("wmsgrReturnList", "getAllGR", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}
