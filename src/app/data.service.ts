import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, debounceTime, retry, catchError } from 'rxjs/operators';
import * as  CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  value: string;
  decryptedToken: String = null;
  serverEndPoint: string;
  //kingfisher airlines
  secretKey: string = 'a577cb9aa0be8ef12005bdbbc65bf3685a5f687d';
  userId: string = '';
  headers = new HttpHeaders();
  headers2 = new HttpHeaders();
  serverName: string;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.headers2.append('Content-Type', 'multipart/form-data');
    if (this.document.location.hostname == 'localhost') {
      this.serverName = 'http://139.59.22.238';
    } else if (this.document.location.hostname == '27.254.172.167') {
      this.serverName = 'http://27.254.172.167';
    } else {
      this.serverName = "https://" + this.document.location.hostname;
    }
    this.serverEndPoint = this.serverName + "/rhbusphp/Amfphp/index.php?contentType=application/json";

  }

  /**
  * @author Abhijeet
  * sends the POST request
  */
  getData(data) {
    return this.http.post(this.serverEndPoint, data)
      .pipe(
        catchError(this.handleError)
      )
      ;
  }

  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = 'http://139.59.22.238/ecom/';
    const formData: FormData = new FormData();
    formData.append('uploadFile', fileToUpload)
    return this.http
      .post(endpoint, formData, { headers: this.headers2 })
      .map(() => { return true; })
      .catch((e) => this.handleError(e));
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  getServerData(serviceName: String, methodName: String, parameters: String[]) {

    //  (1) Verify that the decrypted token is null, its set to null during the application timeout or
    //      first time login Hence it would always contain the recent working token from Server.
    //  (2) Retrieve encrypted token stored in local storage and decrypt. 

    if (this.decryptedToken == null) {
      this.retrieveKey("accessToken")
        .subscribe(data => {
          parameters[0] = data;
          this.decryptedToken = data;
        });
    }
    else {
      parameters[0] = this.decryptedToken;
    }

    // parameters.splice(1, 0, serviceName);
    // parameters.join();

    // parameters.splice(2, 0, methodName);
    // parameters.join();

    // Calls AMFPHP Service 

    return this.http.post(this.serverEndPoint,
      JSON.stringify(
        {
          "serviceName": serviceName,
          "methodName": methodName,
          "parameters": parameters
        }), { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error.status);
  };

  /**
  * sets the (key,value) with the encypted value in localstorage
  */
  setKey(key, value) {
    value = CryptoJS.AES.encrypt(value, this.secretKey);
    window.localStorage.setItem(key, value);
  }

  /**
  * retrives the (key,value) and decrypts value
  */
  retrieveKey(key) {
    this.value = localStorage.getItem(key);
    this.value = CryptoJS.AES.decrypt(this.value, this.secretKey).toString(CryptoJS.enc.Utf8);
    return Observable.of(this.value);
  }

  // Setter method to reset decrypted token value when application timesout.

  resetdecryptedToken(): Boolean {
    this.decryptedToken = null;
    return true;
  }


  setLocal(key, value): void {
    // value = CryptoJS.AES.encrypt(value, this.secretKey);
    window.localStorage.setItem(key, value);
  }

  /**
  * retrives the (key,value) and decrypts value
  */
  getValues(key) {
    return localStorage.getItem(key);
    // this.value = CryptoJS.AES.decrypt(this.value, this.secretKey).toString(CryptoJS.enc.Utf8);
    //return Observable.of(this.value);
  }

  /**
  * Remove the Local Storage ;
  */
  removeTheLocalStorageValue() {
    localStorage.removeItem('accessToken');
    this.decryptedToken = null;
  }

  getTheServerIP() {
    return this.serverName;
  }

}
