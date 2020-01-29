import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
require('jspdf-autotable');
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  AccountType: string = 'ALL';
  dataSource: any = [];
  printLines: any = {};
  AccountTypeSuggestions: any = {};
  ParentCodeSuggestions: any = {};
  SubAccountTypeSuggestions: any = {};
  PostingTypeSuggestions: any = ['Both', 'Debit', 'Credit'];
  MainTypeSuggestions: any = ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSES'];
  AccountLevelSuggestions: any = ['1', '2', '3', '4', '5'];
  onUpdateHolder: any = {};
  companyData = null;
  columns1 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "Account Code", dataKey: "AccountCode", width: 40 },
    { title: "Name", dataKey: "Name", width: 40 },
    { title: "Balance", dataKey: "Balance", width: 40 }
  ];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  companySetupOne: object = [];
  companySetupTwo: object = [];
  companyName: string;
  companySetupThree: object = [];
  companySetupFour: object = [];
  userSetupOne: any = {};
  userSetupTwo: any = [];
  FYSetupOne: any = [];
  FYDate: string;
  usersList: object = [];

  AllowBackDate = [{ Code: "Yes" }, { Code: "No" }];
  CostingMethod = [{ Code: "AVERAGE" }, { Code: "FIFO" }];
  CurrentFiscalYear: object = [];
  costingMethodValue: any;
  backdateValue: any;
  fiscalyearvalue: any;
  generalAccountingSetupOne: any = {};
  LSfiscalyearvalue: string;
  LSbackdateValue: string;
  LScostingMethodValue: string;
  showUsersPopup: boolean = false;
  showRolesPopup: boolean = false;
  showPaymentPopup: boolean = false;
  showARPopup: boolean = false;
  showAPPopup: boolean = false;
  showWHTPopup1: boolean = false;
  showWHTPopup2: boolean = false;
  showVATPopup1: boolean = false;
  showVATPopup2: boolean = false;
  showCurrencyPopup: boolean = false;
  showPolicyPopup: boolean = false;
  popupVisible2: boolean = false;
  showUOMPopup: boolean = false;
  showFYPopup: boolean = false;
  roleList: Object = [];
  roleSetupOne: any;
  ARList: Object;
  ARSetupOne: any;
  uomsOne: Object;
  APSetupOne: any;
  APList: Object;
  WHTList1: Object;
  WHTList2: Object;
  WHTSetupOne: any;
  WHTSetupTwo: any;
  VATList1: Object;
  VATList2: Object;
  VATSetupOne: any;
  VATSetupTwo: any;
  paymentList: Object;
  PaymentSetupOne: any;
  currencyList: Object;
  currencySetupOne: any;
  policyList: Object;
  policySetupOne: any;
  itemImageData: any;
  itemimagePath: any;
  base64image: any;
  getAllUOMs: Object;
  currencyArray: Object;
  currencyCodevalue: any;
  LScurrencyCodevalue: string;
  company: any;
  fiscalYearList: Object;
  namePattern: any = /^[^ ]+$/;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public dataServices: DataService,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer
  ) {
    this.setSubAccountTypeOnAccountType = this.setSubAccountTypeOnAccountType.bind(this);
  }

  ngAfterViewInit() {
    $(function () {
      $('.preloader').fadeOut();
    });
  }

  ngOnInit() {
    this.companyName = UtilsForGlobalData.retrieveLocalStorageKey("company");
    this.getImag();
    localStorage.removeItem("companyName");

    this.dataServices.getServerData("userManager", "getUserList", [""])
      .subscribe(GotUserList => {
        this.usersList = GotUserList;
      });

    this.dataServices.getServerData("FiscalYear", "getFiscalYears", [""])
      .subscribe(getFiscalYears => {
        this.fiscalYearList = getFiscalYears
      });

    this.dataServices.getServerData("RoleBasicSetup", "getRoleList", [""])
      .subscribe(GotUserList => {
        this.roleList = GotUserList;
      });

    this.dataServices.getServerData("PaymentMaster", "getList", [""])
      .subscribe(getList => {
        this.paymentList = getList;
      });

    this.dataServices.getServerData("CurrencyExchangeRateSetup", "getList", [""])
      .subscribe(getList => {
        this.currencyList = getList;
      });

    this.dataServices.getServerData("GenPolicySetup", "getList1", [""])
      .subscribe(getList1 => {
        this.policyList = getList1;
      });

    this.dataServices.getServerData("globalSetup", "Arlist", [""])
      .subscribe(Arlist => {
        this.ARList = Arlist;
      });
    this.dataServices.getServerData("globalSetup", "Aplist", [""])
      .subscribe(Aplist => {
        this.APList = Aplist;
      });

    this.dataServices.getServerData("WHTSetup", "getList1", [""])
      .subscribe(getList1 => {
        this.WHTList1 = getList1;
      });

    this.dataServices.getServerData("WHTSetup", "getList2", [""])
      .subscribe(getList2 => {
        this.WHTList2 = getList2;
      });

    this.dataServices.getServerData("VATGSTSetup", "getList1", [""])
      .subscribe(getList1 => {
        this.VATList1 = getList1;
      });

    this.dataServices.getServerData("VATGSTSetup", "getList2", [""])
      .subscribe(getList2 => {
        this.VATList2 = getList2;
      });

    this.dataServices.getServerData("globalLookup", "handleConnectedCurrencyCode", [''])
      .subscribe(currencyArray => {
        this.currencyArray = currencyArray;
      });

    this.dataServices.getServerData("FinancialSetUp", "initGenAccountSetup", [""])
      .subscribe(initGenAccountSetup => {
        this.generalAccountingSetupOne = initGenAccountSetup[0];
      });


    this.dataServices.getServerData("FiscalYear", "getFiscalYears", [''])
      .subscribe(getFiscalYears => {
        this.CurrentFiscalYear = getFiscalYears;
      });

    this.dataServices.getServerData("unitofMeasure", "getAllUOMs", [''])
      .subscribe(getAllUOMs => {
        this.getAllUOMs = getAllUOMs;
      });

    this.dataServices.getServerData("company", "getCompanyInfo", ['', this.companyName])
      .subscribe(getCompanyInfo => {
        this.companySetupOne = getCompanyInfo[0];
        this.companySetupTwo = getCompanyInfo[0];
        this.companySetupThree = getCompanyInfo[0];
        this.companySetupFour = getCompanyInfo[0];
      });


    var thisComponent = this;
    var dummyDataServive = this.dataServices;

    this.dataSource = new CustomStore({
      key: "AccountCode",
      //key: ["AccountCode", "Name", "AccountLevel", "AccountType", "SubAccountType", "PostingType", "parentAccount"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        if (thisComponent.AccountType == 'ALL') {
          dummyDataServive.getServerData("ChartOfAccounts", "openChartOfAccounts", [""])
            .subscribe(data => {
              thisComponent.printLines = data;
              devru.resolve(data);
            });
        }
        else {
          thisComponent.dataServices.getServerData("ChartOfAccounts", "openChartOfAccountsFilter", ["",
            thisComponent.AccountType])
            .subscribe(data => {
              thisComponent.printLines = data;
              devru.resolve(data);
            });
        }
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["AccountCode"] != undefined ? values["Name"] != undefined ? values["AccountLevel"] != undefined ?
          values["AccountType"] != undefined ? values["PostingType"] != undefined ? values["ParentCode"] != undefined ? true : false : false : false : false : false : false) {
          dummyDataServive.getServerData("ManageAccountCode", "btnSave_clickHandlerADD", ["",
            values["AccountCode"],
            values["Name"],
            values["AccountLevel"] != null ? values["AccountLevel"] : '0',
            values["AccountType"],
            values["SubAccountType"] == undefined ? '' : values["SubAccountType"],
            values["PostingType"],
            values["AccountType"],
            values["AccountLevel"] == '1' ? values["AccountCode"] : values["ParentCode"]
          ]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Adding the Lines with AccountCode: " + values["AccountCode"] + ", Error Status Code is " + data[0]);
            }
          });
        } else {
          devru.resolve();
          thisComponent.toastr.warning("Some Fields Are Missing");
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ManageAccountCode", "btnSave_clickHandlerMODIFY", ["",
          getUpdateValues(key, newValues, "Name"),
          getUpdateValues(key, newValues, "AccountLevel"),
          getUpdateValues(key, newValues, "AccountType"),
          getUpdateValues(key, newValues, "SubAccountType"),
          getUpdateValues(key, newValues, "PostingType"),
          getUpdateValues(key, newValues, "AccountLevel") == '1' ? getUpdateValues(key, newValues, "AccountCode") : getUpdateValues(key, newValues, "ParentCode"),
          getUpdateValues(key, newValues, "AccountCode")
        ])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with AccountCode: " + getUpdateValues(key, newValues, "AccountCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataServices.getServerData("ManageAccountCode", "getAccountType", [''])
      .subscribe(callData3 => {
        this.AccountTypeSuggestions = {
          paginate: true,
          pageSize: 10,
          loadMode: "raw",
          load: () =>
            <String[]>callData3
        }
      });

    dummyDataServive.getServerData("company", "getCompanyInfo", ['', localStorage.getItem('company')])
      .subscribe(callData3 => {
        this.companyData = callData3[0];
      });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == undefined || newValues[field] == null) ? thisComponent.onUpdateHolder[field] : newValues[field];
    }

  }

  passwordComparison = () => {
    return this.userSetupOne.password ? this.userSetupOne.password : '';
  };

  errorHandlingToasterForUPDATESTATUS(dataStatus, errorStatus) {
    if (dataStatus >= 0) {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating! Please Check For DUP/INVALID, Error Status Code :" + errorStatus, "Try Again");
    }
  }

  companySetupOneButtonClick() {
    this.formWidget.instance.updateData(this.companySetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("globalSetup", "companySetupOne", ['',
      data["HomePage"],
      data["BranchID"],
      data["BranchName"],
      data["Address1"],
      data["Address2"],
      data["City"],
      data["PostCode"],
      data["VATID"],
      data["Phone"],
      data["Fax"],
      data["EMail"],
      this.companyName]).subscribe(companySetupOne => {
        this.errorHandlingToasterForUPDATESTATUS(companySetupOne, "UPDATE-ERR");
        /* if (companySetupOne == 1) {
          this.toastr.success("Details Updated!");
        } */
      });
  }

  companySetupTwoButtonClick() {
    this.formWidget.instance.updateData(this.companySetupTwo);
    var data = this.formWidget.instance.option("formData");

    this.companyName = localStorage.getItem("companyName");

    this.dataServices.getServerData("globalSetup", "companySetupTwo", ['',
      data["Address1"],
      data["Address2"],
      data["City"],
      data["PostCode"],
      this.companyName]).subscribe(companySetupTwo => {
        this.errorHandlingToasterForUPDATESTATUS(companySetupTwo, "UPDATE-ERR");
        /* if (companySetupTwo == 1) {
          this.toastr.success("Details Updated!");
        } */
      });
  }

  companySetupThreeButtonClick() {
    this.formWidget.instance.updateData(this.companySetupThree);
    var data = this.formWidget.instance.option("formData");

    this.companyName = localStorage.getItem("companyName");

    this.dataServices.getServerData("globalSetup", "companySetupThree", ['',
      data["VATID"],
      this.companyName]).subscribe(companySetupThree => {
        this.errorHandlingToasterForUPDATESTATUS(companySetupThree, "UPDATE-ERR");
        /* if (companySetupThree == 1) {
          this.toastr.success("Details Updated!");
        } */
      });
  }

  companySetupFourButtonClick() {
    this.formWidget.instance.updateData(this.companySetupFour);
    var data = this.formWidget.instance.option("formData");

    this.companyName = localStorage.getItem("companyName");

    this.dataServices.getServerData("globalSetup", "companySetupFour", ['',
      data["Phone"],
      data["Fax"],
      data["EMail"],
      this.companyName]).subscribe(companySetupFour => {
        this.errorHandlingToasterForUPDATESTATUS(companySetupFour, "UPDATE-ERR");
        /* if (companySetupFour == 1) {
          this.toastr.success("Details Updated!");
        } */
      });
  }

  userSetupOneButtonClick(event) {
    this.formWidget.instance.updateData(this.userSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("globalSetup", "userSetupOne", ['',
      this.userSetupOne["userid"],
      this.userSetupOne["userName"],
      this.userSetupOne["password"],
      this.companyName]).subscribe(userSetupOne => {
        this.errorHandlingToasterForUPDATESTATUS(userSetupOne, "INSERT-ERR");
        if (userSetupOne == 1) {
          this.userSetupOne = {};
        }
        /* if (userSetupOne == 1) {
          this.toastr.success("Details Updated!");
          this.userSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  userSetupTwoButtonClick() {
    this.formWidget.instance.updateData(this.userSetupTwo);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("globalSetup", "userSetupTwo", ['',
      this.userSetupTwo["password"],
      this.userSetupTwo["userid"]]).subscribe(userSetupTwo => {
        this.errorHandlingToasterForUPDATESTATUS(userSetupTwo, "INSERT-ERR");
        if (userSetupTwo == 1) {
          this.userSetupTwo = {};
        }
        /* if (userSetupTwo == 1) {
          this.toastr.success("Details Updated!");
          this.userSetupTwo = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  FYSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.FYSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.FYDate = this.FYSetupOne["StartingDate"].toLocaleDateString('zh-Hans-CN').replace('/', '-').replace('/', '-');

    this.dataServices.getServerData("CreateFiscalYear", "createNewFiscalYear", ['',
      this.FYDate,
      this.FYSetupOne["FiscalYearID"],
      UtilsForGlobalData.getUserId()]).subscribe(FYSetupOne => {
        if (FYSetupOne[0] == 'DONE') {
          this.toastr.success("Fiscal Year Created Successfully", "Done");
          this.FYSetupOne = {};
          this.ngOnInit();
        } else {
          this.toastr.error("Failed to Create the Fiscal Year, Error Status Code :" + FYSetupOne[0]);
        }
      });
  }

  hover2(data) {
    return "<div class='custom-item' title='" + data.Code + "'>" + data.Code + "</div>";
  }

  hover6(data) {
    return "<div class='custom-item' title='" + data.CurrencyCode + "'>" + data.CurrencyCode + "</div>";
  }

  suggestionFormateForDropDown2(data) {
    return data ? data.Code : '';
  }

  suggestionFormateForDropDown3(data) {
    return data ? data.FiscalYearID : '';
  }

  hover3(data) {
    return "<div class='custom-item' title='" + data.FiscalYearID + "'>" + data.FiscalYearID + "</div>";
  }

  suggestionFormateForcurrencyArray(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "CurrencyCode");
  }


  onCurrentFiscalYearChange(event) {
    this.fiscalyearvalue = event.value;
    window.localStorage.setItem('fiscalyearvalue', this.fiscalyearvalue);
  }

  onCurrencyCodeChange(event) {
    this.currencyCodevalue = event.value;
    window.localStorage.setItem('currencyCodevalue', this.currencyCodevalue);
  }

  AllowBackDateChange(event) {
    this.backdateValue = event.value;
    window.localStorage.setItem('backdateValue', this.backdateValue);
  }

  onCostingMethodChange(event) {
    this.costingMethodValue = event.value;
    window.localStorage.setItem('costingMethodValue', this.costingMethodValue);
  }


  generalAccountingSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.generalAccountingSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.LSfiscalyearvalue = localStorage.getItem("fiscalyearvalue");
    this.LSbackdateValue = localStorage.getItem("backdateValue");
    this.LScostingMethodValue = localStorage.getItem("costingMethodValue");
    this.LScurrencyCodevalue = localStorage.getItem("currencyCodevalue");

    if (data["RoundingPrecision"] ? data["RoundingPrecision"] != '' : false) {
      this.dataServices.getServerData("globalSetup", "generalAccountingSetupOneButtonClick", ['',
        this.LSfiscalyearvalue,
        this.LSbackdateValue,
        this.LScurrencyCodevalue,
        this.LScostingMethodValue,
        data["RoundingPrecision"],
      ]).subscribe(generalAccountingSetupOne => {
        this.errorHandlingToasterForUPDATESTATUS(generalAccountingSetupOne, "UPDATE-ERR");
        if (generalAccountingSetupOne >= 0) {
          this.generalAccountingSetupOne = {};
        }
      });
    } else {
      this.toastr.warning("Invalid RoundingPrecision Please Provide a Valid Number");
    }
  }

  gotothewebsite() {
    this.router.navigate(['/authentication/login']);
  }

  showUSers() {
    this.showUsersPopup = true;
    this.ngOnInit();
  }

  showFY() {
    this.showFYPopup = true;
    this.ngOnInit();
  }

  showRole() {
    this.showRolesPopup = true;
    this.ngOnInit();
  }
  showPayment() {
    this.showPaymentPopup = true;
    this.ngOnInit();
  }
  showCurrency() {
    this.showCurrencyPopup = true;
    this.ngOnInit();
  }
  showPolicy() {
    this.showPolicyPopup = true;
    this.ngOnInit();
  }
  showARList() {
    this.showARPopup = true;
    this.ngOnInit();
  }

  showAPList() {
    this.showAPPopup = true;
    this.ngOnInit();
  }

  showUoms() {
    this.showUOMPopup = true;
    this.ngOnInit();
  }

  showWHTList1() {
    this.showWHTPopup1 = true;
    this.ngOnInit();
  }

  showWHTList2() {
    this.showWHTPopup2 = true;
    this.ngOnInit();
  }

  showVATList1() {
    this.showVATPopup1 = true;
    this.ngOnInit();
  }

  showVATList2() {
    this.showVATPopup2 = true;
    this.ngOnInit();
  }

  showInfo() {
    this.popupVisible2 = true;
  }


  roleSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.roleSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("RoleBasicSetup", "btnValidateNewRole_clickHandler", ['',
      data["RoleID"]]).subscribe(btnValidateNewRole_clickHandler => {
        if (btnValidateNewRole_clickHandler[0] == 'CREATED') {
          this.toastr.success("Role ID Created Successfully", "Done");
          this.roleSetupOne = {};
        } else {
          this.toastr.error("Failed to Create the Role ID, Error Status Code :" + btnValidateNewRole_clickHandler[0]);
        }
      });
  }

  paymentSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.PaymentSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("PaymentMaster", "btnValidate_clickHandler", ['',
      data["Code"], data["Description"]]).subscribe(btnValidate_clickHandler => {
        this.errorHandlingToasterForUPDATESTATUS(btnValidate_clickHandler, "INSERT-ERR");
        if (btnValidate_clickHandler == 1) {
          this.PaymentSetupOne = {};
        }
        /* if (btnValidate_clickHandler == 1) {
          this.toastr.success("Details Updated!");
          this.PaymentSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  currencySetupOneButtonClick() {
    this.formWidget.instance.updateData(this.currencySetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("CurrencyExchangeRateSetup", "btnNewCode_clickHandler", ['',
      data["CurrencyCode"], data["ExchangeRate"]]).subscribe(btnNewCode_clickHandler => {
        this.errorHandlingToasterForUPDATESTATUS(btnNewCode_clickHandler, "INSERT-ERR");
        if (btnNewCode_clickHandler == 1) {
          this.currencySetupOne = {};
        }
        /* if (btnNewCode_clickHandler == 1) {
          this.toastr.success("Details Updated!");
          this.currencySetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  policySetupOneButtonClick() {
    this.formWidget.instance.updateData(this.policySetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("GenPolicySetup", "save1PressedAdd", ['',
      data["Code"],
      data["Description"]]).subscribe(save1PressedAdd => {
        this.errorHandlingToasterForUPDATESTATUS(save1PressedAdd, "INSERT-ERR");
        if (save1PressedAdd == 1) {
          this.policySetupOne = {};
        }
        /* if (save1PressedAdd == 1) {
          this.toastr.success("Details Updated!");
          this.policySetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  UomsOneButtonClick() {
    this.formWidget.instance.updateData(this.uomsOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("unitofMeasure", "addNewUOM", ['',
      data["Code"],
      data["Description"]]).subscribe(addNewUOM => {
        if (addNewUOM == 1) {
          this.toastr.success("New UOM added Successfully!", "Done");
          this.uomsOne = {};
        } else {
          this.toastr.error("Error While Adding,Please Check For INVALID/DUPLICATES, Error Status Code :INSERT-ERR");
        }
      });
  }

  ARSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.ARSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("globalSetup", "ARInsert", ['',
      data["Code"],
      data["Description"]]).subscribe(ARInsert => {
        this.errorHandlingToasterForUPDATESTATUS(ARInsert, "INSERT-ERR");
        if (ARInsert == 1) {
          this.ARSetupOne = {};
        }
        /* if (ARInsert == '1') {
          this.toastr.success("Details Updated!");
          this.ARSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  APSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.APSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("globalSetup", "APInsert", ['',
      data["Code"],
      data["Description"]]).subscribe(ARInsert => {
        this.errorHandlingToasterForUPDATESTATUS(ARInsert, "INSERT-ERR");
        if (ARInsert == 1) {
          this.APSetupOne = {};
        }
        /* if (ARInsert == '1') {
          this.toastr.success("Details Updated!");
          this.APSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  WHTSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.WHTSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("WHTSetup", "save1PressedAdd", ['',
      data["Code"],
      data["Description"]]).subscribe(save1PressedAdd => {
        this.errorHandlingToasterForUPDATESTATUS(save1PressedAdd, "INSERT-ERR");
        if (save1PressedAdd == 1) {
          this.WHTSetupOne = {};
        }
        /* if (save1PressedAdd == 1) {
          this.toastr.success("Details Updated!");
          this.WHTSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  WHTSetupTwoButtonClick() {
    this.formWidget.instance.updateData(this.WHTSetupTwo);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("WHTSetup", "save2PressedAdd", ['',
      data["Code"],
      data["Description"]]).subscribe(save2PressedAdd => {
        this.errorHandlingToasterForUPDATESTATUS(save2PressedAdd, "INSERT-ERR");
        if (save2PressedAdd == 1) {
          this.WHTSetupTwo = {};
        }
        /* if (save2PressedAdd == '1') {
          this.toastr.success("Details Updated!");
          this.WHTSetupTwo = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  VATSetupOneButtonClick() {
    this.formWidget.instance.updateData(this.VATSetupOne);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("VATGSTSetup", "save1PressedAdd", ['',
      data["Code"],
      data["Description"]]).subscribe(save1PressedAdd => {
        this.errorHandlingToasterForUPDATESTATUS(save1PressedAdd, "INSERT-ERR");
        if (save1PressedAdd == 1) {
          this.VATSetupOne = {};
        }
        /* if (save1PressedAdd == 1) {
          this.toastr.success("Details Updated!");
          this.VATSetupOne = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  VATSetupTwoButtonClick() {
    this.formWidget.instance.updateData(this.VATSetupTwo);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getServerData("VATGSTSetup", "save2PressedAdd", ['',
      data["Code"],
      data["Description"]]).subscribe(save2PressedAdd => {
        this.errorHandlingToasterForUPDATESTATUS(save2PressedAdd, "INSERT-ERR");
        if (save2PressedAdd == 1) {
          this.VATSetupTwo = {};
        }
        /* if (save2PressedAdd == 1) {
          this.toastr.success("Details Updated!");
          this.VATSetupTwo = {};
        } else {
          this.toastr.error("Something went wrong!");
        } */
      });
  }

  formateForAccountTypeSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  AccountTypeLookUp(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "Code", "CodeType");
  }

  formateForParentCodeTypeSuggestion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "AccountCode");
  }

  ParentCodeLookUp(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "AccountCode", "Name");
  }


  onTabChange(event: NgbTabChangeEvent) {
    this.AccountType = event.nextId;
    this.gridContainer.instance.refresh();
  }

  COAOnEditing(event, type) {
    event.component.columnOption("AccountLevel", "visible", true);
    event.component.columnOption("PostingType", "visible", true);
    event.component.columnOption("MainType", "visible", true);
    if (type == 'ADD') {
      event.component.columnOption("ParentCode", "visible", false);
      event.component.columnOption("SubAccountType", "visible", false);
      if (event.data.ParentCode == '0') {
        event.data.AccountLevel = 0;
        event.component.columnOption("AccountLevel", "allowEditing", false);
      }
    }
    else {
      this.onUpdateHolder = event.data;
      this.dataServices.getServerData("COALookUp", "getListBYLEVEL", ['',
        event.data.AccountLevel]).subscribe(callData3 => {
          if ((Object.keys(callData3).length > 0)) {
            event.component.columnOption("ParentCode", "visible", true);
            this.ParentCodeSuggestions = new DataSource({
              store: <String[]>callData3,
              paginate: true,
              pageSize: 10
            });
          }
        });
    }
  }

  setSubAccountTypeOnAccountType(newData, value, currentData): void {
    newData.SubAccountType = '';
    newData.AccountType = value;
    this.setFetch(value);
    //(<any>this).defaultSetCellValue(newData, value);
  }

  setFetch(value) {
    this.dataServices.getServerData("ManageAccountCode", "getSubAccountType", ['',
      value]).subscribe(callData3 => {
        if ((Object.keys(callData3).length > 0)) {
          this.SubAccountTypeSuggestions = new DataSource({
            store: <String[]>callData3,
            paginate: true,
            pageSize: 10
          });
        }
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

  getImag() {
    this.dataServices.getServerData("company", "getCompanyImage", ["", this.companyName])
      .subscribe(getCustImage => {
        this.itemImageData = getCustImage[0];
        if (this.itemImageData != undefined)
          this.itemimagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,'
            + this.itemImageData["CompanyLogoText"]);
      });
  }

  processFile(imageInput, event) {
    var files = imageInput.files;
    var file = files[0];
    var t = file.type.split('/').pop().toLowerCase();
    if (t != "jpeg" && t != "jpg" && t != "png") {
      this.toastr.warning("Please select a valid image file");
    } else if (file.size > 1024000) {
      this.toastr.warning("Max Upload size is 1MB only");
    } else {
      this.dataServices.getBase64(files[0])
        .then(gotbase64backimg => {
          this.base64image = gotbase64backimg;
          this.base64image = this.base64image.split(",")[1];
          this.dataServices.getServerData("globalSetup", "updateImage", ["", this.companyName, this.base64image])
            .subscribe(updateImage => {
              this.errorHandlingToasterForUPDATESTATUS(updateImage, "UPDATE-ERR");
              this.popupVisible2 = false;
              this.getImag();
            });
        }
        );
    }
  }

  getImageDimension(image): Observable<any> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = function (event) {
        const loadedImage: any = event.currentTarget;
        image.width = loadedImage.width;
        image.height = loadedImage.height;
        observer.next(image);
        observer.complete();
      }
      img.src = image.url;
    });
  }

  finishSetup() {
    this.dataServices.getServerData("company", "getCompany", [''])
      .subscribe(getCompany => {
        this.company = getCompany[0];
        if (this.company["SeupStepsCompleted"] == '12') {
          this.dataServices.getServerData("company", "updateSetupField", [''])
            .subscribe(updateSetupField => {
              if (updateSetupField == 1) {
                this.toastr.success("Setup Completed!");
                this.router.navigate(['/dashboard/dashboard1']);
              }
            });
        } else {
          this.toastr.error("Setup is not completed");
        }
      });
  }

  skipSetup() {
    this.router.navigate(['/dashboard/dashboard1']);
  }

  updateCompanySetupNumber(number) {
    this.dataServices.getServerData("company", "updateSetupField2", ['', number])
      .subscribe(updateSetupField2 => {
        if (updateSetupField2 == 1) {
          if (number == 1) {
            this.toastr.success("Company Updated!");
          }
          if (number == 2) {
            this.toastr.success("Users Updated!");
          }
          if (number == 3) {
            this.toastr.success("Fiscal year Updated!");
          }
          if (number == 4) {
            this.toastr.success("General Accounting Updated!");
          }
          if (number == 5) {
            this.toastr.success("Roles Updated!");
          }
          if (number == 6) {
            this.toastr.success("Account Receivables Updated!");
          }
          if (number == 7) {
            this.toastr.success("Account Payable Updated!");
          }
          if (number == 8) {
            this.toastr.success("With Holding Tax Updated!");
          }
          if (number == 9) {
            this.toastr.success("TAX Updated!");
          }
          if (number == 10) {
            this.toastr.success("Payments Updated!");
          }
          if (number == 11) {
            this.toastr.success("Currency Exchange Updated!");
          }
          if (number == 12) {
            this.toastr.success("General Policy Updated!");
          }
        }
      });
  }

}