import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 22-07-2019
  * sends the POST request
  */


export class ItemListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getItemList(parameter): any {
    return this.dataFromService.getServerData("itemList", "getItemList",parameter).map(getItem => {
        return getItem;
      });
  }

  handleConnectedbrand(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedbrand",parameter).map(getBrand => {
        return getBrand;
      });
  }

  handleConnectedcategory(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcategory",parameter).map(getCategory => {
        return getCategory;
      });
  }

  handleConnectedsubCategory(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedsubCategory",parameter).map(getSubCategory => {
        return getSubCategory;
      });
  }
  
  handleConnecteditemFamily(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnecteditemFamily", parameter)
      .map(getItemFamily => {
        return getItemFamily;
      });
  }

  getRecords(parameter): any {
    return this.dataFromService.getServerData("ItemImportBuffer", "getRecords",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  deleteItemLines(parameter): any {
    return this.dataFromService.getServerData("itemList", "deleteItemLines",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  updateItemLines(parameter): any {
    return this.dataFromService.getServerData("itemList", "updateItemLines",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  getRecords2(parameter): any {
    return this.dataFromService.getServerData("ItemImportBuffer", "getRecords2",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  btnChkRepBarcode_clickHandler(parameter): any {
    return this.dataFromService.getServerData("ItemImportBuffer", "btnChkRepBarcode_clickHandler",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  btnCreate_Handler(parameter): any {
    return this.dataFromService.getServerData("ItemCreation", "btnCreate_Handler",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  btnImportItem_clickHandler(parameter): any {
    return this.dataFromService.getServerData("itemList", "btnImportItem_clickHandler",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  importJsonSample(parameter): any {
    return this.dataFromService.getServerData("itemList", "importJsonSample",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  onImport(parameter): any {
    return this.dataFromService.getServerData("itemList", "onImport",parameter).map(dataStatus => {
        return dataStatus;
      });
  }


  btnImport_clickHandler(parameter): any {
    return this.dataFromService.getServerData("ItemImportBuffer", "btnImport_clickHandler",parameter).map(dataStatus => {
        return dataStatus;
      });
  }

  INSERTItems(parameter): any {
    return this.dataFromService.getServerData("ItemImportBuffer", "INSERTItems",parameter).map(dataStatus => {
        return dataStatus;
      });
  }
  
  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  updateItemwithAutoCode(parameter): any {
    return this.dataFromService.getServerData("ItemCreation", "updateItemwithAutoCode", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
