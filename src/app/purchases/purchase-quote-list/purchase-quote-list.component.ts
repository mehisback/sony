import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router, RouterModule } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PurchaseQuoteListHttpDataService } from './purchase-quote-list-http-data.service';

@Component({
  selector: 'app-purchase-quote-list',
  templateUrl: './purchase-quote-list.component.html',
  styleUrls: ['./purchase-quote-list.component.css']
})
export class PurchaseQuoteListComponent implements OnInit {

  documentNumber: string;
  poListSource: any = {};
  focusingKey: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(private httpDataService: PurchaseQuoteListHttpDataService,
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
    UtilsForGlobalData.setLocalStorageKey('PQNumber', this.documentNumber);
    this.router.navigate(['/purchases/purchase-quote-details']);

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

    this.httpDataService.getAttributeValue(["", "PURCHASEQUOTE"])
      .subscribe(dataAttribute => {
        if (Object.keys(dataAttribute).length > 0) {
          this.dataAttributes = dataAttribute;
          this.attributesPopup = true;
        } else {
          this.createDoc('');
        }
      });
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.createDoc(event.data.AttributeValue);
  }

  createDoc(att: String) {
    this.httpDataService.createNewDocument(["", "PURCHASEQUOTE", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PQNumber', data[0]);
          this.router.navigate(['/purchases/purchase-quote-details']);
          this.toastr.success("Purchase Quote Created");
        } else {
          this.toastr.error("Error While Creating the Purchase Quote, Error Status Code :" + data[1]);
        }
      });
  }

}