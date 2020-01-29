import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable({
  providedIn: 'root'
})
export class PostedPurchaseCreditNoteListHttpDataService {

  constructor(private dataFromService: DataService) { }

  getAllPurchaseInvoices(parameter): any {
    return this.dataFromService.getServerData("postedPurchaseCreditNoteList", "getAllPurchaseInvoices", parameter)
      .map(dataHeader => {
        return dataHeader;
      });
  }

}
