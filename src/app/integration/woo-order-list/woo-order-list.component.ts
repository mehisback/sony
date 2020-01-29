import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { DataService } from '../../data.service';
import { confirm } from 'devextreme/ui/dialog';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-woo-order-list',
    templateUrl: './woo-order-list.component.html',
    styleUrls: ['./woo-order-list.component.css'],
    providers: [DatePipe]
})

export class WooOrderListComponent implements OnInit {

    soListSource: any = {};
    id: String;
    FormDate: any = {};

    constructor(
        private dataFromService: DataService,
        public router: Router,
        private datePipe: DatePipe,
        private toastr: ToastrService
    ) {

        var thisComponent = this;
        this.soListSource = new CustomStore({
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.dataFromService.getServerData("Woo_StandardAllInOne", "woo_listAllOrders", ['',
                    UtilsForGlobalData.retrieveLocalStorageKey('woo_StoreURL'),
                    UtilsForGlobalData.retrieveLocalStorageKey('woo_ConsumerKey'),
                    UtilsForGlobalData.retrieveLocalStorageKey('woo_ConsumerValue')])
                    .subscribe(data => {
                        devru.resolve(data);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                devru.resolve();
                return devru.promise();
            },
        });
    }

    ngOnInit() {
        var date = new Date();
        this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 180);
        this.FormDate.DocumentToDate = new Date();

        this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
        this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    }

    onUserRowSelect(event) {
        this.id = String(event.data.id);
        UtilsForGlobalData.setLocalStorageKey('woo_OrderNumber', this.id);
        this.router.navigate(['/integration/woo-order-details']);
    }

    onCreateNewSO() {

    }

    convertToSO(data) {
        if (data == 'ALL') {
            let result = confirm("<p>Are you sure want to Convert All To SO?</p>", "SO");
            result.then((dialogResult) => {
                if (dialogResult) {
                    this.dataFromService.getServerData("Woo_StandardAllInOne", "woo_listAllOrders1", [''])
                        .subscribe(data => {
                            if (data == true) {
                                this.toastr.success("Converted All To Sales Order", "DONE");
                            } else {
                                this.toastr.error("Error while Converting All To Sales Order Error status Code :" + data[0]);
                            }
                        });
                }
            });
        } else {

        }

    }

}



