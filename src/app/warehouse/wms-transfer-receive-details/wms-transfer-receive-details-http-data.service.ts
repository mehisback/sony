import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 16-09-2019
  * sends the POST request
  */

export class WmsTransferReceiveDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getItemMaster(parameter): any {
    return this.dataFromService.getServerData("mainMenuScreen", "getItemMaster", parameter)
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

  InTransitCode(parameter): any {
    return this.dataFromService.getServerData("wmsMasterLookUp", "InTransitCode", parameter)
      .map(dataLocation => {
        return dataLocation;
      });
  }


  openTransHeader(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "openTransHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openTransferLines(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "openTransferLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnDelete_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  looseDG_itemEditEndHandler(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "looseDG_itemEditEndHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getInventoryDetails(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "getInventoryDetails", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleMasterLookupFLC(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "handleMasterLookupFLC", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleMasterLookupTLC(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "handleMasterLookupTLC", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleMasterLookupITC(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "handleMasterLookupITC", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSend_clickHandler2(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "btnReceive_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralMovUPDATE(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferReceive", "genralMovUPDATE", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}

