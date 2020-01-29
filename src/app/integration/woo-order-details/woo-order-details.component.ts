import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-woo-order-details',
  templateUrl: './woo-order-details.component.html',
  styleUrls: ['./woo-order-details.component.css']
})

export class WooOrderDetailsComponent implements OnInit {

  itemDetails: any;
  soListSource: any;
  billtoInfo: boolean = false;
  shiptoInfo: boolean = false;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    var thisComponent = this;
    this.soListSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("Woo_StandardAllInOne", "woo_retreiveOrder", ['',
          UtilsForGlobalData.retrieveLocalStorageKey('woo_StoreURL'),
          UtilsForGlobalData.retrieveLocalStorageKey('woo_ConsumerKey'),
          UtilsForGlobalData.retrieveLocalStorageKey('woo_ConsumerValue'),
          UtilsForGlobalData.retrieveLocalStorageKey('woo_OrderNumber')])
          .subscribe(data => {
            thisComponent.itemDetails = data;
            devru.resolve(data["line_items"]);
          });
        return devru.promise();
      }
    });
  }

  getToCustomerDetail(type) {
    if (type == 'BILL') {
      this.billtoInfo = true;
    } else {
      this.shiptoInfo = true;
    }
  }

}




