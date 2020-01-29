import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { GenJournalListHttpDataService } from './gen-journal-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-gen-journal-list',
  templateUrl: './gen-journal-list.component.html',
  styleUrls: ['./gen-journal-list.component.css']
})
export class GenJournalListComponent implements OnInit {

  genJournalList: Object;
  error: void;
  documentNumber: any;
  companyHeader: any = {};

  constructor(public router: Router,
    private toastr: ToastrService,
    private httpDataService: GenJournalListHttpDataService) { }

  ngOnInit() {

    var thisComponent = this;

    this.genJournalList = new CustomStore({
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

  onCreateNewJournal() {

    this.httpDataService.createNewDocument(["",
      "GENJOURNAL",
      UtilsForGlobalData.getUserId(),
      this.companyHeader.CurrentFiscalYear]).subscribe(data => {
        if (data[0] === "CREATED") {
          UtilsForGlobalData.setLocalStorageKey('GenJournalNumber', data[1]);
          this.router.navigate(['/finance/gen-journal-details']);
        } else if (data[0] === null || data[0] === 'null' || data[0] === null) {
          this.toastr.error("Error While Creating the Gen Journal, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Gen Journal Process Failed : " + data[0]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('GenJournalNumber', this.documentNumber);
    this.router.navigate(['/finance/gen-journal-details']);

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
