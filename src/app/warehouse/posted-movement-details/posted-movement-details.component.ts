import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import * as events from "devextreme/events";
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { PostedMovementDetailsHttpDataService } from './posted-movement-details-http-data.service';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-posted-movement-details',
  templateUrl: './posted-movement-details.component.html',
  styleUrls: ['./posted-movement-details.component.css']
})
export class PostedMovementDetailsComponent implements OnInit {

  movementHeader: [];
  MovementNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PostedMovementNumber');
  isLinesExist: boolean = false;
  MovementOperations: any = [];
  dataSource: any = {};
  printLines: any;
  companyHeader: any = {};

  constructor(
    private httpDataService: PostedMovementDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {

    var thisComponent = this;

    this.dataSource.store = new CustomStore({
      key: ["LineNo", "ItemCode", "Description", "BaseUOM", "Quantity", "FromStorageUnitcode", "ToStorageUnitCode", "LotNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchMovementHeader();
        thisComponent.httpDataService.getMovementLines(["",
          thisComponent.MovementNumber]).subscribe(dataLines => {
            if (Object.keys(dataLines).length > 0) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            thisComponent.printLines = dataLines;
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(companyData => {
      this.companyHeader = companyData[0];
    });
  }

  fetchMovementHeader() {
    this.httpDataService.getMovement(["",
      this.MovementNumber]).subscribe(dataHeader => {
        this.movementHeader = dataHeader[0];
      });
  }

  MovementOperationsGo(userOption) {
  }

}
