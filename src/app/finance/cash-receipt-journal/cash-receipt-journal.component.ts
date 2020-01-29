import { Component, OnInit } from '@angular/core';
import { CashReceiptJournalHttpDataService } from './cash-receipt-journal-http-data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-cash-receipt-journal',
  templateUrl: './cash-receipt-journal.component.html',
  styleUrls: ['./cash-receipt-journal.component.css']
})
export class CashReceiptJournalComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: CashReceiptJournalHttpDataService
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

  onCreateNewCRJ() {
    this.httpDataService.createNewDocument(["", "CASHRECEIPTJOURNAL",
      UtilsForGlobalData.getUserId(),
      this.companyHeader.CurrentFiscalYear])
      .subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('CRJNumber', data[1]);
          this.router.navigate(['/finance/cash-receipt-journal-details']);
        } else if (data[0] === null || data[0] === 'null' || data[0] === null) {
          this.toastr.error("Error While Creating the Cash Receipt Journal, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating Cash Receipt Journal, Process Failed :" + data[0]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('CRJNumber', this.documentNumber);
    this.router.navigate(['/finance/cash-receipt-journal-details']);

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
