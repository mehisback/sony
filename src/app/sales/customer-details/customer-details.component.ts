import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { Router } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import { DomSanitizer } from '@angular/platform-browser';
import DataSource from "devextreme/data/data_source";
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { CustomerDetailsHttpDataService } from './customer-details-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

const data: any = require('./data.json');
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;


  custDetail: any = {};
  NameEditMode: boolean = false;
  visiblity: boolean = true;
  currentRate = 0;
  custCode: String = UtilsForGlobalData.retrieveLocalStorageKey('CustCode');
  formData: any = { min: 0, max: 500 };
  dataSource: CustomStore;
  error: any;
  salesPersonSuggestions: any = null;
  custGroupSuggestions: any = null;
  vatGroupSuggestions: any = null;
  custPriceGroupSuggestions: any = null;
  custAreaSuggestions: any = null;
  custSubAreaSuggestions: any = null;
  custTypeSuggestions: any = null;
  getCountryCodeListAll: DataSource;
  getStateCodeListAll: DataSource;
  data: any;
  phonePattern: any = /^[^a-z]+$/;
  phoneRules: any = {
    X: /[02-9]/
  };
  CustImage: any;
  CustimagePath: any;
  CustImageData: [];
  popupVisible: boolean = false;
  base64image: any;
  public pieChartLabels: string[] = [''];
  public pieChartData: number[] = [0];

  public pieChartType = 'pie';


  showPieChart = true;
  showDatagridNew = false;

  // This is for the donute chart
  donuteChart1: Chart = {
    type: 'Pie',
    data: data['Pie'],
    options: {
      donut: true,
      showLabel: false,
      donutWidth: 30
    }
  };
  dataforNewGrid: Object;
  jsonSchema: JSON;
  valueforJson: any;
  keyforJson: any;
  getCustomerContactdata: CustomStore;

  constructor(
    public router: Router,
    private httpDataService: CustomerDetailsHttpDataService,
    private toastr: ToastrService,
    public cdRef: ChangeDetectorRef,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.visiblity = true;
    this.getCustomerDetails();
    this.getImag();

    this.httpDataService.getRecordList([""])
      .subscribe(getSalesPerson => {
        this.salesPersonSuggestions = new DataSource({
          store: <String[]>getSalesPerson,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.getGeneralStats(['', this.custCode])
      .subscribe(dataforKPI => {
        let numbers = dataforKPI;
        for (var i = 0; i < Object.keys(numbers).length; i++) {
          this.pieChartData[i] = Number(numbers[i]["Qty"]);
          this.pieChartLabels[i] = numbers[i]["LineCode"];
        }
        this.dataforNewGrid = dataforKPI;
      });

    this.httpDataService.getCountryList(['']).subscribe(getCountryList => {
      this.getCountryCodeListAll = new DataSource({
        store: <String[]>getCountryList,
        paginate: true,
        pageSize: 20
      });
    });
  }

  getCustomerDetails() {
    this.httpDataService.getCustomerCard(["", this.custCode])
      .subscribe(GotCustDetail => {
        this.custDetail = GotCustDetail[0];
        if (this.custDetail["Name"] ? this.custDetail["Name"] != '' : false) {
          this.NameEditMode = false;
        } else {
          this.NameEditMode = true;
        }
        this.custDetail["CreditLimit"] = parseFloat(this.custDetail["CreditLimit"]).toFixed(2);
        var a = new Array(this.custDetail["Address1"], this.custDetail["Address2"], this.custDetail['Address3']);
        this.custDetail["custAddress"] = a.join(",");

        if (this.custDetail["CustBlocked"] == 'No' || this.custDetail["CustBlocked"] == '') {
          this.custDetail["CustBlocked"] = false;
        } else {
          this.custDetail["CustBlocked"] = true;
        }
        if (this.custDetail["HO"] == 'No' || this.custDetail["HO"] == '') {
          this.custDetail["HO"] = false;
        } else {
          this.custDetail["HO"] = true;
        }
        this.currentRate = this.custDetail["Rating"];
        this.custDetail["custAddress"] = this.custDetail["Address1"].concat(this.custDetail["Address2"]);
        this.httpDataService.getStateList(['',
          this.custDetail["Country"]]).subscribe(getStateList => {
            this.getStateCodeListAll = new DataSource({
              store: <String[]>getStateList,
              paginate: true,
              pageSize: 20
            });
          });
      });

    var thisComponent = this;
    thisComponent.dataSource = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getHeaderListBYCUSTOMER(["", thisComponent.custCode])
          .subscribe(data => {
            devru.resolve(data);
          });
        thisComponent.httpDataService.getTotalByCustomer(["", thisComponent.custCode])
          .subscribe(GotAPDetailTotal => {
            thisComponent.data = parseFloat(GotAPDetailTotal[0]["Balance"]).toFixed(2);
          });
        return devru.promise();
      }
    });
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  suggestionFormatForSalesPerson(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }


  suggestionFormatForCustGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormatForVatGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Description");
  }

  suggestionFormatForCustPriceGroup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "SalesCode", "Description");
  }


  suggestionFormatForAreaCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  suggestionFormatForSubAreaCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }


  suggestionFormatForCustType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Code", "Name");
  }

  suggestionFormatForCountryCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "countrycode", "countryname");
  }

  valueFormatForCountryCode(data1, data2) {
    if (this.getCountryCodeListAll && this.custDetail) {
      var json = this.getCountryCodeListAll["_store"]._array;
      for (var i = 0; i < Object.keys(json).length; i++) {
        if (json[i][data2] == this.custDetail[data1]) {
          return UtilsForSuggestion.autoFillSuggestionsFormatFor2(json[i], "countrycode", "countryname");
        }
      }
    }
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

  allowNewclick(args) {
    var e = args.jQueryEvent;
  }

  onClickedOutside(event: Event) {
    this.NameEditMode = false;
  }

  getImag() {
    this.httpDataService.getCustImage(["", this.custCode])
      .subscribe(getCustImage => {
        this.CustImageData = getCustImage[0];
        if (this.CustImageData != undefined)
          this.CustimagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,'
            + this.CustImageData["ImageTxt"]);
      });
  }

  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'CustomerDetails') {
      this.visiblity = true;
    }

    if (event.nextId == 'contact') {
      this.getVendoritems();
    }


    if (event.nextId == "CustomerOperations") {
      this.visiblity = true;
      if (this.custGroupSuggestions == null) {
        this.httpDataService.handleConnectedcustgroup([""])
          .subscribe(getCustGroup => {
            this.custGroupSuggestions = new DataSource({
              store: <String[]>getCustGroup,
              paginate: true,
              pageSize: 10
            });

          },
            error => this.error = this.alertCode(error));
      }
      if (this.vatGroupSuggestions == null) {
        this.httpDataService.handleConnectedvatBusGrp([""])
          .subscribe(getVatGroup => {
            this.vatGroupSuggestions = new DataSource({
              store: <String[]>getVatGroup,
              paginate: true,
              pageSize: 10
            });

          },
            error => this.error = this.alertCode(error));
      }
    }

    if (event.nextId == "CustomerSales") {
      this.getcustSubArea();
      this.visiblity = true;
      if (this.custPriceGroupSuggestions == null) {
        this.httpDataService.handleConnectedcustPriceGrp([""])
          .subscribe(getCustPriceGroup => {
            this.custPriceGroupSuggestions = new DataSource({
              store: <String[]>getCustPriceGroup,
              paginate: true,
              pageSize: 10
            });
            //  // console.log(this.custPriceGroupSuggestions._store._array);

          },
            error => this.error = this.alertCode(error));
      }
      if (this.custAreaSuggestions == null) {
        this.httpDataService.handleConnectedarea([""])
          .subscribe(getAreacode => {
            this.custAreaSuggestions = new DataSource({
              store: <String[]>getAreacode,
              paginate: true,
              pageSize: 10
            });

          },
            error => this.error = this.alertCode(error));
      }


      if (this.custTypeSuggestions == null) {
        this.httpDataService.handleConnectedcusttype([""])
          .subscribe(getCustType => {
            this.custTypeSuggestions = new DataSource({
              store: <String[]>getCustType,
              paginate: true,
              pageSize: 10
            });

          },
            error => this.error = this.alertCode(error));
      }
    }

    if (event.nextId == 'CustomerAREntries') {
      this.visiblity = false;
    }

    // if (event.nextId == 'userDefined') {
    //   this.userdefinedrefresh();
    // }
  }

  userdefinedrefresh() {
    this.jsonSchema = JSON.parse(null);
    this.httpDataService.getJSON2(['', 'CUSTOMER'])
      .subscribe(getJSON2 => {
        var jsonSchema1 = JSON.parse(getJSON2[0]["attribute"]);
        this.httpDataService.getCustomerCard1(["", this.custCode])
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

  onCustAreaChanged(event: any) {
    this.custDetail["AreaCode"] = event.value;
    this.httpDataService.handleConnectedsubarea(["", event.value])
      .subscribe(getSubAreacode => {
        this.custSubAreaSuggestions = new DataSource({
          store: <String[]>getSubAreacode,
          paginate: true,
          pageSize: 10
        });

      },
        error => this.error = this.alertCode(error));

  }

  onCustSubAreaChanged(event: any) {
    this.custDetail["SubAreaCode"] = event.value;
  }

  onCustTypeChanged(event: any) {
    this.custDetail["custType"] = event.value;
  }

  onCustPriceGroupChanged(event: any) {
    this.custDetail["PriceGroup"] = event.value;
  }

  onCustVatGroupChanged(event: any) {
    this.custDetail["VATGroup"] = event.value;
  }

  onCustGroupChanged(event: any) {
    this.custDetail["CustomerGroup"] = event.value;
  }

  onDefaultDropDownvalueChanged(event, dataField) {
    this.custDetail["" + dataField] = event.value;
    if (dataField == 'Country') {
      this.httpDataService.getStateList(['',
        this.custDetail["Country"]]).subscribe(getStateList => {
          this.getStateCodeListAll = new DataSource({
            store: <String[]>getStateList,
            paginate: true,
            pageSize: 20
          });
        });
    }
  }


  onCustSAlesPersonChanged(event: any) {
    this.custDetail["Salesperson"] = event.value;
  }

  onCustNameChanged(event: any) {
    this.httpDataService.updateCustomers(["", 'Name', event.value, this.custCode])
      .subscribe(updateCustomers => {
        this.errorHandlingToasterForUPDATE(updateCustomers);
      });
  }

  getcustSubArea() {

    this.httpDataService.handleConnectedsubarea2(["", this.custDetail["AreaCode"]])
      .subscribe(getSubAreacode => {
        this.custSubAreaSuggestions = new DataSource({
          store: <String[]>getSubAreacode,
          paginate: true,
          pageSize: 10
        });
      },
        error => this.error = this.alertCode(error));
  }

  form_fieldDataChanged(event) {
    if (event.dataField == 'CreditLimit') {
      this.custDetail["" + event.dataField] = parseFloat(this.custDetail["" + event.dataField]).toFixed(2);
    }
  }

  update() {
    this.formWidget.instance.updateData(this.custDetail);
    var data = this.formWidget.instance.option("formData");
    data.Rating = this.currentRate;
    if (data.CustBlocked == false) {
      data.CustBlocked = "No";
    } else {
      data.CustBlocked = "yes";
    }
    if (data.HO == false) {
      data.HO = 'No';
    } else {
      data.HO = 'Yes';
    }
    this.httpDataService.UPDATECustomer(
      ["", data.Name2,
        data.Salesperson,
        data.Phone,
        data.Fax,
        data.Website,
        data.VATID,
        data.Address1,
        data.Address2,
        data.Address3,
        data.City,
        data.ZipCode,
        data.AreaCode,
        data.CustomerGroup,
        data.VATGroup,
        data.SubAreaCode,
        data.custType,
        data.CustBlocked,
        data.Name,
        data.Contact,
        data.LegacyCode,
        data.PriceGroup,
        data.HO,
        data.BranchID,
        data.PaymentTerm,
        data.BranchName,
        data.Rating,
        data.Latitude,
        data.Longitude,
        data.Country,
        data.Email,
        data.State,
        data.CreditLimit,
        data.CustCode]).subscribe(updateCustdata => {
          this.errorHandlingToasterForUPDATE(updateCustdata);
        }, error => this.error = this.alertCode(error));
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
      this.httpDataService.getBase64(files[0])
        .then(gotbase64backimg => {
          this.base64image = gotbase64backimg;
          this.base64image = this.base64image.split(",")[1];
          this.httpDataService.newimage(["", this.custCode, this.base64image])
            .subscribe(getSubAreacode => {
              this.popupVisible = false;
              this.getImag();
            });
        }
        );
    }
  }

  routeBack() {
    this.router.navigate(['/sales/customer-list']);
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

  showGridNew() {
    if (this.showDatagridNew == true) {
      this.showDatagridNew = false;
    } else {
      this.showDatagridNew = true;
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

      this.httpDataService.getJSON3(["", this.custCode])
        .subscribe(getJSON3 => {
          var jsonStr = getJSON3[0]["attribute"];
          var obj = JSON.parse(jsonStr);

          var thisC = this;
          obj['attribute'] = obj['attribute'].filter(function (item) {
            return (Object.keys(item) != thisC.keyforJson);
          });
          obj['attribute'].push({ [this.keyforJson]: this.valueforJson });
          jsonStr = JSON.stringify(obj);

          this.httpDataService.storeJsonAtrributeByJson(["", jsonStr, this.custCode])
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
    this.getCustomerDetails();
  }

  getVendoritems() {
    var ThisComponent = this;
    this.getCustomerContactdata = new CustomStore({
      key: ["ContactID", "FirstName", "LastName", "LastName", "Email"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        ThisComponent.httpDataService.getCustomerContactDetail(["",
          ThisComponent.custCode])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        ThisComponent.httpDataService.INSERTNewCustomerContact(["",
          values["FirstName"],
          values["LastName"],
          values["MobilePhone"],
          values["Email"],
          ThisComponent.custCode,]).subscribe(data => {
            if (data >= 1) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Inserting the Lines ");
            }
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        ThisComponent.httpDataService.deleteCustomerContact(["",
          key.ContactID])
          .subscribe(dataStatus => {
            if (dataStatus >= 1) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Deleting the Lines");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        ThisComponent.httpDataService.updateCustomerContact(["",
          getUpdateValues(key, newValues, "FirstName"),
          getUpdateValues(key, newValues, "LastName"),
          getUpdateValues(key, newValues, "MobilePhone"),
          getUpdateValues(key, newValues, "Email"),
          getUpdateValues(key, newValues, "ContactID")]
        ).subscribe(data => {
          if (data >= 1) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Updating the Lines");
          }
        });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }


}
