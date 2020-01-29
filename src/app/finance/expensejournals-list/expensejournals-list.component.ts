import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

/* @Author Ganesh
/* this is For Expense Journals
/* On 01-03-2019
*/

@Component({
  selector: 'app-expensejournals-list',
  templateUrl: './expensejournals-list.component.html',
  styleUrls: ['./expensejournals-list.component.css']
})

export class ExpensejournalsListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("ExpenseJournalList", "getHeaderList", [""])
      .subscribe(getHeaderList => {
        this.dataSource = getHeaderList;
      });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()])
      .subscribe(data => {
        this.companyHeader = data[0];
      });
  }

  onCreateNewEJ() {
    this.dataFromService.getServerData("ExpenseJournalList", "createNewDocument", ["",
      "EXPJOURNAL", UtilsForGlobalData.getUserId(), this.companyHeader.CurrentFiscalYear])
      .subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('EJNumber', data[1]);
          this.router.navigate(['/finance/expensejournals-details']);
        } else if (data[0] === null || data[0] === 'null' || data[0] === null) {
          this.toastr.error("Error While Creating the Return Receipt, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Expense Journals, Process Failed :" + data[0]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('EJNumber', this.documentNumber);
    this.router.navigate(['/finance/expensejournals-details']);

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
