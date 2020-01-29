import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { SalesinvoiceHttpDataService } from './salesinvoice-http-data.service';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.css']
})
export class SalesinvoiceComponent implements OnInit {

  dataSource: CustomStore;
  error: void;
  documentNumber: any;
  dataAttributes: any;
  attributesPopup: boolean = false;

  constructor(
    public router: Router,
    private httpDataService: SalesinvoiceHttpDataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllSalesInvoices([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onCreateNewSI() {

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
    this.httpDataService.createNewDocument(["", "SALEINVOICE", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('SINumber', data[0]);
          this.router.navigate(['/finance/salesinvoicedetails']);
        } else {
          this.toastr.error("Error While Creating the Sales Invoice, Error Status Code :" + data[1]);
        }
      });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('SINumber', this.documentNumber);
    this.router.navigate(['/finance/salesinvoicedetails']);

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
