import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReturnReceiptListHttpDataService } from './return-receipt-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-return-receipt-list',
  templateUrl: './return-receipt-list.component.html',
  styleUrls: ['./return-receipt-list.component.css']
})
export class ReturnReceiptListComponent implements OnInit {
  grReturntListSource: any = {};
  documentNumber: any;

  constructor(private httpDataService: ReturnReceiptListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.grReturntListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllGR([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });

  }


  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('GRReturnNumber', this.documentNumber);
    this.router.navigate(['/warehouse/return-receipt-details']);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "DocumentStatus") {
      if (e.value == "Approved")
        e.cellElement.className += " color-for-column-Approved";
      else if (e.value == "Open")
        e.cellElement.className += " color-for-column-OPEN";
      else if (e.value == "SENT FOR APPROVAL")
        e.cellElement.className += " color-for-column-SFApproval";
      else if (e.value == "Rejected")
        e.cellElement.className += " color-for-column-Rejected";
    }
  }

  onCreateGRReturn() {

    this.httpDataService.createNewDocument(["",
      "SRRECEIPT", '',
      UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('GRReturnNumber', data[0]);
          this.router.navigate(['/warehouse/return-receipt-details']);
        } else if (data[1] === null || data[1] === 'null' || data[1] === null) {
          this.toastr.error("Error While Creating the Return Receipt, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Return Receipt, Process Failed :" + data[1]);
        }
      });
  }



}
