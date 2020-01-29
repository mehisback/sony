import {
  Component, OnInit, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-vendor-type-setup',
  templateUrl: './vendor-type-setup.component.html',
  styleUrls: ['./vendor-type-setup.component.css']
})
export class VendorTypeSetupComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: any;

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
        dummyDataServive.getServerData("VendorSetup", "getCodeName", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("VendorSetup", "deleteVendorTypeMaster", ["", key["Code"]])
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
        dummyDataServive.getServerData("VendorSetup", "insertVendorTypeMaster", ["",
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
