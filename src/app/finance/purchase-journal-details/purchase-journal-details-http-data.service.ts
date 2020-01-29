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


export class PurchaseJournalDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getServiceItem(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "getServiceItem", parameter)
      .map(dataService => {
        return dataService;
      });
  }

  getVendorList(parameter): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  handleConnectedvatBusGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", parameter)
      .map(dataConnectedvatBusGrp => {
        return dataConnectedvatBusGrp;
      });
  }

  handleConnectedvendgroup(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvendgroup", parameter)
      .map(dataConnectedvendgroup => {
        return dataConnectedvendgroup;
      });
  }

  getHeader(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "getHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getLines(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "getLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteLine(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "deleteLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateJournalLine(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "updateJournalLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertNewLine(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "insertNewLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handlePayToLookUpManager(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "handlePayToLookUpManager", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPaytoVendorUpdate(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "onPaytoVendorUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  generalUpdate(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "generalUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("PurchJournalPostConfirm", "createGLBufferLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("PurchJournalPostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PurchJournalPostConfirm", "btnPost_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("PurchJournalPostConfirm", "onPostingAccountValidatation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSaveChrge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("purchaseJournal", "btnSaveChrge_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}
