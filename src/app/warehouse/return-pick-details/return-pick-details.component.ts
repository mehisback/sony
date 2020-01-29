import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ReturnPickDetailsHttpDataService } from './return-pick-details-http-data.service';
let variable = require('../../../assets/js/rhbusfont.json');
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-return-pick-details',
  templateUrl: './return-pick-details.component.html',
  styleUrls: ['./return-pick-details.component.css']
})


export class ReturnPickDetailsComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainerGRHH") gridContainerGRHH: DxDataGridComponent;
  @ViewChild("gridContainerPA") gridContainerPA: DxDataGridComponent;

  PickReturnHeader: [];
  duplicatePickRHeader: string[];
  companyHeader: any = {};
  PickReturnNumber: string = UtilsForGlobalData.retrieveLocalStorageKey('PickReturnNumber');
  ShipFromSuggestions: any = {};
  SOForSuggestions: any = null;
  printHeader: any = {};
  printLines: any = {};
  dataSource: any = {};
  dataSourcePICKStore: any = {};
  dataSourcePICKADHQuantityToPick: any = [];
  isLinesExist: boolean = false;
  GoodsReceiptOperation = ['Register', 'Print Return Pick', 'Pick Stock Undo'];
  columns2 = [
    { title: "DocumentNo", dataKey: "DocumentNo", width: 90 },
    { title: "DocumentDate", dataKey: "DocumentDate", width: 40 }
  ];
  columns3 = [
    { title: "SNo", dataKey: "SnNo", width: 90 },
    { title: "ItemCode", dataKey: "ItemCode", width: 40 },
    { title: "Description", dataKey: "Description", width: 40 },
    { title: "BaseUOM", dataKey: "BaseUOM", width: 40 },
    { title: "Base Qty", dataKey: "QtyInBaseUOM", width: 40 },
    { title: "PRUOM", dataKey: "PRUOM", width: 40 },
    { title: "QtyinPR", dataKey: "QtyInPRUOM", width: 40 },
    { title: "ShippingQuantity", dataKey: "ShippingQuantity", width: 40 }
  ];
  itemDetails: any = {};
  itemDetailsPopup: Boolean = false;
  globalItemLookupPopup: boolean = false;
  globalSOLookupPopup: boolean = false;
  isLocationCodeSelected: boolean = false;
  popupSelltoCustDetails: Boolean = false;

  constructor(
    private httpDataService: ReturnPickDetailsHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.httpDataService.getLocationList1([''])
      .subscribe(getLoc => {
        this.ShipFromSuggestions = new DataSource({
          store: <String[]>getLoc,
          paginate: true,
          pageSize: 20
        });
      });


    var thisComponent = this;
    this.dataSource = new CustomStore({
      key: ["LineNo", "ItemCode", "BaseUOM", "QtyInBaseUOM", "PRUOM", "QtyInPRUOM", "ShippingQuantity", "ShippedQuantity"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.fetchOpenHeader();
        thisComponent.httpDataService.openPickLines(["",
          thisComponent.PickReturnNumber])
          .subscribe(dataLines => {
            thisComponent.printLines = dataLines;
            if ((dataLines != null ? Object.keys(dataLines).length > 0 : false)) {
              thisComponent.isLinesExist = true;
            } else {
              thisComponent.isLinesExist = false;
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      }
    });

    this.dataSourcePICKStore = new CustomStore({
      key: ["ItemCode", "SUCode", "LineNo", "LotLineNo", "LotNumber", "Available", "QtyinBaseUOM", "QtyinSOUOM", "QuantityToPick", "ExpiryDate", "OriginDate", "reqQty"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.httpDataService.getWMSLines(["",
          thisComponent.PickReturnHeader["DocumentDate"],
          thisComponent.PickReturnHeader["LocationCode"],
          thisComponent.PickReturnNumber]).subscribe(dataLines => {
            if (dataLines != null ? Object.keys(dataLines).length > 0 : false) {
              if (thisComponent.dataSourcePICKADHQuantityToPick.length == 0) {
                for (var i = 0; i < Object.keys(dataLines).length; i++) {
                  thisComponent.dataSourcePICKADHQuantityToPick.push('0');
                }
              }
              for (var i = 0; i < Object.keys(dataLines).length; i++) {
                dataLines[i].QuantityToPick = thisComponent.dataSourcePICKADHQuantityToPick[i];
              }
            }
            devru.resolve(dataLines);
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        var recQty: Number = Number(getUpdateValues(key, newValues, "QuantityToPick"));
        var avb: Number = 0.00;
        avb = Number(getUpdateValues(key, newValues, "Available"));
        this.reqQty = Number(getUpdateValues(key, newValues, "reqQty"));
        if ((recQty > avb) || (recQty > this.reqQty)) {
          devru.reject("Quantity Should be less than Equal Inventory Available & less than Equal Pick Quantity!");
        } else if (recQty == 0) {
          devru.reject("Quantity Should be More Than Zero to Move!!");
        }
        else {
          thisComponent.httpDataService.button1_clickHandler(["",
            thisComponent.PickReturnNumber,
            getUpdateValues(key, newValues, "LotNumber"),
            getUpdateValues(key, newValues, "ExpiryDate"),
            recQty.toString(),
            getUpdateValues(key, newValues, "LineNo"),
            UtilsForGlobalData.getUserId(),
            getUpdateValues(key, newValues, "OriginDate")]).subscribe(dataStatus => {
              if (dataStatus[0] != 'DONE') {
                devru.reject("Pack Move Failed! with Error Status Code :" + dataStatus[0]);
              } else {
                devru.resolve(dataStatus);
              }
            });
        }
        devru.resolve();
        return devru.promise();
      }
    });

    this.httpDataService.getCompanyInfo().subscribe(callData3 => {
      this.companyHeader = callData3[0];
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }
  }

  hover4(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "LocationCode", "Name");
  }
  hover1(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerNo");
  }

  suggestionFormateForLocationCode(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "LocationCode", "Name");
  }

  suggestionFormateForSalesOrder(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data, "DocumentNo", "SelltoCustomerNo");
  }


  fetchOpenHeader() {
    this.httpDataService.openPickOrder(["",
      this.PickReturnNumber]).subscribe(gotGRDetails => {
        this.assignToDuplicate(gotGRDetails);
        this.printHeader = gotGRDetails;
        this.PickReturnHeader = gotGRDetails[0];
        if (this.PickReturnHeader["LocationCode"] ? this.PickReturnHeader["LocationCode"] != '' : false) {
          this.isLocationCodeSelected = true;
          this.httpDataService.getAllReturnOrder(['',
            this.PickReturnHeader["LocationCode"],
            this.PickReturnHeader["DocumentDate"]]).subscribe(dataSR => {
              this.SOForSuggestions = dataSR;
            });
        } else {
          this.isLocationCodeSelected = false;
        }
        if (this.PickReturnHeader["ReservedPick"] == 'Yes') {
          this.PickReturnHeader["ReservedPick"] = true;
        } else {
          this.PickReturnHeader["ReservedPick"] = false;
        }
      });
  }

  onLocationCodeChanged(event) {
    if (this.duplicatePickRHeader[0]["LocationCode"] != event.value) {
      /* event.value = (event.value == null ? '' : event.value);
      this.GRReceiptHeader["LocationCode"] = event.value;
      this.GRReceiptHeader["DefReceiveStorage"] = event.value;*/
      if (!event.value) {
        this.httpDataService.btnClearLoc_clickHandler(["",
          this.PickReturnNumber]).subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      } else {
        var json = this.ShipFromSuggestions == null ? {} : this.ShipFromSuggestions._store._array;
        for (var index = 0; index < json.length; ++index) {
          if (json[index].LocationCode == event.value) {
            this.httpDataService.handleLocation(["",
              event.value,
              json[index].DefReceiveStorage,
              this.PickReturnNumber]).subscribe(callData3 => {
                this.errorHandlingToasterForUpdate(callData3);
              });
            break;
          }
        }
      }
    }
  }

  SalesOrderLookupSearch() {
    if (this.isLocationCodeSelected) {
      this.globalSOLookupPopup = true;
    } else {
      this.toastr.warning("Please Select the Location Code!!");
    }
  }

  onSalesOrderClicked(event) {
    this.globalSOLookupPopup = false;
    this.httpDataService.handlePRLookUp(['',
      this.PickReturnNumber,
      event.data.DocumentNo,
      this.PickReturnHeader["LocationCode"],
      this.PickReturnHeader["DefPickStorage"]])
      .subscribe(callData3 => {
        if (callData3[0] == 'COMPLETED') {
          this.gridContainer.instance.refresh();
        } else {
          this.toastr.error("Failed to Update!!, Error Status Code : " + callData3[0]);
        }
      });
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField != 'ReservedPick') {
      if ((e.value != undefined || e.value != null) && this.duplicatePickRHeader[0][e.dataField] != e.value) {
        this.duplicatePickRHeader[0]["" + e.dataField] = e.value;
        if (e.dataField == 'DocumentDate') {
          this.httpDataService.DocumentDate_changeHandler(["",
            e.value,
            this.PickReturnNumber])
            .subscribe(callData3 => {
              this.errorHandlingToasterForUpdate(callData3);
            });
        } else {
          this.httpDataService.genralPickUpdate(["",
            e.dataField, e.value,
            this.PickReturnNumber])
            .subscribe(callData3 => {
              this.errorHandlingToasterForUpdate(callData3);
            });
        }
      }
    }
  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicatePickHeader
    this.duplicatePickRHeader = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicatePickRHeader["" + i] = {};
      for (var prop in data[i]) {
        this.duplicatePickRHeader[i][prop] = data[i][prop];
      }
    }
  }

  GoodsReceiptOperationsGo(selected: string) {
    if (selected == 'Register') {
      if (this.isLinesExist) {
        this.checkQtyToPost();
      } else
        this.toastr.warning("Please Add the Lines");
    } else if (selected == 'Print Return Pick') {
      if (this.isLinesExist) {
        this.generateStdPDF(this.PickReturnHeader, this.printLines, this.columns3, "Purchase Return Pick");
      } else {
        this.toastr.warning("Please add the Lines!!");
      }
    } else if (selected == 'Pick Stock Undo') {
      this.httpDataService.btnUndo_clickHandler(["",
        this.PickReturnNumber,
        UtilsForGlobalData.getUserId()])
        .subscribe(callData3 => {
          if (callData3[0] == 'DONE') {
            this.toastr.success("Pick Allocation is REMOVED!");
            this.gridContainer ? this.gridContainer.instance.refresh() : '';
            this.gridContainerPA ? this.gridContainerPA.instance.refresh() : '';
          } else {
            this.toastr.error("Error while Undo , Error Status Code :" + callData3[0]);
          }
        });
    } else {
      this.toastr.warning("Please Select The Operation");
    }
  }

  setFocus(e) {
    e.component.focus();
  }

  checkQtyToPost() {
    this.httpDataService.checkForZeroShipping(["",
      this.PickReturnNumber]).subscribe(gotGRDetails => {
        if (Object.keys(gotGRDetails).length > 0) {
          if (Number(gotGRDetails[0].qty) != 0) {
            if (this.PickReturnHeader["DocumentStatus"] != 'POSTED') {
              this.httpDataService.postPickProcedure(["",
                this.PickReturnNumber,
                this.PickReturnHeader["DefPickStorage"],
                this.PickReturnHeader["SourceNo"],
                this.PickReturnHeader["DocumentDate"],
                UtilsForGlobalData.getUserId()]).subscribe(data => {
                  if (data[0] == 'POSTED') {
                    this.toastr.success("Pick Return " + this.PickReturnNumber + " is successfully Posted and Archived", "Posted");
                    this.router.navigate(['/warehouse/return-pick-list']);
                  } else {
                    this.toastr.error("Posting Failed! with Error status Code :" + data[0], "Try again");
                  }
                });
            } else {
              this.toastr.warning("Nothing to Post!!", "Already Posted Error");
            }
          } else {
            this.toastr.warning("No Receiving Quantity Found!!");
          }
        } else {
          this.toastr.warning("Nothing to Post!!", "No Record found Error");
        }
      });
  }

  errorHandlingToasterForUpdate(dataStatus) {
    if (dataStatus >= 0) {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  errorHandlingToaster(dataStatus) {
    if (dataStatus[0] == 'DONE') {
      this.fetchOpenHeader();
      this.toastr.success("Successfully Updated", "DONE");
    } else {
      this.toastr.error("Error In Updating!! Error Status Code : UPDATE-ERR", "Try Again");
    }
  }

  getSellToCustomerDetail(event) {
    this.popupSelltoCustDetails = true;
  }

  onCustomerDetailsFieldsChanges(e) {
    if (e.dataField != 'ReservedPick') {
      if ((e.value != undefined || e.value != null) && this.duplicatePickRHeader[0][e.dataField] != e.value) {
        this.httpDataService.genralPickUpdate(["",
          e.dataField, e.value,
          this.PickReturnNumber])
          .subscribe(callData3 => {
            this.errorHandlingToasterForUpdate(callData3);
          });
      }
    }
  }


  ItemDeatilsForPopUp(data) {
    this.itemDetails = data.data;
    this.itemDetailsPopup = true;
  }

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
    rightStartCol1: 400,
    rightStartCol2: 480,
    InitialstartX: 40,
    startX: 40,
    InitialstartY: 50,
    startY: 0,
    lineHeights: 12,
    MarginEndY: 40
  };

  generateStdPDF(printHeader, printLines, columHeader, title) {

    printHeader.BaseTotalQty = 0;
    printHeader.POTotalQty = 0;
    printHeader.ReceivedTotalQty = 0;
    printHeader.RemarksExternal = printHeader.RemarksExternal ? printHeader.RemarksExternal : '';
    printHeader.Zone = printHeader.Zone ? printHeader.Zone : '';


    for (var i = 0; i < Object.keys(printLines).length; i++) {
      printLines[i].SnNo = i + 1;
      printHeader.BaseTotalQty = Number(printHeader.BaseTotalQty) + Number(printLines[i].QtyInBaseUOM);
      printHeader.POTotalQty = Number(printHeader.POTotalQty) + Number(printLines[i].QtyInPRUOM);
      printHeader.ReceivedTotalQty = Number(printHeader.ReceivedTotalQty) + Number(printLines[i].ShippingQuantity);
      printLines[i].QtyInBaseUOM = this.formatNumber(printLines[i].QtyInBaseUOM);
      printLines[i].QtyInPRUOM = this.formatNumber(printLines[i].QtyInPRUOM);
      printLines[i].ShippingQuantity = this.formatNumber(printLines[i].ShippingQuantity);
    }

    const doc = new jsPDF('p', 'pt', 'a4');

    doc.addFileToVFS("Garuda-Bold.tff", variable.thai6);
    doc.addFont('Garuda-Bold.tff', this.pdfFormate.SetFont, this.pdfFormate.SetFontType);
    doc.setFont(this.pdfFormate.SetFont);

    var tempY = this.pdfFormate.InitialstartY;

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + title, { align: "left" }, this.pdfFormate.startX, tempY);
    doc.setLineWidth(1);
    var pageEnd = doc.internal.pageSize.width - this.pdfFormate.MarginEndY;
    doc.line(this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing, pageEnd, tempY);
    tempY += (this.pdfFormate.NormalSpacing);

    doc.addImage('data:image/jpeg;base64,' + this.companyHeader.CompanyLogo, 'PNG', this.pdfFormate.startX, tempY, 90, 60); //variable.company_logo.src
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontSize(this.pdfFormate.SubTitleFontSize);
    doc.textAlign("" + this.companyHeader.Name, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.textAlign("" + this.companyHeader.Address1, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.Address2, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("" + this.companyHeader.City + "- " + this.companyHeader.PostCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Phone :" + this.companyHeader.Phone, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("TAX ID :" + this.companyHeader.VATID, { align: "left" }, this.pdfFormate.rightStartCol1, tempY += this.pdfFormate.NormalSpacing);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.setFontSize(this.pdfFormate.SmallFontSize);
    doc.setFontType(this.pdfFormate.SetFontType);

    tempY += this.pdfFormate.NormalSpacing;
    doc.setFont(this.pdfFormate.SetFont);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("RECEIVE FROM :", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("RECEIVE AT :", { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("" + printHeader.VendorCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("LOCATION   : " + printHeader.LocationCode, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Name, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("SU CODE    : " + printHeader.DefPickStorage, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address1 + ",", { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("ZONE         : " + printHeader.Zone, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.Address2, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);
    doc.textAlign("Handled By : " + printHeader.HandledBy, { align: "left" }, this.pdfFormate.rightStartCol1, tempY);

    doc.textAlign("" + printHeader.City + " " + printHeader.ZipCode, { align: "left" }, this.pdfFormate.startX, tempY += this.pdfFormate.NormalSpacing);

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(this.columns2, this.printHeader, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'center'
      },
      headStyles: {
        fillColor: [64, 139, 202],
      },
    });

    tempY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;

    doc.autoTable(columHeader, printLines, {
      startX: this.pdfFormate.startX,
      startY: tempY += this.pdfFormate.NormalSpacing * 2,
      styles: {
        font: this.pdfFormate.SetFont, fontSize: this.pdfFormate.SmallFontSize,
        fontStyle: this.pdfFormate.SetFontType, halign: 'right'
      },
      columnStyles: {
        SnNo: {
          halign: 'left'
        },
        ItemCode: {
          halign: 'left'
        },
        Description: {
          halign: 'left'
        },
        BaseUOM: {
          halign: 'left'
        },
        QtyInBaseUOM: {
          halign: 'right'
        },
        PRUOM: {
          halign: 'left'
        },
        QtyInPRUOM: {
          halign: 'right'
        },
        ShippingQuantity: {
          halign: 'right'
        }
      },
      headStyles: {
        fillColor: [64, 139, 202],
        halign: 'left'
      },
      didDrawPage: data => {
        let footerStr = "Page " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          footerStr = footerStr;
        }
        footerStr += "  Date Printed : " + UtilsForGlobalData.getCurrentDate() + " User : " + UtilsForGlobalData.getUserId();
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
    var startY = doc.autoTable.previous.finalY + this.pdfFormate.NormalSpacing;

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("SUB TOTAL QTY:", { align: "left" }, rightcol1, (startY));
    doc.textAlign("" + printHeader.BaseTotalQty, { align: "right-align" }, rightcol2, startY);

    doc.setFontType(this.pdfFormate.SetFontType);
    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.textAlign("TOTAL P.R. QTY: ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.POTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("TOTAL SHIPPING QTY : ", { align: "left" }, rightcol1, startY);
    doc.textAlign("" + printHeader.ReceivedTotalQty, { align: "right-align" }, rightcol2, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing * 2, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Remarks : " + printHeader.RemarksExternal, { align: "left" }, this.pdfFormate.startX, startY);
    doc.setLineWidth(1);
    startY += this.pdfFormate.NormalSpacing * 2;
    doc.line(this.pdfFormate.startX, startY, 150, startY);

    startY = this.calculateThePage(startY += this.pdfFormate.NormalSpacing, doc);
    doc.setFontType(this.pdfFormate.SetFontType);
    doc.textAlign("Prepared By", { align: "left" }, this.pdfFormate.startX, startY);
    doc.textAlign("Approved By", { align: "right-align" }, this.pdfFormate.rightStartCol1, startY);

    doc.save("ReturnPick" + this.PickReturnNumber + ".pdf");
    this.gridContainer.instance.refresh();
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

      x = x - txtWidth;
    } else if (options.align === "right-align") {

      x = this.internal.pageSize.width - 40 - txtWidth;
    } else if (options.align === "right-align-toleft") {
      if (430 + txtWidth > this.internal.pageSize.width - 40) {
        x = this.internal.pageSize.width - 40 - txtWidth;
      } else
        x = x;
    }
    this.text(txt, x, y);
  };

  API.getLineHeight = function (txt) {
    return this.internal.getLineHeight();
  };

})(jsPDF.API);
