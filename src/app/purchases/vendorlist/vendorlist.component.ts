import { Component, OnInit, AfterContentInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule
} from 'devextreme-angular';
import { Server } from 'selenium-webdriver/safari';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';


@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.css']
})
export class VendorlistComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent


  newVendorDetail: [];
  popupVisible: boolean = false;
  addNewVendValue: Object;
  vendList: Object;
  error: any;
  vendorTypeList: string[];
  p;
  searchText;

  constructor(public router: Router,
    private dataFromService: DataService,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.vendorTypeList = [
      "HD Video Player",
      "SuperHD Video Player",
      "SuperPlasma 50",
      "SuperLED 50",
      "SuperLED 42",
      "SuperLCD 55",
      "SuperLCD 42",
      "SuperPlasma 65",
      "SuperLCD 70",
      "Projector Plus",
      "Projector PlusHT",
      "ExcelRemote IR",
      "ExcelRemote BT",
      "ExcelRemote IP"
    ];
    this.dataFromService.getServerData("vendorMasterList", "getVendorList", [""])
      .subscribe(GotCustList => {
        this.vendList = GotCustList;
      },
        error => this.error = this.alertCode(error)
      );
  }
  alertCode(error: any): any {
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

  openVendorDetails(vendCode) {
    UtilsForGlobalData.setLocalStorageKey('VendCode', vendCode);
    this.router.navigate(['/purchases/vendor-details']);
  }


  showInfo() {
    //this.popupVisible = true;
    this.newVendorDetail = [];
    this.dataFromService.getServerData("vendorMasterList", "createNewDocument",
      ["", "VENDOR", '', UtilsForGlobalData.getUserId()]).subscribe(createdNew => {
        if (createdNew[1] == 'DONE') {
          UtilsForGlobalData.setLocalStorageKey('VendCode', createdNew[0]);
          this.router.navigate(['/purchases/vendor-details']);
        } else if (createdNew[1] == 'SETUPNOTFOUND') {
          this.toastr.warning("Vendor No. Series Setup is missing!");
        } else {
          this.toastr.warning("Process Failed! Error Status Code :" + createdNew[1]);
        }
      })
  }

  SaveNewVendor() {
    this.formWidget.instance.updateData(this.newVendorDetail);
    var data: [] = null;
    data = this.formWidget.instance.option("formData");
    console.log(data)
    if (Object.keys(data).length != 0) {
      if (data["VendCode"]) {
        this.dataFromService.getServerData("vendorMasterList", "btnCreateNewVendor",
          ["",
            data["VendCode"],
            data["Name"],
            data["Address"],
            data["Address2"],
            data["City"],
            data["ZipCode"],
            data["Phone"],
            data["Email"]
          ])
          .subscribe(gotNewVendDetail => {
            this.addNewVendValue = gotNewVendDetail;
            if (this.addNewVendValue > 0) {
              this.toastr.success("Customer Added Sucessfully");
              this.openVendorDetails(data["VendCode"]);
            }
            else {
              this.toastr.error("error While Inserting Customer")
            }
          },
            error => this.error = this.alertCode(error)
          );
      }
      else {
        this.toastr.warning("CustomerCode is Empty")
      }
    }
    else {
      this.toastr.warning("Customer Data is Empty")
    }

  }

  onVendTypeChanged(e) {

  }


}
