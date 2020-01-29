import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import DataSource from "devextreme/data/data_source";
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import { PostedPurchaseCreditNoteListHttpDataService } from './posted-purchase-credit-note-list-http-data.service';

/* @Author Ganesh
/* this is For Purchase Credit Note
/* On 27-02-2019
*/

@Component({
  selector: 'app-posted-purchase-credit-note-list',
  templateUrl: './posted-purchase-credit-note-list.component.html',
  styleUrls: ['./posted-purchase-credit-note-list.component.css']
})

export class PostedPurchaseCreditNoteListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService,
    private httpDataService: PostedPurchaseCreditNoteListHttpDataService
  ) { }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllPurchaseInvoices([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });
  }

  onCreateNewPCN() {

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PostedPCNNumber', this.documentNumber);
    this.router.navigate(['/finance/posted-purchase-credit-note-details']);

  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "FlowResult") {
      if (e.value == "Approved")
        e.cellElement.className += " color-for-column-Approved";
      else if (e.value == "OPEN")
        e.cellElement.className += " color-for-column-OPEN";
      else if (e.value == "SENT FOR APPROVAL")
        e.cellElement.className += " color-for-column-SFApproval";
      else if (e.value == "Rejected")
        e.cellElement.className += " color-for-column-Rejected";
    }
  }

  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Server Error");
    }
  }

}


