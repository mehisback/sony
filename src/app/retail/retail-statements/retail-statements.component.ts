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
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-retail-statements',
  templateUrl: './retail-statements.component.html',
  styleUrls: ['./retail-statements.component.css']
})
export class RetailStatementsComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;
  Date: number;
  statementID: string;
  datetoString: string;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("statementList", "getAllStatements", [""])
      .subscribe(getAllStatements => {
        this.dataSource = getAllStatements;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onCreateNewStatement() {
    this.Date = Date.now();
    this.datetoString = this.Date.toString();
    this.statementID = "STMT-" + this.datetoString;

    this.dataFromService.getServerData("statementList", "createNewDocument", ["",
      this.statementID,
      UtilsForGlobalData.getUserId()]).subscribe(createNewDocument => {
        if (createNewDocument == 1) {
          UtilsForGlobalData.setLocalStorageKey('statementID', this.statementID);
          this.router.navigate(['/retail/retail-statements-details']);
        } else {
          this.toastr.error("Error While Creating the Statement, Error Status Code :INSERT-ERR");
        }
      });

  }

  onUserRowSelect(event) {
    this.statementID = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('statementID', this.statementID);
    this.router.navigate(['/retail/retail-statements-details']);
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
