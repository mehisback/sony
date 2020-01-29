import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-gl-register',
  templateUrl: './gl-register.component.html',
  styleUrls: ['./gl-register.component.css']
})
export class GlRegisterComponent implements OnInit {

  dataSource: Object;
  error: void;
  documentNumber: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private dataFromService: DataService
  ) { }

  ngOnInit() {
    this.dataFromService.getServerData("GLRegister", "getHeaderList", [""])
      .subscribe(GotInventoryAll => {
        this.dataSource = GotInventoryAll;
      },
        error => this.error = this.alertCode(error)
      );
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('GLRNumber', this.documentNumber);
    this.router.navigate(['/finance/gl-register-details']);
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
