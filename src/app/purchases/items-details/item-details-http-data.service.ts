import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 22-07-2019
  * sends the POST request
  */

export class ItemDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getItemDetail(parameter): any {
    return this.dataFromService.getServerData("item", "getItemDetail", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  getAverageCost(parameter): any {
    return this.dataFromService.getServerData("item", "getAverageCost", parameter)
      .map(getItemCost => {
        return getItemCost;
      });
  }

  handleConnecteditemFamily(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnecteditemFamily", parameter)
      .map(getItemFamily => {
        return getItemFamily;
      });
  }

  handleConnectedsize(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedsize", parameter)
      .map(getItemSize => {
        return getItemSize;
      });
  }

  handleConnectedcolor(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcolor", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  getJSON2(parameter): any {
    return this.dataFromService.getServerData("schema", "getJSON2", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  handleConnectedvatPrdGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatPrdGrp", parameter)
      .map(getItemvatPrdGrp => {
        return getItemvatPrdGrp;
      });
  }

  handleConnectedGENPOLICY(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedGENPOLICY", parameter)
      .map(getItemGENPOLICY => {
        return getItemGENPOLICY;
      });
  }

  getList(parameter): any {
    return this.dataFromService.getServerData("LotBarcodeList", "getList", parameter)
      .map(getItemList => {
        return getItemList;
      });
  }

  getStoreageunitCodes(parameter): any {
    return this.dataFromService.getServerData("mainMenuScreen", "getStoreageunitCodes", parameter)
      .map(getItemSUC => {
        return getItemSUC;
      });
  }

  getItemPriceLog(parameter): any {
    return this.dataFromService.getServerData("item", "getItemPriceLog", parameter)
      .map(getItemPriceLog => {
        return getItemPriceLog;
      });
  }

  getAllLines(parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "getAllLines", parameter)
      .map(getItem => {
        return getItem;
      });
  }

  numHistDays_changeHandler(parameter): any {
    return this.dataFromService.getServerData("item", "numHistDays_changeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnADD_clickHandler(parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "btnADD_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  addRecord(parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "addRecord", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  update(parameter): any {
    return this.dataFromService.getServerData("item", "update", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  titlewindow1_initializeHandler(parameter): any {
    return this.dataFromService.getServerData("UOMConversion", "titlewindow1_initializeHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onResponse(parameter): any {
    return this.dataFromService.getServerData("UOMConversion", "onResponse", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getCostDetails(parameter): any {
    return this.dataFromService.getServerData("ItemCostDetails", "getCostDetails", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getListForBarcode(parameter): any {
    return this.dataFromService.getServerData("ItemPriceLookup", "getListForBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  validateBarcode(parameter): any {
    return this.dataFromService.getServerData("ItemPriceLookup", "validateBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  dg_itemEditEndHandler(parameter): any {
    return this.dataFromService.getServerData("ItemPriceLookup", "dg_itemEditEndHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  FIFOCostgetCostDetails(parameter): any {
    return this.dataFromService.getServerData("ItemFIFOCostDetails", "getCostDetails", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnAdd_clickHandler(parameter): any {
    return this.dataFromService.getServerData("UOMConversion", "btnAdd_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDELETE_clickHandler(parameter): any {
    return this.dataFromService.getServerData("UOMConversion", "btnDELETE_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDelete_clickHandlerSUC(parameter): any {
    return this.dataFromService.getServerData("Itemstoreageunit", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleConnectedBASEUOM(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedBASEUOM", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  handleConnectedPURCHUOM(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedPURCHUOM", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  handleConnectedSALESUOM(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedSALESUOM", parameter)
      .map(dataList => {
        return dataList;
      });
  }

  DELETEBarcode(parameter): any {
    return this.dataFromService.getServerData("barcodeList", "DELETEBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  processEdit(parameter): any {
    return this.dataFromService.getServerData("barcodeList", "processEdit", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  barcodeListvalidateBarcode(parameter): any {
    return this.dataFromService.getServerData("barcodeList", "validateBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  INSERTBarcode(parameter): any {
    return this.dataFromService.getServerData("barcodeList", "INSERTBarcode", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  updateImage(parameter): any {
    return this.dataFromService.getServerData("item", "updateImage", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getItemImage(parameter): any {
    return this.dataFromService.getServerData("item", "getItemImage", parameter)
      .map(dataImage => {
        return dataImage;
      });
  }

  getItempicture(parameter): any {
    return this.dataFromService.getServerData("item", "getItempicture", parameter)
      .map(dataImage => {
        return dataImage;
      });
  }

  getJSON3(parameter): any {
    return this.dataFromService.getServerData("schema", "getJSON3", parameter)
      .map(dataJson => {
        return dataJson;
      });
  }

  storeJsonAtrributeByJson(parameter): any {
    return this.dataFromService.getServerData("schema", "storeJsonAtrributeByJson", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  UPDATEHeader(parameter): any {
    return this.dataFromService.getServerData("item", "UPDATEHeader", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  woo_createProducts(parameter): any {
    return this.dataFromService.getServerData("woo_products", "woo_createProducts", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  woo_deleteProduct(parameter): any {
    return this.dataFromService.getServerData("woo_products", "woo_deleteProduct", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getitemcrossreferenceDetail(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "getitemcrossreferenceDetail", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  INSERTNewItemcrossreference(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "INSERTNewItemcrossreference", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  deleteNewItemcrossreference(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "deleteNewItemcrossreference", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  deleteItemcrossreference(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "deleteItemcrossreference", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateItemcrossreference(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "updateItemcrossreference", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  woo_listAllProdCategory(parameter): any {
    return this.dataFromService.getServerData("Woo_StandardAllInOne", "woo_listAllProdCategory", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getLogistics(parameter): any {
    return this.dataFromService.getServerData("Logistics", "getLogistics", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  testingJson2(parameter): any {
    return this.dataFromService.getServerData("testingJson", "testingJson2", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getImageUrlPath() {
    return this.dataFromService.getTheServerIP();
  }

  getitemcrossreferencecode(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "getitemcrossreferencecode", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getitemcrossreferencecode2(parameter): any {
    return this.dataFromService.getServerData("itemcrossreference", "getitemcrossreferencecode2", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  updateProducttoSOCreated(parameter): any {
    return this.dataFromService.getServerData("Woo_StandardAllInOne", "updateProducttoSOCreated", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  LazadaCreateProduct(parameter): any {
    return this.dataFromService.getServerData("lazadaProducts", "CreateProduct", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  GetBrands(parameter): any {
    return this.dataFromService.getServerData("lazadaProducts", "GetBrands", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  GetCategoryTree(parameter): any {
    return this.dataFromService.getServerData("lazadaProducts", "GetCategoryTree", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  Create_product(parameter): any {
    return this.dataFromService.getServerData("shopify", "Create_product", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  Delete_product(parameter): any {
    return this.dataFromService.getServerData("shopify", "Delete_product", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  getAllSetup(parameter): any {
    return this.dataFromService.getServerData("ecommerceSetup", "getAllSetup", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  add(parameter): any {
    return this.dataFromService.getServerData("Items", "add", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  delete(parameter): any {
    return this.dataFromService.getServerData("Items", "delete", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  generateAccessToken(parameter): any {
    return this.dataFromService.getServerData("lazadaAuth", "generateAccessToken", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  refreshAccessToken(parameter): any {
    return this.dataFromService.getServerData("lazadaAuth", "refreshAccessToken", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  create_Product(parameter): any {
    return this.dataFromService.getServerData("lazadaProducts", "create_Product", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

  remove_products(parameter): any {
    return this.dataFromService.getServerData("lazadaProducts", "remove_products", parameter)
      .map(getCustomer => {
        return getCustomer;
      });
  }

}
