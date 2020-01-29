import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-report-setup',
  templateUrl: './report-setup.component.html',
  styleUrls: ['./report-setup.component.css']
})
export class ReportSetupComponent implements OnInit {
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;

  reportSetup: CustomStore;
  reportsetupForm: any = {};
  DocumentList = ['SI', 'SO'];
  getTheItemLookup = ['Y', 'N'];

  constructor(
    public dataServices: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  onDocumentListChange(event) {
    var thisComponent = this;
    this.reportSetup = new CustomStore({
      key: ["Code", "Required", "ReportType"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataServices.getServerData("reportssetup", "getAllReportsSetup", ['',
          event.value
        ]).subscribe(getAllReportsSetup => {
          devru.resolve(getAllReportsSetup);
        });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.dataServices.getServerData("reportssetup", "updateReportSetup", ['',
          getUpdateValues(key, newValues, "Required"),
          getUpdateValues(key, newValues, "Code"),
          getUpdateValues(key, newValues, "MetaData"),
          getUpdateValues(key, newValues, "ReportType")
        ]).subscribe(data => {
          if (data == 1) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines");
          }
        });
        return devru.promise();
      }
    });
    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }



}
