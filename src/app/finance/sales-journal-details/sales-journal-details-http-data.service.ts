import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 26-09-2019
  * sends the POST request
  */


export class SalesJournalDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getServiceItem(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "getServiceItem", parameter)
      .map(dataService => {
        return dataService;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(dataCustomer => {
        return dataCustomer;
      });
  }

  handleConnectedvatBusGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", parameter)
      .map(dataConnectedvatBusGrp => {
        return dataConnectedvatBusGrp;
      });
  }

  handleConnectedvendgroup(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcustgroup", parameter)
      .map(dataConnectedvendgroup => {
        return dataConnectedvendgroup;
      });
  }

  getHeader(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "getHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getLines(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "getLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  deleteLine(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "deleteLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updateJournalLine(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "updateJournalLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  insertNewLine(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "insertNewLine", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handleBuyFromLookUpManager(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "handleBuyFromLookUpManager", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onCustomerCodeUpdate(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "onCustomerCodeUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  generalUpdate(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "generalUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("SalesJournalPostConfirm", "createGLBufferLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("SalesJournalPostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalesJournalPostConfirm", "btnPost_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("SalesJournalPostConfirm", "onPostingAccountValidatation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSaveChrge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("SalesJournalCard", "btnSaveChrge_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

}

