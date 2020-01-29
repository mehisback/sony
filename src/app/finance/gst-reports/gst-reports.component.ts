import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import { RouteInfo } from '../../shared/sidebar/sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  NgbModal, NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { DataService } from '../../data.service';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
const data: any = require('./data.json');

@Component({
  selector: 'app-gst-reports',
  templateUrl: './gst-reports.component.html',
  styleUrls: ['./gst-reports.component.css'],
  providers: [DatePipe]
})
export class GstReportsComponent implements OnInit {

  currentDate: String = UtilsForGlobalData.getCurrentDate();
  FormDate: any = {};
  userID: String = UtilsForGlobalData.getUserId();
  datasource1: any;
  datasource2: any;
  datasource11: any;
  result = [];

  constructor(
    private datePipe: DatePipe,
    public dataServices: DataService) { }

  ngOnInit() {
    console.log(data);
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 180);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    this.datagridone();
    this.datagridtwo();
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate") {
        this.FormDate.DocumentFromDate = e.value;
        this.getData();
      }
      if (e.dataField == "DocumentToDate") {
        this.FormDate.DocumentToDate = e.value;
        this.getData();
      }
    }
  }

  getData() {
    // this.dataServices.getServerData("Dashboard2_Reports1", "stat_dashboard2_1", ['',
    //   this.FormDate.DocumentFromDate,
    //   this.FormDate.DocumentToDate,
    //   this.userID]).subscribe(stat_dashboard2_1 => {

    //   });
  }

  datagridone() {
    this.datasource1 = data["b2b"];

    // for (var i = 0; i < this.datasource1.length; i++) {
    //   delete this.datasource1[i]['ctin'];
    //   this.datasource1[i]  = this.datasource1[i]["inv"];
    // }
    //console.log(this.datasource1);

    /* const result = this.datasource1
      .map((item) => item.inv.map((inv) => ({ ctin: item.ctin })))
      .reduce((a, b) => a.concat(b), []); */
    // for (var j = 0; j < this.datasource1.length; j++) {
    //   for (var i = 0; i < this.datasource1[j].inv.length; i++) {
    //     this.datasource1[j].inv[i].ctin = this.datasource1[j]["ctin"];
    //   }
    //   delete this.datasource1[j]['ctin'];
    //   this.result.push(this.datasource1[j].inv);
    // }

    let notFlattened = this.datasource1.map(({ctin, inv}) => {
      inv = inv.map(r=> {
            r.ctin = ctin;
            return r;
        });
      return inv;
  })
  this.result = [].concat.apply([], notFlattened);
  
  console.log(this.result);
  }

  datagridtwo() {
    this.datasource2 = data["b2cs"];
  }

}
