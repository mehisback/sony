import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DxDataGridComponent } from 'devextreme-angular';
import { WmsSegmentsHttpDataService } from './wms-segments-http-data.service';

@Component({
  selector: 'app-wms-segments',
  templateUrl: './wms-segments.component.html',
  styleUrls: ['./wms-segments.component.css']
})
export class WmsSegmentsComponent implements OnInit {
  @ViewChild("gridContainer1") gridContainer1: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;
  @ViewChild("gridContainer4") gridContainer4: DxDataGridComponent;

  LocationMaster: string = UtilsForGlobalData.retrieveLocalStorageKey('LocationMaster');
  LocationDetails: any = {};
  duplicateLocHeader = [];
  dataSource: CustomStore;
  tenderSuggestions: any = [{ Code: 'Basic' }, { Code: 'Advanced' }];
  dataSource2: CustomStore;
  dataSource3: CustomStore;
  dataSource4: CustomStore;
  ZoneCodeClicked: any;
  SectionsCodeClicked: any;
  ShelvesCodeClicked: any;
  receiveLocSuggestions: DataSource;
  isConsignment: Boolean = false;

  isSectionAdd: Boolean = false;
  isShelvesAdd: Boolean = false;
  isStorageAdd: Boolean = false;

  constructor(
    private httpDataService: WmsSegmentsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    
    var thisComponent = this;
    this.fetchLocationDetails();
    this.getAllTheLocation();

    this.dataSource = new CustomStore({
      key: ["ZoneCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getZones(["",
          thisComponent.LocationMaster])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["ZoneCode"]) {
          thisComponent.httpDataService.insertZone(["",
            thisComponent.LocationMaster,
            values["ZoneCode"],values["Name"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with ZoneCode: " + values["ZoneCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource2 = new CustomStore({
      key: ["SectionCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getSection(["",
          thisComponent.LocationMaster, thisComponent.ZoneCodeClicked])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["SectionCode"]) {
          thisComponent.httpDataService.insertSection(["",
            thisComponent.LocationMaster,
            thisComponent.ZoneCodeClicked,
            values["SectionCode"],
            values["Name"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with SectionCode: " + values["SectionCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource3 = new CustomStore({
      key: ["ShelfCode", "Name"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getShelf(["",
          thisComponent.LocationMaster, thisComponent.ZoneCodeClicked,
          thisComponent.SectionsCodeClicked])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["ShelfCode"]) {
          thisComponent.httpDataService.insertShelf(["",
            thisComponent.LocationMaster, thisComponent.ZoneCodeClicked,
            thisComponent.SectionsCodeClicked,
            values["ShelfCode"],
            values["Name"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with ShelfCode: " + values["ShelfCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource4 = new CustomStore({
      key: ["StorageUnit", "StorageUnitCode"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getStorageUnit(["",
          thisComponent.LocationMaster, thisComponent.SectionsCodeClicked,
          thisComponent.ZoneCodeClicked,
          thisComponent.ShelvesCodeClicked])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["StorageUnit"]) {
          thisComponent.httpDataService.insertStorageUnit(["",
            thisComponent.LocationMaster, thisComponent.ZoneCodeClicked,
            thisComponent.SectionsCodeClicked,
            thisComponent.ShelvesCodeClicked,
            values["StorageUnit"]])
            .subscribe(data => {
              if (data > 0) {
                thisComponent.getAllTheLocation();
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with StorageUnit: " + values["StorageUnit"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }


  }

  onUserRowSelect1(event) {
    this.ZoneCodeClicked = event.data.ZoneCode;
    this.isSectionAdd = true;
    this.isShelvesAdd = false;
    this.isStorageAdd = false;
    this.gridContainer2.instance.refresh();
  }


  onUserRowSelect2(event) {
    this.SectionsCodeClicked = event.data.SectionCode;
    this.isShelvesAdd = true;
    this.isStorageAdd = false;
    this.gridContainer3.instance.refresh();
  }

  onUserRowSelect3(event) {
    this.ShelvesCodeClicked = event.data.ShelfCode;
    this.isStorageAdd = true;
    this.gridContainer4.instance.refresh();
  }

  wmsLocationCardOnInitNewRow(event, type) {
    if (type == 'SECTIONS') {
      event.data.FamilyCode = this.ZoneCodeClicked;
    }
    else if (type == 'SHELVES') {
      event.data.Category = this.SectionsCodeClicked;
    }
    else if (type == 'STORAGE') {
      event.data.Category = this.ShelvesCodeClicked;
    }
  }

  suggestionFormateForLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hoverFormateForLocation(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  suggestionFormateForLocation2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormateForLocation2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onDropDownChanged(event, dataField) {
    this.LocationDetails["" + dataField] = event.value;
    if ((event.value != undefined || event.value != null) && this.duplicateLocHeader[0][dataField] != event.value) {
      this.httpDataService.updateLocation(["", dataField, event.value, this.LocationMaster])
        .subscribe(dataStatus => {
          this.errorHandlingToasterForUPDATE(dataStatus);
        });
    }
  }

  formWarehouse_fieldDataChanged(e) {
    if (e.dataField == 'Name' || e.dataField == 'Address1' || e.dataField == 'Address2' || e.dataField == 'City' || e.dataField == 'Zip' || e.dataField == 'LocationType' ) {
      if ((e.value != undefined || e.value != null) && this.duplicateLocHeader[0][e.dataField] != e.value) {
        this.httpDataService.updateLocation(["", e.dataField, e.value, this.LocationMaster])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
    else if (e.dataField == 'Intransit' || e.dataField == 'QCLocation' || e.dataField == 'DepositLocation') {
      var temp = (e.value == true ? 'Yes' : 'No');
      if ((e.value != undefined || e.value != null) && this.duplicateLocHeader[0][e.dataField] != temp) {
        this.httpDataService.updateLocation(["", e.dataField, temp, this.LocationMaster])
          .subscribe(dataStatus => {
            this.errorHandlingToasterForUPDATE(dataStatus);
          });
      }
    }
  }

  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus >= 0) {
      this.fetchLocationDetails();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  fetchLocationDetails() {
    this.httpDataService.getLocation(["",
      this.LocationMaster]).subscribe(dataHeader => {
        this.assignToDuplicate(dataHeader);
        this.LocationDetails = dataHeader[0];
        if (this.LocationDetails["Intransit"] == 'Yes') {
          this.LocationDetails["Intransit"] = true;
        } else {
          this.LocationDetails["Intransit"] = false;
        }
        if (this.LocationDetails["QCLocation"] == 'Yes') {
          this.LocationDetails["QCLocation"] = true;
        } else {
          this.LocationDetails["QCLocation"] = false;
        }
        if (this.LocationDetails["DepositLocation"] == 'Yes') {
          this.LocationDetails["DepositLocation"] = true;
          this.isConsignment = true;
        } else {
          this.LocationDetails["DepositLocation"] = false;
          this.isConsignment = false;
        }
      });
  }

  assignToDuplicate(data) {
    // copy properties from Vendor to duplicateSalesHeader
    this.duplicateLocHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateLocHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateLocHeader[i][prop] = data[i][prop];
      }
    }
  }

  getAllTheLocation() {
    this.httpDataService.LocationStorageUnit(['', this.LocationMaster]).subscribe(getLocation => {
      this.receiveLocSuggestions = new DataSource({
        store: <String[]>getLocation,
        paginate: true,
        pageSize: 20
      });
    });
  }

}
