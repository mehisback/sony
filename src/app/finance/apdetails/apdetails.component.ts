import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import CustomStore from 'devextreme/data/custom_store';


@Component({
  selector: 'app-apdetails',
  templateUrl: './apdetails.component.html',
  styleUrls: ['./apdetails.component.css'],
  providers: [DatePipe]
})

export class ApdetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: CustomStore;
  dataSourceDetails: any;
  p;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    barThickness: 10
  };

  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any;
  public barChartColors: Array<any> = [
    { backgroundColor: '#55ce63' },
    { backgroundColor: '#009efb' }
  ];
  dateValue: any = {};

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.dateValue["Date"] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["VendorNo", "current", "1-30Days", "31-60Days", "61-90Days", "MoreThan90Days"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("APDetails", "getRecords", ['',
          thisComponent.dateValue["Date"]]).subscribe(gotData => {
            thisComponent.barChartData = gotData;
            for (var i = 0; i < Object.keys(thisComponent.barChartData).length; i++) {
              thisComponent.barChartData[i]["current"] = parseFloat(thisComponent.barChartData[i]["current"]).toFixed(2);
              thisComponent.barChartData[i]["1-30Days"] = parseFloat(thisComponent.barChartData[i]["1-30Days"]).toFixed(2);
              thisComponent.barChartData[i]["31-60Days"] = parseFloat(thisComponent.barChartData[i]["31-60Days"]).toFixed(2);
              thisComponent.barChartData[i]["61-90Days"] = parseFloat(thisComponent.barChartData[i]["61-90Days"]).toFixed(2);
              thisComponent.barChartData[i]["MoreThan90Days"] = parseFloat(thisComponent.barChartData[i]["MoreThan90Days"]).toFixed(2);
            }
            devru.resolve(gotData);
          });
        return devru.promise();
      }
    });
  }

  initialFunc() {




  }

  formSummary_fieldDataChanged(event) {
    this.gridContainer.instance.refresh();
  }
}
