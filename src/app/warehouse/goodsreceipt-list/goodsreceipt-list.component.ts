import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoodsreceiptListHttpDataService } from './goodsreceipt-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-goodsreceipt-list',
  templateUrl: './goodsreceipt-list.component.html',
  styleUrls: ['./goodsreceipt-list.component.css']
})
export class GoodsreceiptListComponent implements OnInit {

  pickListSource: any = {};
  documentNumber: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(private httpDataService: GoodsreceiptListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.pickListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllGR([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('GoodsReceiptNumber', this.documentNumber);
    this.router.navigate(['/warehouse/goodsreceipt-details']);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "DocumentStatus") {
      if (e.value == "Approved") {
        e.cellElement.className += "color-for-column-Approved fa fa-check";
        e.cellElement.title += "Approved";
      } else if (e.value == "Open") {
        e.cellElement.className += " color-for-column-OPEN fa fa-square-o";
        e.cellElement.title += "Open";
      } else if (e.value == "SENT FOR APPROVAL") {
        e.cellElement.className += " color-for-column-SFApproval fa fa-share-square-o";
        e.cellElement.title += "SENT FOR APPROVAL";
      } else if (e.value == "Rejected") {
        e.cellElement.className += " color-for-column-Rejected fa fa-times";
        e.cellElement.title += "Rejected";
      }
    }
  }

  onCreateNewPick() {
    this.createDoc('');
    /* this.httpDataService.getAttributeValue(["", "GOODSRECEIPT"])
      .subscribe(dataAttribute => {
        if (Object.keys(dataAttribute).length > 0) {
          this.dataAttributes = dataAttribute;
          this.attributesPopup = true;
        } else {
          this.createDoc('');
        }
      }); */
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.createDoc(event.data.AttributeValue);
  }

  createDoc(att: String) {
    this.httpDataService.createNewDocument(["", "GOODSRECEIPT", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('GoodsReceiptNumber', data[0]);
          this.router.navigate(['/warehouse/goodsreceipt-details']);
        } else {
          this.toastr.error("Error While Creating the Goods Receipt, Error Status Code :" + data[1]);
        }
      });
  }

}
