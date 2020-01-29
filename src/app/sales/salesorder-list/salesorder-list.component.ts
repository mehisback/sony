import { Component, ViewChild, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { SalesorderListHttpDataService } from './salesorder-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salesorder-list',
  templateUrl: './salesorder-list.component.html',
  styleUrls: ['./salesorder-list.component.css'],
  providers: [DatePipe]
})
export class SalesorderListComponent {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  documentNumber: any;
  chooseImportFormat = [];
  soListSource: any = {};
  dataAttributes: any;
  CustSuggestions: any;
  TypeSuggestions: any;
  attributesPopup: boolean = false;

  constructor(
    private httpDataService: SalesorderListHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {

    var thisComponent = this;
    this.soListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllSalesOrder(["", ""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SONumber', this.documentNumber);
    UtilsForGlobalData.setLocalStorageKey('FlowResult', event.data.FlowResult);
    this.router.navigate(['/sales/salesorder-details']);

  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "FlowResult") {
      if (e.value == "Approved") {
        e.cellElement.className += "color-for-column-Approved fa fa-check";
        e.cellElement.title += "Approved";
      } else if (e.value == "OPEN") {
        e.cellElement.className += " color-for-column-OPEN fa fa-square-o";
        e.cellElement.title += "OPEN";
      } else if (e.value == "SENT FOR APPROVAL") {
        e.cellElement.className += " color-for-column-SFApproval fa fa-share-square-o";
        e.cellElement.title += "SENT FOR APPROVAL";
      } else if (e.value == "Rejected") {
        e.cellElement.className += " color-for-column-Rejected fa fa-times";
        e.cellElement.title += "Rejected";
      }
    }
  }

  onCreateNewSO() {

    this.httpDataService.getAttributeValue(["", "SALESORDER"])
      .subscribe(dataAttribute => {
        this.dataAttributes = dataAttribute;
        this.attributesPopup = true;
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.httpDataService.createNewDocument(["", "SALESORDER", event.data.AttributeValue, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('SONumber', data[0]);
          UtilsForGlobalData.setLocalStorageKey('FlowResult', "OPEN");
          this.toastr.success("Sales Order Created");
          this.router.navigate(['/sales/salesorder-details']);
        } else {
          this.toastr.error("Error While Creating the Sales Order, Error Status Code :" + data[1]);
        }
      });
  }
}
