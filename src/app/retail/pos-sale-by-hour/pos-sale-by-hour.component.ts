import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../../data.service';
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ToastrService } from 'ngx-toastr';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';


@Component({
  selector: 'app-pos-sale-by-hour',
  templateUrl: './pos-sale-by-hour.component.html',
  styleUrls: ['./pos-sale-by-hour.component.css'],
  providers: [DatePipe]
})
export class PosSaleByHourComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  userID: String = UtilsForGlobalData.getUserId();
  currentDate: String = UtilsForGlobalData.getCurrentDate();
  FormDate: any = {};
  dataSource: Object;
  error: void;
  storeList: DataSource;
  tempStoreID: any;

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public router: Router,
    public dataServices: DataService
  ) { }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 30);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');
    this.callDataforDataGrid();
  }

  callDataforDataGrid() {
    this.dataServices.getServerData("posSale", "posSalebyHour", ["", this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate])
      .subscribe(posSalebyPayment => {
        this.dataSource = posSalebyPayment[1];
        this.gridContainer.instance.refresh();
      });
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate") {
        this.FormDate.DocumentFromDate = e.value;
        this.callDataforDataGrid();
        this.gridContainer.instance.refresh();
      }
      if (e.dataField == "DocumentToDate") {
        this.FormDate.DocumentToDate = e.value;
        this.callDataforDataGrid();
        this.gridContainer.instance.refresh();
      }
    }
  }

}
