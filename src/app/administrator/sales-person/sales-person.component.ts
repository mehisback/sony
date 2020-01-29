import {
  Component, OnInit, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css']
})
export class SalesPersonComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: any;
  Active = [{ "Code": "Yes" }, { "Code": "No" }];

  constructor(
    public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Name", "Commision", "Active"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("Salesperson", "getRecordList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SalesPersonEdit", "button4_clickHandler", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SalesPersonEdit", "UpdateSalesPerson", ["",
          getUpdateValues(key, newValues, "Name"),
          getUpdateValues(key, newValues, "Commision"),
          getUpdateValues(key, newValues, "Active"),
          getUpdateValues(key, newValues, "Code")
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines with LineNo: " + getUpdateValues(key, newValues, "LineNo") + ", Error Status Code is UPDATE-ERR");
          }
        });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("SalesPersonEdit", "createNewSP", ["",
          values["Code"],
          values["Name"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
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
    this.gridContainer.instance.columnOption("Code", "allowEditing", true);
    this.gridContainer.instance.columnOption("Name", "allowEditing", true);
    this.gridContainer.instance.columnOption("Commision", "allowEditing", false);
    this.gridContainer.instance.columnOption("Active", "allowEditing", false);
  }

  onEditingStart(event) {
    this.gridContainer.instance.columnOption("Code", "allowEditing", false);
    this.gridContainer.instance.columnOption("Name", "allowEditing", true);
    this.gridContainer.instance.columnOption("Commision", "allowEditing", true);
    this.gridContainer.instance.columnOption("Active", "allowEditing", true);
  }

  suggestionFormateForDropDown2(data) {
    return data ? data.Code : '';
  }

  hover2(data) {
    return "<div class='custom-item' title='" + data.Code + "'>" + data.Code + "</div>";
  }


}
