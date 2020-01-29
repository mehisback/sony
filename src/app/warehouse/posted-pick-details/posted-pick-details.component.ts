import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');


@Component({
    selector: 'app-posted-pick-details',
    templateUrl: './posted-pick-details.component.html',
    styleUrls: ['./posted-pick-details.component.css']
})
export class PostedPickDetailsComponent implements OnInit {

    @ViewChild("gridContainerPL") gridContainerPL: DxDataGridComponent;
    @ViewChild("gridContainerAP") gridContainerAP: DxDataGridComponent;
    @ViewChild("gridContainerPS") gridContainerPS: DxDataGridComponent;
    @ViewChild("gridContainerPA") gridContainerPA: DxDataGridComponent;

    pickHeader: [];
    duplicatePickHeader: string[];
    companyHeader: any = {};
    postedPickNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('postedPickNumber');
    ShipFromSuggestions: any = {};
    SOForSuggestions: any = null;
    dataSource: any = {};
    itemListArray: any = {};
    dataSource2: any = [];
    dataSourcePICKSUGG: any = {};
    printPICKSUGG: any = {};
    dataSourcePICKADH: any = {};
    dataSourcePICKADHQuantityToPick: any = [];
    dataSourcePICKHH: any = {};
    dataSourcePICKHH2: any = [];
    looseArr: any = {};
    dataSourcePICKAUTO: any = {};
    PickFlowResult: boolean = false;
    isPickLinesAdded: boolean = false;
    printPickLine: any;
    printPickHeader: any;
    reqQty: Number = 0.00;
    columns1 = [
        { title: "ลำดับ", dataKey: "SnNo", width: 90 },
        { title: "รหัสสินค้า", dataKey: "ItemCode", width: 40 },
        //{ title: "ยี่ห้อ", dataKey: "BrandCode", width: 40 },
        //{ title: "หมวดสินค้า", dataKey: "CategoryCode", width: 40 },
        //{ title: "หมวดย่อย", dataKey: "SubCatcode", width: 40 },
        { title: "ชื่อสินค้า", dataKey: "Description", width: 40 },
        { title: "ราคา/หน่วย", dataKey: "SOUnitPrice", width: 40 },
        { title: "หน่วยนับ", dataKey: "SOUOM", width: 40 },
        { title: "จำนวน", dataKey: "ShippingQty", width: 40 },
    ];
    columns2 = [
        { title: "SNo", dataKey: "SnNo", width: 90 },
        { title: "ItemCode", dataKey: "ItemCode", width: 40 },
        { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
        { title: "StorageCode", dataKey: "StorageCode", width: 40 },
        { title: "Stock", dataKey: "Stock", width: 40 }
    ];
    columns3 = [
        { title: "SNo", dataKey: "SnNo", width: 90 },
        { title: "ItemCode", dataKey: "ItemCode", width: 40 },
        { title: "LotNo", dataKey: "LotNumber", width: 40 },
        { title: "StorageCode", dataKey: "StorageCode", width: 40 },
        { title: "Req Quantity", dataKey: "reqQty", width: 40 },
        { title: "Available", dataKey: "Available", width: 40 },
        { title: "QuantityToPick", dataKey: "QuantityToPick", width: 40 }
    ];

    itemDetails: any = {};
    itemDetailsPopup: Boolean = false;
    popupShipToVendorDetails: Boolean = false;
    popupDeliveryStatus: Boolean = false;
    DeliveryStatus: any = [];
    pickOpeartion = ['Print Shipment', 'Update Deliver Status'];


    constructor(
        private dataFromService: DataService,
        public router: Router,
        private toastr: ToastrService) { }

    ngOnInit() {

        var thisComponent = this;

        this.dataSource.store = new CustomStore({
            key: ["LineNo", "ItemCode", "Barcode"],
            load: function (loadOptions) {
                var devru = $.Deferred();
                thisComponent.fetchOpenHeader();
                thisComponent.dataFromService.getServerData("wmsPostedPickCard", "openPickLines", ["",
                    thisComponent.postedPickNumber])
                    .subscribe(dataLines => {
                        if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
                            thisComponent.isPickLinesAdded = true;
                        } else {
                            thisComponent.isPickLinesAdded = false;
                        }
                        thisComponent.printPickLine = dataLines;
                        devru.resolve(dataLines);
                    });
                return devru.promise();
            },
            remove: function (key) {
                var devru = $.Deferred();
                thisComponent.dataFromService.getServerData("wmsPostedPickCard", "btnDeleteItem_clickHandler", ["",
                    key["LineNo"],
                    thisComponent.postedPickNumber,
                    UtilsForGlobalData.getUserId()]).subscribe(dataLines => {
                        if (dataLines[0] != 'DONE') {
                            devru.reject("Error while Undoing the Shipping, Error :" + dataLines[0]);
                        } else {
                            devru.resolve(dataLines);
                        }
                    });
                return devru.promise();
            },

        });

        this.dataFromService.getServerData("company", "getCompanyInfo", ['',
            UtilsForGlobalData.getCompanyName()]).subscribe(callData3 => {
                this.companyHeader = callData3[0];
            });

        function getUpdateValues(key, newValues, field): String {
            return newValues[field] ? newValues[field] : key[field];
        }
    }

