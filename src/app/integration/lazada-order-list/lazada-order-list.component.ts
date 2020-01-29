import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lazada-order-list',
  templateUrl: './lazada-order-list.component.html',
  styleUrls: ['./lazada-order-list.component.css'],
  providers: [DatePipe]
})
export class LazadaOrderListComponent implements OnInit {
  codefromLAZO: string;
  refreshTokenofLazofromBack: any;
  refreshTimerofLazofromBack: any;
  tokenofLazofromBack: any = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
  checkTokenofLazoFromLS;
  refreshTokenbackfromLS: any;
  FormDate: any = {};
  ifTimerExists: any = 'No';
  countdown: number;
  dataSource: any;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    public dataServices: DataService
  ) {

  }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 180);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
    if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
      localStorage.setItem('LazobackURL', this.router.url);
      this.router.navigate(['/integration/lazada-auth']);
    } else {
      //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.generateAccessToken();
      //}
    }
  }

  generateAccessToken() {
    if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.dataServices.getServerData("lazadaAuth", "generateAccessToken", ["", this.codefromLAZO])
        .subscribe(generateAccessToken => {
          this.tokenofLazofromBack = generateAccessToken["access_token"];
          this.refreshTokenofLazofromBack = generateAccessToken["refresh_expires_in"];
          this.refreshTimerofLazofromBack = generateAccessToken["refresh_token"];
          UtilsForGlobalData.setLocalStorageKey("refresh_token", this.refreshTimerofLazofromBack);
          UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
          this.startCountdownTimer(this.refreshTokenofLazofromBack);
          this.getOrders();
        });
    } else {
      this.getOrders();
    }
  }

  getOrders() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    this.dataServices.getServerData("lazadaAuth", "getOrders", ["", this.tokenofLazofromBack])
      .subscribe(getOrders => {
        this.dataSource = getOrders["data"]["orders"];
      });
  }


  startCountdownTimer(timer) {
    this.ifTimerExists = UtilsForGlobalData.retrieveLocalStorageKey("timerLazo");
    if (this.ifTimerExists == 'No' || this.ifTimerExists == '' || this.ifTimerExists == undefined || this.ifTimerExists == null) {
      UtilsForGlobalData.setLocalStorageKey("timerLazo", 'Yes');
      const interval = 1000;
      const duration = timer;
      const stream$ = Observable.timer(0, interval)
        .finally(() => this.timerfinish())
        .takeUntil(Observable.timer(duration + interval))
        .map(value => duration - value * interval);
      stream$.subscribe(value => {
        this.countdown = value;
      });
    }
  }

  timerfinish() {
    UtilsForGlobalData.setLocalStorageKey("timerLazo", 'No');
    this.refreshTokenbackfromLS = UtilsForGlobalData.retrieveLocalStorageKey("refresh_token");
    this.dataServices.getServerData("lazadaAuth", "refreshAccessToken", ["", this.refreshTokenbackfromLS])
      .subscribe(refreshAccessToken => {
        this.tokenofLazofromBack = refreshAccessToken["access_token"];
        this.refreshTokenofLazofromBack = refreshAccessToken["refresh_expires_in"];
        this.refreshTimerofLazofromBack = refreshAccessToken["refresh_token"];
        UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
        this.startCountdownTimer(this.refreshTokenofLazofromBack);
      });

  }

  convertToSO(){
    
  }

}
