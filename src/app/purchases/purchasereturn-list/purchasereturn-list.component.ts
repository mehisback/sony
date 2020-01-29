import { Component } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { PurchasereturnListHttpDataService } from './purchasereturn-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-purchasereturn-list',
  templateUrl: './purchasereturn-list.component.html',
  styleUrls: ['./purchasereturn-list.component.css']
})
export class PurchasereturnListComponent {


  documentNumber: any;
  prListSource: any = {};
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(
    private httpDataService: PurchasereturnListHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {

    var thisComponent = this;

    this.prListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllPurchasereturn([""])
          .subscribe(dataHaeder => {
            devru.resolve(dataHaeder);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PRNumber', this.documentNumber);
    UtilsForGlobalData.setLocalStorageKey('FlowResult', event.data.FlowResult);
    this.router.navigate(['/purchases/purchasereturn-details']);

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

  onCreateNewPR() {
    this.httpDataService.getAttributeValue(["", "PURCHASERETURN"])
      .subscribe(dataAttribute => {
        this.dataAttributes = dataAttribute;
        this.attributesPopup = true;
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.httpDataService.createNewDocument(["",
      "PURCHASERETURN",
      event.data.AttributeValue,
      UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] == "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PRNumber', data[0]);
          UtilsForGlobalData.setLocalStorageKey('FlowResult', "OPEN");
          this.router.navigate(['/purchases/purchasereturn-details']);
        } else {
          this.toastr.error("Error While Creating the Purchase Return with Error Status Code : " + data[1]);
        }
      });
  }

}