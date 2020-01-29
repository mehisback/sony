import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 08-08-2019
  * sends the POST request
  */


export class ChartofaccountsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCompanyInfo(): any {
    return this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .map(getCompany => {
        return getCompany;
      });
  }

  openChartOfAccounts(parameter): any {
    return this.dataFromService.getServerData("ChartOfAccounts", "openChartOfAccounts", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  openChartOfAccountsFilter(parameter): any {
    return this.dataFromService.getServerData("ChartOfAccounts", "openChartOfAccountsFilter", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  btnSave_clickHandlerADD(parameter): any {
    return this.dataFromService.getServerData("ManageAccountCode", "btnSave_clickHandlerADD", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  btnSave_clickHandlerMODIFY(parameter): any {
    return this.dataFromService.getServerData("ManageAccountCode", "btnSave_clickHandlerMODIFY", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getAccountType(parameter): any {
    return this.dataFromService.getServerData("ManageAccountCode", "getAccountType", parameter)
      .map(AccountType => {
        return AccountType;
      });
  }

  getListBYLEVEL(parameter): any {
    return this.dataFromService.getServerData("COALookUp", "getListBYLEVEL", parameter)
      .map(dataStatus => {
        return dataStatus;
      });
  }

  getSubAccountType(parameter): any {
    return this.dataFromService.getServerData("ManageAccountCode", "getSubAccountType", parameter)
      .map(AccountType => {
        return AccountType;
      });
  }

  getHeaderListDefault(parameter): any {
    return this.dataFromService.getServerData("GLEntries", "getHeaderListDefault", parameter)
      .map(glEntry => {
        return glEntry;
      });
  }

}
