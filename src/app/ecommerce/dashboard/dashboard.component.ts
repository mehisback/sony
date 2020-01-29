import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, TemplateRef, HostListener, Input } from '@angular/core';
import { ROUTES } from '../../shared/sidebar/menu-items';
import { RouteInfo } from '../../shared/sidebar/sidebar.metadata';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgxPermissionsModule } from 'ngx-permissions'
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataService } from '../../data.service';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxPieChartModule,
  DxDateBoxModule
} from 'devextreme-angular';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  DataforProductTable: Object;
  DataforProcessingOrders: Object;
  DataforCancelledOrders: Object;
  dataforStats: Object;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public dataServices: DataService
  ) {}

  ngOnInit() {
    this.getDataforProductTable();
    this.getDataforProcessingTable();
    this.getDataforCancelledTable();
    this.getDataforStats();
  }

  getDataforProductTable() {
    this.dataServices.getServerData("ecommerce", "getallproducts", [''])
      .subscribe(getallproducts => {
        this.DataforProductTable = getallproducts;
      });
  }

  getDataforProcessingTable() {
    this.dataServices.getServerData("ecommerce", "getallprocessingproducts", [''])
      .subscribe(getallprocessingproducts => {
        this.DataforProcessingOrders = getallprocessingproducts;
      });
  }

  getDataforCancelledTable() {
    this.dataServices.getServerData("ecommerce", "getallcancelledproducts", [''])
      .subscribe(getallcancelledproducts => {
        this.DataforCancelledOrders = getallcancelledproducts;
      });
  }

  getDataforStats() {
    this.dataServices.getServerData("ecommerce", "getallstats", [''])
      .subscribe(getallstats => {
        this.dataforStats = getallstats[0];
      });
  }
}
