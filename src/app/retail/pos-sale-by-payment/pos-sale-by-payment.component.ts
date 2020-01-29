import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../../data.service';
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ToastrService } from 'ngx-toastr';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-pos-sale-by-payment',
  templateUrl: './pos-sale-by-payment.component.html',
  styleUrls: ['./pos-sale-by-payment.component.css'],
  providers: [DatePipe]
})
export class PosSaleByPaymentComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  userID: String = UtilsForGlobalData.getUserId();
  currentDate: String = UtilsForGlobalData.getCurrentDate();
  FormDate: any = {};
  columns: any = [];
  dataSource: CustomStore;
  error: void;
  storeList: DataSource;
  tempStoreID: any;

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public router: Router,
    public dataServices: DataService
  ) { }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 30);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');
    this.getStoreList();

    var thisComponent = this;
    thisComponent.dataSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.tempStoreID) {
          thisComponent.dataServices.getServerData("posSale", "posSalebyPayment", ["",
            thisComponent.tempStoreID,
            thisComponent.FormDate["DocumentFromDate"],
            thisComponent.FormDate["DocumentToDate"]]).subscribe(dataLines => {
              if (dataLines[0] == 'DONE') {
                thisComponent.columns = [];
                if (Object.keys(dataLines[1]).length > 0) {
                  for (var prop in dataLines[1][0]) {
                    if (isNaN(dataLines[1][0][prop])) {
                      thisComponent.columns.push({ dataField: prop });
                    } else {
                      thisComponent.columns.push({ dataField: prop, alignment: "right" });
                    }
                  }
                }
                devru.resolve(dataLines[1]);
              } else {
                devru.reject("Data Transaction Not Available For this Date!!, Error Status Code: " + dataLines[0])
              }
            });
        } else {
          devru.resolve([]);
        }
        return devru.promise();
      }
    });

  }

  getStoreList() {
    this.dataServices.getServerData("PeriodicReport", "titlewindow1_creationCompleteHandler", [""])
      .subscribe(titlewindow1_creationCompleteHandler => {
        this.storeList = new DataSource({
          store: <String[]>titlewindow1_creationCompleteHandler,
          paginate: true,
          pageSize: 10
        });
      });
  }


  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Server Error");
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.gridContainer.instance.refresh();
      }
    }
  }

  suggestionFormateForStore(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "StoreID");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "StoreID");
  }

  onStoreIDCodeChanged(event) {
    this.tempStoreID = event.value;
    this.gridContainer.instance.refresh();
  }

}
