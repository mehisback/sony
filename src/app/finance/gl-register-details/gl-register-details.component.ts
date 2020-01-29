import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-gl-register-details',
  templateUrl: './gl-register-details.component.html',
  styleUrls: ['./gl-register-details.component.css']
})
export class GlRegisterDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  dataSource: Object;
  error: void;
  docNo: string = UtilsForGlobalData.retrieveLocalStorageKey('GLRNumber');
  documentType: any;
  dataSource2: Object;

  constructor(
    private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService
  ) { }


  ngOnInit() {
    this.dataFromService.getServerData("GLEntries", "getHeaderListBYDOCUMENT", ["", this.docNo])
      .subscribe(getHeaderListBYDOCUMENT => {
        this.dataSource = getHeaderListBYDOCUMENT;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onUserRowSelect(event) {
    this.documentType = event.data.DocumentType;
    if (this.documentType == 'SALESINVOICE') {
      this.documentType = 'SI'
    }
    if (this.documentType == 'RECEIPTJOURNAL') {
      this.documentType = 'RJ'
    }
    if (this.documentType == 'PURCHASEINVOICE') {
      this.documentType = 'PI'
    }
    if (this.documentType == 'SALESCREDITNOTE') {
      this.documentType = 'SCN'
    }
    if (this.documentType == 'SALECREDITMEMO') {
      this.documentType = 'SCM'
    }
    if (this.documentType == 'PURCHASECREDITNOTE') {
      this.documentType = 'PCN'
    }
    if (this.documentType == 'PAYMENTJOURNAL') {
      this.documentType = 'PAJ'
    }
    this.dataFromService.getServerData("GLEntries", "getTrackingData", ["", this.documentType, this.docNo])
      .subscribe(getTrackingData => {
        this.dataSource2 = getTrackingData[1];
        this.gridContainer.instance.refresh();
      },
        error => this.error = this.alertCode(error)
      );
  }

  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Internal server Error");
    }
    else {
      this.toastr.error("Server Error");
    }
  }

}
