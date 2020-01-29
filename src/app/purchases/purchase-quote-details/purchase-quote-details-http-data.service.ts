import { Injectable } from '@angular/core';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuoteDetailsHttpDataService {

  constructor(private dataFromService: DataService) {

  }

  getItem(): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getItem", ['']).map(getItem => {
      return getItem;
    });
  }

  getServiceItems(): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getServiceItems", ['',
    ]).map(getSItem => {
      return getSItem;
    });
  }

  getDeposit(BilltoCustomerNo: String, dt: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getDeposit", ['',
      BilltoCustomerNo, dt]).map(getDItem => {
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

  getLocationList3(): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationList3", [''])
      .map(getLocation => {
        return getLocation;
      });
  }

  getLocationList4(): any {
    return this.dataFromService.getServerData("wmsLocationList", "getLocationListPOLookup", [''])
      .map(getLocation => {
        return getLocation;
      });
  }

  getVendorList(): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", [''])
      .map(getVendor => {
        return getVendor;
      });
  }

  getCurrencyList(DocumentNo: String): any {
    return this.dataFromService.getServerData("CurrencyExchangeList", "getRecordList1", ['',
      DocumentNo]).map(getCurrency => {
        return getCurrency;
      });
  }

  getpurchasequoteheader(PONumber: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getpurchasequoteheader", ['',
      PONumber]).map(dataHeader => {
        return dataHeader;
      });
  }

  openPQLines(PONumber: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "openPQLines", ['',
      PONumber]).map(dataLines => {
        return dataLines;
      });
  }

  deleteItemLines(LineNo: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "deleteItemLines", ['',
      LineNo]).map(dataStatus => {
        return dataStatus;
      });
  }

  deleteDepositItemLines1(PONumber: String, LineNo: String, ItemCode: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "deleteItemLines", ['',
      PONumber, LineNo, ItemCode]).map(dataStatus => {
        return dataStatus;
      });
  }

  insertNewLine(PONumber: String, ItemCode: String, Description: String, AmtIncvat: String, DirectUnitCost: String,
    Quantity: String, UOM: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "insertNewLine", ['',
      PONumber, ItemCode, Description, AmtIncvat, DirectUnitCost, Quantity, UOM]).map(dataStatus => {
        return dataStatus;
      });
  }

  updateJournalLine(parameter: any): any {
    return this.dataFromService.getServerData("PurchaseQuote", "updateJournalLine", parameter).map(dataStatus => {
        return dataStatus;
      });
  }


  updateVendorCode(PONumber: String, value: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "updateVendorCode", ['',
      PONumber, value]).map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(PONumber: String, Type: String, dataField: String, value: String, User: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "handleLocation", ['',
      PONumber, Type, dataField, value, User]).map(handleLocation => {
        return handleLocation;
      });
  }

  btnClearLoc_clickHandler(PONumber: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "btnClearLoc_clickHandler", ['',
      PONumber]).map(handleLocation => {
        return handleLocation;
      });
  }

  checkCustomerCreditLimit(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "checkCustomerCreditLimit", parameter).map(getProcessRole => {
      return getProcessRole;
    });
  }

  getProcessRole(Type: String, nextSequence: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getProcessRole", ['',
      Type, nextSequence]).map(getProcessRole => {
        return getProcessRole;
      });
  }

  getProcessFlow(nextSequence: String): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getProcessFlow", ['',
      nextSequence]).map(getProcessFlow => {
        return getProcessFlow;
      });
  }

  updateStatus(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "updateStatus", Parameter)
      .map(updateStatus => {
        return updateStatus;
      });
  }

  getAllLines(Parameter): any {
    return this.dataFromService.getServerData("PQListForPO", "getAllLines", Parameter)
      .map(updateStatus => {
        return updateStatus;
      });
  }

  getCustomerList(Parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", Parameter)
      .map(getCustomerList => {
        return getCustomerList;
      });
  }

  getList(Parameter): any {
    return this.dataFromService.getServerData("POBarcodeList", "getList", Parameter)
      .map(gotBarcodeList => {
        return gotBarcodeList;
      });
  }

  handleSellToLookUpManager(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "handleSellToLookUpManager", Parameter)
      .map(setSO => {
        return setSO;
      });
  }

  UPDATEHeader(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "UPDATEHeader", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  }

  btnInvDiscount_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "btnInvDiscount_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "getToatalAmount", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  btnAddLinePressed(Parameter): any {
    return this.dataFromService.getServerData("PQListForPO", "btnAddLinePressed", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  AmtIncvat_clickHandler(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "AmtIncvat_clickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DueDate_changeHandler(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "DueDate_changeHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  logExpectedDate(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "logExpectedDate", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  POExpectedgetList(Parameter): any {
    return this.dataFromService.getServerData("POExpectedDateLog", "getList", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  openPONoSULines(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "openPONoSULines", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleConnectedconsstore(Parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedconsstore", Parameter)
      .map(dataStores => {
        return dataStores;
      });
  }

  getGraphData(Parameter): any {
    return this.dataFromService.getServerData("POVendKPI", "getGraphData", Parameter)
      .map(dataGraphData => {
        return dataGraphData;
      });
  }

  getStoreageunitCodes(Parameter): any {
    return this.dataFromService.getServerData("mainMenuScreen", "getStoreageunitCodes", Parameter)
      .map(dataSUC => {
        return dataSUC;
      });
  }

  ItemstoreageunitgetAllLines(Parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "getAllLines", Parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnADD_clickHandler(Parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "btnADD_clickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addRecord(Parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "addRecord", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDelete_clickHandler(Parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "btnDelete_clickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAddAll_clickHandler(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "btnAddAll_clickHandler", Parameter)
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

  createNewDocument(Parameter): any {
    return this.dataFromService.getServerData("vendorMasterList", "createNewDocument", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getVendorDetailPerVendor(Parameter): any {
    return this.dataFromService.getServerData("vendorDetailsPerVendor", "getVendorDetail", Parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  addServiceLine(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "addServiceLine", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  depsoitDG_itemDoubleClickHandler(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "depsoitDG_itemDoubleClickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "handleCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleRemoveCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("PurchaseQuote", "handleRemoveCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAllSP(Parameter): any {
    return this.dataFromService.getServerData("PurchaserEdit", "getAllSP", Parameter)
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
