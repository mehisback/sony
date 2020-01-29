import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ItemJournalListHttpDataService } from './item-journal-list-http-data.service';

/* @Author Ganesh
/* this is For Pick Order
/* On 13-03-2019
*/

@Component({
  selector: 'app-item-journal-list',
  templateUrl: './item-journal-list.component.html',
  styleUrls: ['./item-journal-list.component.css']
})

export class ItemJournalListComponent implements OnInit {

  pickListSource: any = {};
  Code: any;

  constructor(private httpDataService: ItemJournalListHttpDataService,
    public router: Router,
    private toastr: ToastrService) {

    this.pickListSource.store = new CustomStore({
      key: ["Code"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        httpDataService.getAllRecords(["",
          UtilsForGlobalData.getUserId()])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  ngOnInit() {

  }

  onUserRowSelect(event) {
    this.Code = event.data.Code;
    UtilsForGlobalData.setLocalStorageKey('ItemJournalCode', this.Code);
    this.router.navigate(['/warehouse/item-journal-details']);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "DocumentStatus") {
      if (e.value == "Approved")
        e.cellElement.className += " color-for-column-Approved";
      else if (e.value == "Open")
        e.cellElement.className += " color-for-column-OPEN";
      else if (e.value == "SENT FOR APPROVAL")
        e.cellElement.className += " color-for-column-SFApproval";
      else if (e.value == "Rejected")
        e.cellElement.className += " color-for-column-Rejected";
    }
  }

  onCreateNewItemJournal() {

    this.httpDataService.createNewDocument(["", "STOCKJOURNAL", '',
      UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('ItemJournalCode', data[0]);
          this.router.navigate(['/warehouse/item-journal-details']);
        } else {
          this.toastr.error("Error While Creating the Item Journal Batch, Error Status Code : " + data[1]);
        }
      });
  }

}

