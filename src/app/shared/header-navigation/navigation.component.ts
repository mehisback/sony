import { Component, AfterViewInit, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../authentication/login/login.component';
import { UserIdleService } from 'angular-user-idle';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ConnectionService } from 'ng-connection-service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html'
})

export class NavigationComponent implements AfterViewInit, OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    public subscribers: any = {};

    TimeCounter: Number = 0;
    isRefresh: boolean = false;
    userID = UtilsForGlobalData.getUserId();
    name: string;
    public config: PerfectScrollbarConfigInterface = {};
    statusPopup: boolean = false;
    isConnected = true;
    constructor(
        private connectionService: ConnectionService,
        private dataFromService: DataService,
        public router: Router,
        private appComp: LoginComponent,
        private modalService: NgbModal,
        private userIdle: UserIdleService) {
        this.connectionService.monitor().subscribe(isConnected => {
            this.isConnected = isConnected;
            if (this.isConnected) {
                this.statusPopup = false;
            }
            else {
                this.statusPopup = true;
            }
        });

        var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
        if (timer.isRefresh) {
            this.setUserIdleConfiguration(timer.idleNumber, timer.timeroutNumber, timer.pingNumber);
        }
    }

    ngOnInit() {


    }

    logout() {
        this.appComp.stopSession();
        this.stopSession();
    }

    // This is for Notifications
    notifications: Object[] = [
        {
            round: 'round-danger',
            icon: 'ti-link',
            title: 'Luanch Admin',
            subject: 'Just see the my new admin!',
            time: '9:30 AM'
        },
        {
            round: 'round-success',
            icon: 'ti-calendar',
            title: 'Event today',
            subject: 'Just a reminder that you have event',
            time: '9:10 AM'
        },
        {
            round: 'round-info',
            icon: 'ti-settings',
            title: 'Settings',
            subject: 'You can customize this template as you want',
            time: '9:08 AM'
        },
        {
            round: 'round-primary',
            icon: 'ti-user',
            title: 'Pavan kumar',
            subject: 'Just see the my admin!',
            time: '9:00 AM'
        }
    ];

    // This is for Mymessages
    mymessages: Object[] = [
        {
            useravatar: 'assets/images/users/1.jpg',
            status: 'online',
            from: 'Pavan kumar',
            subject: 'Just see the my admin!',
            time: '9:30 AM'
        },
        {
            useravatar: 'assets/images/users/2.jpg',
            status: 'busy',
            from: 'Sonu Nigam',
            subject: 'I have sung a song! See you at',
            time: '9:10 AM'
        },
        {
            useravatar: 'assets/images/users/2.jpg',
            status: 'away',
            from: 'Arijit Sinh',
            subject: 'I am a singer!',
            time: '9:08 AM'
        },
        {
            useravatar: 'assets/images/users/4.jpg',
            status: 'offline',
            from: 'Pavan kumar',
            subject: 'Just see the my admin!',
            time: '9:00 AM'
        }
    ];

    ngAfterViewInit() {

        const set = function () {
            const width =
                window.innerWidth > 0 ? window.innerWidth : this.screen.width;
            const topOffset = 0;
            if (width < 1170) {
                $('#main-wrapper').addClass('mini-sidebar');
            } else {
                // $('#main-wrapper').addClass('mini-sidebar');

                $(function () {
                    $('.sidebartoggler').on('click', function () {
                        if ($('#main-wrapper').hasClass('mini-sidebar')) {
                            $('body').trigger('resize');
                            $('#main-wrapper').removeClass('mini-sidebar');
                        } else {
                            $('body').trigger('resize');
                            $('#main-wrapper').addClass('mini-sidebar');
                        }
                    });
                });
                //$('#main-wrapper').removeClass('mini-sidebar');
            }
        };
        $(window).ready(set);
        $(window).on('resize', set);

        $('.search-box a, .search-box .app-search .srh-btn').on(
            'click',
            function () {
                $('.app-search').toggle(200);
            }
        );

        $('body').trigger('resize');
    }


    setUserIdleConfiguration(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
        try {
            this.userIdle.stopWatching();
        } catch (Error) { }
        this.userIdle.setConfigValues({ idle: idleInNumber, timeout: timeoutInNumber, ping: pingInNumber });
        this.userIdle.startWatching();
        this.subscribers.timer = this.userIdle.onTimerStart().subscribe(count => {
            this.TimeCounter = Number(timeoutInNumber - count);
            if (this.TimeCounter == 0) {
                this.modalService.dismissAll(this.modalContent);
                this.logout();
            }
            if (count == Number(timeoutInNumber - 60)) {
                this.modalService.open(this.modalContent, {
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                });
            }
        });

        this.subscribers.timerout = this.userIdle.onTimeout().subscribe(() => {
            this.modalService.dismissAll(this.modalContent);
            console.log("Time's up");
            this.router.navigate(['/authentication/login']);
        });

        /* this.subscribers.ping = this.userIdle.ping$.subscribe(() => {
            console.log("PING");
        }); */

        //this.userIdle.resetTimer();
    }

    continueSessionOnClick() {
        this.dataFromService.getServerData("Auth3", "getNewToken", [""])
            .subscribe(newtoken => {
                if (newtoken != "Failed") {
                    this.dataFromService.removeTheLocalStorageValue();
                    UtilsForGlobalData.setLocalStorageKey('accessToken', newtoken);
                    this.modalService.dismissAll(this.modalContent);
                    var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
                    this.restart(timer.idleNumber, timer.timeroutNumber, timer.pingNumber);
                } else {
                    this.modalService.dismissAll(this.modalContent);
                    this.logout();
                }
            }, error => {
                this.modalService.dismissAll(this.modalContent);
                this.logout();
            });
    }

    stopSession() {
        this.stopWatching();
        this.stop();
        localStorage.removeItem("userID");
        this.dataFromService.removeTheLocalStorageValue();
        localStorage.removeItem("company");
        var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
        timer.isRefresh = false;
        UtilsForGlobalData.setLocalStorageKey("timerJson", JSON.stringify(timer));
        this.modalService.dismissAll(this.modalContent);
        this.router.navigate(['/authentication/login']);
    }

    stop() {
        this.userIdle.stopTimer();
        this.userIdle["isTimeout"] = true;
        console.log(this.subscribers.timer);
        this.subscribers.timer != undefined ? this.subscribers.timer.unsubscribe() : "";
        this.subscribers.timerout != undefined ? this.subscribers.timerout.unsubscribe() : "";
        this.subscribers.ping != undefined ? this.subscribers.ping.unsubscribe() : "";
    }

    stopWatching() {
        this.userIdle.stopWatching();
    }

    startWatching() {
        this.userIdle.startWatching();
    }

    restart(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
        /* this.stopWatching();
        this.stop();
        this.setUserIdleConfiguration(idleInNumber, timeoutInNumber, pingInNumber); */
        this.userIdle.resetTimer();
    }

}
