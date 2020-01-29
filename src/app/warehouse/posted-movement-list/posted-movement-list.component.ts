import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { PostedMovementListHttpDataService } from './posted-movement-list-http-data.service';
@Component({
  selector: 'app-posted-movement-list',
  templateUrl: './posted-movement-list.component.html',
  styleUrls: ['./posted-movement-list.component.css']
})

export class PostedMovementListComponent implements OnInit {

  movementListSource: any = {};
  documentNumber: any;

  constructor(private httpDataSevice: PostedMovementListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    var thisComponent = this;

    this.movementListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataSevice.getAllMovements([""])
          .subscribe(dataHeader => {
            devru.resolve(dataHeader);
          });
        return devru.promise();
      },
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PostedMovementNumber', this.documentNumber);
    this.router.navigate(['/warehouse/posted-movement-details']);
  }

  onCreateNewPick() {
    
  }
}

