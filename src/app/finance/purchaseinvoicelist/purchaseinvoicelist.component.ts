import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';

import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';

import CustomStore from 'devextreme/data/custom_store';
import { PurchaseinvoicelistHttpDataService } from './purchaseinvoicelist-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-purchaseinvoicelist',
  templateUrl: './purchaseinvoicelist.component.html',
  styleUrls: ['./purchaseinvoicelist.component.css']
})
export class PurchaseinvoicelistComponent implements OnInit {

  dataSource: any = {};
  documentNumber: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: PurchaseinvoicelistHttpDataService
  ) { }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllPurchaseInvoices([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onCreateNewPI() {

    this.createDoc('');
    /* this.httpDataService.handleConnectedBU([""]).subscribe(dataAttribute => {
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
    this.createDoc(event.data.ID);
  }

  createDoc(att: String) {
    this.httpDataService.createNewDocument(["", "PURCHASEINVOICE", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PINumber', data[0]);
          this.router.navigate(['/finance/purchaseinvoicedetails']);
        } else {
          this.toastr.error("Error While Creating the Purchase Invoice, Error Status Code :" + data[1]);
        }
      });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PINumber', this.documentNumber);
    this.router.navigate(['/finance/purchaseinvoicedetails']);

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

}
