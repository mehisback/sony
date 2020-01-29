import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule,
  DxDataGridComponent
} from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  userDefinedAttributes: any;
  mastervalue: any;
  jsonSchema: any;
  mastervaluefromlocal: string;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public dataServices: DataService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.dataServices.getServerData("schema", "getJSON", [""]).subscribe(getJSON => {
        this.userDefinedAttributes = getJSON;
      });
  }

  suggestionFormateForDropDown3(data) {
    return data ? data.master : '';
  }

  hover3(data) {
    return "<div class='custom-item' title='" + data.master + "'>" + data.master + "</div>";
  }

  onmasterChange(event) {
    this.mastervalue = event.value;
    UtilsForGlobalData.setLocalStorageKey('mastervalue', this.mastervalue);
    this.dataServices.getServerData("schema", "getJSON2", ['', this.mastervalue])
      .subscribe(getJSON2 => {
        this.jsonSchema = JSON.parse(getJSON2[0]["attribute"]);
      });

    this.ngOnInit();
  }

  onChange(event) {
    if (event["type"] == "addComponent" || event["type"] == "saveComponent" || event["type"] == "deleteComponent") {
      this.mastervaluefromlocal = UtilsForGlobalData.retrieveLocalStorageKey('mastervalue')
      var json = JSON.stringify(event.form, null, 4);
      this.dataServices.getServerData("schema", "saveJSON", ['', json, this.mastervaluefromlocal])
        .subscribe(saveJSON => {
          this.jsonSchema = JSON.parse(saveJSON[0]["attribute"]);
        });
    }
  }

}
