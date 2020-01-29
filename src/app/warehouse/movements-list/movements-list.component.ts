import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MovementsListHttpDataService } from './movements-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
@Component({
  selector: 'app-movements-list',
  templateUrl: './movements-list.component.html',
  styleUrls: ['./movements-list.component.css']
})
export class MovementsListComponent implements OnInit {

  movementListSource: any = {};
  documentNumber: any;

  constructor(private httpDataSevice: MovementsListHttpDataService,
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
    UtilsForGlobalData.setLocalStorageKey('MovementNumber', this.documentNumber);
    this.router.navigate(['/warehouse/movements']);
  }

  onCreateNewPick() {
    var newStr: String = new String();
    var dt: Date = new Date();
    var yyyy: String = dt.getFullYear().toString();
    var yy: String = yyyy.slice(2, 4);
    var mm: String = (dt.getMonth() + 1).toString();
    if (mm.length == 1) {
      mm = '0' + mm;
    }
    var dd: String = dt.getDate().toString();
    var tt: String = dt.getTime().toString();

    this.documentNumber = 'MOV-' + tt;
    this.httpDataSevice.createNewDocument(["", this.documentNumber,
      UtilsForGlobalData.getUserId()]).subscribe(data => {
        if (data == 1) {
          UtilsForGlobalData.setLocalStorageKey('MovementNumber', this.documentNumber);
          this.router.navigate(['/warehouse/movements']);
        } else {
          this.toastr.error("Error While Creating the Movements, Error Status Code : INSERT-ERR");
        }
      });
  }
}
