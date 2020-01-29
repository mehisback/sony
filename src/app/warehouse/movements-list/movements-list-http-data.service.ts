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

export class MovementsListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllMovements(parameter): any {
    return this.dataFromService.getServerData("wmsMovementMultipleList", "getAllMovements", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("wmsMovementMultipleList", "createMovement", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
