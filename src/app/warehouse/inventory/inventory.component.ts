import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { InventoryHttpDataService } from './inventory-http-data.service';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  @ViewChild("gridContainer1") gridContainer1: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;

  dataSource: any;
  dataSource2: any;
  dataSource3: any;
  isNegativeShow: Boolean = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: InventoryHttpDataService
  ) { }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["ItemCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.isNegativeShow) {
          thisComponent.httpDataService.getInvByItemCodeNL([""])
            .subscribe(getInvByItemCodeNL => {
              devru.resolve(getInvByItemCodeNL);
            });
        } else {
          thisComponent.httpDataService.getInvByItemCodeNLFilter([""])
            .subscribe(getInvByItemCodeNL => {
              devru.resolve(getInvByItemCodeNL);
            });
        }
        return devru.promise();
      }
    });

    this.dataSource2 = new CustomStore({
      key: ["ItemCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.isNegativeShow) {
          thisComponent.httpDataService.getInvByItemCode([""])
            .subscribe(getInvByItemCode => {
              devru.resolve(getInvByItemCode);
            });
        } else {
          thisComponent.httpDataService.getInvByItemCodeFilter([""])
            .subscribe(getInvByItemCodeNL => {
              devru.resolve(getInvByItemCodeNL);
            });
        }
        return devru.promise();
      }
    });

    this.dataSource3 = new CustomStore({
      key: ["ItemCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.isNegativeShow) {
          thisComponent.httpDataService.getInvByLot([""])
            .subscribe(getInvByItemCode => {
              devru.resolve(getInvByItemCode);
            });
        } else {
          thisComponent.httpDataService.getInvByLotFilter([""])
            .subscribe(getInvByItemCodeNL => {
              devru.resolve(getInvByItemCodeNL);
            });
        }
        return devru.promise();
      }
    });

  }

  onTabChange(event: NgbTabChangeEvent) {
    this.isNegativeShow = false;
    if (event.nextId == "SUCode") {

    }
  }

  onOptionChanged(event) {
    this.isNegativeShow = event.value;
    this.gridContainer1 ? this.gridContainer1.instance.refresh() : '';
    this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
    this.gridContainer3 ? this.gridContainer3.instance.refresh() : '';
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
