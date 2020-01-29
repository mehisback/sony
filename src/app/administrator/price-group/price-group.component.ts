import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/data/odata/store';
import { DxDataGridComponent } from 'devextreme-angular';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { CompundDiscountService } from '../../Utility/compund-discount.service';

@Component({
  selector: 'app-price-group',
  templateUrl: './price-group.component.html',
  styleUrls: ['./price-group.component.css'],
  providers: [DatePipe]
})
export class PriceGroupComponent implements OnInit {
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  continents: any = {};
  ItemCode: any;
  dataSource: any = {};
  FormDate: any = {};
  itemArray: any = [];
  isSalesCodeSelected: boolean = false;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private compoundDiscount: CompundDiscountService) {

    this.setDiscountValue = this.setDiscountValue.bind(this);
  }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.FormDate.DocumentFromDate = new Date();
    this.FormDate.DocumentToDate = new Date();
    this.FormDate.AccountCode = '';

    //this.FormDate.DocumentFromDate.setMonth(this.FormDate.DocumentFromDate.getMonth() - 1);
    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');


    this.continents.store = new CustomStore({
      key: ["SalesCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "getAllSP", [""]).subscribe(data => {
          devru.resolve(data);
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "deletePriceGroup", ["", key["SalesCode"]])
          .subscribe(data => {
            if (data == '0') {
              devru.reject("Error while Updating the Lines with LineNo: " + key["SalesCode"] + ", Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "button1_clickHandler", ["",
          values["SalesCode"],
          "", ""
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Adding the Lines with ItemCode: " + values["SalesCode"] + ", Error Status Code is INSERT-ERR");
          }
        });
        return devru.promise();
      }
    });

    this.dataFromService.getServerData("ItemPriceLookup2", "getList", [''])
      .subscribe(callData3 => {
        this.itemArray = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () =>
            <String[]>callData3
        }
      });


    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

    this.dataSource.store = new CustomStore({
      key: ["ItemCode", "UOM", "StartingDate", "EndingDate", "DiscText", "BasePrice", "UnitPrice"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "getItemLines", ["",
          thisComponent.FormDate.SalesCode]).subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "btnDelete_clickHandler", ["",
          thisComponent.FormDate.SalesCode,
          key["ItemCode"], key["StartingDate"], key["UOM"]])
          .subscribe(data => {
            if (data <= 0) {
              devru.reject("Error while Updating the Lines with LineNo: " + key["ItemCode"] + ", Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroup", "handleLookup", ["",
          values["ItemCode"],
          thisComponent.FormDate.SalesCode,
          values["StartingDate"],
          values["EndingDate"],
          values["UOM"],
          values["UnitPrice"],
          values["BasePrice"],
          thisComponent.FormDate.AllCustomers == true ? 'Yes' : 'No',
          values["DiscText"],
          Number(values["BasePrice"]) - Number(values["UnitPrice"])
        ]).subscribe(data => {
          if (data > 0) {
            devru.resolve(data);
          } else {
            devru.reject("Error while Adding the Lines with ItemCode: " + values["ItemCode"] + ", Error Status Code is INSERT-ERR");
          }
        });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("PriceGroupEdit", "btnSave_clickHandler", ["",
          getUpdateValues(key, newValues, "UnitPrice"),
          getUpdateValues(key, newValues, "DiscText"),
          "" + (Number(getUpdateValues(key, newValues, "BasePrice")) - Number(getUpdateValues(key, newValues, "UnitPrice"))),
          thisComponent.FormDate.SalesCode,
          getUpdateValues(key, newValues, "ItemCode"),
          getUpdateValues(key, newValues, "StartingDate"),
          getUpdateValues(key, newValues, "UOM")
        ])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines with ItemCode: " + getUpdateValues(key, newValues, "ItemCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });
  }

  changeSelection(event) {
    this.dataFromService.getServerData("PriceGroup", "getSelectedRecord", ['',
      event.data.SalesCode])
      .subscribe(callData3 => {
        this.FormDate = callData3[0];
        this.FormDate.DocumentFromDate = new Date();
        this.FormDate.DocumentToDate = new Date();
        this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
        this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');
        if (this.FormDate.AllCustomers == "Yes") {
          this.FormDate.AllCustomers = true;
        } else {
          this.FormDate.AllCustomers = false;
        }
        this.gridContainer.instance.refresh();
      });
    this.isSalesCodeSelected = true;
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "Description" || e.dataField == "DiscFormula" || e.dataField == "AllCustomers") {
        var temp = e.value;
        if (e.dataField == "AllCustomers") {
          temp = (e.value == true ? 'Yes' : 'No');
        }
        this.dataFromService.getServerData("PriceGroup", "updateSP", ['',
          e.dataField, temp, this.FormDate.SalesCode])
          .subscribe(callData3 => {
            if (callData3 < 0)
              this.toastr.error("Error While Updating!! Error Status Code: UPDATE-ERR");
          });
        this.gridContainer.instance.refresh();
      }
    }
  }

  onInitNewRow(event) {
    if (event.data.ItemCode) {

    }
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "ItemCode") {
      let standardHandler = e.editorOptions.onValueChanged;
      let thisComponent = this;
      e.editorOptions.onValueChanged = function (event) {
        if (thisComponent.FormDate.DiscFormula ? thisComponent.FormDate.DiscFormula != '' : false) {
          e.component.cellValue(e.row.rowIndex, "UOM", event.value.UOM);
          e.component.cellValue(e.row.rowIndex, "BasePrice", event.value.UnitPrice);
          e.component.cellValue(e.row.rowIndex, "StartingDate", thisComponent.FormDate.DocumentFromDate);
          e.component.cellValue(e.row.rowIndex, "EndingDate", thisComponent.FormDate.DocumentToDate);
          e.component.cellValue(e.row.rowIndex, "DiscText", thisComponent.FormDate.DiscFormula);
          e.component.cellValue(e.row.rowIndex, "ItemCode", event.value.ItemCode);
          var disc = 0;
          var amtafterDisc: String = thisComponent.compoundDiscount.calculateCompDiscount(thisComponent.FormDate.DiscFormula, event.value.UnitPrice);
          if (amtafterDisc != "invalid value") {
            disc = Number(amtafterDisc); //Number(event.value.UnitPrice)
            if (Math.sign(disc) == -1) {
              disc = - disc;
            }
            if (disc <= Number(event.value.UnitPrice)) {
              disc = Number(disc.toFixed(2));
            } else {
              disc = 0;
            }
          }
          e.component.cellValue(e.row.rowIndex, "UnitPrice", disc);
        } else {
          thisComponent.gridContainer.instance.refresh();
          thisComponent.toastr.warning("Please add the Discount Formula!!");
        }
      }
    }
  }

  setBaseUOMValueItemCode(newData, value, currentData): void {
    newData.ItemCode = value;
    (<any>this).defaultSetCellValue(newData, value);
  }

  setDiscountValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    if (currentData.BasePrice) {
      var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(value, currentData.BasePrice);
      var disc = 0;
      if (amtafterDisc != "invalid value") {
        disc = Number(currentData.BasePrice) - Number(amtafterDisc);
        if (disc <= currentData.BasePrice) {
          disc = Number(disc.toFixed(2));
        } else {
          disc = 0;
        }
      }
      newData.DiscText = disc;
      newData.UnitPrice = currentData.BasePrice - disc;
    } else {
      newData.DiscText = value;
    }
  }

  setUnitPriceValue(newData, value, currentData): void {
    value = value != null ? value : 0;
    if (currentData.BasePrice && currentData.DiscText) {
      var amtafterDisc: String = this.compoundDiscount.calculateCompDiscount(currentData.DiscText, value);
      var disc = 0;
      if (amtafterDisc != "invalid value") {
        disc = Number(currentData.BasePrice) - Number(amtafterDisc);
        if (disc <= currentData.BasePrice) {
          disc = Number(disc.toFixed(2));
        } else {
          disc = 0;
        }
      }
      newData.UnitPrice = disc;
      newData.DiscText = disc;
    } else {
      newData.DiscText = value;
      newData.UnitPrice = value;
    }
  }

  itemLookup2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }
  formateForItemListSuggestion2(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "ItemCode");
  }
  hoverItemList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor4(data, "ItemCode", "Description", "UOM", "UnitPrice");
  }

  formateForItemListSuggestionUOM(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "UOM");
  }
  hoverItemUOMList(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "UOM");
  }

}
