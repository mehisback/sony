import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 31-08-2019
  * sends the POST request
  */

export class PostedReturnReceiptListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllGR(parameter): any {
    return this.dataFromService.getServerData("wmsPostedPurchReturnPickList", "getAllGR", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }
}
