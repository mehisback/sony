import { Component, OnInit,ViewChild } from '@angular/core';
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
  selector: 'app-role-setup-list',
  templateUrl: './role-setup-list.component.html',
  styleUrls: ['./role-setup-list.component.css']
})
export class RoleSetupListComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  RoleList: any;
  error: void;
  p;
  searchText;
  newRolePopUp: boolean = false;
  newRoleDetail: [];

  constructor(public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getRoleList();
  }

  getRoleList() {
    this.dataFromService.getServerData("RoleMenuSetup", "getRoleList", [""])
      .subscribe(GotRoleList => {
        this.RoleList = GotRoleList;
      },
        error => this.error = this.alertCode(error)
      );
  }
  openUserDetails(RoleID) {
    UtilsForGlobalData.setLocalStorageKey('selectedRole', RoleID);
    this.router.navigate(['/administrator/role-setup-details']);
  }

  onCreateNew() {
    this.newRolePopUp = true;
    this.newRoleDetail = [];
    this.newRoleDetail["NewRoleID"] = "";
  }

  SaveNewRole() {
    if (this.newRoleDetail["NewRoleID"] != "") {
      if (this.newRoleDetail["NewRoleID"] != null || this.newRoleDetail["NewRoleID"] != "") {
        this.dataFromService.getServerData("RoleMenuSetup", "btnValidateNewRole_clickHandler", ["",
          this.newRoleDetail["NewRoleID"]])
          .subscribe(createRoleRes => {
            // console.log(createRoleRes);
            if (createRoleRes[0] == 'CREATED') {
              this.toastr.success("Role Created");
              UtilsForGlobalData.setLocalStorageKey('selectedRole', this.newRoleDetail["NewRoleID"]);
              this.router.navigate(['/administrator/role-setup-details']);
            }
            else {
              this.toastr.error("Failed to Create Role. Role already Exists!");
            }
          },
            error => this.error = this.alertCode(error)
          );
      }
    }
    else {
      this.toastr.warning("Please Fill the Role ID");
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


}
