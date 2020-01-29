import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import DataSource from "devextreme/data/data_source";
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { DxButtonModule, DevExtremeModule, DxDataGridComponent } from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-billing-note',
  templateUrl: './billing-note.component.html',
  styleUrls: ['./billing-note.component.css']
})
export class BillingNoteComponent implements OnInit {
  @ViewChild("getlinesforgrid") getlinesforgrid: DxDataGridComponent;

  dataSource: Object;
  error: void;
  documentNumber: any;
  popupforNewBN: boolean = false;
  dataSource2: Object;
  currentDate = UtilsForGlobalData.getCurrentDate();
  dates = {
    date: this.currentDate
  }
  arrayforDate: any = [];

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    this.arrayforDate["date"] = this.currentDate;

    this.dataFromService.getServerData("BillingNote", "getDocList", [""])
      .subscribe(getDocList => {
        this.dataSource = getDocList;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onCreateNewBillingNote() {
    this.popupforNewBN = true;
    this.dataFromService.getServerData("BillingNote", "getRecords", ["", this.arrayforDate["date"]])
      .subscribe(data => {
        this.dataSource2 = data;
      });

  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == 'date') {
        this.dataFromService.getServerData("BillingNote", "getRecords", ["", e.value])
          .subscribe(data => {
            this.dataSource2 = data;
            this.getlinesforgrid.instance.refresh();
          });
      }
    }
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('BillingNoteNumber', this.documentNumber);
    this.router.navigate(['/finance/billing-note-details']);

  }


  addnewline(event) {
    this.dataFromService.getServerData("SOList", "createNewDocument", ["",
      'BILLINGNOTE',
      '',
      UtilsForGlobalData.getUserId()]).subscribe(createNewDocument => {
        this.popupforNewBN = false;
        if (createNewDocument[1] === "DONE") {
          this.dataFromService.getServerData("BillingNote", "handleCreateNewDocument", ["", createNewDocument[0], event.key["CustCode"]])
            .subscribe(handleCreateNewDocument => {
              if (handleCreateNewDocument > 0) {
                UtilsForGlobalData.setLocalStorageKey('BillingNoteNumber', createNewDocument[0]);
                this.router.navigate(['/finance/billing-note-details']);
              } else {
                this.toastr.error("Error While Updating the Billing Note, UPDATE-ERR");
              }
            });
        } else if (createNewDocument[1] === null || createNewDocument[1] === 'null' || createNewDocument[1] === "null") {
          this.toastr.error("Error While Creating the Billing Note, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Billing Note");
        }
      });
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
