import { Component, ViewChild, TemplateRef } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  title = 'RHBUS Solutions';
  TimeCounter: Number = 0;

  /* constructor(
    private router: Router,
    private userIdle: UserIdleService,
    private modal: NgbModal
  ) {
  }

  setUserIdleConfiguration(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
    this.userIdle.setConfigValues({ idle: idleInNumber, timeout: timeoutInNumber, ping: pingInNumber });
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe(count => {
      this.TimeCounter = Number(timeoutInNumber - count);
      if (count == Number(timeoutInNumber - 60)) {
        this.modal.open(this.modalContent, { size: 'lg' });
      }
    });

    this.userIdle.onTimeout().subscribe(() => {
      this.modal.dismissAll(this.modalContent);
      console.log("Time's up");
    });

    this.userIdle.ping$.subscribe(() => {
      console.log("PING");
    });
  }

  continueSessionOnClick() {
    this.restart(1, 70, 80);
    this.modal.dismissAll(this.modalContent);
  }

  stopSession() {
    this.stopWatching();
    this.stop();
    this.modal.dismissAll(this.modalContent);
    localStorage.removeItem("userID");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("company");
    this.router.navigate(['/authentication/login']);
  }

  stop() {
    this.userIdle.stopTimer();
    this.userIdle["isTimeout"] = true;
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();

  }

  restart(idleInNumber: number, timeoutInNumber: number, pingInNumber: number) {
    this.stopWatching();
    this.stop();
    this.setUserIdleConfiguration(idleInNumber, timeoutInNumber, pingInNumber);
  } */

}
