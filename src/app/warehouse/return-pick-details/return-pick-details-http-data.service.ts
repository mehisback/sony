import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 07-08-2019
  * sends the POST request
  */


export class ReturnPickDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getLocationList1(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList1", parameter)
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

  openPickOrder(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "openPickOrder", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  openPickLines(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "openPickLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getAllReturnOrder(parameter): any {
    return this.dataFromService.getServerData("prLookUpListForPick", "getAllReturnOrder", parameter)
      .map(dataPR => {
        return dataPR;
      });
  }

  grLineDG_itemEditEndHandlerRQ(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "grLineDG_itemEditEndHandlerRQ", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnClearLoc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "btnClearLoc_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "handleLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handlePRLookUp(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "handlePRLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DocumentDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "DocumentDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralPickUpdate(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "genralPickUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  txtScan_enterHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "txtScan_enterHandler", parameter)
      .map(dataBarcode => {
        return dataBarcode;
      });
  }

  onScan(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "onScan", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  checkForZeroShipping(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "checkForZeroShipping", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  postPickProcedure(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickCard", "postPickProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getWMSLines(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickMoveLot", "getWMSLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  button1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickMoveLot", "button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnUndo_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPurchReturnPickMoveLot", "btnUndo_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
