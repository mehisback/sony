import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 12-07-2019
  * sends the POST request
  */

export class PurchaseOrderHttpDataService {

  constructor(private dataFromService: DataService) {

  }

  GetSOItemList(PONumber: String, Type: String): any {
    return this.dataFromService.getServerData("PONEW", "getItemList", ['',
      PONumber, Type]).map(getItem => {
        return getItem;
      });
  }

  getServiceItems(): any {
    return this.dataFromService.getServerData("PONEW", "getServiceItems", ['',
    ]).map(getSItem => {
      return getSItem;
    });
  }

  getDeposit(BilltoCustomerNo: String, dt: String): any {
    return this.dataFromService.getServerData("PONEW", "getDeposit", ['',
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

  getPurchaseHeader(PONumber: String): any {
    return this.dataFromService.getServerData("PONEW", "getPurchaseHeader", ['',
      PONumber]).map(dataHeader => {
        return dataHeader;
      });
  }

  openPOLines(PONumber: String): any {
    return this.dataFromService.getServerData("PONEW", "openPOLines", ['',
      PONumber]).map(dataLines => {
        return dataLines;
      });
  }

  deleteItemLines1(LineNo: String): any {
    return this.dataFromService.getServerData("PONEW", "deleteItemLines1", ['',
      LineNo]).map(dataStatus => {
        return dataStatus;
      });
  }

  deleteDepositItemLines1(PONumber: String, LineNo: String, ItemCode: String): any {
    return this.dataFromService.getServerData("PONEW", "deleteItemLines", ['',
      PONumber, LineNo, ItemCode]).map(dataStatus => {
        return dataStatus;
      });
  }

  itemInsertClickHandler(PONumber: String, ItemCode: String, AmtIncvat: String, DirectUnitCost: String,
    Quantity: String, LineDiscountAmount1: String, LineDiscountAmount2: String, UOM: String, Location: String): any {
    return this.dataFromService.getServerData("PONEW", "tl_itemDoubleClickHandler2", ['',
      PONumber, ItemCode, AmtIncvat, DirectUnitCost, Quantity, LineDiscountAmount1,
      LineDiscountAmount2, UOM, Location]).map(dataStatus => {
        return dataStatus;
      });
  }

  itemUpdateClickHandler(PONumber: String, ItemCode: String, LineNo: String, Quantity: String,
    DirectUnitCost: String, LineDiscountAmount1: String, LineDiscountAmount2: String, Description: String, Location: String): any {
    return this.dataFromService.getServerData("PoLineEdit2", "btnSave_clickHandler", ['',
      PONumber, ItemCode, LineNo, Quantity, DirectUnitCost, LineDiscountAmount1,
      LineDiscountAmount2, Description, Location]).map(dataStatus => {
        return dataStatus;
      });
  }


  updateVendorCode(PONumber: String, value: String, Type: String, User: String): any {
    return this.dataFromService.getServerData("PONEW", "updateVendorCode", ['',
      PONumber, value, Type, User]).map(dataStatus => {
        return dataStatus;
      });
  }

  handleLocation(PONumber: String, Type: String, dataField: String, value: String, User: String): any {
    return this.dataFromService.getServerData("PONEW", "handleLocation", ['',
      PONumber, Type, dataField, value, User]).map(handleLocation => {
        return handleLocation;
      });
  }

  btnClearLoc_clickHandler(PONumber: String): any {
    return this.dataFromService.getServerData("PONEW", "btnClearLoc_clickHandler", ['',
      PONumber]).map(handleLocation => {
        return handleLocation;
      });
  }

  checkCustomerCreditLimit(parameter): any {
    return this.dataFromService.getServerData("PONEW", "checkCustomerCreditLimit", parameter).map(getProcessRole => {
      return getProcessRole;
    });
  }

  getProcessRole(Type: String, nextSequence: String): any {
    return this.dataFromService.getServerData("PONEW", "getProcessRole", ['',
      Type, nextSequence]).map(getProcessRole => {
        return getProcessRole;
      });
  }

  getProcessFlow(nextSequence: String): any {
    return this.dataFromService.getServerData("PONEW", "getProcessFlow", ['',
      nextSequence]).map(getProcessFlow => {
        return getProcessFlow;
      });
  }

  updateStatus(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "updateStatus", Parameter)
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
    return this.dataFromService.getServerData("PONEW", "handleSellToLookUpManager", Parameter)
      .map(setSO => {
        return setSO;
      });
  }

  UPDATEHeader(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "UPDATEHeader", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


  getTotalLinesDiscAmt(parameter): any {
    return this.dataFromService.getServerData("PONEW", "getTotalLinesDiscAmt", parameter)
      .map(getTotalLinesDiscAmt => {
        return getTotalLinesDiscAmt;
      });
  }

  getSumQuantityItem(parameter): any {
    return this.dataFromService.getServerData("PONEW", "getSumQuantityItem", parameter)
      .map(getSumQuantityItem => {
        return getSumQuantityItem;
      });
  }

  btnInvDiscount_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PONEW", "btnInvDiscount_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getToatalAmount(parameter): any {
    return this.dataFromService.getServerData("PONEW", "getToatalAmount", parameter)
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
    return this.dataFromService.getServerData("PONEW", "AmtIncvat_clickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  DueDate_changeHandler(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "DueDate_changeHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  logExpectedDate(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "logExpectedDate", Parameter)
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
    return this.dataFromService.getServerData("PONEW", "openPONoSULines", Parameter)
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
    return this.dataFromService.getServerData("PONEW", "btnAddAll_clickHandler", Parameter)
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
    return this.dataFromService.getServerData("PONEW", "addServiceLine", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  depsoitDG_itemDoubleClickHandler(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "depsoitDG_itemDoubleClickHandler", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "handleCurrencyCode", Parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleRemoveCurrencyCode(Parameter): any {
    return this.dataFromService.getServerData("PONEW", "handleRemoveCurrencyCode", Parameter)
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
