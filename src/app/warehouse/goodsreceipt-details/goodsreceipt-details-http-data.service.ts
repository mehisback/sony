import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 18-07-2019
  * sends the POST request
  */


export class GoodsreceiptDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }


  getLocationList3(): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", [''])
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
    return this.dataFromService.getServerData("wmsGRCard", "openGROrder", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openGRLines(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "openGRLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  grLineDG_itemEditEndHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "grLineDG_itemEditEndHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAdhocLines(parameter): any {
    return this.dataFromService.getServerData("wmsGRFromHandheld", "getAdhocLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getAllPurchaseOrderTypeOne(parameter): any {
    return this.dataFromService.getServerData("poLookUpListGR", "getAllPurchaseOrderTypeOneProc", parameter)
      .map(dataPO => {
        return dataPO;
      });
  }

  LocationStorageUnit(parameter): any {
    return this.dataFromService.getServerData("wmsMasterLookUp", "LocationStorageUnit", parameter)
      .map(gotSUList => {
        return gotSUList;
      });
  }

  btnClearLoc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "btnClearLoc_clickHandler", parameter)
      .map(gotSUList => {
        return gotSUList;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "handleLocation", parameter)
      .map(gotSUList => {
        return gotSUList;
      });
  }

  handlePOLookUp(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "handlePOLookUp", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genralGRUPDATE(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "genralGRUPDATE", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DocumentDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "DocumentDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  txtScan_enterHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "txtScan_enterHandler", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  onScan(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "onScan", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  checkQtyToPost(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "checkQtyToPost", parameter)
      .map(gotGRDetails => {
        return gotGRDetails;
      });
  }

  postGRProcedure(parameter): any {
    return this.dataFromService.getServerData("wmsGRCard", "postGRProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  looseDG_itemClickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRFromHandheld", "looseDG_itemClickHandler", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  DELETEDeviceLine(parameter): any {
    return this.dataFromService.getServerData("wmsGRFromHandheld", "DELETEDeviceLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  button1_clickHandler(parameter): any {
    return this.dataFromService.getServerData("wmsGRFromHandheld", "button1_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getItemDetail(ItemCode: String) {
    return this.dataFromService.getServerData("itemJournalItemDetails", "getItemDetail", ["",
      ItemCode]).map(item => {
        return item;
      });
  }

  getVendorDetailPerVendor(Parameter): any {
    return this.dataFromService.getServerData("vendorDetailsPerVendor", "getVendorDetail", Parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }
}
