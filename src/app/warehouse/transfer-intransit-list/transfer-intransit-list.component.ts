import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { TransferIntransitListHttpDataService } from './transfer-intransit-list-http-data.service';

@Component({
  selector: 'app-transfer-intransit-list',
  templateUrl: './transfer-intransit-list.component.html',
  styleUrls: ['./transfer-intransit-list.component.css']
})
export class TransferIntransitListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: TransferIntransitListHttpDataService
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
          UtilsForGlobalData.setLocalStorageKey('TRINumber', dataStatus[0]);
          this.router.navigate(['/warehouse/transfer-intransit-details']);
        } else if (dataStatus[1] === null || dataStatus[1] === 'null' || dataStatus[1] === "null") {
          this.toastr.error("Error While Creating the Transfer Order, PLEASE CHECK THE SETUP!");
        } else {
          this.toastr.error("Error While Creating the Transfer Order, Error Status Code :" + dataStatus[1]);
        }
      });

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('TRINumber', this.documentNumber);
    this.router.navigate(['/warehouse/transfer-intransit-details']);

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

