import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';

@Component({
  selector: 'app-gst-setup',
  templateUrl: './gst-setup.component.html',
  styleUrls: ['./gst-setup.component.css']
})
export class GstSetupComponent implements OnInit {
  dataSource: CustomStore;
  tenderSuggestions: any = [{ Code: 'CASH' }, { Code: 'CREDITCARD' }, { Code: 'VOUCHER' }];
  VATBusPostingGrpSuggesstions: Object;
  VATProdPostingGrpSuggesstions: Object;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("VATBusPostingGrp", "getList", [""])
      .subscribe(data => {
        this.VATBusPostingGrpSuggesstions = data;
      });

    this.dataFromService.getServerData("VATProdPostingGrp", "getList", [""])
      .subscribe(data => {
        this.VATProdPostingGrpSuggesstions = data;
      });

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["VATBusPostingGroup", "VATProdPostingGroup", "VATpercentage"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATPostingSetup", "getList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATPostingSetup", "savePressedAdd", ["",
          values["VATBusPostingGroup"],
          values["VATProdPostingGroup"],
          values["VATpercentage"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with VATBusPostingGroup: " + values["VATBusPostingGroup"] + ", Error Status Code is INSERT-ERR");
            }
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATPostingSetup", "delBtnPressed", ["",
          key["VATBusPostingGroup"],
          key["VATProdPostingGroup"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            }
            else {
              devru.reject("Error while Updating the Lines with VATBusPostingGroup: " + key["VATBusPostingGroup"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VATPostingSetup", "savePressedModify", ["",
          getUpdateValues(key, newValues, "VATBusPostingGroup"),
          getUpdateValues(key, newValues, "VATProdPostingGroup"),
          getUpdateValues(key, newValues, "VATpercentage")]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with VATBusPostingGroup: " + getUpdateValues(key, newValues, "VATBusPostingGroup") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

}
