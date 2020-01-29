import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-vatsubmission-register-list',
  templateUrl: './vatsubmission-register-list.component.html',
  styleUrls: ['./vatsubmission-register-list.component.css']
})
export class VATSubmissionRegisterListComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  dataSource: CustomStore;
  popupVisibleForNewRegister: boolean = false;
  newVatDetail: {};
  companyData: any = {};
  VatRegisterNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {

    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("VATSubmissionRegisterList", "getHeaderList", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("company", "getCompanyInfo", ['',
      UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
        this.companyData = callData3[0];
      });
  }

  onUserRowSelect(event) {
    this.VatRegisterNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('VatNumber', this.VatRegisterNumber);
    this.router.navigate(['/finance/vatsubmissionregisterdetails']);
  }

  forYearnumberBox_valueChanged(event) {
    this.newVatDetail["ForYear"] = event.value;
  }

  forMonthnumberBox_valueChanged(event) {
    this.newVatDetail["forMonth"] = event.value;
  }

  onCreateNewVatSubbmission() {
    this.popupVisibleForNewRegister = true;
    var year = new Date().getFullYear();
    this.newVatDetail = { ForYear: year, ForMonth: 1 };
  }

  CreateNewRegister() {
    this.formWidget.instance.updateData(this.newVatDetail);
    this.dataFromService.getServerData("NewVatRegister", "btnOK_clickHandler", ["",
      this.newVatDetail["ForMonth"],
      this.newVatDetail["ForYear"]]).subscribe(DocCount => {
        if (DocCount[0]["recCount"] == 0) {
          this.dataFromService.getServerData("NewVatRegister", "createNewDocument", ["",
            UtilsForGlobalData.getUserId(),
            this.companyData.CurrentFiscalYear,
            this.newVatDetail["ForYear"],
            this.newVatDetail["ForMonth"]]).subscribe(createdNew => {
              if (createdNew[0] == "CREATED") {
                this.VatRegisterNumber = createdNew[1];
                this.toastr.success("VAT REGISTER Created");
                UtilsForGlobalData.setLocalStorageKey('VatNumber', this.VatRegisterNumber);
                this.router.navigate(['/finance/vatsubmissionregisterdetails']);
              } else if (createdNew[0] === null || createdNew[0] === 'null' || createdNew[0] === null) {
                this.toastr.error("Error While Creating the VATREGISTER, PLEASE CHECK THE SETUP!");
              } else {
                this.toastr.error("Error While Creating the VATREGISTER, Process Failed :" + createdNew[0]);
              }
            });
        } else {
          this.toastr.warning("Register for this payment already exisits, Summary: " + DocCount[0]["recCount"]);
        }
      });

  }

}
