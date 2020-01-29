import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router, RouterModule } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import { PurchaseorderlistHttpDataService } from './purchaseorderlist-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-purchaseorderlist',
  templateUrl: './purchaseorderlist.component.html',
  styleUrls: ['./purchaseorderlist.component.css']
})
export class PurchaseorderlistComponent implements OnInit {
  documentNumber: string;
  poListSource: any = {};
  focusingKey: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(private httpDataService: PurchaseorderlistHttpDataService,
    public router: Router,
    private toastr: ToastrService) {


    this.poListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        httpDataService.getAllPurchaseOrder([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  ngOnInit() {
  }

  onUserRowSelect(event) {

    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PONumber', this.documentNumber);
    this.router.navigate(['/purchases/purchaseorder']);

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

  onCreateNewPO() {

    this.httpDataService.getAttributeValue(["", "PURCHASEORDER"])
      .subscribe(data => {
        this.dataAttributes = data;
        this.attributesPopup = true;
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.httpDataService.createNewDocument(["", "PURCHASEORDER", event.data.AttributeValue, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PONumber', data[0]);
          this.router.navigate(['/purchases/purchaseorder']);
          this.toastr.success("Purchase Order Created");
        } else {
          this.toastr.error("Error While Creating the Purchase Order, Error Status Code :", data[1]);
        }
      });
  }




}
