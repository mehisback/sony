import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../../data.service';
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory-with-cost',
  templateUrl: './inventory-with-cost.component.html',
  styleUrls: ['./inventory-with-cost.component.css'],
  providers: [DatePipe]
})
export class InventoryWithCostComponent implements OnInit {

  userID: String = UtilsForGlobalData.getUserId();
  currentDate: String = UtilsForGlobalData.getCurrentDate();
  FormDate: any = {};
  dataSource: Object;
  error: void;
  dataSource2: Object;


  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public router: Router,
    public dataServices: DataService
  ) { }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentToDate = new Date();
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');
    this.callDataforTabOne();
    this.callDataforTabTwo();
  }

  callDataforTabOne() {
    this.dataServices.getServerData("InventoryAccounting", "getStockAndCost", ["", this.FormDate.DocumentToDate, this.userID])
      .subscribe(getHeaderListBYDOCUMENT => {
        this.dataSource = getHeaderListBYDOCUMENT[1];
      },
        error => this.error = this.alertCode(error)
      );
  }

  callDataforTabTwo() {
    this.dataServices.getServerData("InventoryAccounting", "getLotCost", ["", this.FormDate.DocumentToDate])
      .subscribe(getHeaderListBYDOCUMENT => {
        this.dataSource2 = getHeaderListBYDOCUMENT;
      },
        error => this.error = this.alertCode(error)
      );
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

  getFormatOfNumber(e) {
    return UtilsForSuggestion.getStandardFormatNumber(e.value);
  }


  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentToDate") {
        this.FormDate.DocumentToDate = e.value;
        this.callDataforTabOne();
        this.callDataforTabTwo();
      }
    }
  }

}
