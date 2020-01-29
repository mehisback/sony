import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-posted-gr-list',
  templateUrl: './posted-gr-list.component.html',
  styleUrls: ['./posted-gr-list.component.css']
})
export class PostedGrListComponent implements OnInit {

  pickListSource: any = {};
  documentNumber: any;

  constructor(private dataFromService: DataService
    ,
    public router: Router,
    private toastr: ToastrService) { }
 
  ngOnInit() {

    this.dataFromService.getServerData("wmsGRHistoryList", "getAllGR", [""])
    .map(dataHeader => {
      return dataHeader;
    });

    var thisComponent= this;
    
    this.pickListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("wmsGRHistoryList", "getAllGR", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('postedGoodsReceiptNumber', this.documentNumber);
    this.router.navigate(['/warehouse/posted-gr-details']);
  }

  onCellPrepared(e) {
    if (e.rowType == "data" && e.column.dataField == "DocumentStatus") {
      if (e.value == "Approved") {
        e.cellElement.className += "color-for-column-Approved fa fa-check";
        e.cellElement.title += "Approved";
      } else if (e.value == "Open") {
        e.cellElement.className += " color-for-column-OPEN fa fa-square-o";
        e.cellElement.title += "Open";
      } else if (e.value == "SENT FOR APPROVAL") {
        e.cellElement.className += " color-for-column-SFApproval fa fa-share-square-o";
        e.cellElement.title += "SENT FOR APPROVAL";
      } else if (e.value == "Rejected") {
        e.cellElement.className += " color-for-column-Rejected fa fa-times";
        e.cellElement.title += "Rejected";
      }
    }
  }
  
}