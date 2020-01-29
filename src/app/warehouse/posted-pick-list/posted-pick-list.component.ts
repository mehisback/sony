import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData'

@Component({
  selector: 'app-posted-pick-list',
  templateUrl: './posted-pick-list.component.html',
  styleUrls: ['./posted-pick-list.component.css']
})
export class PostedPickListComponent implements OnInit {
  pickListSource: any = {};
  documentNumber: any;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) { }
  ngOnInit() {

    this.dataFromService.getServerData("wmsPickHistoryList", "getAllPick", [""])
      .map(getList => {
        return getList;
      });

    var thisComponent = this;

    this.pickListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.dataFromService.getServerData("wmsPickHistoryList", "getAllPick", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('postedPickNumber', this.documentNumber);
    this.router.navigate(['/warehouse/posted-pick-details']);
  }
}