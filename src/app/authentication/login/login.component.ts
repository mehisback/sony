import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxFormComponent } from 'devextreme-angular';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  public subscribers: any = {};
  public timerJson: any = { idleNumber: 0.1, timeroutNumber: 70, pingNumber: 0, isRefresh: false };

  login = { key: '', username: '', password: '', };
  public formLogin: FormGroup;
  public globalData: String;
  LoginDataFromServer: any;
  rememberMe = false;
  error: any;
  storedIDdemo: any;
  TimeCounter: Number = 0;
  forgotIDModal = false;
  forgotPassModal = false;
  forgotid: any[];
  forgotpass: any[];
  newPassModal = false;
  newpass: any;
  newRegister: any;
  codeoctcpc: Object;
  codececmcaciclc: any;
  otpforcheck: any;
  emailFromCust: any;
  codeckcecyc: any;
  keyforCheck: any;
  newpasshashed: Object;
  company: unknown[];
  registerpopup: boolean = false;
  newRegisterid: string[];
  newRegisterKey: any;
  newRegisterEmail: any;
  newRegisterCustomerDetails: any;
  newuserregistrerpopup: boolean = false;
  progressbarpopup: boolean = false;
  newRegisterCompanyName: any;
  newuserandpass: any;
  newUser: any;
  newPass: any;
  scriptValue;
  host: any;
  companynamefornewDB: any;
  confirmPass: any;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public dataServices: DataService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public userIdle: UserIdleService
  ) {
    this.router = router;
    this.formLogin = this.formBuilder.group({
      key: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {


    if (localStorage.getItem("loginID") != null && localStorage.getItem("customerKey") != null) {
      this.login.key = UtilsForGlobalData.retrieveLocalStorageKey("customerKey");
      this.login.username = UtilsForGlobalData.retrieveLocalStorageKey("loginID");
    }

    if (localStorage.getItem("loginID")) {
      this.rememberMe = true;
    }

  }

  ngAfterViewInit() {
    /*$(function() {
            $(".preloader").fadeOut();
        });
        $('#to-recover').on("click", function() {
            $("#loginform").slideUp();
            $("#recoverform").fadeIn();
        });*/
  }

  format(value) {
    return 'Loading: ' + value * 100 + '%';
  }
  onLoggedin() {
    if (this.rememberMe === true) {
      UtilsForGlobalData.setLocalStorageKey('loginID', this.login.username);
      UtilsForGlobalData.setLocalStorageKey('customerKey', this.login.key);
    } else {
      localStorage.removeItem("loginID");
      localStorage.removeItem("customerKey");
    }
    UtilsForGlobalData.setUserId(this.login.username);
    this.dataServices.getData(JSON.stringify(
      {
        "serviceName": "Auth3",
        "methodName": "inCreds",
        "parameters": [
          this.login.key,
          this.login.username,
          this.login.password
        ]
      }))
      .subscribe(callData => {
        this.LoginDataFromServer = callData["data"];
        this.dataServices.removeTheLocalStorageValue();
        this.timerJson = { idleNumber: 0.1, timeroutNumber: this.LoginDataFromServer[0]["amfSessionTime"], pingNumber: 0, isRefresh: false };
        UtilsForGlobalData.setLocalStorageKey("timerJson", JSON.stringify(this.timerJson));
        var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
        this.setUserIdleConfiguration(timer.idleNumber, timer.timeroutNumber, timer.pingNumber);

        UtilsForGlobalData.setLocalStorageKey('accessToken', this.LoginDataFromServer[0].accesstoken);
        UtilsForGlobalData.setLocalStorageKey('company', this.LoginDataFromServer[0].company);
        UtilsForGlobalData.setLocalStorageKey('RoleID', this.LoginDataFromServer[0].RoleID);
        localStorage.removeItem('tokenLAZO');
        localStorage.removeItem('CodebackFromLAZO');
        localStorage.removeItem('timerLazo');
        localStorage.removeItem('refresh_token');
        UtilsForGlobalData.setLocalStorageKey('woo_StoreURL', 'https://rhbussolutions.com/woocommerce/');
        UtilsForGlobalData.setLocalStorageKey('woo_ConsumerKey', 'ck_89564891ed25b1423ea23c0793f67b0f10bca2fa');
        UtilsForGlobalData.setLocalStorageKey('woo_ConsumerValue', 'cs_d1b44e6d134d5dd5bd287fd79bb0a6c5ad0cda1f');

        this.dataServices.getServerData("company", "getCompany", [''])
          .subscribe(getCompany => {
            this.company = getCompany[0];
            if (this.company["SetupCompleted"] == 'No') {
              this.router.navigate(['/authentication/setup']);
            } else {
              this.router.navigate(['/dashboard/dashboard1']);
            }
          });
      },
        error => this.error = this.alertCode(error)
      );
  }

  onregisterclick() {
    this.registerpopup = true;
  }

  passwordComparison = () => {
    return this.formWidget.instance.option("formData").newpass;
  };

  validateNewRegister() {
    this.formWidget.instance.updateData(this.newRegister);
    var data = this.formWidget.instance.option("formData");

    this.newRegisterid = data["orderid"];
    this.newRegisterKey = data["key"];
    this.newRegisterEmail = data["email"];

    this.dataServices.getData(JSON.stringify(
      {
        "serviceName": "newregister",
        "methodName": "checkNewRegisterNumber",
        "parameters": [
          data["orderid"],
          data["key"],
          data["email"]
        ]
      }))
      .subscribe(checkNewRegisterNumber => {
        if (checkNewRegisterNumber >= 1) {
          this.dataServices.getData(JSON.stringify(
            {
              "serviceName": "newregister",
              "methodName": "checkNewRegister",
              "parameters": [
                this.newRegisterid,
                this.newRegisterKey,
                this.newRegisterEmail
              ]
            }))
            .subscribe(checkNewRegister => {
              this.newRegisterCustomerDetails = checkNewRegister[0];
              this.companynamefornewDB = this.newRegisterCustomerDetails["CompanyName"];
              if (this.newRegisterCustomerDetails["CompanyName"] == '') {
                this.toastr.error("Something went wont. Please contact our customer service for more info.");
                this.registerpopup = false;
              } else {
                this.registerpopup = false;
                this.newuserregistrerpopup = true;
              }
            });
        } else {
          this.toastr.error("Key/Email/Order Number is incorrect");
        }
      });
  }

  CreateNewRegister() {
    this.formWidget.instance.updateData(this.newuserandpass);
    var data = this.formWidget.instance.option("formData");

    this.newUser = data["username"];
    this.newPass = data["newpass"];
    this.confirmPass = data["newpassconfirm"];

    if (this.newUser == '' || this.newUser == null || this.newUser == undefined) {
      this.toastr.warning("User Id Field is Required");
    } else {
      if (this.newPass == '' || this.newPass == null || this.newPass == undefined) {
        this.toastr.warning("Password Field is Required");
      } else {
        if (this.confirmPass == '' || this.confirmPass == null || this.confirmPass == undefined) {
          this.toastr.warning("Confrim Passowrd is Required");
        } else {
          if (this.newPass == this.confirmPass) {
            if ((/(?=^.{8,16}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(this.newPass))) {
              this.dataServices.getData(JSON.stringify(
                {
                  "serviceName": "newregister",
                  "methodName": "validateNewUser",
                  "parameters": [
                    this.newUser
                  ]
                }))
                .subscribe(validateNewUser => {
                  if (validateNewUser >= 1) {
                    this.toastr.error("User already exists!");
                  } else {
                    this.dataServices.getData(JSON.stringify(
                      {
                        "serviceName": "newregister",
                        "methodName": "createDB",
                        "parameters": [
                          this.companynamefornewDB
                        ]
                      }))
                      .subscribe(createDB => {
                        if (createDB["inserted"] == 1) {
                          this.newRegisterCompanyName = createDB["companyName"];
                          this.dataServices.getData(JSON.stringify(
                            {
                              "serviceName": "newregister",
                              "methodName": "createuserfortheDB",
                              "parameters": [
                                this.newRegisterCompanyName,
                                this.newUser,
                                this.newPass
                              ]
                            }))
                            .subscribe(createuserfortheDB => {
                              this.newuserregistrerpopup = false
                              this.progressbarpopup = true;
                              this.scriptValue = 12;
                              if (createuserfortheDB == 1) {
                                this.dataServices.getData(JSON.stringify(
                                  {
                                    "serviceName": "newregister",
                                    "methodName": "runScriptone",
                                    "parameters": [
                                      this.newRegisterCompanyName
                                    ]
                                  }))
                                  .subscribe(runScriptone => {
                                    this.scriptValue = runScriptone;
                                    this.dataServices.getData(JSON.stringify(
                                      {
                                        "serviceName": "newregister",
                                        "methodName": "runScripttwo",
                                        "parameters": [
                                          this.newRegisterCompanyName
                                        ]
                                      }))
                                      .subscribe(runScripttwo => {
                                        this.scriptValue = runScripttwo;
                                        this.dataServices.getData(JSON.stringify(
                                          {
                                            "serviceName": "newregister",
                                            "methodName": "runScriptthree",
                                            "parameters": [
                                              this.newRegisterCompanyName
                                            ]
                                          }))
                                          .subscribe(runScriptthree => {
                                            this.scriptValue = runScriptthree;
                                            this.dataServices.getData(JSON.stringify(
                                              {
                                                "serviceName": "newregister",
                                                "methodName": "createuserintheDB",
                                                "parameters": [
                                                  this.newRegisterCompanyName,
                                                  this.newUser,
                                                  this.newPass,
                                                  this.companynamefornewDB
                                                ]
                                              }))
                                              .subscribe(createuserintheDB => {
                                                this.scriptValue = createuserintheDB;
                                                this.dataServices.getData(JSON.stringify(
                                                  {
                                                    "serviceName": "newregister",
                                                    "methodName": "createcompanyintheDB",
                                                    "parameters": [
                                                      this.newRegisterCompanyName,
                                                      this.companynamefornewDB,
                                                      this.newRegisterKey,
                                                      this.newRegisterEmail
                                                    ]
                                                  }))
                                                  .subscribe(createcompanyintheDB => {
                                                    this.scriptValue = createcompanyintheDB;
                                                    this.host = "0.0.0.0";
                                                    this.dataServices.getData(JSON.stringify(
                                                      {
                                                        "serviceName": "newregister",
                                                        "methodName": "createmongoconnection",
                                                        "parameters": [
                                                          this.newRegisterCompanyName,
                                                          this.newRegisterKey,
                                                          this.newUser,
                                                          this.newPass,
                                                          this.host
                                                        ]
                                                      }))
                                                      .subscribe(createmongoconnection => {
                                                        this.scriptValue = createmongoconnection;
                                                        this.progressbarpopup = false;
                                                        this.toastr.success("User Registration Done!");
                                                      });
                                                  });
                                              });
                                          });
                                      });
                                  });
                              }
                            });
                        } else {
                          this.toastr.error("Something went wont. Please contact our customer service for more info.");
                        }
                      });
                  }
                });
            } else {
              this.toastr.error("Password should be strong!");
            }
          } else {
            this.toastr.warning("Password and Confrim Passowrd should match!");
          }
        }
      }
    }
  }



  alertCode(error) {
    if (error == '401') {
      this.router.navigate(['/authentication/not-found']);
    }
    else if (error == '500') {
      this.toastr.error("Username/Password Incorrect");
    }
    else {
      this.toastr.error("Server Error");
    }
  }


  setUserIdleConfiguration(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
    this.userIdle.stopWatching();
    this.userIdle.setConfigValues({ idle: idleInNumber, timeout: timeoutInNumber, ping: pingInNumber });
    this.userIdle.startWatching();
    this.subscribers.timer = this.userIdle.onTimerStart().subscribe(count => {
      this.TimeCounter = Number(timeoutInNumber - count);
      if (this.TimeCounter == 0) {
        this.modalService.dismissAll(this.modalContent);
        this.stopSession();
      }
      if (count == Number(timeoutInNumber - 60)) {
        this.modalService.open(this.modalContent, {
          size: 'lg', backdrop: 'static',
          keyboard: false
        });
      }
    });

    this.subscribers.timeout = this.userIdle.onTimeout().subscribe(() => {
      this.modalService.dismissAll(this.modalContent);
      console.log("Time's up");
      this.router.navigate(['/authentication/login']);
    });

    /* this.subscribers.ping = this.userIdle.ping$.subscribe(() => {
      console.log("PING");
    }); */

  }

  continueSessionOnClick() {
    this.dataServices.getServerData("Auth3", "getNewToken", [""])
      .subscribe(newtoken => {
        if (newtoken != "Failed") {
          this.dataServices.removeTheLocalStorageValue();
          UtilsForGlobalData.setLocalStorageKey('accessToken', newtoken);
          this.modalService.dismissAll(this.modalContent);
          var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
          this.restart(timer.idleNumber, timer.timeroutNumber, timer.pingNumber);
        } else {
          this.router.navigate(['/authentication/login']);
        }
      }, error => this.router.navigate(['/authentication/login']));
  }

  stopSession() {
    this.stopWatching();
    this.stop();
    this.modalService.dismissAll(this.modalContent);
    localStorage.removeItem("userID");
    this.dataServices.removeTheLocalStorageValue();
    localStorage.removeItem("company");
    this.router.navigate(['/authentication/login']);
  }

  stop() {
    this.userIdle.stopTimer();
    this.userIdle["isTimeout"] = true;
    console.log(this.subscribers.timer);
    this.subscribers.timer != undefined ? this.subscribers.timer.unsubscribe() : "";
    this.subscribers.timerout != undefined ? this.subscribers.timerout.unsubscribe() : "";
    this.subscribers.ping != undefined ? this.subscribers.ping.unsubscribe() : "";
    var thisC = this;
    setTimeout(function () {
      try {
        thisC.subscribers.dispose();
      } catch (Error) { }
    }, 0);
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();

  }

  restart(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
    /* this.stopWatching();
    this.stop(); */
    this.userIdle.resetTimer();
    /* var thisComponent = this;
      setTimeout(() => {
        thisComponent.userIdle.resetTimer();
      }, 500); */
  }

  forgotID() {
    this.forgotIDModal = true;
  }
  forgotPass() {
    this.forgotPassModal = true;
  }

  forgotPassModalButtonClick() {
    this.formWidget.instance.updateData(this.forgotpass);
    var data = this.formWidget.instance.option("formData");
    this.codececmcaciclc = data["email"];
    this.codeckcecyc = data["customerkey"];
    this.dataServices.getData(JSON.stringify(
      {
        "serviceName": "Auth3",
        "methodName": "forgotPass",
        "parameters": [
          data["customerkey"],
          data["email"]
        ]
      }))
      .subscribe(forgotPass => {
        if (forgotPass == 1) {
          this.toastr.success("Please Check for OTP in your Registered Phone Number");
          this.forgotPassModal = false;
          this.newPassModal = true;
          UtilsForGlobalData.setLocalStorageKey('codececmcaciclc', this.codececmcaciclc);
          UtilsForGlobalData.setLocalStorageKey('codeckcecyc', this.codeckcecyc);

        } else {
          this.toastr.error("Customer Key/Email is incorrect");
        }
      });
  }

  forgotIDModalButtonClick() {
    this.formWidget.instance.updateData(this.forgotid);
    var data = this.formWidget.instance.option("formData");

    this.dataServices.getData(JSON.stringify(
      {
        "serviceName": "Auth3",
        "methodName": "forgotID",
        "parameters": [
          data["key"],
          data["email"]
        ]
      }))
      .subscribe(forgotID => {
        if (forgotID == 0) {
          this.toastr.error("Customer Key/Email is incorrect");
        } else {
          this.toastr.success("Please Check your email");
        }
      });

  }

  newPassModalButtonClick() {
    this.formWidget.instance.updateData(this.newpass);
    var data = this.formWidget.instance.option("formData");

    this.emailFromCust = UtilsForGlobalData.retrieveLocalStorageKey("codececmcaciclc");
    this.keyforCheck = UtilsForGlobalData.retrieveLocalStorageKey("codeckcecyc");

    if (data["newpass"] == data["newpassconfirm"]) {
      this.dataServices.getData(JSON.stringify(
        {
          "serviceName": "Auth3",
          "methodName": "generateHashedPass",
          "parameters": [
            data["newpass"]
          ]
        }))
        .subscribe(generateHashedPass => {
          this.newpasshashed = generateHashedPass;

          this.dataServices.getData(JSON.stringify(
            {
              "serviceName": "Auth3",
              "methodName": "newPasschange",
              "parameters": [
                this.keyforCheck,
                this.emailFromCust,
                this.newpasshashed,
                data["otp"]
              ]
            }))
            .subscribe(forgotID => {
              if (forgotID == 0) {
                this.toastr.error("Password Update failed, Please Try Again!");
                this.newPassModal = false;
              } else if (forgotID == 2) {
                this.toastr.error("Something wrong, try resetting the passsword again");
                this.newPassModal = false;
              } else if (forgotID == 3) {
                this.toastr.error("Incorrect OTP");
              } else if (forgotID == 4) {
                this.toastr.error("Something wrong, try resetting the passsword again");
                this.newPassModal = false;
              } else {
                this.toastr.success("Password Updated!");
                this.newPassModal = false;
              }
            });
        });
    } else {
      this.toastr.error("Both the Passwords should Match!");
    }

  }
}