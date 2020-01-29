import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';

@Component({
  selector: 'app-retail-transactions',
  templateUrl: './retail-transactions.component.html',
  styleUrls: ['./retail-transactions.component.css']
})
export class RetailTransactionsComponent implements OnInit {
  @ViewChild("transactionGrid") transactionGrid: DxDataGridComponent;
  @ViewChild("returnGrid") returnGrid: DxDataGridComponent;
  @ViewChild("cancelGrid") cancelGrid: DxDataGridComponent;
  @ViewChild("vatGrid") vatGrid: DxDataGridComponent;
  @ViewChild("saleGrid") saleGrid: DxDataGridComponent;

  formdataforbutton: any = [];
  error: void;
  datasource: any;
  StoreIDfromDataGrid: any = '';
  POSIDfromDataGrid: any = '';
  StoreNamefromDataGrid: any = '';
  currentDate = UtilsForGlobalData.getCurrentDate();
  transactionDataGrid: Object;
  dates = {
    fromDate: this.currentDate,
    toDate: this.currentDate,
  }
  returnDataGrid: Object;
  cancelDataGrid: Object;
  vatDataGrid: Object;
  saleDataGrid: Object;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.formdataforbutton["fromDate"] = this.currentDate;
    this.formdataforbutton["toDate"] = this.currentDate;

    this.dataFromService.getServerData("RetailTransactionDetails", "GetStores", [""])
      .subscribe(GetStores => {
        this.datasource = GetStores;

      },
        error => this.error = this.alertCode(error)
      );
  }

  onUserRowSelect(event) {
    this.StoreIDfromDataGrid = event.data.StoreID;
    this.POSIDfromDataGrid = event.data.POSID;
    this.StoreNamefromDataGrid = event.data.StoreName;

    this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
      'Transactionheader',
      'Transactionlines',
      this.StoreIDfromDataGrid,
      this.POSIDfromDataGrid,
      this.formdataforbutton["fromDate"],
      this.formdataforbutton["toDate"]
    ])
      .subscribe(GetPostedTrans => {
        this.transactionDataGrid = GetPostedTrans;
        this.transactionGrid.instance.refresh();
      },
        error => this.error = this.alertCode(error)
      );

  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == "transaction") {
      this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
        'Transactionheader',
        'Transactionlines',
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"]
      ])
        .subscribe(GetPostedTrans => {
          this.transactionDataGrid = GetPostedTrans;
          this.transactionGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
    if (event.nextId == "return") {
      this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
        'Returnheader',
        'RetunrLines',
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"]
      ])
        .subscribe(GetPostedTrans => {
          this.returnDataGrid = GetPostedTrans;
          this.returnGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
    if (event.nextId == "cancel") {
      this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
        'CanceledTransHeader',
        'CanceledTransLines',
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"]
      ])
        .subscribe(GetPostedTrans => {
          this.cancelDataGrid = GetPostedTrans;
          this.cancelGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
    if (event.nextId == "vat") {
      this.dataFromService.getServerData("RetailVATRegister", "GetPostedTrans", ["",
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"]
      ])
        .subscribe(GetPostedTrans => {
          this.vatDataGrid = GetPostedTrans;
          this.vatGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
    if (event.nextId == "sale") {
      this.dataFromService.getServerData("RetailSalesRegister", "GetPostedTrans", ["",
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"]]).subscribe(GetPostedTrans => {
          this.saleDataGrid = GetPostedTrans[1];
          this.saleGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'fromDate') {
      this.formdataforbutton["fromDate"] = e.value;
      this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
        'Transactionheader',
        'Transactionlines',
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"],
      ])
        .subscribe(GetPostedTrans => {
          this.transactionDataGrid = GetPostedTrans;
          this.transactionGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
    }
    if (e.dataField == 'toDate') {
      this.formdataforbutton["toDate"] = e.value;
      this.dataFromService.getServerData("RetailTransRegister", "GetPostedTrans", ["",
        'Transactionheader',
        'Transactionlines',
        this.StoreIDfromDataGrid,
        this.POSIDfromDataGrid,
        this.formdataforbutton["fromDate"],
        this.formdataforbutton["toDate"],
      ])
        .subscribe(GetPostedTrans => {
          this.transactionDataGrid = GetPostedTrans;
          this.transactionGrid.instance.refresh();
        },
          error => this.error = this.alertCode(error)
        );
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

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }

}
