import { Component, OnInit, Inject } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PickListHttpDataService } from './pick-list-http-data.service';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DatePipe } from '@angular/common';
import DataSource from "devextreme/data/data_source";
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.css'],
  providers: [DatePipe]
})
export class PickListComponent implements OnInit {

  pickListSource: any = {};
  tokenofLazofromBack: any = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
  documentNumber: any;
  dataAttributes: any;
  attributesPopup: boolean = false;
  shippingLablePopup: boolean = false;
  FormDate: any = {};
  codefromLAZO: string;
  refreshTokenofLazofromBack: any;
  refreshTimerofLazofromBack: any;
  ifTimerExists: any = 'No';
  countdown: number;
  refreshTokenbackfromLS: any;
  shippinglabelbackfromLazo: any;
  chooseImportFormat = ["By Document Date", "By BatchId"];
  TypeSuggestions: any;
  BatchIDForApprove: boolean = false;
  DateForApprove: boolean = false;
  clientID: string;
  mainURL: string;
  currentURL = "https://rhbussupport.com/dist/lazada_script.html";
  serverName: string;

  constructor(
    private httpDataService: PickListHttpDataService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public dataServices: DataService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService) { }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 180);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    var thisComponent = this;

    this.pickListSource.store = new CustomStore({
      key: ["DocumentNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getAllPick([""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
    });


    this.httpDataService.getAllBatchIDForPick(['']).subscribe(getAllBatchID => {
      this.TypeSuggestions = new DataSource({
        store: <String[]>getAllBatchID,
        paginate: true,
        pageSize: 20
      });
    });
  }

  onUserRowSelect(event) {
    this.documentNumber = event.data.DocumentNo;
    UtilsForGlobalData.setLocalStorageKey('PickNumber', this.documentNumber);
    this.router.navigate(['/warehouse/pick-details']);
  }

  onCreateNewPick() {
    this.createDoc('');
    /* this.httpDataService.getAttributeValue(["", "PICKLIST"])
      .subscribe(dataAttribute => {
        if (Object.keys(dataAttribute).length > 0) {
          this.dataAttributes = dataAttribute;
          this.attributesPopup = true;
        } else {
          this.createDoc('');
        }
      }); */
  }

  onAttributesSelected(event) {
    this.attributesPopup = false;
    this.createDoc(event.data.AttributeValue);
  }

  getShippingLabels() {
    this.shippingLablePopup = true;
  }

  OpenPopup() {
    var width = 500;
    var height = 600;
    var left = 0;
    var top = 0;
    const options = `width=${width},height=${height},left=${left},top=${top}`;

    if (this.document.location.hostname == 'localhost') {
      this.serverName = 'http://localhost:4200';
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
        this.currentURL = this.currentURL + "?id=" + this.clientID;
        localStorage.setItem('LazobackURL', this.router.url);
        var that = this;
        window.addEventListener('storage', function (e) {
          that.getShippingLabelsfromLazada();
        });
        window.open(this.currentURL, 'lazada', options);
      });

  }

  getShippingLabelsfromLazada() {
    this.codefromLAZO = localStorage.getItem('CodebackFromLAZO');
    if (this.codefromLAZO == '' || this.codefromLAZO == undefined || this.codefromLAZO == null) {
      this.OpenPopup();
    } else {
      window.removeEventListener('storage', function (e) { });
      //if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.generateAccessToken();
      //}
    }
  }

  generateAccessToken() {
    if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.httpDataService.generateAccessToken(["", this.codefromLAZO])
        .subscribe(generateAccessToken => {
          this.tokenofLazofromBack = generateAccessToken["access_token"];
          this.refreshTokenofLazofromBack = generateAccessToken["refresh_expires_in"];
          this.refreshTimerofLazofromBack = generateAccessToken["refresh_token"];
          UtilsForGlobalData.setLocalStorageKey("refresh_token", this.refreshTimerofLazofromBack);
          UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
          this.startCountdownTimer(this.refreshTokenofLazofromBack);
          this.getshippinglabelsfromlazo();
        });
    } else {
      this.getshippinglabelsfromlazo();
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate" || e.dataField == "DocumentToDate") {
        this.FormDate[e.dataField] = e.value;
      }
    }
  }

  getshippinglabelsfromlazo() {
    this.tokenofLazofromBack = UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO");
    if (this.tokenofLazofromBack = '' || this.tokenofLazofromBack == undefined || this.tokenofLazofromBack == null) {
      this.generateAccessToken();
    } else {
      if (this.FormDate.userselected == 'By Document Date') {
        this.httpDataService.getMultDocument(["",
          UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO"),
          this.FormDate.DocumentFromDate,
          this.FormDate.DocumentToDate]).subscribe(SetStatusToReadyToShip => {
            if (SetStatusToReadyToShip.code == '0' || SetStatusToReadyToShip.code == 0) {
              this.shippinglabelbackfromLazo = SetStatusToReadyToShip["data"]["document"]["file"];
              this.shippinglabelbackfromLazo = decodeURIComponent(atob(this.shippinglabelbackfromLazo).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              this.printShippinglabelfromHTML(this.shippinglabelbackfromLazo);
            } else {
              this.toastr.error("" + SetStatusToReadyToShip.message);
            }
          });
      } else {
        this.httpDataService.getMultDocumentByBatchId(["",
          UtilsForGlobalData.retrieveLocalStorageKey("tokenLAZO"),
          this.FormDate.BatchID]).subscribe(SetStatusToReadyToShip => {
            if (SetStatusToReadyToShip.code == '0' || SetStatusToReadyToShip.code == 0) {
              this.shippinglabelbackfromLazo = SetStatusToReadyToShip["data"]["document"]["file"];
              this.shippinglabelbackfromLazo = decodeURIComponent(atob(this.shippinglabelbackfromLazo).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              this.printShippinglabelfromHTML(this.shippinglabelbackfromLazo);
            } else {
              this.toastr.error("" + SetStatusToReadyToShip.message);
            }
          });
      }
    }
  }

  printShippinglabelfromHTML(html) {
    let printContents, popupWin;
    printContents = html;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
    <head>
    </head>
    <body onload="window.print();">${printContents}</body>
    </html>`
    );
  }

  checkforParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if (code == 'Yes') {
        this.getshippinglabelsfromlazo();
      }
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
    this.httpDataService.refreshAccessToken(["", this.refreshTokenbackfromLS])
      .subscribe(refreshAccessToken => {
        this.tokenofLazofromBack = refreshAccessToken["access_token"];
        this.refreshTokenofLazofromBack = refreshAccessToken["refresh_expires_in"];
        this.refreshTimerofLazofromBack = refreshAccessToken["refresh_token"];
        UtilsForGlobalData.setLocalStorageKey("tokenLAZO", this.tokenofLazofromBack);
        this.startCountdownTimer(this.refreshTokenofLazofromBack);
      });

  }

  createDoc(att: String) {
    this.httpDataService.createNewDocument(["", "PICKLIST", att, UtilsForGlobalData.getUserId()])
      .subscribe(data => {
        if (data[1] === "DONE") {
          UtilsForGlobalData.setLocalStorageKey('PickNumber', data[0]);
          this.router.navigate(['/warehouse/pick-details']);
        } else {
          this.toastr.error("Error While Creating the Pick Number, Error Status Code :" + data[1]);
        }
      });
  }

  hoverFormatForType(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "BatchID");
  }

  suggestionFormateForType(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "BatchID");
  }

  onCodeChanged1(event, dataField) {
    if (event.value != undefined) {
      this.FormDate[dataField] = event.value;
      if (dataField == 'userselected') {
        if (event.value == 'By BatchId') {
          this.BatchIDForApprove = true;
          this.DateForApprove = false;
        } else {
          this.BatchIDForApprove = false;
          this.DateForApprove = true;
        }
      } else if (dataField == 'BatchID') {
      }
    }
  }

}
