import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 29-07-2019
  * sends the POST request
  */


export class SalesinvoicedetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(dataCustomer => {
        return dataCustomer;
      });
  }


  handleConnectedcustgroup(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcustgroup", parameter)
      .map(datacustgroup => {
        return datacustgroup;
      });
  }

  handleConnectedvatBusGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", parameter)
      .map(datavatBusGrp => {
        return datavatBusGrp;
      });
  }

  getServiceItems(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceServiceItem", "getServiceItems", parameter)
      .map(datavatBusGrp => {
        return datavatBusGrp;
      });
  }


  getSaleInvoiceHeader(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "getSaleInvoiceHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getSaleInvoiceLines(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "getSaleInvoiceLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getList(parameter): any {
    return this.dataFromService.getServerData("SOListForInvoice2", "getList", parameter)
      .map(getList => {
        return getList;
      });
  }

  btnDelLine_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "btnDelLine_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertLine(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceServiceItem", "insertLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceLineEdit", "btnSave_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleBuyFromLookUpManager(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "handleBuyFromLookUpManager", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onBuyFromCustomerUpdate(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "onBuyFromCustomerUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateHeader(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "updateHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeleteSOLines_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "btnDeleteSOLines_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnCreateLines_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SOListForInvoice2", "btnCreateLines_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "getToatalAmount", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnInvDisc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "btnInvDisc_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("SaleInvoicePostConfirm", "createGLBufferLines", parameter)
      .map(dataBuffer => {
        return dataBuffer;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("SaleInvoicePostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SaleInvoicePostConfirm", "btnPost_clickHandler", parameter)
      .map(dataBuffer => {
        return dataBuffer;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("SaleInvoicePostConfirm", "onPostingAccountValidatation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getHSNSummaryLines(parameter): any {
    return this.dataFromService.getServerData("SaleInvoiceHeader", "getHSNSummaryLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAllReportsSetup(parameter): any {
    return this.dataFromService.getServerData("reportssetup", "getAllReportsSetup", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  CompoundDiscountP(parameter): any {
    return this.dataFromService.getServerData("globalData", "CompoundDiscountP", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
