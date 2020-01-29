import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedPurchaseInvoiceListHttpDataService } from './posted-purchase-invoice-list-http-data.service';

@Component({
  selector: 'app-posted-purchase-invoice-list',
  templateUrl: './posted-purchase-invoice-list.component.html',
  styleUrls: ['./posted-purchase-invoice-list.component.css']
})
export class PostedPurchaseInvoiceListComponent implements OnInit {

  dataSource: any = {};
  documentNumber: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: PostedPurchaseInvoiceListHttpDataService
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
    
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.createDoc(event.data.ID);
  }

  createDoc(att: String) {
    
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PostedPINumber', this.documentNumber);
    this.router.navigate(['/finance/posted-purchase-invoice-details']);

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
