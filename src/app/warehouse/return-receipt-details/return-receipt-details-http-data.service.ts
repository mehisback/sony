import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 06-08-2019
  * sends the POST request
  */


export class ReturnReceiptDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getLocationList3(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", parameter)
      .map(getLocation => {
        return getLocation;
      });
  }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  openGROrder(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "openGROrder", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  openGRLines(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "openGRLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getAllReturnOrderFilter(parameter): any {
    return this.dataFromService.getServerData("srLookUpListGR", "getAllReturnOrderFilter", parameter)
      .map(dataSR => {
        return dataSR;
      });
  }

  grLineDG_itemEditEndHandlerRQ(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "grLineDG_itemEditEndHandlerRQ", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAdhocLines(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnFromHandheld", "getAdhocLines", parameter)
      .map(dataGRLines => {
        return dataGRLines;
      });
  }

  btnClearLoc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "btnClearLoc_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "handleLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handlePOLookUp(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "handlePOLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DocumentDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "DocumentDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralGRUPDATE(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "genralGRUPDATE", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  txtScan_enterHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "txtScan_enterHandler", parameter)
      .map(dataBarcode => {
        return dataBarcode;
      });
  }

  onScan(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "onScan", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  checkQtyToPost(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "checkQtyToPost", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  postGRProcedure(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "postGRProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  looseDG_itemClickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnFromHandheld", "looseDG_itemClickHandler", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  DELETEDeviceLine(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnFromHandheld", "DELETEDeviceLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  button1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnFromHandheld", "button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getList(parameter): any {
    return this.dataFromService.getServerData("StoreCustomerList", "getList", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleStoreLookUp(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "handleStoreLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  chkShiptoStore_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "chkShiptoStore_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  chkShiptoStore_clickHandler1(parameter): any {
    return this.dataFromService.getServerData("wmsGRReturnCard", "chkShiptoStore_clickHandler1", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
