import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';
import DataSource from "devextreme/data/data_source";
import CustomStore from 'devextreme/data/custom_store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  continents: any = {};
  lazadaformDetails: any;
  ecommerceFormDetails: any = {};
  duplicateRetail: any = [];
  ShipFromSuggestions: DataSource;
  ShipFromSuggestions2: DataSource;
  ShipFromSuggestions3: DataSource;

  constructor(
    private toastr: ToastrService,
    public dataServices: DataService
  ) { }

  ngOnInit() {

    this.dataServices.getServerData("wmsLocationList", "getLocationList1", [""]).subscribe(getAllSetup => {
      this.ShipFromSuggestions = new DataSource({
        store: <String[]>getAllSetup,
        paginate: true,
        pageSize: 20
      });
    });

    this.dataServices.getServerData("globalLookup", "handleConnectedcusttype", [""]).subscribe(handleConnectedcusttype => {
      this.ShipFromSuggestions2 = new DataSource({
        store: <String[]>handleConnectedcusttype,
        paginate: true,
        pageSize: 20
      });
    });

    this.dataServices.getServerData("globalLookup", "handleConnectedcust", [""]).subscribe(handleConnectedcust => {
      this.ShipFromSuggestions3 = new DataSource({
        store: <String[]>handleConnectedcust,
        paginate: true,
        pageSize: 20
      });
    });

    var dummyDataServive = this.dataServices;
    var thisComponent = this;

    this.continents = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ecommerceSetup", "getAllSetup", [""]).subscribe(data => {
          devru.resolve(data);
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ecommerceSetup", "DELETERecord", ["", key["Name"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Lines with Name: " + key["Name"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Name"] ? values["Name"] != '' : false) {
          dummyDataServive.getServerData("ecommerceSetup", "INSERTRecord", ["",
            values["Name"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Name: " + values["Name"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataServices.getServerData("ecommerce", "getLogoLocation", ["", UtilsForGlobalData.getUserId()])
      .subscribe(getCustImage => {
        this.lazadaformDetails = getCustImage[0];
        if (getCustImage[0] == 1) {
          this.toastr.success("Details Updated!");
        }
      });
  }

  onformFieldsChanges(e) {
    if (this.duplicateRetail.length > 0 ? this.duplicateRetail[0][e.dataField] != e.value : false) {
      this.dataServices.getServerData("ecommerceSetup", "updateItemLines", ["",
        e.dataField, e.value, this.ecommerceFormDetails.Name])
        .subscribe(dataStatus => {
          if (dataStatus > 0) {
            this.toastr.success("Details Updated!", "DONE");
          }
        });
    }
  }

  onUserRowSelect(event) {
    var result = [];
    result.push(event.data);
    this.assignToDuplicate(result);
    this.ecommerceFormDetails = event.data;
  }

  onDropDownCodeChanged(event, dataField) {
    if (dataField == 'LocationCode') {
      event.value = (event.value == null ? '' : event.value);
      this.dataServices.getServerData("ecommerceSetup", "updateItemLines", ["",
        'LocationCode', event.value, this.ecommerceFormDetails.Name])
        .subscribe(dataStatus => {
          if (dataStatus > 0) {
            this.toastr.success("Details Updated!", "DONE");
          }
        });
    }

    if (dataField == 'AttirbuteCode') {
      event.value = (event.value == null ? '' : event.value);
      this.dataServices.getServerData("ecommerceSetup", "updateItemLines", ["",
        'AttirbuteCode', event.value, this.ecommerceFormDetails.Name])
        .subscribe(dataStatus => {
          if (dataStatus > 0) {
            this.toastr.success("Details Updated!", "DONE");
          }
        });
    }

    if (dataField == 'CustomerCode') {
      event.value = (event.value == null ? '' : event.value);
      this.dataServices.getServerData("ecommerceSetup", "updateItemLines", ["",
        'CustomerCode', event.value, this.ecommerceFormDetails.Name])
        .subscribe(dataStatus => {
          if (dataStatus > 0) {
            this.toastr.success("Details Updated!", "DONE");
          }
        });
    }
  }

  suggestionFormateForShippedby(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForPaymentMethod(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  suggestionFormateForCustomer(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "CustCode", "Name");
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateRetail = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateRetail["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateRetail[i][prop] = data[i][prop];
      }
    }
  }

}
