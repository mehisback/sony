import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-role-setup-details',
  templateUrl: './role-setup-details.component.html',
  styleUrls: ['./role-setup-details.component.css']
})
export class RoleSetupDetailsComponent implements OnInit {
  @ViewChild("gridContainerMenuModules") gridContainer: DxDataGridComponent;
  dataSourceRoleModules: CustomStore;
  dataSourceRoleGranules: CustomStore;
  selectedModule: any;
  selectedGranules: any;
  dataSourceRoleFunctions: CustomStore;
  selectedFunctions: any;
  dataSourceRoleMenuPermission: CustomStore;
  selectedRole = UtilsForGlobalData.retrieveLocalStorageKey("selectedRole");
  selectedMenuID: any;
  rolePermissionDetail: string[];
  duplicaterolePermissionDetail: string[];


  constructor(
    public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService,
    public cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getRoleDetails();

    this.rolePermissionDetail = [];
  }

  getRoleDetails() {

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    thisComponent.dataSourceRoleModules = new CustomStore({
      key: ["ID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("RoleMenuSetup", "getList1", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },


    });

    this.getRolePermission();



  }

  getRolePermission() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    thisComponent.dataSourceRoleMenuPermission = new CustomStore({
      key: ["MenuID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("RoleMenuSetup", "getRolePermission", ["", thisComponent.selectedRole])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },


    });
  }

  onFocusedRowChangedModules(event) {
    var data = event.row.data;
    this.selectedModule = data.ID;

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;



    thisComponent.dataSourceRoleGranules = new CustomStore({
      key: ["ID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("RoleMenuSetup", "level1DG_itemClickHandler", ["", thisComponent.selectedModule])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },


    });

  }

  onFocusedRowChangedGranules(event) {

    var data = event.row.data;
    this.selectedGranules = data.ID;

    var dummyDataServive = this.dataFromService;
    var thisComponent = this;



    thisComponent.dataSourceRoleFunctions = new CustomStore({
      key: ["ID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("RoleMenuSetup", "level2DG_itemClickHandler", ["", thisComponent.selectedGranules])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },


    });
  }

  onFocusedRowChangedFunctions(event) {
    var data = event.row.data;
    this.selectedFunctions = data.ID;
  }

  onFocusedRowChangedMenuPermission(event) {
    var data = event.row.data;
    this.selectedMenuID = data.MenuID;
  }

  btnAddModules_clickHandler() {
    if (this.selectedModule != null || this.selectedModule != undefined) {
      this.insertMenuPermission(this.selectedModule)
    }
    else {
      this.toastr.warning("Please Select Module");
    }
  }

  btnAddGranules_clickHandler() {
    if (this.selectedGranules != null || this.selectedGranules != undefined) {
      this.insertMenuPermission(this.selectedGranules)
    }
    else {
      this.toastr.warning("Please Select Granules");
    }
  }

  btnAddFunctions_clickHandler() {
    if (this.selectedFunctions != null || this.selectedFunctions != undefined) {
      this.insertMenuPermission(this.selectedFunctions)
    }
    else {
      this.toastr.warning("Please Select Functions");
    }
  }

  insertMenuPermission(id) {
    this.dataFromService.getServerData("RoleMenuSetup", "insertMenuPermission", ["", this.selectedRole, id])
      .subscribe(insertPermission => {
        if (insertPermission == 0) {
          this.toastr.error("Insert Failed");
        } else if (insertPermission == -1) {
          this.toastr.error("Already Exists!");
        }
        else {
          this.toastr.success("Menu Role Added Successfully");
          this.getRolePermission();
        }
      });
  }

  btnDeletePermission_clickHandler() {
    if (this.selectedMenuID != null || this.selectedMenuID != undefined) {
      this.dataFromService.getServerData("RoleMenuSetup", "btnDelPermission_clickHandler", ["", this.selectedRole, this.selectedMenuID])
        .subscribe(deletePermission => {
          if (deletePermission == 0) {
            this.toastr.error("Delete Failed");
          }
          else {
            this.getRolePermission();
          }
        });
    }
    else {
      this.toastr.warning("Please Select ID from Added Menu")
    }
  }

  onTabChange(event) {
    if (Object.keys(this.rolePermissionDetail).length == 0) {
      this.dataFromService.getServerData("RoleMenuSetup", "getRoleSetup", ["", this.selectedRole])
        .subscribe(rolesetupPermis => {
          this.assignToDuplicate(rolesetupPermis);
          let jsonObj: any = rolesetupPermis[0];
          for (let prop in jsonObj) {
            if (jsonObj[prop] == 'No') {
              jsonObj[prop] = false;
            }
            else if (jsonObj[prop] == 'Yes') {
              jsonObj[prop] = true;
            }
            else {

            }
          }
          this.rolePermissionDetail = jsonObj;
        })
    }

  }

  assignToDuplicate(data) {
    // copy properties from Vendor to duplicateSalesHeader
    this.duplicaterolePermissionDetail = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicaterolePermissionDetail["" + i] = {};
      for (var prop in data[i]) {
        if (data[i][prop] == 'Yes') {
          data[i][prop] = true;
        }
        else if (data[i][prop] == 'No') {
          data[i][prop] = false;
        }
        else {

        }
        this.duplicaterolePermissionDetail[i][prop] = data[i][prop];
      }
    }
  }


  formSummary_fieldDataChanged(event) {
    if (event.value != undefined || event.value != null) {
      if (this.duplicaterolePermissionDetail[0][event.dataField] != event.value) {
        this.duplicaterolePermissionDetail[0]["" + event.dataField] = event.value;
        var temp;
        if (event.value == false) {
          temp = 'No';
        }
        else if (event.value == true) {
          temp = 'Yes';
        }
        else {

        }
        this.dataFromService.getServerData("RoleMenuSetup", "updateRoleSetup", ["", event.dataField, event.value, this.selectedRole])
          .subscribe(updatePermission => {
            if (updatePermission == 0) {
              this.toastr.error("Update Failed");
            }
            else {
              this.toastr.success("Updated Successfully");
            }
          });
      }
    }
  }


}
