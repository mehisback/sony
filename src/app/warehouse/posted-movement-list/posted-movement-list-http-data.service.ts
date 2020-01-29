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

export class PostedMovementListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllMovements(parameter): any {
    return this.dataFromService.getServerData("wmsMovementMultiplePostedList", "getAllMovements", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
