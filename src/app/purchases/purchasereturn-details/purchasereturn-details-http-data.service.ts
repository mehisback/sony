import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 05-08-2019
  * sends the POST request
  */

export class PurchasereturnDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getItemMaster(parameter): any {
    return this.dataFromService.getServerData("mainMenuScreen", "getItemMaster", parameter)
      .map(dataItemMaster => {
        return dataItemMaster;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(dataCustomer => {
        return dataCustomer;
      });
  }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getVendorList(parameter): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  getLocationList3(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", parameter)
      .map(dataCustomer => {
        return dataCustomer;
      });
  }

  getPurchaseHeader(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getPurchaseHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getpostedpurchaseinvoicelines(parameter): any {
    return this.dataFromService.getServerData("PIListForPurchReturn", "getpostedpurchaseinvoicelines", parameter)
      .map(getpostedpurchinvoicelines => {
        return getpostedpurchinvoicelines;
      });
  }

  CreatePRFromPI2(parameter): any {
    return this.dataFromService.getServerData("PIListForPurchReturn", "CreatePRFromPI2", parameter)
      .map(getpostedsalesinvoicelines => {
        return getpostedsalesinvoicelines;
      });
  }

  openPOLines(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "openPOLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteItemLines(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "deleteItemLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insetLines(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "insetLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  modifyLine(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "modifyLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  UPDATEVendorCodeBuyFrom(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "UPDATEVendorCodeBuyFrom", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  UPDATEVendorCodePayTo(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "UPDATEVendorCodePayTo", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "handleLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  UPDATEHeader(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "UPDATEHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getProcessRole(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getProcessRole", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getProcessFlow(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getProcessFlow", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateStatus(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "updateStatus", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  txtBarcode_enterHandler(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "txtBarcode_enterHandler", parameter)
      .map(dataBarcode => {
        return dataBarcode;
      });
  }

  onGetBarcode(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "onGetBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAverageCost(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getAverageCost", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  openPRCommentLines(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "openPRCommentLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  updateComment(parameter): any {
    return this.dataFromService.getServerData("prCommentEditor", "updateComment", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  }
  getLMORemark(parameter): any {
    return this.dataFromService.getServerData("PurchaseReturnCard", "getLMORemark", parameter)
      .map(getLMORemark => {
        return getLMORemark;
      });
  }

  CompoundDiscountP(parameter): any {
    return this.dataFromService.getServerData("globalData", "CompoundDiscountP", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
  
}
