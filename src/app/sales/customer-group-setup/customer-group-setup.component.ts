import {
  Component, OnInit, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-customer-group-setup',
  templateUrl: './customer-group-setup.component.html',
  styleUrls: ['./customer-group-setup.component.css']
})
export class CustomerGroupSetupComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: any;
  dataSource2: any;

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
      key: ["Code", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CustomerSetup", "getCustomerGroup", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CustomerSetup", "deleteRecordcustomergroup", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CustomerSetup", "savePressed", ["",
          values["Code"],
          values["Description"]])
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

    this.dataSource2 = new CustomStore({
      key: ["Code", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CustomerSetup", "getCustomerType", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("CustomerSetup", "DELETERecordcustomertype", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTcustomertype", ["",
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

  }

}
