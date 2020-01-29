import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-manage-purchase-list',
  templateUrl: './manage-purchase-list.component.html',
  styleUrls: ['./manage-purchase-list.component.css']
})
export class ManagePurchaseListComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: any;
  unitprice;

  constructor(
    private toastr: ToastrService,
    public dataServices: DataService) { }

  ngOnInit() {
    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["LineNo", "FromSQLIneNo", "FromSQNo", "DocumentNo", "ItemCode", "DirectUnitCost", "MarginPert", "UnitPriceFromPQ"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataServices.getServerData("managePO", "getAllPQConnectedSQ", [''])
          .subscribe(getAllOpenSO => {
            thisComponent.dataSource["suggestedPrice"] = '0.00';
            devru.resolve(getAllOpenSO);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        var cost = Number(getUpdateValues(key, newValues, "DirectUnitCost"));
        var margin = Number(getUpdateValues(key, newValues, "MarginPert"));
        thisComponent.dataSource["suggestedPrice"] = Number(cost + (Number(cost * margin) / 100)).toFixed(2);

        thisComponent.dataServices.getServerData("managePO", "updateMarginandUnitPriceBuffer", ['',
          getUpdateValues(key, newValues, "MarginPert"),
          thisComponent.dataSource["suggestedPrice"],
          getUpdateValues(key, newValues, "LineNo")])
          .subscribe(data => {
            if (data == 1) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines ");
            }
          });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return newValues[field] ? newValues[field] : key[field];
    }
  }

  SetSQPrice(event) {
    this.dataServices.getServerData("managePO", "updateSQfromManagePQ", ['',
      event.key["UnitPriceFromPQ"],
      'Yes',
      event.key["FromSQNo"],
      event.key["ItemCode"],
      event.key["FromSQLIneNo"], 
      event.key["LineNo"], 
      event.key["DocumentNo"]
    ]).subscribe(data => {
      if (data > 0) {
        this.dataServices.getServerData("managePO", "getAllPQConnectedSQ", [''])
          .subscribe(data => {
            this.dataSource = {
              paginate: true,
              pageSize: 20,
              loadMode: "raw",
              load: () =>
                <String[]>data
            }
            this.gridContainer.instance.refresh();
          });
        this.toastr.success("Price successfully updated in Sales Quote");
      }
    });
  }

}
