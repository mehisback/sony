import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-account-charges-setup',
  templateUrl: './account-charges-setup.component.html',
  styleUrls: ['./account-charges-setup.component.css']
})
export class AccountChargesSetupComponent implements OnInit {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  continents: any = {};
  dataSourcePOS: any = {};
  AccountCharge: any;
  AccountChargeDetails: any = {};
  chargeTypeArr: any = [{ Code: "PREPAYMENT", Description: "PREPAYMENT" },
  { Code: "BANKCHARGE", Description: "BANKCHARGE" },
  { Code: "OTHER", Description: "OTHER" }];
  COALookUpSuggestions: any;
  VatLookUpSuggestions: any;
  visiblityAccount: Boolean = false;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.continents = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("AccountChargesSetup", "getList", [""]).subscribe(data => {
          for (var i = 0; i < Object.keys(data).length; i++) {
            data[i]["PostingType"] = data[i]["PostingType"] == 'DEBIT' ? true : false;
          }
          devru.resolve(data);
        });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] != null) {
          dummyDataServive.getServerData("AccountChargesSetup", "btnNewCode_clickHandler", ["",
            values["Code"]]).subscribe(dataStatus => {
              if (dataStatus > 0) {
                devru.resolve(dataStatus);
              } else {
                devru.reject("Error while Adding the Charge : " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.resolve();
        }
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("COALookUp", "getListCHILDONLY", [''])
      .subscribe(callData3 => {
        this.COALookUpSuggestions = new DataSource({
          store: <String[]>callData3,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedvatPrdGrp", [''])
      .subscribe(getStorageUnit => {
        this.VatLookUpSuggestions = new DataSource({
          store: <String[]>getStorageUnit,
          paginate: true,
          pageSize: 20
        });
      });
  }

  onUserRowSelect(event) {
    this.AccountCharge = event.data.Code;
    this.AccountChargeDetails = event.data;
    this.visiblityAccount = true;
  }

  onDropDownvalueChanged(e, dataField) {
    if (e.value ? this.AccountChargeDetails[dataField] != e.value : false) {
      this.AccountChargeDetails[dataField] = e.value;
    }
  }

  update() {
    var postType: String;
    if (this.AccountChargeDetails["PostingType"] == true) {
      postType = 'DEBIT';
    } else {
      postType = 'CREDIT';
    }
    this.dataFromService.getServerData("AccountChargesSetup", "btnSave_clickHandler", ['',
      this.AccountChargeDetails["Description"],
      this.AccountChargeDetails["AccountCode"],
      postType,
      this.AccountChargeDetails["ChargeType"],
      this.AccountChargeDetails["VatProdGroup"],
      this.AccountCharge]).subscribe(callData3 => {
        if (callData3 >= 0) {
          this.toastr.success("Successfully Updated", "Done");
        } else {
          this.toastr.error("Update Failed , Error Status Code : UPDATE-ERR");
        }
        this.gridContainer.instance.refresh();
      });
  }

  suggestionFormatForCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  hoverFormatForCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }

  suggestionFormatForVatCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  hoverFormatForVatCode(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

}
