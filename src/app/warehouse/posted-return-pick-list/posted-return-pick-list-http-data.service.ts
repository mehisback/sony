import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Injectable({
  providedIn: 'root'
})
export class PostedReturnPickListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPick(parameter): any {
    return this.dataFromService.getServerData("wmsPostedPurchReturnPickList", "getAllPick", parameter)
      .map(getHeader => {
        return getHeader;
      });
  }
}
