import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import { TransferListHttpDataService } from './transfer-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: TransferListHttpDataService
  ) { }

  ngOnInit() {
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllRecords([""])
          .subscribe(dataHeader => {
            devru.resolve(dataHeader);
          });
        return devru.promise();
      },
    });
  }

  onCreateNewPI() {

    this.httpDataService.createNewDocument(["",
      "TRANSFER", '', UtilsForGlobalData.getUserId()])
      .subscribe(dataStatus => {
        if (dataStatus[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('TRNumber', dataStatus[0]);
          this.router.navigate(['/warehouse/transfer-details']);
        } else {
          this.toastr.error("Error While Creating the Transfer Order, Error Status Code :" + dataStatus[1]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('TRNumber', this.documentNumber);
    this.router.navigate(['/warehouse/transfer-details']);

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
