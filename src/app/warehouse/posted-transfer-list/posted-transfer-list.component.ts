import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedTransferListHttpDataService } from './posted-transfer-list-http-data.service';

@Component({
  selector: 'app-posted-transfer-list',
  templateUrl: './posted-transfer-list.component.html',
  styleUrls: ['./posted-transfer-list.component.css']
})

export class PostedTransferListComponent implements OnInit {

  dataSource: CustomStore;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: PostedTransferListHttpDataService
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

  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PostedTRINumber', this.documentNumber);
    this.router.navigate(['/warehouse/posted-transfer-details']);

  }

}
