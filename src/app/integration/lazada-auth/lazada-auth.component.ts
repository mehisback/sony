import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../../data.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-lazada-auth',
  templateUrl: './lazada-auth.component.html',
  styleUrls: ['./lazada-auth.component.css']
})
export class LazadaAuthComponent implements OnInit {
  clientID: string;
  mainURL: string;
  currentURL = "https://rhbussupport.com/dist/lazada_script.html";
  serverName: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    public dataServices: DataService
  ) { }

  ngOnInit() {

    if (this.document.location.hostname == 'localhost') {
      this.serverName = 'localhost:4200';
    } else if (this.document.location.hostname == '27.254.172.167') {
      this.serverName = 'http://27.254.172.167/dist';
    } else if (this.document.location.hostname == 'rhbuscloud.com') {
      this.serverName = 'https://rhbuscloud.com/';
    } else if (this.document.location.hostname == 'rhbussupport.com') {
      this.serverName = 'https://rhbussupport.com/dist';
    } else if (this.document.location.hostname == 'rihbus.com') {
      this.serverName = 'https://rihbus.com';
    } else {
      this.serverName = "https://" + this.document.location.hostname;
    }
    this.currentURL = this.serverName + "/assets/js/lazada_script.html";

    this.dataServices.getServerData("lazadaAuth", "getAppKey", [""])
      .subscribe(getAppKey => {
        this.clientID = getAppKey[0]["AppKey"];
        this.mainURL = "https://auth.lazada.com/oauth/authorize?spm=a2o9m.11193494.0.0.5687266bKmLP5j&response_type=code&redirect_uri=" + this.currentURL + "&force_auth=true&client_id=" + this.clientID;
        window.location.href = this.mainURL;
      });
  }

}
