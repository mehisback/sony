import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import DataSource from "devextreme/data/data_source";
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

var itemListArray: any = [];

@Component({
  selector: 'app-retail-statements-details',
  templateUrl: './retail-statements-details.component.html',
  styleUrls: ['./retail-statements-details.component.css']
})
export class RetailStatementsDetailsComponent implements OnInit {

  statementID: String = UtilsForGlobalData.retrieveLocalStorageKey('statementID');
  headerdetails: any = [];
  storeList: any = [];
  openStmtLine: any = [];
  getItemLine: any = [];
  StatementOperations = ['Post', 'Create Lines', 'Remove Lines'];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  getStatementHeader() {
    this.dataFromService.getServerData("StatementCard", "openStmt", ['', this.statementID])
      .subscribe(openStmt => {
        this.headerdetails = openStmt[0];
      });
  }

  getStatementLines() {
    this.dataFromService.getServerData("StatementCard", "openStmtLine", ['', this.statementID])
      .subscribe(openStmtLine => {
        this.openStmtLine = openStmtLine;
      });
  }

  getStatementItemLines() {
    this.dataFromService.getServerData("StatementCard", "getItemLine", ['', this.statementID])
      .subscribe(getItemLine => {
        this.getItemLine = getItemLine;
      });
  }

  ngOnInit() {
    this.getStatementHeader();

    this.getStatementLines();

    this.getStatementItemLines();

    this.dataFromService.getServerData("globalLookup", "handleConnectedstore", [''])
      .subscribe(handleConnectedstore => {
        this.storeList = handleConnectedstore;
      });
  }

  hover(data) {
    return "<div class='custom-item' title='" + data.StoreID + "'>" + data.StoreID + "</div>";
  }

  suggestionFormateForPOS(data) {
    return data ? data.StoreID : '';
  }

  onPOSIDCodeChanged(event) {
    if (this.storeList["StoreID"] != event.value) {
      this.dataFromService.getServerData("StatementCard", "handleStoreLookup", ['', event.value, this.statementID])
        .subscribe(handleConnectedstore => {
          if (handleConnectedstore == '1') {
            this.getStatementHeader();

            this.getStatementLines();

            this.getStatementItemLines();
            this.toastr.success("Updated!");
          }
        });
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'TransStartingDate') {
      this.dataFromService.getServerData("StatementCard", "TransStartingDate_valueCommitHandler", ['', e.value, this.statementID])
        .subscribe(TransStartingDate_valueCommitHandler => {
          if (TransStartingDate_valueCommitHandler == '1') {
            this.toastr.success("Updated!");
            this.getStatementHeader();
          }
        });
    }
  }

  SalesInvoiceOperationsGo(selected: string) {
    if (selected == 'Post') {
      this.dataFromService.getServerData("StatementCard", "postStatement", ['',
        this.statementID,
        this.headerdetails["StoreDefaultStoageUnit"],
        UtilsForGlobalData.getUserId(),
        '']).subscribe(postStatement => {
          if (postStatement[0] == '1') {
            this.toastr.success("POSTED");
            this.router.navigate(['/retail/retail-statements']);
          } else {
            this.toastr.error(postStatement[0]);
          }
        });
    } else if (selected == 'Create Lines') {
      this.dataFromService.getServerData("StatementCard", "calculateLinesProcedure", ['',
        this.statementID,
        this.headerdetails["TransStartingDate"],
        this.headerdetails["TransStartingDate"],
        this.headerdetails["StoreNo"],
        UtilsForGlobalData.getUserId()]).subscribe(calculateLinesProcedure => {
          if (calculateLinesProcedure[0] == '1') {
            this.toastr.success("Lines Created");
            this.ngOnInit();
          } else {
            this.toastr.error(calculateLinesProcedure[0]);
            this.ngOnInit();
          }
        });
    } else if (selected == 'Remove Lines') {
      this.dataFromService.getServerData("StatementCard", "btnRemove_clickHandler", ['',
        this.statementID,
        this.headerdetails["TransStartingDate"],
        this.headerdetails["StoreNo"],
        UtilsForGlobalData.getUserId()]).subscribe(btnRemove_clickHandler => {
          if (btnRemove_clickHandler[0] == '1') {
            this.toastr.success("Lines Deleted");
            this.ngOnInit();
          } else {
            this.toastr.error(btnRemove_clickHandler[0]);
            this.ngOnInit();
          }
        });
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }


}
