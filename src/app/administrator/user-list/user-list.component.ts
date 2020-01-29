import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

import { DxFormComponent } from 'devextreme-angular';
import { Server } from 'selenium-webdriver/safari';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  UserList: any;
  error: void;
  p;
  newUserPopUp: boolean = false;
  newUserDetail: [];
  searchText;

  constructor(
    public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.getUserList();

  }

  getUserList() {
    this.dataFromService.getServerData("userManager", "getUserList", [""])
      .subscribe(GotUserList => {
        this.UserList = GotUserList;
      },
        error => this.error = this.alertCode(error)
      );
  }

  openUserDetails(userid) {
    UtilsForGlobalData.setLocalStorageKey('user', userid);
    this.router.navigate(['/administrator/user-details']);
  }

  onCreateNew() {
    this.newUserPopUp = true;
    this.newUserDetail = [];
  }

  passwordComparison = () => {
    return this.formWidget.instance.option("formData").Password;
  };

  SaveNewUser() {
    this.formWidget.instance.updateData(this.newUserDetail);
    var data = this.formWidget.instance.option("formData");
    var check: boolean = true;
    if (data["UserID"] == null || data["UserID"] == undefined) {
      this.toastr.warning("User Id Field is Required");
      check = false;
    }
    if (data["Password"] == null || data["Password"] == undefined) {
      this.toastr.warning("Password Field is Required");
      check = false;
    }
    if (data["Password"] != data["ConfrimPassword"]) {
      if (data["ConfrimPassword"] == null || data["ConfrimPassword"] == undefined) {
        this.toastr.warning("Confrim Passowrd is Required");
        check = false;
      }
      this.toastr.warning("Password and Confirm Password Don't Match");
      check = false;
    }

    if (check == true) {
      this.validateUser();
    }

  }

  validateUser() {
    this.dataFromService.getServerData("newUser", "validateNewUser", ["", this.newUserDetail["UserID"]])
      .subscribe(validateUser => {
        if (Object.keys(validateUser).length > 0) {
          this.toastr.warning("User ID already Exists!");
        }
        else {
          this.onInsertNewUser();
        }
      },
        error => this.error = this.alertCode(error)
      );
  }

  onInsertNewUser() {
    this.dataFromService.getServerData("newUser", "onInsertNewUser", ["", this.newUserDetail["UserID"]
    ])
      .subscribe(CheckUser => {
        if (Object.keys(CheckUser).length > 0) {
          this.checkUserInMySQLGrant1();
        }
        else {
          this.checkUserInMySQLGrant2();
        }
      },
        error => this.error = this.alertCode(error)
      );
  }

  checkUserInMySQLGrant1() {
    this.dataFromService.getServerData("newUser", "checkUserInMySQLGrant1", ["", this.newUserDetail["UserID"]
    ])
      .subscribe(CheckUserInSql => {
        this.dataFromService.getServerData("newUser", "insertNewUser", ["", this.newUserDetail["UserID"],
          this.newUserDetail["Password"], this.newUserDetail["UserName"]
        ])
          .subscribe(addedNewUser => {
            if (addedNewUser == '-1') {
              this.toastr.error("Failed to Insert User. Please note that the username cant be too long");
            }
            else {
              this.toastr.success("New User Added");
              UtilsForGlobalData.setLocalStorageKey('user', this.newUserDetail["UserID"]);
              this.router.navigate(['/administrator/user-details']);
            }
          });

        /*if(CheckUserInSql == "DONE"){
         this.toastr.success("New User Added");
       }
       else{
         this.toastr.error("Failed to Grant Permissions")
       } */
      },
        error => this.error = this.alertCode(error)
      );
  }

  checkUserInMySQLGrant2() {
    this.dataFromService.getServerData("newUser", "checkUserInMySQLGrant2", ["", this.newUserDetail["UserID"],
      this.newUserDetail["Password"]
    ])
      .subscribe(CheckUserInSql2 => {
        if (CheckUserInSql2) {
          this.checkUserInMySQLGrant1();
        }
        else {
          this.toastr.warning("Failed")
        }
      },
        error => this.error = this.alertCode(error)
      );
  }



  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Password should be Strong!");
    }
  }


}
