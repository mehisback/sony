import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DxFormComponent } from 'devextreme-angular';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { WmsSegmentsListHttpDataService } from './wms-segments-list-http-data.service';

@Component({
  selector: 'app-wms-segments-list',
  templateUrl: './wms-segments-list.component.html',
  styleUrls: ['./wms-segments-list.component.css']
})


export class WmsSegmentsListComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  pickListSource: any = {};
  documentNumber: any;
  newLocationDetail: [];
  popupVisible: boolean = false;

  constructor(private httpDataService: WmsSegmentsListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.pickListSource.store = new CustomStore({
      key: ["LocationCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getRecList([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.LocationCode;
    UtilsForGlobalData.setLocalStorageKey('LocationMaster', this.documentNumber);
    this.router.navigate(['/warehouse/wms-segments']);
  }

  onCreateNewLocation() {
    this.popupVisible = true;
    this.newLocationDetail = [];
  }

  Save() {
    this.formWidget.instance.updateData(this.newLocationDetail);
    var data = this.formWidget.instance.option("formData");
    if (Object.keys(data).length != 0) {
      if (data["LocationCode"]) {
        this.httpDataService.validateLocationCode(["",
          data["LocationCode"]]).subscribe(dataStatus => {
            if (Object.keys(dataStatus).length == 0) {
              this.httpDataService.insertLocation(["",
                data["LocationCode"],
                data["Name"],
                data["Address1"],
                data["Address2"],
                data["City"],
                data["Zip"]]).subscribe(getNewItemDetail => {
                  this.popupVisible = false;
                  if (getNewItemDetail > 0) {
                    this.toastr.success("Location added Suucessfully");
                    UtilsForGlobalData.setLocalStorageKey('LocationMaster', data["LocationCode"]);
                    this.router.navigate(['/warehouse/wms-segments']);
                  }
                  else {
                    this.toastr.error("Error while inserting Item");
                  }
                });
            } else {
              this.toastr.error("Location code already exists!!");
            }
          });
      } else {
        this.toastr.warning("Location Code is Empty")
      }
    }
    else {
      this.toastr.warning("Location Data is Empty")
    }
  }

}
