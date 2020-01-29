import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import DataSource from "devextreme/data/data_source";
import { DatePipe } from '@angular/common';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.css'],
  providers: [DatePipe]
})
export class FiscalYearComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  fiscalYearListSuggestions: DataSource;
  fiscalYearList: any = {};
  fiscalYearListGrid: any = {};
  newFiscalPOPUP: boolean;
  newFiscalDetail: [] = null;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    var thisComponent = this;
    this.getFiscalYear();

    this.fiscalYearListGrid = new CustomStore({
      key: ["FiscalPeriod", "StartingDate", "EndingDate", "FiscalQuater", "FiscalStaus"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("FiscalYear", "getFiscalYearLines", ['',
          thisComponent.fiscalYearList["FiscalYearID"]])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });
  }

  getFiscalYear() {
    this.dataFromService.getServerData("FiscalYear", "getFiscalYears", [""])
      .subscribe(gotTrackValues => {
        this.fiscalYearListSuggestions = new DataSource({
          store: <String[]>gotTrackValues,
          paginate: true,
          pageSize: 10
        });
      });
  }

  suggestionFormatForFiscalYearCodeList(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "FiscalYearID","FYStartDate");
  }

  onFiscalYearChanged(e) {
    if (e.value != null) {
      this.fiscalYearList["FiscalYearID"] = e.value;
      this.gridContainer.instance.refresh();
      var array = this.fiscalYearListSuggestions["_store"]._array;
      for (var index = 0; index < array.length; ++index) {
        if (array[index].FiscalYearID == e.value) {
          this.fiscalYearList["StartingDate"] = array[index].FYStartDate;
          this.fiscalYearList["EndingDate"] = array[index].FYEndDate;
          this.fiscalYearList["FiscalStaus"] = array[index].FiscalStatus;
          break;
        }
      }
    }
  }

  allowNewclick(event) {
    this.newFiscalPOPUP = true;
    this.newFiscalDetail = [];
  }

  SaveNewFiscal() {
    this.formWidget.instance.updateData(this.newFiscalDetail);
    var data = this.formWidget.instance.option("formData");
    if (this.newFiscalDetail["FiscalYearID"] != null) {

      if (this.newFiscalDetail["StartingDate"] != null) {
        this.newFiscalDetail["StartingDate"] = this.datePipe.transform(this.newFiscalDetail["StartingDate"], 'yyyy-MM-dd');
        this.dataFromService.getServerData("CreateFiscalYear", "createNewFiscalYear", ['', this.newFiscalDetail["StartingDate"],
          this.newFiscalDetail["FiscalYearID"], UtilsForGlobalData.getUserId()])
          .subscribe(createdDocRes => {
            this.newFiscalPOPUP = false;
            if (createdDocRes[0]) {
              this.toastr.success(this.newFiscalDetail["FiscalYearID"] + " Saved Successfully");
              this.getFiscalYear();
            } else {
              this.toastr.error("Error while creating Fiscal year,Please check if this ID already exists? Error Status Code: " + createdDocRes[0]);
            }
          })
      } else {
        this.toastr.warning("Please Select Starting Date");
      }
    } else {
      this.toastr.warning("Please Enter Fiscal Year");
    }
  }

  form_fieldDataChanged(e) {
    // console.log(event);
  }

}
