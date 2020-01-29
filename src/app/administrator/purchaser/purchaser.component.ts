import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/data/odata/store';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-purchaser',
  templateUrl: './purchaser.component.html',
  styleUrls: ['./purchaser.component.css']
})
export class PurchaserComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  continents: any = {};
  PurchaserDetails: any = {};
  Code: any = {};
  visiblityDETAILS: Boolean = false;
  duplicatePurchaserDetails: any = [];

  constructor(
    public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.continents = new CustomStore({
      key: ["Code", "Name", "Commision"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PurchaserEdit", "getAllSP", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PurchaserEdit", "button4_clickHandler", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with LineNo: " + key["LineNo"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if(values["Code"] ? values["Code"] != '' : false){
        dummyDataServive.getServerData("PurchaserEdit", "createNewSP", ["",
          values["Code"], '']).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
            }
          });
        } else{
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  onUserRowSelect(event) {
    var result = [];
    result.push(event.data);
    this.assignToDuplicate(result);
    this.Code = event.data.Code;
    this.PurchaserDetails = event.data;
    this.visiblityDETAILS = true;

  }

  purchaser_fieldData(e) {
    if (Object.keys(this.duplicatePurchaserDetails).length > 0 ? this.duplicatePurchaserDetails[0][e.dataField] != e.value : e.value != null) {
      this.dataFromService.getServerData("PurchaserEdit", "updateSP", ["",
        e.dataField, e.value,
        this.Code]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
    this.gridContainer.instance.refresh();
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicatePurchaserDetails = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatePurchaserDetails["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatePurchaserDetails[i][prop] = data[i][prop];
      }
    }
  }

}
