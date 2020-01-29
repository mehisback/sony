import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 07-08-2019
  * sends the POST request
  */

export class ReturnPickListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPick(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickList", "getAllPick", parameter)
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
