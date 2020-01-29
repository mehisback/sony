import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 29-07-2019
  * sends the POST request
  */


export class InventoryHttpDataService {

  constructor(private dataFromService: DataService) { }

  getInvByItemCodeNL(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByItemCodeNL", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getInvByItemCodeNLFilter(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByItemCodeNLFilter", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getInvByItemCode(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByItemCode", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getInvByItemCodeFilter(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByItemCodeFilter", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getInvByLot(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByLot", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

  getInvByLotFilter(parameter): any {
    return this.dataFromService.getServerData("InventoryAll", "getInvByLotFilter", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }
}
