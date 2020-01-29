import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedSalesInvoiceListHttpDataService } from './posted-sales-invoice-list-http-data.service';

@Component({
  selector: 'app-posted-sales-invoice-list',
  templateUrl: './posted-sales-invoice-list.component.html',
  styleUrls: ['./posted-sales-invoice-list.component.css']
})
export class PostedSalesInvoiceListComponent implements OnInit {

  dataSource: CustomStore;
  error: void;
  documentNumber: any;

  constructor(public router: Router,
    private toastr: ToastrService,
    private httpDataService: PostedSalesInvoiceListHttpDataService) { }

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
      }
    });

  }

  onCreateNewSI() {

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PostedSINumber', this.documentNumber);
    this.router.navigate(['/finance/posted-sales-invoice-details']);

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
