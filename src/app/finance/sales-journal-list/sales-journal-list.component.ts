import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { SalesJournalListHttpDataService } from './sales-journal-list-http-data.service';

@Component({
  selector: 'app-sales-journal-list',
  templateUrl: './sales-journal-list.component.html',
  styleUrls: ['./sales-journal-list.component.css']
})
export class SalesJournalListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: SalesJournalListHttpDataService
  ) { }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getHeaderList([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });

    this.httpDataService.getCompanyInfo().subscribe(data => {
      this.companyHeader = data[0];
    });
  }

  onCreateNewPurchJ() {
    this.httpDataService.createNewDocument(["",
      "SALEGENJOURNAL",
      UtilsForGlobalData.getUserId(),
      this.companyHeader.CurrentFiscalYear]).subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('SalesJNumber', data[1]);
          this.router.navigate(['/finance/sales-journal-details']);
        } else {
          this.toastr.error("Error While Creating the Sales Journal");
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SalesJNumber', this.documentNumber);
    this.router.navigate(['/finance/sales-journal-details']);

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

