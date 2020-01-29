import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})

/**
  * @author Ganesh
  * On 12-07-2019
  * sends the POST request
  */


export class ItemJournalListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllRecords(parameter): any {
    return this.dataFromService.getServerData("wmsItemJournalBatch", "getAllRecords", parameter)
    .map(dataHeader => {
        return dataHeader;
      });
  }

  createNewDocument(parameter): any {
    return this.dataFromService.getServerData("SOList", "createNewDocument", parameter)
    .map(dataHeader => {
        return dataHeader;
      });
  }
}