    fetchOpenHeader() {
        this.dataFromService.getServerData("wmsPostedPickCard", "openPickOrder", ["",
            this.postedPickNumber])
            .subscribe(gotPickDetails => {
                this.pickHeader = gotPickDetails[0];
                if (this.pickHeader["DeliveryStatus"] == 'NOTDELIVERED') {
                    this.DeliveryStatus = ['NOTDELIVERED', 'DELIVERED'];
                } else if (this.pickHeader["DeliveryStatus"] == 'DELIVERED') {
                    this.DeliveryStatus = ['SHIPACKNOWLEDGE'];
                } else if (this.pickHeader["DeliveryStatus"] == 'SHIPACKNOWLEDGE') {
                    this.DeliveryStatus = ['SENDACCOUNTING'];
                } else {
                    this.DeliveryStatus = [];
                }
            });
    }

    getFormatOfNumber(e) {
        return UtilsForSuggestion.getStandardFormatNumber(e.value);
    }
    
    PickOrderOperationsGo(selected: string) {
        if (selected == 'Print Shipment') {
            if (this.printPickLine != null ? Object.keys(this.printPickLine).length > 0 : false) {
                this.generateStdPDF(this.pickHeader, this.printPickLine, this.columns1, "Print Shipment Duplicate");
            } else {
                this.toastr.warning("There is No Lines To Print!!");
            }
        } else if (selected == 'Update Deliver Status') {
            this.popupDeliveryStatus = true;
        }
    }

    UpdateDeliveryStatusGo(selected: string) {
        if (selected == 'DELIVERED') {
            this.dataFromService.getServerData("wmsPostedPickCard", "handleProcessChoiceDelivered",
                ["", this.postedPickNumber]).subscribe(gotPickDetails => {
                    this.errorHandlingStatus(gotPickDetails, selected);
                });
        } else if (selected == 'SHIPACKNOWLEDGE') {
            this.dataFromService.getServerData("wmsPostedPickCard", "handleProcessChoiceShipAck",
                ["", this.postedPickNumber]).subscribe(gotPickDetails => {
                    this.errorHandlingStatus(gotPickDetails, selected);
                });
        } else if (selected == 'SENDACCOUNTING') {
            if (this.pickHeader["DeliveryResult"] == 'WAITINGRESULT') {
                this.errorHandlingStatus(1, selected + " DeliveryResult :WAITINGRESULT");
            } else {
                this.dataFromService.getServerData("wmsPostedPickCard", "handleProcessChoiceSendAcc",
                    ["", this.postedPickNumber]).subscribe(gotPickDetails => {
                        this.errorHandlingStatus(gotPickDetails, selected);
                    });
            }
        } else if (selected == 'CLOSED') {
            this.dataFromService.getServerData("wmsPostedPickCard", "handleProcessChoiceClosed",
                ["", this.postedPickNumber]).subscribe(gotPickDetails => {
                    this.errorHandlingStatus(gotPickDetails, selected);
                });
        }
    }

