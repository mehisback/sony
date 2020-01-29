import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent, DxDataGridComponent, DxPopupModule, DxNumberBoxModule, DxTooltipModule, DxDateBoxModule
} from 'devextreme-angular';
import { DxButtonModule, DevExtremeModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-vatregister',
  templateUrl: './vatregister.component.html',
  styleUrls: ['./vatregister.component.css'],
  providers: [DatePipe]
})
export class VatregisterComponent implements OnInit {
  todate: any = new Date();
  fromdate: any = new Date();
  dataSource: any = {};

  constructor(public router: Router,
    private dataFromService: DataService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public cdRef: ChangeDetectorRef) {





  }

  ngOnInit() {
    this.todate = this.datePipe.transform(this.todate, 'yyyy-MM-dd');
    this.fromdate.setMonth(this.fromdate.getMonth() - 1);
    this.fromdate = this.datePipe.transform(this.fromdate, 'yyyy-MM-dd');
   // var dataFromService: DataService;
    var thisComponent = this;

    this.dataFromService.getServerData("VATRegister", "getSaleVatRecords", ["",
      thisComponent.fromdate, thisComponent.todate])
      .subscribe(GotInventoryAll => {
        this.dataSource = GotInventoryAll;
      },
        // error => this.error = this.alertCode(error)
      );


  }

  fromdateBox_valueChanged(event) {
    this.fromdate = event.value

  }

  todateBox_valueChanged(event) {
    this.todate = event.value;
  }

  doneClick(){
    this.dataFromService.getServerData("VATRegister", "getSaleVatRecords", ["",
    this.fromdate, this.todate])
      .subscribe(GotInventoryAll => {
        this.dataSource = GotInventoryAll;
      },
        // error => this.error = this.alertCode(error)
      );
  }


}
