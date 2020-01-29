import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import DataSource from "devextreme/data/data_source";
import { DomSanitizer } from '@angular/platform-browser';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-service-item-details',
  templateUrl: './service-item-details.component.html',
  styleUrls: ['./service-item-details.component.css']
})
export class ServiceItemDetailsComponent implements OnInit {

  ServiceCode: string = UtilsForGlobalData.retrieveLocalStorageKey('ServiceCode');
  serviceDetails: any = {};
  OneSUperLocationSuggestions = [{ Code: "ACTIVE" }, { Code: "INACTIVE" }];
  WHTProdGroupSuggestion: DataSource;
  ProdPostingGroupSuggestion: DataSource;
  VatProdGroupSuggestion: DataSource;
  duplicateCompanyInfo: string[];
  base64image: any;
  popupVisible: boolean = false;
  NameEditMode: boolean = false;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("ServiceItem", "getItemDetail", ['', this.ServiceCode])
      .subscribe(getItemInfo => {
        this.assignToDuplicate(getItemInfo);
        this.serviceDetails = getItemInfo[0];
        if (this.serviceDetails["Description"] ? this.serviceDetails["Description"] != '' : false) {
          this.NameEditMode = false;
        } else {
          this.NameEditMode = true;
        }
        this.serviceDetails = UtilsForSuggestion.StandartNumberFormat(this.serviceDetails, ["UnitPrice", "UnitCost"]);
      });
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateCompanyInfo = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateCompanyInfo["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateCompanyInfo[i][prop] = data[i][prop];
      }
    }
  }

  ngOnInit() {
    this.getHeaderDetails();

    this.dataFromService.getServerData("globalLookup", "handleConnectedvatPrdGrp", [''])
      .subscribe(getLocationList4 => {
        this.VatProdGroupSuggestion = new DataSource({
          store: <String[]>getLocationList4,
          paginate: true,
          pageSize: 20
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedGENPOLICY", [''])
      .subscribe(getLocationList3 => {
        this.ProdPostingGroupSuggestion = new DataSource({
          store: <String[]>getLocationList3,
          paginate: true,
          pageSize: 20
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedWHTPRDGRP", [''])
      .subscribe(getCountryList => {
        this.WHTProdGroupSuggestion = new DataSource({
          store: <String[]>getCountryList,
          paginate: true,
          pageSize: 20
        });
      });
  }

  suggestionFormatForCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormatForCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  suggestionFormatForCodeAndDesc(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  hoverFormatForCodeAndDesc(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  onDefaultCodevalueChanged(event, dataField) {
    if (event.value != null) {
      this.serviceDetails[dataField] = event.value;
    }
  }

  update() {
    this.dataFromService.getServerData("ServiceItem", "update", ['',
      this.serviceDetails.ItemStatus, this.serviceDetails.Description, this.serviceDetails.VatProdGroup,
      this.serviceDetails.UnitCost, this.serviceDetails.UnitCost, this.serviceDetails.UnitPrice, this.serviceDetails.ProdPostingGroup,
      this.serviceDetails.WHTProdGroup,this.ServiceCode, this.serviceDetails.HSNCode])
      .subscribe(dataStatus => {
        this.errorHandlingToaster(dataStatus);
      });
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus > 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
    this.getHeaderDetails();
  }

  form_fieldDataChanged(event) {
    if (event.dataField == 'UnitPrice' || event.dataField == 'UnitCost') {
      this.serviceDetails["" + event.dataField] = parseFloat(this.serviceDetails["" + event.dataField]).toFixed(2);
    }
  }

  showInfo() {
    this.popupVisible = true;
  }

  onClickedOutside(e: Event) {
    this.NameEditMode = false;
  }

  onItemDescriptionChanged(event: any) {
    this.serviceDetails["Description"] = event.value;
    if (this.serviceDetails["Description"] ? this.serviceDetails["Description"] != '' : false) {
      this.NameEditMode = false;
    } else {
      this.NameEditMode = true;
    }
  }

}
