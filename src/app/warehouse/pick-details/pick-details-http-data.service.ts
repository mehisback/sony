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

export class PickDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getLocationList1(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList1", parameter)
      .map(getItem => {
        return getItem;
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
    return this.dataFromService.getServerData("wmsPickCard", "openPickOrder", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }


  openPickLines(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "openPickLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }


  txtScan_enterHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "txtScan_enterHandler", parameter)
      .map(getBarcode => {
        return getBarcode;
      });
  }

  onScanHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "onScanHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getWMSLines(parameter): any {
    return this.dataFromService.getServerData("wmsPickMoveSuggestion", "getWMSLines", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  init(parameter): any {
    return this.dataFromService.getServerData("wmsPickMoveLot", "init", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  wmsPickMoveLotgetWMSLines(parameter): any {
    return this.dataFromService.getServerData("wmsPickMoveLot", "getpickadhoclines", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  getAdhocLines(parameter): any {
    return this.dataFromService.getServerData("wmsPickFromHandheld", "getAdhocLines", parameter)
      .map(getLines => {
        return getLines;
      });
  }


  getPickLot(parameter): any {
    return this.dataFromService.getServerData("wmsPickLot", "getPickLot", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  getAllSalesOrder(parameter): any {
    return this.dataFromService.getServerData("soLookUpListForPick", "getAllSalesOrder", parameter)
      .map(getSalesOrder => {
        return getSalesOrder;
      });
  }

  btnClearLoc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "btnClearLoc_clickHandler", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "handleLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleSOLookUp(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "handleSOLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DocumentDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "DocumentDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralPickUpdate(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "genralPickUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  looseDG_itemClickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickFromHandheld", "looseDG_itemClickHandler", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteLine(parameter): any {
    return this.dataFromService.getServerData("wmsPickFromHandheld", "deleteLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAllRecords(parameter): any {
    return this.dataFromService.getServerData("wmsPickLogList", "getAllRecords", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAutoPick_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "btnAutoPick_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  button1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickMoveLot", "button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createPickLot(parameter): any {
    return this.dataFromService.getServerData("wmsPickLot", "createPickLot", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnUndo_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickLot", "btnUndo_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  PickMovebutton1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsPickMoveSuggestion", "button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


  checkForZeroShipping(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "checkForZeroShipping", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  postPickProcedure(parameter): any {
    return this.dataFromService.getServerData("wmsPickCard", "postPickProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
  getCustomerCard(parameter): any {
    return this.dataFromService.getServerData("customerCard", "getCustomerCard", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
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

  getDocument(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "getDocument", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  ShipmentMethodFromSuggestions(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "GetShipmentProviders", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  SetStatusToPackedByMarketplace(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "SetStatusToPackedByMarketplace", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  SetStatusToReadyToShip(parameter): any {
    return this.dataFromService.getServerData("lazadaShipping", "SetStatusToReadyToShip", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

  getSource(parameter): any {
    return this.dataFromService.getServerData("lazadaOrder", "getSource", parameter)
      .map(dataAttribute => {
        return dataAttribute;
      });
  }

}
