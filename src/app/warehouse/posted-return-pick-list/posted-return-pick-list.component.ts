import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedReturnPickListHttpDataService } from './posted-return-pick-list-http-data.service';

@Component({
  selector: 'app-posted-return-pick-list',
  templateUrl: './posted-return-pick-list.component.html',
  styleUrls: ['./posted-return-pick-list.component.css']
})
export class PostedReturnPickListComponent implements OnInit {
  grReturntListSource: any = {};
  documentNumber: any;

  constructor(private httpDataService: PostedReturnPickListHttpDataService,
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
    UtilsForGlobalData.setLocalStorageKey('PostedPickReturnNumber', this.documentNumber);
    this.router.navigate(['/warehouse/posted-return-pick-details']);
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

  }



}

