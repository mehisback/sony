import { AnonymousSubject } from "rxjs/Rx";

/* @Author Ganesh
/* this is For Utility UtilsForSuggestion Functions commonly Used In app Please Refer to More Details
/* On 26-02-2019
*/

/* To Use:
/* 1) Import By : import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
/* 2) Call By : UtilsForSuggestion.name_of_Function(with Respect Parameter);
*/


export default class UtilsForSuggestion {

    static autoFillSuggestionsFormatFor1(data: any, val1: string): string {
        return data ? data[val1] : '';
    }

    static hoverSuggestionsFormatFor1(data: any, val1: string): string {
        return "<div class='custom-item' title='" + data[val1] + "'>" + data[val1] + "</div>";
    }

    static autoFillSuggestionsFormatFor2(data: any, val1: string, val2: string): string {
        return data ? data[val1] + " | " + data[val2] : '';
    }

    static hoverSuggestionsFormatFor2(data: any, val1: string, val2: string): string {
        return "<div class='custom-item' title='" + data[val1] + " | " + data[val2] + "'>" + data[val1] + " | " + data[val2] + "</div>";
    }

    static autoFillSuggestionsFormatFor4(data: any, val1: string, val2: string, val3: string, val4: string): string {
        return data ? data[val1] + " | " + data[val2] + " | " + data[val3] + " | " + data[val4] : '';
    }

    static autoFillSuggestionsFormatFor3(data: any, val1: string, val2: string, val3: string): string {
        return data ? data[val1] + " | " + data[val2] + " | " + data[val3] : '';
    }

    static hoverSuggestionsFormatFor4(data: any, val1: string, val2: string, val3: string, val4: string): string {
        return "<div class='custom-item' title='" + data[val1] + " | " + data[val2] + " | " + data[val3] + " | " + data[val4] + "'>" + data[val1] + " | " + data[val2] + " | " + data[val3] + " | " + data[val4] + "</div>";
    }



    static getStandardFormatNumber(value) {
        return parseFloat(value).toFixed(2);
    }

    static compareDate(date1: Date, date2: Date): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1); let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 1;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
    }

    static StandartNumberFormat(data: any, keys: any): any {
        for (var i = 0; i < keys.length; i++) {
            if (!(String(data["" + keys[i]]).includes('%'))) {
                data["" + keys[i]] = parseFloat(data["" + keys[i]]).toFixed(2);
            }
        }
        return data;
    }

    static StandardValueFormat(data: any, keys: any): any {
        for (var i = 0; i < keys.length; i++) {
            if (data["" + keys[i]] == undefined || data["" + keys[i]] == null || data["" + keys[i]] == '') {
                data["" + keys[i]] = '-';
            }
        }
        return data;
    }

    static StandardDateFormat(data: any, keys: any): any {
        for (var i = 0; i < keys.length; i++) {
            if (data["" + keys[i]] != null) {
                var date = new Date(data["" + keys[i]]);
                data["" + keys[i]] = date.toLocaleDateString('en-GB').replace('/', '-').replace('/', '-');
            }
        }
        return data;
    }

    static ReportsCustoms(data: [], keys: string): any {
        var newA = data.filter(function (item) {
            return (item["Code"] == keys && item["Required"] == 'Y');
        });
        if (newA ? newA.length > 0 : false) {
            return true;
        } else {
            return false;
        }
    }

    static getReportsCustomsItems(data: [], keys: string): any {
        return data.filter(function (item) {
            return (item["Code"] == keys && item["Required"] == 'Y');
        });
    }
}