import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReturnPickListHttpDataService } from './return-pick-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-return-pick-list',
  templateUrl: './return-pick-list.component.html',
  styleUrls: ['./return-pick-list.component.css']
})
export class ReturnPickListComponent implements OnInit {
  grReturntListSource: any = {};
  documentNumber: any;

  constructor(private httpDataService: ReturnPickListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.grReturntListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllPick([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });

  }


  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PickReturnNumber', this.documentNumber);
    this.router.navigate(['/warehouse/return-pick-details']);
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
      "RETURNPICKLIST", '',
      UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PickReturnNumber', data[0]);
          this.router.navigate(['/warehouse/return-pick-details']);
        } else {
          this.toastr.error("Setup Missing or Wrong Setup. Please check Number Series Setup");
        }
      });
  }



}
