import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 24-07-2019
  * sends the POST request
  */

export class SalesorderDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  GetSOItemListWithInventory(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getItemListProcedure", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  getServiceItems(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getServiceItems", parameter)
      .map(getSItem => {
        return getSItem;
      });
  }

  getDeposit(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getDeposit", parameter)
      .map(getDItem => {
        return getDItem;
      });
  }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getLocationList1(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList1", parameter)
      .map(getLocation => {
        return getLocation;
      });
  }

  getLocationListSO(parameter): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationListSOLookup", parameter)
      .map(getLocation => {
        return getLocation;
      });
  }

  getPaymentMethod(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getPaymentMethod", parameter)
      .map(getPaymentMethod => {
        return getPaymentMethod;
      });
  }

  getRecordList(parameter): any {
    return this.dataFromService.getServerData("Salesperson", "getRecordList", parameter)
      .map(getSalesperson => {
        return getSalesperson;
      });
  }

  openHeader(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "openHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }


  openLines(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "openLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteLineProcedure(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "deleteLineProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  deleteLine(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "deleteLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  tl_itemDoubleClickHandler(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "tl_itemDoubleClickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addServiceLine(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "addServiceLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertDeposit(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "insertDeposit", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SOLineEdit2", "btnSave_clickHandler", parameter)
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

  getGeneralStats(parameter): any {
    return this.dataFromService.getServerData("CustomerKPI", "getGeneralStats", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getStat1(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getStat1", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getProcessRole(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getProcessRole", parameter)
      .map(dataProcess => {
        return dataProcess;
      });
  }

  getProcessFlow(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getProcessFlow", parameter)
      .map(dataFlow => {
        return dataFlow;
      });
  }

  updateStatus(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "updateStatus", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateCustCode(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "updateCustCode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  genUpdateSalesHeader(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "genUpdateSalesHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DueDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "DueDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  orderDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "orderDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getToatalAmount", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  btnInvDiscount_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "btnInvDiscount_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  }

  DelteAllSOLines(parameter): any {
    return this.dataFromService.getServerData("SONEW2", "DelteAllSOLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getCurrencyList(DocumentNo: String): any {
    return this.dataFromService.getServerData("CurrencyExchangeList", "getRecordList1", ['',
      DocumentNo]).map(getCurrency => {
        return getCurrency;
      });
  }

  handleCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("SONEW2", "handleCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleRemoveCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("SONEW2", "handleRemoveCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  shipmentDate_changeHandler(Parameter): any {
    return this.dataFromService.getServerData("SONEW2", "shipmentDate_changeHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getItemDetail(Parameter): any {
    return this.dataFromService.getServerData("itemJournalItemDetails", "getItemDetail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  getVendorList(Parameter): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  handleBuyFromLookUpManager(Parameter): any {
    return this.dataFromService.getServerData("SONEW2", "handleBuyFromLookUpManager", Parameter)
      .map(dataDetails => {
        return dataDetails;
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

  updateOrdertoApproved(parameter): any {
    return this.dataFromService.getServerData("Woo_StandardAllInOne", "updateOrdertoApproved", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}