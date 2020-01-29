import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxDataGridComponent
} from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { DatePipe } from '@angular/common';

/* @Author Ganesh
/* this is For Payment- Method
/* On 12-03-2019
*/

@Component({
  selector: 'app-payment-master',
  templateUrl: './payment-master.component.html',
  styleUrls: ['./payment-master.component.css'],
  providers: [DatePipe]
})

export class PaymentMasterComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerMain") gridContainerMain: DxDataGridComponent;

  dataSource: CustomStore;
  dataSource2: CustomStore;
  dataSourceGL: any = [];
  paymentMaster = {};
  duplicatepaymentMaster = [];
  COALookUpSuggestions = {};
  paymentMasterCode: String;
  codeforSetup: any = [];
  listforSecondDatarid: Object;
  gotSelectedLists: Object;
  gotListCHILDONLY: DataSource;
  paymentMethodArr = ['CASH', 'CHEQUE', 'BANK', 'CREDITCARD', 'DEBITCARD', 'OTHER', 'PDC'];
  PayLDate: any = {};

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.PayLDate.DocumentFromDate = new Date();
    this.PayLDate.DocumentToDate = new Date();

    this.PayLDate.DocumentFromDate.setMonth(this.PayLDate.DocumentFromDate.getMonth() - 1);
    this.PayLDate.DocumentFromDate = this.datePipe.transform(this.PayLDate.DocumentFromDate, 'yyyy-MM-dd');
    this.PayLDate.DocumentToDate = this.datePipe.transform(this.PayLDate.DocumentToDate, 'yyyy-MM-dd');

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PaymentMaster", "getList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("PaymentMaster", "btnValidate_clickHandler", ["",
            values["Code"],
            '']).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
                thisComponent.toastr.success("Saved Successfully");
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("COALookUp", "getListCHILDONLY", [''])
      .subscribe(callData3 => {
        this.COALookUpSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataSource2 = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PaymentMaster", "getPaymentEntries", ["",
          thisComponent.PayLDate.DocumentFromDate,
          thisComponent.PayLDate.DocumentToDate,
          thisComponent.paymentMasterCode])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });
  }

  formateForCOALookUpSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  hoverFormateForCOALookUpSuggestion(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }


  onDropDownCodeChanged(event, dataField) {
    if (this.duplicatepaymentMaster[0][dataField] != event.value) {
      event.value = (event.value == null ? '' : event.value);
      this.duplicatepaymentMaster[0]["" + dataField] = event.value;
      this.paymentMaster["" + dataField] = event.value;
      this.dataFromService.getServerData("PaymentMaster", "updateSelectedRecord", ["",
        dataField, event.value,
        this.paymentMasterCode])
        .subscribe(callData3 => {
          this.errorHandlingToaster(callData3);
        });
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (Object.keys(this.duplicatepaymentMaster).length > 0 ? this.duplicatepaymentMaster[0][e.dataField] != e.value : false) {
        if (e.dataField == 'HasBankCharge' || e.dataField == 'AllowCheque') {
          var temp = (e.value == true ? 'Yes' : 'No');
          if (this.duplicatepaymentMaster[0][e.dataField] != temp) {
            this.dataFromService.getServerData("PaymentMaster", "updateSelectedRecord", ["",
              e.dataField, temp,
              this.paymentMasterCode])
              .subscribe(callData3 => {
                this.errorHandlingToaster(callData3);
              });
          }
        } else {
          //this.duplicatepaymentMaster[0][e.dataField] = e.value;
          this.dataFromService.getServerData("PaymentMaster", "updateSelectedRecord", ["",
            e.dataField, e.value,
            this.paymentMasterCode])
            .subscribe(callData3 => {
              this.errorHandlingToaster(callData3);
            });
        }
      }
    }
  }

  errorHandlingToaster(callData) {
    if (callData <= 0) {
      this.toastr.error("Error In Updating!!", "Try Again");
    } else {
      this.toastr.success("Successfully Updated!");
    }
    this.gridContainerMain.instance.refresh();
  }

  PayMForm_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      this.gridContainer.instance.refresh();
    }
  }

  onUserRowSelect(event) {
    this.paymentMasterCode = event.data.Code;
    this.dataFromService.getServerData("PaymentMaster", "getSelectedRecord", ['', this.paymentMasterCode])
      .subscribe(getList2 => {
        getList2[0]["BankChargePerct"] = Number(getList2[0]["BankChargePerct"]).toFixed(2);
        this.assignToDuplicate(getList2);
        this.paymentMaster = getList2[0];
        if (this.paymentMaster["AllowCheque"] == 'Yes') {
          this.paymentMaster["AllowCheque"] = true;
        } else {
          this.paymentMaster["AllowCheque"] = false;
        }
        if (this.paymentMaster["HasBankCharge"] == 'Yes') {
          this.paymentMaster["HasBankCharge"] = true;
        } else {
          this.paymentMaster["HasBankCharge"] = false;
        }
        this.gridContainer ? this.gridContainer.instance.refresh() : '';
      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicatepaymentMaster = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatepaymentMaster["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatepaymentMaster[i][prop] = data[i][prop];
      }
    }
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (!this.paymentMasterCode) {
      event.preventDefault();
      this.toastr.warning("Please Select The Payment Code!!");
    }
  }

  getTasksdataSource(key) {
    var dummyThis = this;
    let item = this.dataSourceGL.find((i) => i.key === key);
    if (!item) {
      item = {
        key: key,
        dataSourceInstance: new DataSource({
          store: new CustomStore({
            key: ["DocumentNo"],
            load: function (loadOptions) {
              var devru = $.Deferred();
              dummyThis.dataFromService.getServerData("GLEntries", "getHeaderListBYDOCUMENT", ["", key["DocumentNo"]])
                .subscribe(data => {
                  devru.resolve(data);
                });
              return devru.promise();
            }
          })
        })
      };
      this.dataSourceGL.push(item);
    }
    return item.dataSourceInstance;
  }

}
