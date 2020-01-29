import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-salescreditnote-list',
  templateUrl: './salescreditnote-list.component.html',
  styleUrls: ['./salescreditnote-list.component.css']
})

export class SalescreditnoteListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("SalesCreditNoteList", "getAllSalesInvoices", [""])
      .subscribe(getAllSalesInvoices => {
        this.dataSource = getAllSalesInvoices;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onCreateNewPI() {

    this.dataFromService.getServerData("SOList", "createNewDocument", ["", 
    "SALECREDITNOTE",'', UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('SCNNumber', data[0]);
          this.router.navigate(['/finance/salescreditnote-details']);
        }
        else {
          this.toastr.error("Error While Creating the Sales Credit Note, Error Status Code: "+data[1]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SCNNumber', this.documentNumber);
    this.router.navigate(['/finance/salescreditnote-details']);
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