    errorHandlingStatus(status, operation) {
        this.popupDeliveryStatus = false;
        this.fetchOpenHeader();
        if (status > 0) {
            this.toastr.success("Successfully Updated : " + operation, "DONE");
        } else {
            this.toastr.error("Error while Updating the " + operation + " Error : UPDATE-ERR");
        }
    }

    getShipToVendorDetail(event) {
        this.popupShipToVendorDetails = true;
    }

    public pdfFormate = {
        HeadTitleFontSize: 18,
        Head2TitleFontSize: 16,
        TitleFontSize: 14,
        SubTitleFontSize: 12,
        NormalFontSize: 10,
        SmallFontSize: 8,
        SetFont: "Garuda-Bold",
        SetFontType: "normal",
        NormalSpacing: 12,
        rightStartCol1: 410,
        rightStartCol2: 480,
        InitialstartX: 40,
        startX: 40,
        InitialstartY: 50,
        startY: 0,
        lineHeights: 12,
        MarginEndY: 40
    };

    formatNumber(number) {
        number = parseFloat(number).toFixed(2) + '';
        var x = number.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    generateStdPDF(printHeader, printLines, columHeader, title) {

        printHeader.TotalQty = 0;
        printHeader.GrandTotalQty = 0;
        printHeader.RemarksExternal = printHeader.RemarksExternal == null ? '' : printHeader.RemarksExternal;
        for (var i = 0; i < Object.keys(printLines).length; i++) {
            printLines[i].SnNo = i + 1;
            printHeader.TotalQty = Number(printHeader.TotalQty) + Number(printLines[i].ShippingQty);
            printHeader.GrandTotalQty = printHeader.TotalQty;
            printLines[i].SOUnitPrice = this.formatNumber(printLines[i].SOUnitPrice);
            printLines[i].ShippingQty = this.formatNumber(printLines[i].ShippingQty);
        }
        const doc = new jsPDF('p', 'pt', 'a4');

        doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
        doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
        doc.setFont(this.pdfFormate.SetFont);

        var tempY = this.pdfFormate.InitialstartY;

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SubTitleFontSize);
        doc.textAlign("" + title, { align: "center" }, this.pdfFormate.startX, tempY);
        tempY += (this.pdfFormate.NormalSpacing);

        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.setFontSize(this.pdfFormate.SmallFontSize);
        doc.textAlign("" + this.companyHeader.Name, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.Address1 + ", " + this.companyHeader.Address2, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("Phone :" + this.companyHeader.Phone + " Fax :" + this.companyHeader.Fax, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
        doc.textAlign("VATID :" + this.companyHeader.VATID, { align: "center" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("", { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("โอนจาก  : " + printHeader.LocationCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("เลขที่เอกสาร : " + printHeader.DocumentNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("ไปยัง     : " + printHeader.SelltoCustomerName, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("วันที่ : " + printHeader.DocumentDate, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("S.O. No.  : " + printHeader.SourceNo, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("Ext. Doc. No.: " + printHeader.SourceNo, { align: "right-align" }, this.pdfFormate.rightStartCol1, tempY);

        tempY += this.pdfFormate.NormalSpacing;
        doc.setFont(this.pdfFormate.SetFont);
        doc.setFontType(this.pdfFormate.SetFontType);

        const totalPagesExp = "{total_pages_count_string}";

        doc.autoTable(columHeader, printLines, {
            startX: this.pdfFormate.startX,
            startY: tempY += this.pdfFormate.NormalSpacing,
            styles: {
                font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
                fontStyle: this.pdfFormate.SetFontType, halign: 'left'
            },
            columnStyles: {
                SnNo: {
                    halign: 'right'
                },
                ItemCode: {
                    halign: 'left'
                },
                Description: {
                    halign: 'left'
                },
                SOUnitPrice: {
                    halign: 'right'
                },
                SOUOM: {
                    halign: 'right'
                },
                ShippingQty: {
                    halign: 'right'
                }
            },
            didDrawPage: data => {
                let footerStr = "Page " + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === 'function') {
                    footerStr = footerStr;
                }
                footerStr += " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
                doc.setFontSize(this.pdfFormate.SmallFontSize);
                doc.text(footerStr, data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }



        //-------Invoice Footer---------------------
        var rightcol1 = 340;
        var rightcol2 = 480;
        doc.setFontType(this.pdfFormate.SetFontType);
        var startY = doc.autoTable.previous.finalY + 60;
        startY = this.calculateThePage(startY, doc);


        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing + 60, doc);
        doc.setFontType(this.pdfFormate.SetFontType);
        doc.textAlign("หมายเหตุ :" + printHeader.RemarksExternal, { align: "left" }, this.pdfFormate.startX, startY);
        doc.setLineWidth(1);
        var inty = startY += this.pdfFormate.NormalSpacing + 30;
        doc.line(this.pdfFormate.startX, inty, 150, inty);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("ผุ้ตรวจสอบ", { align: "center" }, rightcol1, startY);
        doc.textAlign("ผู้ส่ง.................................", { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("........................................", { align: "center" }, rightcol1, startY);
        doc.textAlign("วันที่ ......./............/...........", { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("วันที่ ......./............/...........", { align: "center" }, rightcol1, startY);
        doc.textAlign("ผู้รับ.................................", { align: "right-align" }, rightcol2, startY);

        startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
        doc.textAlign("วันที่ ......./............/...........", { align: "right-align" }, rightcol2, startY);

        doc.save("PostedPickOrder" + this.postedPickNumber + ".pdf");
    }

    calculateThePage(startY, doc) {
        if (startY >= (doc.internal.pageSize.height - this.pdfFormate.MarginEndY)) {
            doc.addPage();
            doc.text("Page " + doc.internal.getNumberOfPages() + " Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId(), this.pdfFormate.startX, doc.internal.pageSize.height - 10);
            startY = this.pdfFormate.InitialstartY;
        }
        return startY;
    }

}


(function (API) {
    API.textAlign = function (txt, options, x, y) {
        options = options || {};
        // Use the options align property to specify desired text alignment
        // Param x will be ignored if desired text alignment is 'center'.
        // Usage of options can easily extend the function to apply different text
        // styles and sizes

        // Get current font size
        var fontSize = this.internal.getFontSize();

        // Get page width
        var pageWidth = this.internal.pageSize.width;

        // Get the actual text's width
        // You multiply the unit width of your string by your font size and divide
        // by the internal scale factor. The division is necessary
        // for the case where you use units other than 'pt' in the constructor
        // of jsPDF.

        var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

        if (options.align === "center") {

            // Calculate text's x coordinate
            x = (pageWidth - txtWidth) / 2;

        } else if (options.align === "centerAtX") { // center on X value

            x = x - (txtWidth / 2);

        } else if (options.align === "right") {

            x = txtWidth - x;
        } else if (options.align === "right-align") {

            x = this.internal.pageSize.width - 40 - txtWidth;
        } else if (options.align === "right-align") {

            x = x;
        } else if (options.align === "right-align-toleft") {
            if (410 + txtWidth > this.internal.pageSize.width - 40) {
                x = this.internal.pageSize.width - 40 - txtWidth;
            } else
                x = x;
        }

        // Draw text at x,y
        /*if(y >= this.internal.pageSize.height - 25){
          this.addPage();
          this.text("Page "+this.internal.getNumberOfPages(), 0, this.internal.pageSize.height - 10);
        } //%(this.internal.pageSize.height - 25)*/
        this.text(txt, x, y);
    };
    /*
        API.textWidth = function(txt) {
            var fontSize = this.internal.getFontSize();
            return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
        };
    */

    API.getLineHeight = function (txt) {
        return this.internal.getLineHeight();
    };

})(jsPDF.API);

