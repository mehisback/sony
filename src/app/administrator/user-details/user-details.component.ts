import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import DataSource from "devextreme/data/data_source";
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { DomSanitizer } from '@angular/platform-browser';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  providers: [DatePipe]
})
export class UserDetailsComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;
  @ViewChild("barcodegridContainer") gridContainer: DxDataGridComponent;

  SelectedUserId: string = UtilsForGlobalData.retrieveLocalStorageKey('user');
  userDetails: [] = null;
  editMode: boolean = false;
  CompanySuggestions: DataSource;
  BUSuggestionsLsit: DataSource;
  RoleSuggestionsList: DataSource;
  PostionSuggestionsList: DataSource;
  AreaSuggestionsList: DataSource;
  SupervisorSuggestionsList: DataSource;
  duplicateEJDetails: string[];
  changePopUp: boolean = false;
  changePass: [] = null;
  itemImageData: any;
  itemimagePath: any;
  popupVisible: boolean;
  base64image;
  deleteconfirmpopup: boolean = false;

  constructor(
    public router: Router,
    private dataFromService: DataService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public cdRef: ChangeDetectorRef,
    private _sanitizer: DomSanitizer
  ) {
    this.checkBox_valueChanged = this.checkBox_valueChanged.bind(this);
    this.onBrandFilter = this.onBrandFilter.bind(this);
  }

  ngOnInit() {
    this.getUserDetails();
    this.getImag();
  }

  showInfo() {
    this.popupVisible = true;
  }

  getImag() {
    this.dataFromService.getServerData("userManager", "getImageText", ["", this.SelectedUserId])
      .subscribe(getImageText => {
        this.itemImageData = getImageText[0];
        if (this.itemImageData != undefined) {
          this.itemimagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,'
            + this.itemImageData["imageText"]);
        }
      });
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
          this.dataFromService.getServerData("userManager", "updateImageText", ["",
            this.base64image,
            this.SelectedUserId]).subscribe(updateImageText => {
              this.errorHandlingToaster(updateImageText);
              this.popupVisible = false;
              this.getImag();
            });
        }
        );
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus == "1") {
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : " + dataStatus, "Try Again");
    }
    //this.getHeaderDetails();
  }

  getUserDetails() {
    this.userDetails = [];
    this.dataFromService.getServerData("userManager", "getUser", ["", this.SelectedUserId])
      .subscribe(GotUserDetails => {
        this.userDetails = GotUserDetails[0];
        this.assignToDuplicate(GotUserDetails);
        if (this.userDetails["buUser"] == 'Yes') {
          this.userDetails["buUser"] = true;
          this.buSuggestion();
        }
        else {
          this.userDetails["buUser"] = false;
        }
        // console.log(this.userDetails["JobPosition"]);
        if (this.userDetails["JobPosition"] == 'Salesperson' || this.userDetails["JobPosition"] == "SalesPerson") {
          this.supervisorSuggestion();
        }

      })

    this.dataFromService.getServerData("globalLookup", "handleConnectedComp", [""])
      .subscribe(gotCompany => {
        this.CompanySuggestions = new DataSource({
          store: <String[]>gotCompany,
          paginate: true,
          pageSize: 10
        });

      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedRole", [""])
      .subscribe(gotCompany => {
        this.RoleSuggestionsList = new DataSource({
          store: <String[]>gotCompany,
          paginate: true,
          pageSize: 10
        });

      });


    this.dataFromService.getServerData("globalLookup", "handleConnectedjobposition", [""])
      .subscribe(gotCompany => {
        this.PostionSuggestionsList = new DataSource({
          store: <String[]>gotCompany,
          paginate: true,
          pageSize: 10
        });

      });

    this.dataFromService.getServerData("globalLookup", "handleConnectedarea", [""])
      .subscribe(gotCompany => {
        this.AreaSuggestionsList = new DataSource({
          store: <String[]>gotCompany,
          paginate: true,
          pageSize: 10
        });

      });


  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateEJ
    this.duplicateEJDetails = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateEJDetails["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateEJDetails[i][prop] = data[i][prop];
      }
    }
  }

  buSuggestion() {
    this.dataFromService.getServerData("globalLookup", "handleConnectedBU", [""])
      .subscribe(gotBuList => {
        this.BUSuggestionsLsit = new DataSource({
          store: <String[]>gotBuList,
          paginate: true,
          pageSize: 10
        });

      });
  }

  supervisorSuggestion() {
    this.dataFromService.getServerData("UsersLookup", "getUserList3", ["", "Salessupervisor"])
      .subscribe(gotSupervisorList => {
        this.SupervisorSuggestionsList = new DataSource({
          store: <String[]>gotSupervisorList,
          paginate: true,
          pageSize: 10
        });

      });
  }

  onClickedOutside(e: Event) {
    this.editMode = false;
  }

  suggestionFormatForCompany(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Name");
  }
  suggestionFormatForBU(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ID");
  }
  suggestionFormatForRole(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "RoleID");
  }

  suggestionFormatForPostion(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor3(data, "Name", "Description", "InternalPosition");
  }

  suggestionFormatForArea(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "Name", "Code");
  }

  suggestionFormatForSupervisor(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "userid", "userid");
  }

  checkBox_valueChanged() {
    if (this.userDetails["buUser"] != null) {
      if (this.userDetails["buUser"] == true) {
        this.buSuggestion();
        this.userDetails["buUser"] = 'Yes'
      }
      else {
        this.userDetails["buUser"] = 'No'
      }
      if (this.duplicateEJDetails[0]["buUser"] != this.userDetails["buUser"]) {
        this.updateField('buUser', this.userDetails["buUser"]);
      }

      if (this.userDetails["buUser"] == 'Yes') {
        this.buSuggestion();
        this.userDetails["buUser"] = true
      }
      else {
        this.userDetails["buUser"] = false;
      }
    }

  }
  onBrandFilter() {
    if (this.userDetails["BrandFilter"] != null) {
      if (this.duplicateEJDetails[0]["BrandFilter"] != this.userDetails["BrandFilter"]) {
        this.updateField('BrandFilter', this.userDetails["BrandFilter"]);

      }
    }
  }

  updateField(dataField, value) {
    this.dataFromService.getServerData("userManager", "updateUser", ["", dataField, value, this.SelectedUserId])
      .subscribe(updateItem => {
        if (updateItem > 0) {
          this.toastr.success("Updated");
        }
        else {
          this.toastr.error("Update Failed, Error Status Code: UPDATE-ERR");
        }
      });
  }



  formSummary_fieldDataChanged(data, e) {
    if ((e.value != undefined || e.value != null) && this.duplicateEJDetails[0][data] != e.value) {
      if (data == 'company' || data == 'buUnit' || data == 'RoleId' || data == 'JobPosition' ||
        data == 'AreaCode' || data == 'SupervisorCode' || data == 'BarndFilter') {

        this.dataFromService.getServerData("userManager", "updateUser", ["", data, e.value, this.SelectedUserId])
          .subscribe(updateItem => {
            if (updateItem > 0) {
              this.toastr.success("Updated");
            }
            else {
              this.toastr.warning("Update Failed");
            }
          });
      }
    }
  }


  onUserNameChanged(event) {
    if (this.userDetails["userName"] != null) {
      if (this.duplicateEJDetails[0]["userName"] != this.userDetails["userName"]) {
        this.updateField('userName', this.userDetails["userName"]);

      }
    }
  }

  onClickPassword() {
    this.changePopUp = true;
    this.changePass = [];
  }

  validateOldPassword() {
    this.formWidget.instance.updateData(this.changePass);
    if (this.changePass["OldPassword"] == null || this.changePass["NewPassword"] == null) {
      this.toastr.warning("Please fill Password field");
    }
    else {
      this.dataFromService.getServerData("changePwd", "validateOldPassword", ["", this.SelectedUserId, this.changePass["OldPassword"]])
        .subscribe(checkOldPass => {
          if (Object.keys(checkOldPass).length != 1) {
            this.toastr.warning("Wrong Password!");
          }
          else {
            this.changePassword();
          }
        });

    }
  }

  changePassword() {
    this.dataFromService.getServerData("changePwd", "changePassword", ["", this.SelectedUserId, this.changePass["NewPassword"]])
      .subscribe(updatePass => {
        if (updatePass > 0) {
          this.dataFromService.getServerData("changePwd", "pwdChanged", ["", this.SelectedUserId, this.changePass["NewPassword"]])
            .subscribe(setPassword => {
              if (setPassword > 0) {
                this.toastr.success("Password Changed");
              }
              else {
                this.changePopUp = false;
                this.toastr.warning("Password Setup Failed");
              }
            });
        }
        else {
          this.changePopUp = false;
          this.toastr.warning("password Updation Failed");
        }
      });
  }

  onDeleteUser() {
    this.deleteconfirmpopup = true;
  }

  deleteconfirmbyuserNo() {
    this.deleteconfirmpopup = false;
  }

  deleteconfirmbyuser() {
    if (this.userDetails["userid"] == UtilsForGlobalData.getUserId()) {
      this.toastr.error("You can't delete yourselft.");
    }
    else {
      this.manageDelete()
    }
  }

  manageDelete() {
    this.dataFromService.getServerData("userManager", "manageDelete", ["", this.SelectedUserId])
      .subscribe(insertuser => {
        this.deleteUser()
      });
  }

  deleteUser() {
    this.dataFromService.getServerData("userManager", "deleteUser", ["", this.SelectedUserId])
      .subscribe(deletedUser => {
        this.dataFromService.getServerData("userManager", "onGetResponse", ["", this.SelectedUserId])
          .subscribe(deleteRes => {
            if (Object.keys(deleteRes).length > 0) {
              this.dataFromService.getServerData("userManager", "onCheckUserforDelete", ["", this.SelectedUserId])
                .subscribe(dropUser => {

                  this.exitFunc();
                });
            }
            else {

              this.exitFunc();
            }
          });
      });
  }

  exitFunc() {
    this.toastr.success("DONE");
    this.router.navigate(['/administrator/user-list']);
  }

}
