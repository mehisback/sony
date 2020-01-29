import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import DataSource from "devextreme/data/data_source";
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import CustomStore from 'devextreme/data/custom_store';
var itemListArray: any = [];
var VendorName: any = "";

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;

  vendorDetails: any = {};
  vendCode: string = UtilsForGlobalData.retrieveLocalStorageKey('VendCode');
  phonePattern: any = /^[^a-z]+$/;
  phoneRules: any = {
    X: /[02-9]/
  };
  NameEditMode: boolean = false;
  vendorGroupSuggestions: any = null;

  itemLookupSuggestionDataGrid: any = [];
  vatBusGroupSuggestions: DataSource;
  whtBusGroupSuggestions: DataSource;
  vendTypeSuggestions: DataSource;
  getCountryCodeListAll: DataSource;
  getStateCodeListAll: DataSource;
  visiblity: boolean = true;
  dataSource: any = {};
  dataSourceSummary: any = {};
  error: any;
  data: any;
  jsonSchema: JSON;
  valueforJson: any;
  keyforJson: any;
  currentRate: any;
  showDatagridNew = false;
  vendorChartData: Object;
  vendorItemAdd: Boolean = false;
  newCustomerDetail: any = {};
  brandSuggestions: DataSource;
  chooseImportFormat: any = ['Item Codes', 'Brand Codes'];
  BrandTemplateItem: Boolean = false;
  ItemCodeTemplateItem: Boolean = false;

  public pieChartLabels: string[] = [''];
  public pieChartData: number[] = [0];

  public pieChartType = 'pie';
  getVendoritemsdata: CustomStore;

  constructor(
    public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService,
    public cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.vendorDetails = {};
    this.getVendorDetails();

    this.dataFromService.getServerData("globalLookup", "handleConnectedvendgroup", [""])
      .subscribe(gotVendGroup => {
        this.vendorGroupSuggestions = new DataSource({
          store: <String[]>gotVendGroup,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedvatBusGrp", [""])
      .subscribe(gotVatBusGroup => {
        this.vatBusGroupSuggestions = new DataSource({
          store: <String[]>gotVatBusGroup,
          paginate: true,
          pageSize: 10
        });
      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedWHTBUSGRP", [""])
      .subscribe(gotWhtBusGroup => {
        this.whtBusGroupSuggestions = new DataSource({
          store: <String[]>gotWhtBusGroup,
          paginate: true,
          pageSize: 10
        });
      });


    this.dataFromService.getServerData("globalLookup", "handleConnectedVendType", [""])
      .subscribe(gotVendType => {
        this.vendTypeSuggestions = new DataSource({
          store: <String[]>gotVendType,
          paginate: true,
          pageSize: 10
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

    this.dataFromService.getServerData("globalLookup", "handleConnectedbrand", [""])
      .subscribe(getBrand => {
        this.brandSuggestions = new DataSource({
          store: <String[]>getBrand,
          paginate: true,
          pageSize: 10
        });
      });
  }

  onClickedOutside(event: Event) {
    this.NameEditMode = false;
  }

  onCustNameChanged(event: any) {
    this.dataFromService.getServerData("VendorCard", "DELETERecord", ["", 'Name',
      event.value,
      this.vendCode]).subscribe(dataStatus => {
        this.errorHandlingToasterForUPDATE(dataStatus);
      });
  }

  onEnterKey(event) {
    this.NameEditMode = false;
  }

  getVendorDetails() {
    this.dataFromService.getServerData("VendorCard", "getAllVendors", ["", this.vendCode])
      .subscribe(GotVendDetails => {
        this.vendorDetails = GotVendDetails[0];
        VendorName = this.vendorDetails["Name"];
        if (this.vendorDetails["Name"] ? this.vendorDetails["Name"] != '' : false) {
          this.NameEditMode = false;
        } else {
          this.NameEditMode = true;
        }
        if (this.vendorDetails["Email"] == 'NA') {
          this.vendorDetails["Email"] = null;
        }
        if (this.vendorDetails["HO"] == 'Yes') {
          this.vendorDetails["HO"] = true;
        }
        else {
          this.vendorDetails["HO"] = false;
        }
        if (this.vendorDetails["Active"] == 'Yes') {
          this.vendorDetails["Active"] = true;
        }
        else {
          this.vendorDetails["Active"] = false;
        }
        this.currentRate = this.vendorDetails["Rating"];
        this.dataFromService.getServerData("CountryStateList", "getStateList", ['',
          this.vendorDetails["Country"]]).subscribe(getStateList => {
            this.getStateCodeListAll = new DataSource({
              store: <String[]>getStateList,
              paginate: true,
              pageSize: 20
            });
          });
      });
  }

  onTabChange(event) {
    if (event.nextId == "APDetails") {
      this.visiblity = false;
      if (Object.keys(this.dataSource).length == 0) {
        this.dataFromService.getServerData("APEntries", "getHeaderListByVendor", ["", this.vendCode])
          .subscribe(GotAPDetail => {
            this.dataSource = GotAPDetail;
          },
            error => this.error = this.alertCode(error)
          );

        this.dataFromService.getServerData("APEntries", "getTotalByVendor", ["", this.vendCode])
          .subscribe(GotAPDetailTotal => {
            this.dataSourceSummary = GotAPDetailTotal;
            this.data = parseFloat(this.dataSourceSummary[0]["Balance"]).toFixed(2);

          },
            error => this.error = this.alertCode(error)
          );
      }
    }
    if (event.nextId == "VendorDetails") {
      this.visiblity = true;
    }
    if (event.nextId == 'userDefined') {
      this.userdefinedrefresh();
    }
    if (event.nextId == 'VendorStats') {
      this.visiblity = false;
      this.vendorStatsrefresh();
    }
    if (event.nextId == 'items') {
      this.visiblity = false;
      this.getVendoritems();
    }
  }

  getVendoritems() {
    this.getTheItemLookup();
    var ThisComponent = this;
    // this.getItemIntegrationDetails();
    this.getVendoritemsdata = new CustomStore({
      key: ["ItemCode", "Name", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        ThisComponent.dataFromService.getServerData("itemVendor", "getitemVendorDetail", ['',
          ThisComponent.vendCode])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        ThisComponent.dataFromService.getServerData("itemVendor", "INSERTNewItemVendor", ['',
          values["ItemCode"],
          ThisComponent.vendCode,
          values["Description"],
          values["Name"]]).subscribe(data => {
            if (data >= 1) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Inserting the Lines with ReferenceCode: " + values["ReferenceCode"] + ", Error Status Code is Insert Error");
            }
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        ThisComponent.dataFromService.getServerData("itemVendor", "deleteItemVendor", ['',
          key.ItemCode,
          ThisComponent.vendCode])
          .subscribe(dataStatus => {
            if (dataStatus >= 1) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines with ItemCode: " + key["ItemCode"] + ", Error Status Code is Delete failed.");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        ThisComponent.dataFromService.getServerData("itemVendor", "updateItemVendor", ['',
          ThisComponent.vendCode,
          getUpdateValues(key, newValues, "ItemCode"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "Name"),
          key["ItemCode"]]).subscribe(data => {
            if (data >= 1) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is not updated");
            }
          });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }


  getTheItemLookup() {
    this.dataFromService.getServerData("itemLookUP", "getItemList", ['',]
    ).subscribe(data => {
      this.itemLookupSuggestionDataGrid = {
        paginate: true,
        pageSize: 20,
        loadMode: "raw",
        load: () =>
          <String[]>data
      }
      itemListArray = data;
    });
  }

  formateForItemListHover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "ItemCode");
  }
  formateForItemListHover2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }

  vendorStatsrefresh() {
    this.dataFromService.getServerData("VendorKPI", "vendorChartStats", ['',
      this.vendCode])
      .subscribe(dataforKPI => {
        let numbers = dataforKPI;
        for (var i = 0; i < Object.keys(numbers).length; i++) {
          this.pieChartData[i] = Number(numbers[i]["Qty"]);
          this.pieChartLabels[i] = numbers[i]["LineCode"];
        }
        this.vendorChartData = dataforKPI;
      });
  }

  showGridNew() {
    if (this.showDatagridNew == true) {
      this.showDatagridNew = false;
    } else {
      this.showDatagridNew = true;
    }
  }

  userdefinedrefresh() {
    this.jsonSchema = JSON.parse(null);
    this.dataFromService.getServerData("schema", "getJSON2", ['', 'VENDOR'])
      .subscribe(getJSON2 => {
        var jsonSchema1 = JSON.parse(getJSON2[0]["attribute"]);
        this.dataFromService.getServerData("VendorCard", "getAllVendors", ["", this.vendCode])
          .subscribe(GotItemDetails => {
            var jsonData = JSON.parse(GotItemDetails[0]["attribute"])["attribute"];
            for (var i = 0; i < Object.keys(jsonSchema1['components']).length; i++) {
              for (var j = 0; j < Object.keys(jsonData).length; j++) {
                if (jsonSchema1['components'][i]["label"] == Object.keys(jsonData[j])) {
                  jsonSchema1['components'][i]["defaultValue"] = jsonData[j][jsonSchema1['components'][i]["label"]];
                }
              }
            }
            this.jsonSchema = jsonSchema1;
          });
      });
  }

  formatNumber(number) {
    number = parseFloat(number).toFixed(2) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  suggestionFormatForVendorGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormatForVatGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormatForWhtGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormatForVendorType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  hover2(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  hover1(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Description");
  }

  hover3(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "Name");
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

  formSummary_fieldDataChanged(e) {

  }

  onDefaultDropDownvalueChanged(event, dataField) {
    this.vendorDetails["" + dataField] = event.value;
    if (dataField == 'Country') {
      this.dataFromService.getServerData("CountryStateList", "getStateList", ['',
        this.vendorDetails["Country"]]).subscribe(getStateList => {
          this.getStateCodeListAll = new DataSource({
            store: <String[]>getStateList,
            paginate: true,
            pageSize: 20
          });
        });
    }
  }

  onVendorGroupChanged(e) {
    this.vendorDetails["VendorGroup"] = e.value;
    this.dataFromService.getServerData("VendorCard", "DELETERecord", ["", "VendorGroup", e.value, this.vendCode])
      .subscribe(DELETERecord => {
        this.errorHandlingToasterForUPDATE(DELETERecord);
      });
  }

  onVatBusGroupChanged(e) {
    this.vendorDetails["VATGroup"] = e.value;
    this.dataFromService.getServerData("VendorCard", "DELETERecord", ["", "VATGroup", e.value, this.vendCode])
      .subscribe(DELETERecord => {
        this.errorHandlingToasterForUPDATE(DELETERecord);
      });
  }

  onWHTBusGroupChanged(e) {
    this.vendorDetails["WHTGroup"] = e.value;
    this.dataFromService.getServerData("VendorCard", "DELETERecord", ["", "WHTGroup", e.value, this.vendCode])
      .subscribe(DELETERecord => {
        this.errorHandlingToasterForUPDATE(DELETERecord);
      });
  }

  onVendTypeChanged(e) {
    this.vendorDetails["VendorType"] = e.value;
    this.dataFromService.getServerData("VendorCard", "DELETERecord", ["", "VendorType", e.value, this.vendCode])
      .subscribe(DELETERecord => {
        this.errorHandlingToasterForUPDATE(DELETERecord);
      });
  }

  Save() {
    this.formWidget.instance.updateData(this.vendorDetails);
    var data = this.formWidget.instance.option("formData");
    var isActive: string;
    var isHO: string;
    if (data["VATID"] ? data["VATID"] != '' : false) {
      if (data["HO"] == true) {
        isHO = 'Yes';
      } else {
        isHO = 'No';
      }
      if (data["Active"] == true) {
        isActive = 'Yes';
      } else {
        isActive = 'No';
      }
      data.CreditLimit = data.CreditLimit != null ? data.CreditLimit == '' ? 0.00 : data.CreditLimit : 0.00;

      this.dataFromService.getServerData("VendorCard", "update", ["",
        data.Name, data.Address1, data.Address2, data.City,
        data.Country, data.ZipCode, data.Phone, data.Fax,
        data.Email, data.VATID, data.Purchaser, data.Contact,
        data.VendorType, data.VendorGroup, data.VATGroup,
        data.PaymentTerm, data.CreditLimit, data.LegacyCode,
        data.WHTGroup, isActive, isHO, data.BranchID,
        data.BranchName, data.State, this.vendCode]).subscribe(updateItemdata => {
          this.errorHandlingToasterForUPDATE(updateItemdata);
        });
    } else {
      this.toastr.warning("Please provide VAT ID to save this Vendor details");
    }

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

  onChange1(event) {
    if (event.changed != undefined) {
      switch (event.changed.component.type) {
        // this is for feature work for the other components
        /* case "":
            this.valueforJson = event.changed.component.checked;
            break; */
        default:
          this.valueforJson = event.changed.value;
      }
      this.keyforJson = event.changed.component.label;

      this.dataFromService.getServerData("VendorCard", "getJSON3", ["", this.vendCode])
        .subscribe(getJSON3 => {
          var jsonStr = getJSON3[0]["attribute"];
          var obj = JSON.parse(jsonStr);

          var thisC = this;
          obj['attribute'] = obj['attribute'].filter(function (item) {
            return (Object.keys(item) != thisC.keyforJson);
          });
          obj['attribute'].push({ [this.keyforJson]: this.valueforJson });
          jsonStr = JSON.stringify(obj);

          this.dataFromService.getServerData("VendorCard", "storeJsonAtrributeByJson", ["", jsonStr, this.vendCode])
            .subscribe(storeJsonAtrribute => {
            });
        });
    }
  }


  errorHandlingToasterForUPDATE(dataStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
    this.getVendorDetails();
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    for (var index = 0; index < itemListArray.length; ++index) {
      if (itemListArray[index].ItemCode == value) {
        newData.ItemCode = itemListArray[index].ItemCode;
        newData.Name = VendorName;
        newData.Description = itemListArray[index].Description;
        break;
      }
    }
    (<any>this).defaultSetCellValue(newData, value);
  }

  onInitNewRow() {
    this.newCustomerDetail = {};
    this.vendorItemAdd = true;
  }

  onHiding(event) {
    this.gridContainer2.instance.refresh();
  }

  suggestionFormatForBrand(data) {
    return data ? data.BrandCode : null;
  }

  onSuggestionChange(event, dataField) {
    if (event.value) {
      this.newCustomerDetail[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'Item Codes') {
          this.ItemCodeTemplateItem = true;
          this.BrandTemplateItem = false;
        } else {
          this.ItemCodeTemplateItem = false;
          this.BrandTemplateItem = true;
        }
      } else if (dataField == 'ItemCode') {
        for (var index = 0; index < itemListArray.length; ++index) {
          if (itemListArray[index].ItemCode == event.value) {
            this.newCustomerDetail.Name = VendorName;
            this.newCustomerDetail.Description = itemListArray[index].Description;
            break;
          }
        }
      } else if (dataField == 'BrandCode') {
        var jsonarray = this.brandSuggestions["_store"]._array ? this.brandSuggestions["_store"]._array : [];
        for (var index = 0; index < jsonarray.length; ++index) {
          if (jsonarray[index].BrandCode == event.value) {
            this.newCustomerDetail.Name = VendorName;
            this.newCustomerDetail.Description = jsonarray[index].Description;
            break;
          }
        }
      }
    }
  }

  SaveItemInPopup() {
    this.formWidget.instance.updateData(this.newCustomerDetail);
    if (this.newCustomerDetail["userselected"]) {
      if (this.newCustomerDetail["userselected"] == 'Item Codes') {
        if (this.newCustomerDetail["ItemCode"]) {
          this.dataFromService.getServerData("itemVendor", "INSERTNewItemVendor", ['',
            this.newCustomerDetail["ItemCode"],
            this.vendCode,
            this.newCustomerDetail["Description"],
            this.newCustomerDetail["Name"]]).subscribe(data => {
              if (data >= 1) {
                this.vendorItemAdd = false;
                this.toastr.success("Added Sucessfully", "DONE");
              } else {
                this.toastr.error("Error while Inserting the Lines with ReferenceCode: " + this.newCustomerDetail["ReferenceCode"] + ", Please Check For Duplicates");
              }
            });
        } else {
          this.toastr.warning("Please Provide the Valid Item Code!");
        }
      } else {
        if (this.newCustomerDetail["BrandCode"]) {
          this.dataFromService.getServerData("itemVendor", "INSERTNewItemVendorByBrand", ["",
            this.newCustomerDetail["BrandCode"],
            this.vendCode,
            this.newCustomerDetail["Description"],
            this.newCustomerDetail["Name"]])
            .subscribe(data => {
              if (data >= 0) {
                this.vendorItemAdd = false;
                this.toastr.success("Added Sucessfully", "DONE");
              } else {
                this.toastr.error("Error while Inserting the Lines with ReferenceCode: " + this.newCustomerDetail["BrandCode"] + ", Please Check For Duplicates");
              }
            });
        } else {
          this.toastr.warning("Please Provide the Valid Item Code!");
        }
      }
    } else {
      this.toastr.warning("Please Select the Line Type!")
    }
  }

}
