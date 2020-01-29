import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { SalesreturnListHttpDataService } from './salesreturn-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-salesreturn-list',
  templateUrl: './salesreturn-list.component.html',
  styleUrls: ['./salesreturn-list.component.css']
})
export class SalesreturnListComponent {

  documentNumber: any;
  srListSource: any = {};
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(
    private httpDataService: SalesreturnListHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {

    var thisComponent = this;

    this.srListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllSalesOrder([""])
          .subscribe(dataHeader => {
            devru.resolve(dataHeader);
          });
        return devru.promise();
      }
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SRNumber', this.documentNumber);
    this.router.navigate(['/sales/salesreturn-details']);

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

  onCreateNewSR() {
    this.httpDataService.getAttributeValue(["", "SALESRETURN"])
      .subscribe(dataAttribute => {
        this.dataAttributes = dataAttribute;
        this.attributesPopup = true;
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.httpDataService.createNewDocument(["",
      "SALESRETURN", event.data.AttributeValue,
      UtilsForGlobalData.getUserId()]).subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('SRNumber', data[0]);
          this.toastr.success("Sales Return Created");
          this.router.navigate(['/sales/salesreturn-details']);
        } else {
          this.toastr.error("Error While Creating the Sales Return, Error Status Code :" + data[1]);
        }
      });
  }

}
