import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-currency-exchange-setup',
  templateUrl: './currency-exchange-setup.component.html',
  styleUrls: ['./currency-exchange-setup.component.css']
})
export class CurrencyExchangeSetupComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: CustomStore;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }


  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["CurrencyCode", "EffectiveDate", "ExchangeRate", "LocalCurrency", "EntryNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CurrencyExchangeRateSetup", "getList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CurrencyExchangeRateSetup", "btnSave_clickHandler", ["",
          getUpdateValues(key, newValues, "EffectiveDate"),
          getUpdateValues(key, newValues, "CurrencyCode"),
          getUpdateValues(key, newValues, "ExchangeRate"),
          getUpdateValues(key, newValues, "LocalCurrency"),
          getUpdateValues(key, newValues, "EntryNo")]).subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is " + data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CurrencyExchangeRateSetup", "btnNewCode_clickHandler", ["",
          values["CurrencyCode"],values["ExchangeRate"] ])
          .subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is " + data[0]);
            }
          });
        return devru.promise();
      }

    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

  onInitNewRow(event) {
    this.gridContainer.instance.columnOption("CurrencyCode", "allowEditing", true);
    this.gridContainer.instance.columnOption("LocalCurrency", "allowEditing", false);
    this.gridContainer.instance.columnOption("EffectiveDate", "allowEditing", true);
    this.gridContainer.instance.columnOption("ExchangeRate", "allowEditing", true);
  }

  onEditNewRow(event) {
    this.gridContainer.instance.columnOption("CurrencyCode", "allowEditing", false);
    this.gridContainer.instance.columnOption("LocalCurrency", "allowEditing", false);
    this.gridContainer.instance.columnOption("EffectiveDate", "allowEditing", true);
    this.gridContainer.instance.columnOption("ExchangeRate", "allowEditing", true);
  }


}
