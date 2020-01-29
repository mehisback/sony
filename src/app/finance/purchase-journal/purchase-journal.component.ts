import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { PurchaseJournalHttpDataService } from './purchase-journal-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-purchase-journal',
  templateUrl: './purchase-journal.component.html',
  styleUrls: ['./purchase-journal.component.css']
})
export class PurchaseJournalComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: PurchaseJournalHttpDataService
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
      "PURJOURNAL",
      UtilsForGlobalData.getUserId(),
      this.companyHeader.CurrentFiscalYear])
      .subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('PurchJNumber', data[1]);
          this.router.navigate(['/finance/purchase-journal-details']);
        } else if (data[0] === null || data[0] === 'null' || data[0] === "null") {
          this.toastr.error("Error While Creating the Purchase Journal, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Purchase Journal, Process Failed :" + data[0]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PurchJNumber', this.documentNumber);
    this.router.navigate(['/finance/purchase-journal-details']);

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
