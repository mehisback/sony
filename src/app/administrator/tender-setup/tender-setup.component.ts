import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';


@Component({
  selector: 'app-tender-setup',
  templateUrl: './tender-setup.component.html',
  styleUrls: ['./tender-setup.component.css']
})
export class TenderSetupComponent implements OnInit {

  dataSource: CustomStore;
  tenderSuggestions: any = [{ Code: 'CASH' }, { Code: 'CREDITCARD' }, { Code: 'VOUCHER' }, { Code: 'OTHERS' }];

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Name", "TenderType"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("TenderSetup", "getList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("TenderSetup", "btnSave_clickHandler", ["",
          values["Code"],
          values["Name"],
          values["TenderType"]])
          .subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + data[0]);
            }
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("TenderSetup", "btnDelete_clickHandler", ["",
          key["Code"],
          key["TenderType"]
        ])
          .subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            }
            else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["Code"] + ", Error Status Code is Denied and " + data);
            }
          });
        return devru.promise();
      },

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

}
