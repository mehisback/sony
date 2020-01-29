import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 26-07-2019
  * sends the POST request
  */

export class PickListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPick(parameter): any {
    return this.dataFromService.getServerData("wmsPickList", "getAllPick", parameter)
      .map(getList => {
        return getList;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getAttributeValue(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "getAttributeValue", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  generateAccessToken(parameter): any {
    return this.dataFromService.getServerData("lazadaAuth", "generateAccessToken", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  refreshAccessToken(parameter): any {
    return this.dataFromService.getServerData("lazadaAuth", "refreshAccessToken", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }


  getMultDocument(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "getMultDocument", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  getMultDocumentByBatchId(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "getMultDocumentByBatchId", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  getAllBatchIDForPick(parameter): any {
    return this.dataFromService.getServerData("wmsPickList", "getAllBatchIDForPick", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

}
