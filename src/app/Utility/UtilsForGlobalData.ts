/* @Author Ganesh
/* this is For Utility UtilsForGlobalData Functions commonly Used In app Please Refer to More Details
    getting Global Data
/* On 26-02-2019
*/

/* To Use:
/* 1) Import By : import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
/* 2) Call By : UtilsForGlobalData.name_of_Function(with Respect Parameter);
*/
import { map, debounceTime, retry, catchError } from 'rxjs/operators';
import * as  CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';

var secretKey: String = 'a577cb9aa0be8ef12005bdbbc65bf3685a5f687d';
var decryptedToken: String = null;

export default class UtilsForGlobalData {

    /* return the Current Date in Formt YYYY-MM-DD*/
    static getCurrentDate(): string {
        return new Date().toISOString().slice(0, 10);
    }

    /* return the Current Time in Formt : HH:MM:SS*/
    static getCurrentTime(): string {
        var today = new Date();
        return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    }

    /* Return Current UserId*/
    static getUserId(): String {
        return this.retrieveLocalStorageKey('userID');
    }

    /* Set the UserId*/
    static setUserId(userid: string): void {
        this.setLocalStorageKey('userID', userid);
    }

    static getUserRoleId(): string {
        return this.retrieveLocalStorageKey('RoleID');
    }

    /* Get the Company*/
    static getCompanyName(): string {
        return this.retrieveLocalStorageKey('company');
    }

    static setsessionTimer(data: Object): void {
        window.localStorage.setItem('sessionTimer', JSON.stringify(data));
    }

    /* Get the Company*/
    static getsessionTimer(): string {
        return this.retrieveLocalStorageKey('sessionTimer');
    }

    /**
    * sets the (key,value) with the encypted value in localstorage
    */
    static setLocalStorageKey(key, value) {
        value = CryptoJS.AES.encrypt(value, secretKey);
        window.localStorage.setItem(key, value);
    }

    /**
    * retrives the (key,value) and decrypts value
    */
    static retrieveLocalStorageKey(key) {
        try {
            var value = localStorage.getItem(key);
            value = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
            return Observable.of(value)["value"];
        } catch (Error) {
            return null;
        }
    }

    static getData() {
        try {
            var value = "0_110915_UxhnO4UJWN4956NbnC42sRvK10409";
            value = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
            return Observable.of(value)["value"];
        } catch (Error) {
            return null;
        }

    }

    /**
    * retrives the accessToken and decrypts value
    */
    static fetchSecuredAccessKey() {
        if (decryptedToken == null) {
            return this.retrieveLocalStorageKey("accessToken");
        } else {
            return decryptedToken;
        }

    }

}