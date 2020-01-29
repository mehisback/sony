import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Abhijeet
  * On 30-07-2019
  * sends the POST request
  */


export class CashReceiptJournalDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getHeader(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "getHeader", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }

  getLines(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "getLines", parameter)
      .map(getLines => {
        return getLines;
      });
  }

  btnDelete_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "btnDelete_clickHandler", parameter)
      .map(btnDelete_clickHandler => {
        return btnDelete_clickHandler;
      });
  }

  lineDG_itemEditEndHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "lineDG_itemEditEndHandler", parameter)
      .map(lineDG_itemEditEndHandler => {
        return lineDG_itemEditEndHandler;
      });
  }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(getCustomerList => {
        return getCustomerList;
      });
  }

  handleConnectedPaymentCodes(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedPaymentCodes", parameter)
      .map(handleConnectedPaymentCodes => {
        return handleConnectedPaymentCodes;
      });
  }

  handleReceiveFromLookUpManager(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "handleReceiveFromLookUpManager", parameter)
      .map(handleReceiveFromLookUpManager => {
        return handleReceiveFromLookUpManager;
      });
  }

  onReceiveFromCodeUpdate(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "onReceiveFromCodeUpdate", parameter)
      .map(handleReceiveFromLookUpManager => {
        return handleReceiveFromLookUpManager;
      });
  }

  updatePaymentMethodInfo(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "updatePaymentMethodInfo", parameter)
      .map(updatePaymentMethodInfo => {
        return updatePaymentMethodInfo;
      });
  }

  generalUpdate(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "generalUpdate", parameter)
      .map(generalUpdate => {
        return generalUpdate;
      });
  }

  createApplicationLines(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "createApplicationLines", parameter)
      .map(createApplicationLines => {
        return createApplicationLines;
      });
  }

  btnDeleteAll_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "btnDeleteAll_clickHandler", parameter)
      .map(btnDeleteAll_clickHandler => {
        return btnDeleteAll_clickHandler;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournalPostConfirm", "createGLBufferLines", parameter)
      .map(createGLBufferLines => {
        return createGLBufferLines;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournalPostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(onCreateGLBuffResultSet => {
        return onCreateGLBuffResultSet;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournalPostConfirm", "btnPost_clickHandler", parameter)
      .map(btnPost_clickHandler => {
        return btnPost_clickHandler;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournalPostConfirm", "onPostingAccountValidatation", parameter)
      .map(onPostingAccountValidatation => {
        return onPostingAccountValidatation;
      });
  }

  getCharges(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "getCharges", parameter)
      .map(getCharges => {
        return getCharges;
      });
  }

  bntDelCharge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "bntDelCharge_clickHandler", parameter)
      .map(bntDelCharge_clickHandler => {
        return bntDelCharge_clickHandler;
      });
  }

  getAccountCharges(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "getAccountCharges", parameter)
      .map(getAccountCharges => {
        return getAccountCharges;
      });
  }

  btnSaveChrge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("CashReceiptJournal", "btnSaveChrge_clickHandler", parameter)
      .map(btnSaveChrge_clickHandler => {
        return btnSaveChrge_clickHandler;
      });
  }
}
