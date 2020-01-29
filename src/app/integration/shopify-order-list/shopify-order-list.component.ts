import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-shopify-order-list',
  templateUrl: './shopify-order-list.component.html',
  styleUrls: ['./shopify-order-list.component.css']
})
export class ShopifyOrderListComponent implements OnInit {

  apiURL: any;
  userID: string;
  id: String;
  password: string;
  storeName: string;
  apiName: string;
  datasource: any;

  constructor(
    private router: Router,
    public dataServices: DataService
  ) {

  }

  ngOnInit() {
    UtilsForGlobalData.setLocalStorageKey("shopify_UserID", "a3d443d80ba4573980d09b885db865d6");
    UtilsForGlobalData.setLocalStorageKey("shopify_UserPassword", "28dbf31f94539c9795f6be5592860464")

    /* this.userID = "a3d443d80ba4573980d09b885db865d6";
    this.password = "28dbf31f94539c9795f6be5592860464"; */
    this.apiName = "orders";
    console.log(UtilsForGlobalData.getData());

    /* this.dataServices.getServerData("shopify", "get_Orders", ["", this.userID, this.password, this.apiName])
      .subscribe(get_Orders => {
        this.datasource = get_Orders["orders"];
      }); */

    var thisComponent = this;
    this.datasource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataServices.getServerData("shopify", "get_Orders", ['',
          UtilsForGlobalData.retrieveLocalStorageKey('shopify_UserID'),
          UtilsForGlobalData.retrieveLocalStorageKey('shopify_UserPassword'),
          thisComponent.apiName])
          .subscribe(data => {
            devru.resolve(data["orders"]);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        devru.resolve();
        return devru.promise();
      },
    });

  }

  onUserRowSelect(event) {
    this.id = String(event.data.id);
    UtilsForGlobalData.setLocalStorageKey('shopify_OrderNumber', this.id);
    //this.router.navigate(['/integration/woo-order-details']);
  }

  convertToSO(data) {
    if (data == 'ALL') {
      let result = confirm("<p>Are you sure want to Convert All To SO?</p>", "SO");
      result.then((dialogResult) => {
        if (dialogResult) {

        }
      });
    } else {

    }
  }

}