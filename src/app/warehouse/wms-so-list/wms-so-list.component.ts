import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-wms-so-list',
  templateUrl: './wms-so-list.component.html',
  styleUrls: ['./wms-so-list.component.css'],
  providers: [DatePipe]
})
export class WmsSoListComponent implements OnInit {
  dataSource: Object;
  currentDate: String = UtilsForGlobalData.getCurrentDate();
  FormDate: any = {};

  constructor(
    public router: Router, 
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate()- 30);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    this.getDataforDatagrid();
  }

  getDataforDatagrid(){
    this.dataFromService.getServerData("WMSSOList", "getShippingList", ["",
    this.FormDate.DocumentFromDate,
    this.FormDate.DocumentToDate])
    .subscribe(getReceipLlist => {
      this.dataSource = getReceipLlist[1];
    });

  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate"){
        this.FormDate.DocumentFromDate  = e.value;
        this.getDataforDatagrid();
      }
      if (e.dataField == "DocumentToDate"){
        this.FormDate.DocumentToDate  = e.value;
        this.getDataforDatagrid();
      }
    }
  }
}
