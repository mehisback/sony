import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 21-08-2019
  * sends the POST request
  */

export class WmsSegmentsHttpDataService {

  constructor(private dataFromService: DataService) { }

  LocationStorageUnit(parameter): any {
    return this.dataFromService.getServerData("wmsMasterLookUp", "LocationStorageUnit", parameter)
      .map(getLocation => {
        return getLocation;
      });
  }

  getLocation(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "getLocation", Parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  updateLocation(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "updateLocation", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getZones(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "getZones", Parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  insertZone(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "insertZone", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getSection(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "getSection", Parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  insertSection(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "insertSection", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getShelf(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "getShelf", Parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  insertShelf(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "insertShelf", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getStorageUnit(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "getStorageUnit", Parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  insertStorageUnit(Parameter): any {
    return this.dataFromService.getServerData("wmsLocationCard", "insertStorageUnit", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
