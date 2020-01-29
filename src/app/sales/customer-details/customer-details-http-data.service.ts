import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Abhijeet
  * On 23-07-2019
  * sends the POST request
  */

export class CustomerDetailsHttpDataService {

  constructor(private dataFromService: DataService) { }

  getCustomerCard(parameter): any {
    return this.dataFromService.getServerData("customerCard", "getCustomerCard", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getRecordList(parameter): any {
    return this.dataFromService.getServerData("Salesperson", "getRecordList", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  updateCustomers(parameter): any {
    return this.dataFromService.getServerData("customerCard", "updateCustomers", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }


  getGeneralStats(parameter): any {
    return this.dataFromService.getServerData("CustomerKPI", "getGeneralStats", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getCustImage(parameter): any {
    return this.dataFromService.getServerData("CustomerImage", "getCustImage", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedcustgroup(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcustgroup", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedvatBusGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedcustPriceGrp(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcustPriceGrp", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedarea(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedarea", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedcusttype(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedcusttype", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getHeaderListBYCUSTOMER(parameter): any {
    return this.dataFromService.getServerData("AREntries", "getHeaderListBYCUSTOMER", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getTotalByCustomer(parameter): any {
    return this.dataFromService.getServerData("AREntries", "getTotalByCustomer", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getJSON2(parameter): any {
    return this.dataFromService.getServerData("schema", "getJSON2", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getCustomerCard1(parameter): any {
    return this.dataFromService.getServerData("customerCard", "getCustomerCard", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedsubarea(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedsubarea", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  handleConnectedsubarea2(parameter): any {
    return this.dataFromService.getServerData("globalLookup", "handleConnectedsubarea", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  UPDATECustomer(parameter): any {
    return this.dataFromService.getServerData("customerCard", "UPDATECustomer", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getJSON3(parameter): any {
    return this.dataFromService.getServerData("customerCard", "getJSON3", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  storeJsonAtrributeByJson(parameter): any {
    return this.dataFromService.getServerData("customerCard", "storeJsonAtrributeByJson", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
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

  newimage(parameter): any {
    return this.dataFromService.getServerData("CustomerImage", "newimage", parameter)
      .map(GotCustDetail => {
        return GotCustDetail;
      });
  }

  getStateList(parameter): any {
    return this.dataFromService.getServerData("CountryStateList", "getStateList", parameter)
      .map(getStateList => {
        return getStateList;
      });
  }

  getCountryList(parameter): any {
    return this.dataFromService.getServerData("CountryList", "getCountryList", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }

  getCustomerContactDetail(parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "getCustomerContactDetail", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }
  INSERTNewCustomerContact(parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "INSERTNewCustomerContact", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }
  deleteCustomerContact(parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "deleteCustomerContact", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }
  updateCustomerContact(parameter): any {
    return this.dataFromService.getServerData("CustomerContact", "updateCustomerContact", parameter)
      .map(getCountryList => {
        return getCountryList;
      });
  }

}
