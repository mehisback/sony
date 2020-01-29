import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})
export class ServiceItemListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getServiceItemList(parameter): any {
    return this.dataFromService.getServerData("ServiceList", "getServiceItemList",parameter).map(getItem => {
        return getItem;
      });
  }

  insertNewServiceItem(parameter): any {
    return this.dataFromService.getServerData("ServiceItemCreation", "insertNewServiceItem",parameter).map(getBrand => {
        return getBrand;
      });
  }

  handleConnectedvatPrdGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatPrdGrp",parameter).map(getBrand => {
        return getBrand;
      });
  }

  handleConnectedGENPOLICY(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedGENPOLICY",parameter).map(getCategory => {
        return getCategory;
      });
  }

}
