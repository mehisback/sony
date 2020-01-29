import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 05-09-2019
  * sends the POST request
  */

export class SalesQuoteDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getItemList(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getUnitAverageCost", parameter)
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

  VariantLookupgetList(parameter): any {
    return this.dataFromService.getServerData("VariantLookup", "getListAll", parameter)
      .map(getSItem => {
        return getSItem;
      });
  }

  VariantLookupgetListWithFilter(parameter): any {
    return this.dataFromService.getServerData("VariantLookup", "getListWithFilter", parameter)
      .map(getSItem => {
        return getSItem;
      });
  }

  getDeposit(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getDeposit", parameter)
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
    return this.dataFromService.getServerData("SalesQuote", "getPaymentMethod", parameter)
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

  getCustomerContactDetail(parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "getCustomerContactDetail", parameter)
      .map(getRecordListContact => {
        return getRecordListContact;
      });
  }

  openHeader(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "openHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }


  openLines(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "openLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteLineProcedure(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "deleteLineProcedure", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAddItem_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "btnAddItem_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDelete_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addServiceLine(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "addServiceLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertDeposit(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "insertDeposit", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  saveItemLine(parameter): any {
    return this.dataFromService.getServerData("SalesQuoteLineEdit", "saveItemLine", parameter)
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
    return this.dataFromService.getServerData("SalesQuote", "getStat1", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getProcessRole(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getProcessRole", parameter)
      .map(dataProcess => {
        return dataProcess;
      });
  }

  getProcessFlow(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getProcessFlow", parameter)
      .map(dataFlow => {
        return dataFlow;
      });
  }

  updateStatus(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "updateStatus", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateCustCode(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "updateCustCode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  generalUpdate(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "generalUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DueDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "DueDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  orderDate_changeHandler(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "orderDate_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getToatalAmount", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  btnInvDiscount_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "btnInvDiscount_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  }

  DelteAllSOLines(parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "DelteAllSOLines", parameter)
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
    return this.dataFromService.getServerData("SalesQuote", "handleCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleRemoveCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "handleRemoveCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  shipmentDate_changeHandler(Parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "shipmentDate_changeHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  convertSQtoPQ(Parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "convertSQtoPQ", Parameter)
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

  getAllMail(Parameter): any {
    return this.dataFromService.getServerData("SendEmailToVendors", "getAllMail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  updateEmailLines(Parameter): any {
    return this.dataFromService.getServerData("SendEmailToVendors", "updateEmailLines", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  sendMail(Parameter): any {
    return this.dataFromService.getServerData("SendEmailToVendors", "sendMail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  SendMailtoPQBulkVendor(Parameter): any {
    return this.dataFromService.getServerData("SendMailtoPQBulkVendor", "sendMail", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  sendMailSingle(Parameter): any {
    return this.dataFromService.getServerData("SendMailtoPQBulkVendor", "sendMailSingle", Parameter)
      .map(dataDetails => {
        return dataDetails;
      });
  }

  getCountryList(parameter): any {
    return this.dataFromService.getServerData("CountryList", "getCountryList", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }

  getAllReportsSetupDefault(parameter): any {
    return this.dataFromService.getServerData("reportssetup", "getAllReportsSetupDefault", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAllPQbySQ(Parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "getAllPQbySQ", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnConvert_clickHandler(Parameter): any {
    return this.dataFromService.getServerData("SalesQuote", "btnConvert_clickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getCustomerContactDG(Parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "getCustomerContactDG", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  sendMailtoCustomer(Parameter): any {
    return this.dataFromService.getServerData("SendMailtoPQBulkVendor", "sendMailtoCustomer", Parameter)
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
