import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 19-07-2019
  * sends the POST request
  */


export class PurchaseinvoicedetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getVendorList(): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", [''])
      .map(getVendor => {
        return getVendor;
      });
  }

  getServiceItems(): any {
    return this.dataFromService.getServerData("PurchInvoiceServiceItem", "getServiceItems", ['',
    ]).map(getSItem => {
      return getSItem;
    });
  }

  getPurchaseInvoiceHeader(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getPurchaseInvoiceHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getPurchaseInvoiceLinesQuantity(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getPurchaseInvoiceLinesQuantity", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }


  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getAllLines(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice", "getAllLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getList(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice2", "getList", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  handleConnectedvendgroup(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvendgroup", parameter)
      .map(handleConnectedvendgroup => {
        return handleConnectedvendgroup;
      });
  }


  handleConnectedvatBusGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", parameter)
      .map(datavatBusGrp => {
        return datavatBusGrp;
      });
  }

  getPurchaseInvoiceLines(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getPurchaseInvoiceLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnDelLine_clickHandler(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "btnDelLine_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PurchInvoiceLineEdit", "btnSave_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPaytoVendorUpdate(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "onPaytoVendorUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handlePayToLookUpManager(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "handlePayToLookUpManager", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateHeader(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "updateHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeletePOLines_clickHandler(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "btnDeletePOLines_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnCreateLines_clickHandler(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice2", "btnCreateLines_clickHandler", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  btnAddLinePressed(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice", "btnAddLinePressed", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  txtPONo_changeHandler(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice", "txtPONo_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getToatalAmount", parameter)
      .map(dataTotal => {
        return dataTotal;
      });
  }

  btnInvDisc_clickHandler(parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "btnInvDisc_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("PurchInvoicePostConfirm", "createGLBufferLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("PurchInvoicePostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  POListForInvoicebtnCreateLines_clickHandler(parameter): any {
    return this.dataFromService.getServerData("POListForInvoice", "btnCreateLines_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PurchInvoicePostConfirm", "btnPost_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("PurchInvoicePostConfirm", "onPostingAccountValidatation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getItemDetail(Parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "getItemDetail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  getServiceItemDetail(Parameter): any {
    return this.dataFromService.getServerData("itemJournalItemDetails", "getServiceItemDetail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  getDepositItemDetail(Parameter): any {
    return this.dataFromService.getServerData("itemJournalItemDetails", "getDepositItemDetail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  getVendorDetailPerVendor(Parameter): any {
    return this.dataFromService.getServerData("vendorDetailsPerVendor", "getVendorDetail", Parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  insertServiceLine(Parameter): any {
    return this.dataFromService.getServerData("PurchInvoiceServiceItem", "insertLine", Parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  getListPREPAYMENTHEADER(Parameter): any {
    return this.dataFromService.getServerData("APPrepaymentLookUpList", "getListPREPAYMENTHEADER", Parameter)
      .map(dataDeposit => {
        return dataDeposit;
      });
  }

  insertDepositLine(Parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "insertDepositLine", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDelLine_clickHandlerDeposit(Parameter): any {
    return this.dataFromService.getServerData("purchaseinvoiceheader", "btnDelLine_clickHandlerDeposit", Parameter)
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
