import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompundDiscountService {

  constructor() { }

  _discounttxt: String = null;
  _amt: Number = 0;
  arr;
  rest: String = '';

  calculateCompDiscount(intxt: String, inamt: Number): String {
    this._discounttxt = intxt;
    this._amt = inamt;
    this.arrsplit();
    this.process();
    return this.rest;
  }
  
  private arrsplit(): void {

    var temp: String = this._discounttxt;
    this.arr = String(temp).split('+');

  }
  private process(): void {
    if (this.checkstring()) {

      var k = 0;
      this.rest = null;

      for (var i = 0; i < this.arr.length; i++) {
        var temp2: String = this.arr[i].toString();
        //rest = temp2;
        if (temp2.charAt(temp2.length - 1) == '%') {

          this._amt = Number(this._amt) - (Number(this._amt) * Number(temp2.substring(0, temp2.length - 1)) / 100);

        } else {
          this._amt = Number(this._amt) - Number(temp2.substring(0, temp2.length))
        }

      }
      this.rest = String(this._amt);

    } else 
      this.rest = "invalid value";
  }

  private checkstring(): Boolean {
    var temp: String = this._discounttxt;
    var ret: Boolean = true;
    temp = String(temp).toUpperCase();
    var myArray = ["*", "-", "/", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "="];
    for (var i = 0; i < temp.length; i++) {
      for (var chk = 0; chk < myArray.length; chk++) {
        if (temp.charAt(i) == myArray[chk]) {
          ret = false;
        }
      }
    }
    return ret;
  }

}
