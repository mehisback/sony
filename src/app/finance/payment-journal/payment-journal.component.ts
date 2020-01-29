import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { PaymentJournalHttpDataService } from './payment-journal-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-payment-journal',
  templateUrl: './payment-journal.component.html',
  styleUrls: ['./payment-journal.component.css']
})
export class PaymentJournalComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: PaymentJournalHttpDataService
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

  onCreateNewPAYJ() {
    this.httpDataService.createNewDocument(["",
      "PAYJOURNAL",
      UtilsForGlobalData.getUserId(),
      this.companyHeader.CurrentFiscalYear]).subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('PAYJNumber', data[1]);
          this.router.navigate(['/finance/payment-journal-details']);
        } else if (data[0] === null || data[0] === 'null' || data[0] === null) {
          this.toastr.error("Error While Creating the Payment Journal, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Payment Journal, Process Failed :" + data[0]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PAYJNumber', this.documentNumber);
    this.router.navigate(['/finance/payment-journal-details']);

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
