import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Abhijeet
  * On 23-07-2019
  * sends the POST request
  */


export class CustomerListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCustomerList(parameter): any {
    return this.dataFromService.getServerData("customerList", "getCustomerList", parameter)
      .map(GotCustList => {
        return GotCustList;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("vendorMasterList", "createNewDocument", parameter)
      .map(GotCustList => {
        return GotCustList;
      });
  }
}
