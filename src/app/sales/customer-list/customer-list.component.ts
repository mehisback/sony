import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  DxFormComponent
} from 'devextreme-angular';
import { CustomerListHttpDataService } from './customer-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  keyname: string = "accessToken"
  closeResult: string;
  disabledValue: boolean;
  newcustDetail: [] = null;
  newCustomerDetail: [];
  newCustCode: any;
  customerValue: any;
  namePattern: any = /^[^0-9]+$/;
  phonePattern: any = /^[^a-z]+$/;
  searchText;
  p: number = 1;
  phoneRules: any = {
    X: /[02-9]/
  }
  error: any;
  // messages: Message[];
  // selectedMessage: Message;
  messageOpen = false;
  key: string;
  GetCustList: string;
  CustList: any;
  popupVisible: boolean = false;
  constructor(
    public router: Router,
    private httpDataService: CustomerListHttpDataService,
    private toastr: ToastrService
  ) {

    this.disabledValue = false;

  }

  ngOnInit(): void {

    this.httpDataService.getCustomerList([""])
      .subscribe(GotCustList => {
        this.CustList = GotCustList;
      },
        error => this.error = this.alertCode(error)
      );



  }

  showInfo() {
    //this.popupVisible = true;
    this.newCustomerDetail = [];
    this.httpDataService.createNewDocument(
      ["", "CUSTOMER", '', UtilsForGlobalData.getUserId()]).subscribe(createdNew => {
        if (createdNew[1] == 'DONE') {
          UtilsForGlobalData.setLocalStorageKey('CustCode', createdNew[0]);
          this.router.navigate(['/sales/customer-details']);
        } else if (createdNew[1] == 'SETUPNOTFOUND') {
          this.toastr.warning("Customer No. Series Setup is missing!");
        } else {
          this.toastr.warning("Process Failed! Error Status Code : "+ createdNew[1]);
        }
      })
  }
  
  openCustomerDetails(custCode) {
    UtilsForGlobalData.setLocalStorageKey('CustCode', custCode);
    this.router.navigate(['/sales/customer-details']);
  }



  Save(event) {

    /*  this.formWidget.instance.updateData(this.newCustomerDetail);
     var data:[] =null;
     data = this.formWidget.instance.option("formData");
     if(Object.keys(data).length != 0){
       if(data["CustomerID"]){
     this.httpDataService.insertCustomer(["",
         data["CustomerID"],
         data["Name"],
         data["Address"],
         data["Address2"],
         data["City"],
         data["ZipCode"],
         data["Phone"],
         data["Email"]
       ])
       .subscribe(getNewCustDetail => {
         this.customerValue = getNewCustDetail;
         if(this.customerValue > 0){
           this.toastr.success("Customer Added Sucessfully");
         this.openCustomerDetails(data["CustomerID"]);
         }
         else{
           this.toastr.error("error While Inserting Customer")
         }
       },
       error => this.error = this.alertCode(error)
       );
     }
     else{
       this.toastr.warning("CustomerCode is Empty")
     }
   }
   else{
     this.toastr.warning("Customer Data is Empty")
   } */


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