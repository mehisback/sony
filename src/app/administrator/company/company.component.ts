import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxDataGridComponent,
  DxFormComponent
} from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import DataSource from "devextreme/data/data_source";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  companyName: String = UtilsForGlobalData.getCompanyName();
  getCompanyInfo: Object;
  hoSuggestions = [{ Code: "Yes" }, { Code: "No" }];
  OneSUperLocationSuggestions = [{ Code: "Yes" }, { Code: "No" }];
  AmountIncludingVATSuggestions = [{ Code: "Yes" }, { Code: "No" }];
  HasINLocalizationSuggestions = [{ Code: "Yes" }, { Code: "No" }];
  getLocationList: any;
  getLocationListAll: DataSource;
  getCountryCodeListAll: DataSource;
  getStateCodeListAll: DataSource;
  getCurrencyCodeListAll: DataSource;
  itemImageData: any;
  itemimagePath: any;
  duplicateCompanyInfo: string[];
  base64image: any;
  popupVisible: boolean = false;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer
  ) { }

  getHeaderDetails() {
    this.dataFromService.getServerData("company", "getCompanyInfo", ['', this.companyName])
      .subscribe(getCompanyInfo => {
        this.assignToDuplicate(getCompanyInfo);
        this.getCompanyInfo = getCompanyInfo[0];
        this.dataFromService.getServerData("CountryStateList", "getStateList", ['', this.getCompanyInfo["CountryCode"]])
          .subscribe(getStateList => {
            this.getStateCodeListAll = new DataSource({
              store: <String[]>getStateList,
              paginate: true,
              pageSize: 20
            });
          });
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
    this.getImag();

    this.dataFromService.getServerData("wmsLocationList", "getLocationList4", [''])
      .subscribe(getLocationList4 => {
        this.getLocationList = new DataSource({
          store: <String[]>getLocationList4,
          paginate: true,
          pageSize: 20
        });
      });

    this.dataFromService.getServerData("wmsLocationList", "getLocationList3", [''])
      .subscribe(getLocationList3 => {
        this.getLocationListAll = new DataSource({
          store: <String[]>getLocationList3,
          paginate: true,
          pageSize: 20
        });
      });

    this.dataFromService.getServerData("CountryList", "getCountryList", [''])
      .subscribe(getCountryList => {
        this.getCountryCodeListAll = new DataSource({
          store: <String[]>getCountryList,
          paginate: true,
          pageSize: 20
        });
      });

    /* this.dataFromService.getServerData("CurrencyExchangeList", "getRecordList", [''])
      .subscribe(getCurrencyCodeListAll => {
        this.getCurrencyCodeListAll = new DataSource({
          store: <String[]>getCurrencyCodeListAll,
          paginate: true,
          pageSize: 20
        });
      }); */
  }

  suggestionFormatForIsHO(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onIsHOvalueChanged(event) {
    if (this.getCompanyInfo["IsHO"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'IsHO', event.value,
        this.companyName]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForOneSUperLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onOneSUperLocationvalueChanged(event) {
    if (this.getCompanyInfo["OneSUperLocation"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'OneSUperLocation', event.value,
        this.companyName]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForAmountIncludingVAT(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onAmountIncludingVATvalueChanged(event) {
    if (this.getCompanyInfo["AmountIncludingVAT"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'AmountIncludingVAT', event.value,
        this.companyName])
        .subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForHasINLocalization(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }

  onHasINLocalizationvalueChanged(event) {
    if (this.getCompanyInfo["HasINLocalization"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'HasINLocalization', event.value,
        this.companyName]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForQCLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  hover5(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  onQCLocationvalueChanged(event) {
    if (this.getCompanyInfo["QCLocation"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'QCLocation', event.value,
        this.companyName]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForDefaultLocation(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "LocationCode");
  }

  hover6(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  onDefaultLocationvalueChanged(event) {
    if (this.getCompanyInfo["DefaultLocation"] != event.value) {
      this.dataFromService.getServerData("company", "updateCompany", ['',
        'DefaultLocation', event.value,
        this.companyName]).subscribe(dataStatus => {
          this.errorHandlingToaster(dataStatus);
        });
    }
  }

  suggestionFormatForCountryCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "countrycode", "countryname");
  }

  hover7(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "countrycode", "countryname");
  }

  suggestionFormatForStateCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hover8(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
  }

  onDefaultCountryCodevalueChanged(event) {
    if (this.getCompanyInfo["CountryCode"] != event.value) {
      this.dataFromService.getServerData("company", "getEdit_ContryCode", ['',
        event.value]).subscribe(getEdit_ContryCode => {
          if (getEdit_ContryCode == 'DONE') {
            var temp = event.value == 'IND' ? 'Yes' : 'No';
            this.dataFromService.getServerData("company", "updateCompany", ['',
              'HasINLocalization', temp,
              this.companyName]).subscribe(dataStatus => {
                this.errorHandlingToaster(dataStatus);
              });
          } else {
            this.toastr.error("Error In Updating!! Error Status Code : " + getEdit_ContryCode, "Try Again");
          }
        });

    }
  }
  onDefaultStateCodevalueChanged(event) {
    if (this.getCompanyInfo["StateCode"] != event.value) {
      this.dataFromService.getServerData("CountryStateList", "getStateList", ['',
        event.value]).subscribe(getStateList => {
          this.dataFromService.getServerData("company", "updateCompany", ['',
            'StateCode', event.value,
            this.companyName]).subscribe(dataStatus => {
              this.errorHandlingToaster(dataStatus);
            });
        });

    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null) && this.duplicateCompanyInfo[0][e.dataField] != e.value) {
      if (e.dataField == 'Address1' || e.dataField == 'Address2' || e.dataField == 'City' ||
        e.dataField == 'PostCode' || e.dataField == 'Phone' || e.dataField == 'Fax' ||
        e.dataField == 'BranchID' || e.dataField == 'BranchName' || e.dataField == 'HomePage' ||
        e.dataField == 'VATID' || e.dataField == 'PrintHeight' || e.dataField == 'PIBackDateLimit' ||
        e.dataField == 'PrintWidth' || e.dataField == 'StateCode' || e.dataField == 'CIN' ||
        e.dataField == 'IEC' || e.dataField == 'PAN') {
        this.dataFromService.getServerData("company", "updateCompany", ['',
          e.dataField, e.value,
          this.companyName])
          .subscribe(dataStatus => {
            this.errorHandlingToaster(dataStatus);
          });
      }
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus == "DONE") {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus, "Try Again");
    }
    //this.getHeaderDetails();
  }

  getImag() {
    this.dataFromService.getServerData("company", "getCompanyImage", ["", this.companyName])
      .subscribe(getCustImage => {
        this.itemImageData = getCustImage[0];
        if (this.itemImageData != undefined)
          this.itemimagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,'
            + this.itemImageData["CompanyLogoText"]);
      });
  }

  showInfo() {
    this.popupVisible = true;
  }

  processFile(imageInput) {
    var files = imageInput.files;
    var file = files[0];

    var t = file.type.split('/').pop().toLowerCase();
    if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
      this.toastr.error("Please select a valid image file");
    }
    else if (file.size > 1024000) {
      this.toastr.error("Max Upload size is 1MB only");
    } else {
      this.dataFromService.getBase64(files[0])
        .then(gotbase64backimg => {
          this.base64image = gotbase64backimg;
          this.base64image = this.base64image.split(",")[1];
          this.dataFromService.getServerData("company", "updateCompany", ["",
            "CompanyLogoText", this.base64image,
            this.companyName]).subscribe(dataStatus => {
              this.errorHandlingToaster(dataStatus);
              this.popupVisible = false;
              this.getImag();
            });
        }
        );
    }
  }

}
