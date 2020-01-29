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

export class TransferDetailsHttpDataService {

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


  openTransHeader(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "openTransHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openTransferLines(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "openTransferLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnDelete_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPickLoose_clickHandler2(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "btnPickLoose_clickHandler2", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getInventoryDetails(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "getInventoryDetails", parameter)
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

  btnSend_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "btnSend_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralMovUPDATE(parameter): any {
    return this.dataFromService.getServerData("wmsTrasnferAdv", "genralMovUPDATE", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
}
