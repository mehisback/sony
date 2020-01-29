import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { WmsTransferReceiveListHttpDataService } from './wms-transfer-receive-list-http-data.service';

@Component({
  selector: 'app-wms-transfer-receive-list',
  templateUrl: './wms-transfer-receive-list.component.html',
  styleUrls: ['./wms-transfer-receive-list.component.css']
})
export class WmsTransferReceiveListComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private httpDataService: WmsTransferReceiveListHttpDataService
  ) { }

  ngOnInit() {
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getHeaderList([""])
          .subscribe(dataHeader => {
            devru.resolve(dataHeader);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('TransferRNumber', this.documentNumber);
    this.router.navigate(['/warehouse/wms-transfer-receive-details']);

  }

}
