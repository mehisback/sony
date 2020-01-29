import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxTreeListModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
import { DxChartModule, DxRangeSelectorModule  } from 'devextreme-angular';



@Component({
  selector: 'app-ardetails',
  templateUrl: './ardetails.component.html',
  styleUrls: ['./ardetails.component.css'],
  providers: [DatePipe]
})
export class ArdetailsComponent implements OnInit {
  dataSource: Object;
  dataSourceDetails: Object;
  curDate: any = new Date();
  companyHeader = null;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    barThickness: 10
  };

  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData:any = [];
  public barChartColors: Array<any> = [
    { backgroundColor: '#55ce63' },
    { backgroundColor: '#009efb' }
  ];
  dateValue: [] = null;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dateValue = [];
    this.curDate = this.datePipe.transform(this.curDate, 'yyyy-MM-dd');
    this.initialFunc();
  }

  initialFunc() {
    
    this.dataFromService.getServerData("ARDashboard1", "getRecords", ['', this.curDate])
      .subscribe(gotData => {
        this.dataSource = gotData;
        this.barChartData = gotData;
          for(var i = 0; i<this.barChartData.length;i++ ){
            
            if(Number(this.barChartData[i]["1-30Days"]) != 0){
            this.barChartData[i]["1-30Days"]= parseFloat(this.barChartData[i]["1-30Days"]).toFixed(2);
            }
            else{
              this.barChartData[i]["1-30Days"] = "";            
            }
            if(Number(this.barChartData[i]["31-60Days"]) != 0){
            this.barChartData[i]["31-60Days"]= parseFloat(this.barChartData[i]["31-60Days"]).toFixed(2);
            }
            else{
              this.barChartData[i]["31-60Days"] = "";
            }
            if(Number(this.barChartData[i]["61-90Days"]) != 0){
            this.barChartData[i]["61-90Days"]= parseFloat(this.barChartData[i]["61-90Days"]).toFixed(2);
            }
            else{
              this.barChartData[i]["61-90Days"] ="";
            }
            if(Number(this.barChartData[i]["MoreThan90Days"]) != 0){
            this.barChartData[i]["MoreThan90Days"]= parseFloat(this.barChartData[i]["MoreThan90Days"]).toFixed(2);
            }
            else{
              this.barChartData[i]["MoreThan90Days"] ="";
            }
          }
      });
   

  }

  onTabChange(event){
    if(event.nextId == 'AgingDetails'){
      this.dataFromService.getServerData("ARDetails", "getRecords", ['', this.curDate])
      .subscribe(gotDataDetails => {
        this.dataSourceDetails = gotDataDetails;
      
      });
    }
  }

  formSummary_fieldDataChanged(event){
    this.dateValue = [];
    if(event.value == null){
    this.dateValue["Date"] =this.curDate;
  }
  else{
    
  //  this.dateValue["Date"] = event.value;
    this.curDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.initialFunc();
  }
    //this.curDate = event.value;
  }

 customizeTooltip(arg: any) {
    if(arg.valueText ==""){
      arg.valueText = 0.00;
    }
    return {
        text: arg.argumentText + ' - ' + arg.seriesName + ' - ' + parseFloat(arg.valueText).toFixed(2)
    };
}

}
