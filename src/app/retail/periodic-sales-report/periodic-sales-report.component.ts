import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-periodic-sales-report',
  templateUrl: './periodic-sales-report.component.html',
  styleUrls: ['./periodic-sales-report.component.css']
})
export class PeriodicSalesReportComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("reportrefresh") reportrefresh: DxDataGridComponent;
  @ViewChild("reportitemdata") reportitemdata: DxDataGridComponent;
  @ViewChild("reportVariant") reportVariant: DxDataGridComponent;
  @ViewChild("reportCategory") reportCategory: DxDataGridComponent;
  @ViewChild("reportBrand") reportBrand: DxDataGridComponent;
  @ViewChild("reportPayments") reportPayments: DxDataGridComponent;

  storeList: DataSource;
  POSList: DataSource;
  formdataforbutton: any = {};
  datasource: CustomStore;
  itemdata: CustomStore;
  variantdata: CustomStore;
  categorydata: CustomStore;
  branddata: CustomStore;
  paymentdata: CustomStore;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.dataFromService.getServerData("PeriodicReport", "titlewindow1_creationCompleteHandler", [""])
      .subscribe(titlewindow1_creationCompleteHandler => {
        this.storeList = new DataSource({
          store: <String[]>titlewindow1_creationCompleteHandler,
          paginate: true,
          pageSize: 10
        });
      });

    var thisComponent = this;

    thisComponent.datasource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.formdataforbutton["fromDate"]) {
          var currUserStamp = UtilsForGlobalData.getUserId() + 'PS' + new Date().getTime();
          thisComponent.dataFromService.getServerData("PeriodicReport", "getList", ["",
            currUserStamp,
            thisComponent.formdataforbutton["fromDate"],
            thisComponent.formdataforbutton["toDate"],
            thisComponent.formdataforbutton["POSID"],
            thisComponent.formdataforbutton["StoreID"],
            UtilsForGlobalData.getUserId()]).subscribe(dataLines => {
              if (dataLines[0] == 'DONE') {
                devru.resolve(dataLines[1]);
                thisComponent.reportitemdata ? thisComponent.reportitemdata.instance.refresh() : '';
                thisComponent.reportVariant ? thisComponent.reportVariant.instance.refresh() : '';
                thisComponent.reportCategory ? thisComponent.reportCategory.instance.refresh() : '';
                thisComponent.reportBrand ? thisComponent.reportBrand.instance.refresh() : '';
                thisComponent.reportPayments ? thisComponent.reportPayments.instance.refresh() : '';
              } else {
                devru.reject("Error While Creating the Report !!, Error Status Code : " + dataLines[0]);
              }
              thisComponent.dataFromService.getServerData("PeriodicReport", "onGetGeneralStats", ["",
                currUserStamp]).subscribe(dataStatus => {
                  thisComponent.toastr.success("Report Created Successfully!!", "Done");
                });
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      }
    });


    thisComponent.itemdata = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.formdataforbutton["fromDate"]) {
          thisComponent.dataFromService.getServerData("PeriodicReport", "getGroup1Data", ["",
            thisComponent.formdataforbutton["StoreID"],
            thisComponent.formdataforbutton["POSID"],
            thisComponent.formdataforbutton["fromDate"],
            thisComponent.formdataforbutton["toDate"]]).subscribe(dataLines => {
              devru.resolve(dataLines);
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      }
    });

    thisComponent.variantdata = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("PeriodicReport", "getGroup2Data", ["",
          thisComponent.formdataforbutton["StoreID"],
          thisComponent.formdataforbutton["POSID"],
          thisComponent.formdataforbutton["fromDate"],
          thisComponent.formdataforbutton["toDate"]]).subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    thisComponent.categorydata = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("PeriodicReport", "getGroup3Data", ["",
          thisComponent.formdataforbutton["StoreID"],
          thisComponent.formdataforbutton["POSID"],
          thisComponent.formdataforbutton["fromDate"],
          thisComponent.formdataforbutton["toDate"]]).subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    thisComponent.branddata = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("PeriodicReport", "getGroup4Data", ["",
          thisComponent.formdataforbutton["StoreID"],
          thisComponent.formdataforbutton["POSID"],
          thisComponent.formdataforbutton["fromDate"],
          thisComponent.formdataforbutton["toDate"]]).subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    thisComponent.paymentdata = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("PeriodicReport", "getGroup5Data", ["",
          thisComponent.formdataforbutton["StoreID"],
          thisComponent.formdataforbutton["POSID"],
          thisComponent.formdataforbutton["fromDate"],
          thisComponent.formdataforbutton["toDate"]]).subscribe(dataLines => {
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

  }

  suggestionFormateForStore(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "StoreID");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "StoreID");
  }

  suggestionFormateForPOS(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "POSID");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "POSID");
  }

  onStoreIDCodeChanged(event) {
    if (event.value != null) {
      this.dataFromService.getServerData("PeriodicReport", "onGetStoreList", ["", event.value])
        .subscribe(onGetStoreList => {
          this.formdataforbutton["StoreID"] = event.value;
          this.POSList = new DataSource({
            store: <String[]>onGetStoreList,
            paginate: true,
            pageSize: 10
          });
        });
    }
  }

  onPOSIDCodeChanged(event) {
    this.formdataforbutton["POSID"] = event.value;
  }


  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'StoreID' || e.dataField == 'POSID' || e.dataField == 'fromDate' || e.dataField == 'toDate') {
      try {
        if (e.dataField == 'fromDate' || e.dataField == 'toDate')
          e.value = e.value.toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');
      } catch (Error) { }
      this.formdataforbutton[e.dataField] = e.value;
    }
  }

  OnCreateReport() {
    if (this.formdataforbutton["fromDate"] ? this.formdataforbutton["toDate"] ?
      this.formdataforbutton["StoreID"] ? this.formdataforbutton["POSID"] : false : false : false) {
      this.reportrefresh.instance.refresh();
    } else {
      this.toastr.warning("Please Select all the Required Fields, For the Report!!");
    }
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (this.formdataforbutton["fromDate"] ? this.formdataforbutton["toDate"] ?
      this.formdataforbutton["StoreID"] ? this.formdataforbutton["POSID"] : false : false : false) {
    } else {
      event.preventDefault();
      this.toastr.warning("Please Select all the Required Fields, For the Report!!");
    }
  }

}
