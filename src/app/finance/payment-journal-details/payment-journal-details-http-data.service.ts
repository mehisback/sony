import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 30-07-2019
  * sends the POST request
  */

  
export class PaymentJournalDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  getVendorList(parameter): any {
    return this.dataFromService.getServerData("vendorList", "getVendorList", parameter)
      .map(dataVendor => {
        return dataVendor;
      });
  }

  handleConnectedPaymentCodes(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedPaymentCodes", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getHeader(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "getHeader", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getLines(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "getLines", parameter)
      .map(dataLines => {
        return dataLines;
      });
  }

  btnDelete_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "btnDelete_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  lineDG_itemEditEndHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "lineDG_itemEditEndHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  handlePayToLookUpManager(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "handlePayToLookUpManager", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPaytoVendorUpdate(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "onPaytoVendorUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  updatePaymentMethodInfo(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "updatePaymentMethodInfo", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  generalUpdate(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "generalUpdate", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createApplicationLines(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "createApplicationLines", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnDeleteAll_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "btnDeleteAll_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  createGLBufferLines(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalPostConfirm", "createGLBufferLines", parameter)
      .map(dataBuffer => {
        return dataBuffer;
      });
  }

  onCreateGLBuffResultSet(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalPostConfirm", "onCreateGLBuffResultSet", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnPost_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalPostConfirm", "btnPost_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  onPostingAccountValidatation(parameter): any {
    return this.dataFromService.getServerData("PaymentJournalPostConfirm", "onPostingAccountValidatation", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getCharges(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "getCharges", parameter)
      .map(dataCharges => {
        return dataCharges;
      });
  }

  bntDelCharge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "bntDelCharge_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAccountCharges(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "getAccountCharges", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSaveChrge_clickHandler(parameter): any {
    return this.dataFromService.getServerData("PaymentJournal", "btnSaveChrge_clickHandler", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }


}
