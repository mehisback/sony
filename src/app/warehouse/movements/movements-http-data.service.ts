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

export class MovementsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getItemLotAvailablityForMov(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "lotinventorybysu", parameter)
      .map(dataItem => {
        return dataItem;
      });
  }

  AllLocation(parameter): any {
    return this.dataFromService.getServerData("wmsMasterLookUp", "AllLocation", parameter)
      .map(dataLocation => {
        return dataLocation;
      });
  }

  getMovement(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "getMovement", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


  getMovementLines(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "getMovementLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  WMSDeleteMovLotLine(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "WMSDeleteMovLotLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getUnitsonLine(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "getUnitsonLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  INSERTLine(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "getwmsMovelotlines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  LocationStorageUnit(parameter): any {
    return this.dataFromService.getServerData("wmsMasterLookUp", "LocationStorageUnit", parameter)
      .map(dataLocationStorageUnit => {
        return dataLocationStorageUnit;
      });
  }

  UPDATEHeader(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "UPDATEHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  Post_WmsMovementByLot(parameter): any {
    return this.dataFromService.getServerData("wmsMultipleMovements", "Post_WmsMovementByLot", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
