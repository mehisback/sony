import { Component, OnInit } from '@angular/core';
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
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';

import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');
var writtenNumber = require('written-number');

import CustomStore from 'devextreme/data/custom_store';
import notify from "devextreme/ui/notify";
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

/* @Author Ganesh
/* this is For Purchase Credit Note
/* On 27-02-2019
*/

@Component({
  selector: 'app-purchasecreditnote-list',
  templateUrl: './purchasecreditnote-list.component.html',
  styleUrls: ['./purchasecreditnote-list.component.css']
})

export class PurchasecreditnoteListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {

    this.dataFromService.getServerData("PurchaseCreditNoteList", "getAllPurchaseInvoices", [""])
      .subscribe(GotInventoryAll => {
        this.dataSource = GotInventoryAll;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onCreateNewPCN() {

    this.dataFromService.getServerData("SOList", "createNewDocument", ["",
      "PURCHASECREDITNOTE",
      '',
      UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PCNNumber', data[0]);
          this.router.navigate(['/finance/purchasecreditnote-details']);
        } else if (data[1] === null || data[1] === 'null' || data[1] === "null") {
          this.toastr.error("Error While Creating the Purchase Credit Note, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Purchase Credit Note, Process Failed :" + data[1]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PCNNumber', this.documentNumber);
    this.router.navigate(['/finance/purchasecreditnote-details']);

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


