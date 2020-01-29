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

export class SalesreturnDetailsHttpDataService {

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

  getLocationList1(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList1", parameter)
      .map(dataLoc => {
        return dataLoc;
      });
  }

  openHeader(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "openHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openLines(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "openLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getAllLines(parameter): any {
    return this.dataFromService.getServerData("soLookUpListForReurn", "getAllLines", parameter)
      .map(dataSOLines => {
        return dataSOLines;
      });
  }

  btnDELETE_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "btnDELETE_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insetLines(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "insetLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  
  getpostedsalesinvoicelines(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "getpostedsalesinvoicelines", parameter)
      .map(getpostedsalesinvoicelines => {
        return getpostedsalesinvoicelines;
      });
  }

  CreateSRFromSI2(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "CreateSRFromSI2", parameter)
      .map(CreateSRFromSI2 => {
        return CreateSRFromSI2;
      });
  }

  modifyLine(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "modifyLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertCustomer(parameter): any {
    return this.dataFromService.getServerData("newCustomer", "insertCustomer", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onGetBarcodeDetails(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "onGetBarcodeDetails", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  txtScan_enterHandler(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "txtScan_enterHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getProcessRole(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "getProcessRole", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getProcessFlow(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "getProcessFlow", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  UPDATEStatus(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "UPDATEStatus", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateCustCode(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "updateCustCode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "handleLocation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  AmtIncvat_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "AmtIncvat_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  orderDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "orderDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  generalUPDATE(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "generalUPDATE", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAddLinePressed(parameter): any {
    return this.dataFromService.getServerData("soLookUpListForReurn", "btnAddLinePressed", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("SalReturnOrder", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  } 

  CompoundDiscountP(parameter): any {
    return this.dataFromService.getServerData("globalData", "CompoundDiscountP", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }
  
}
