import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 05-08-2019
  * sends the POST request
  */

export class SalesreturnListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllSalesOrder(parameter): any {
    return this.dataFromService.getServerData("SRList", "getAllSalesOrder", parameter)
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

  getAttributeValue(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "getAttributeValue", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }
}
