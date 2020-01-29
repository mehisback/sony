import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxPopupComponent, DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import { MatStepper } from '@angular/material';
import * as XLSX from 'xlsx';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';
import { ItemListHttpDataService } from './item-list-http-data.service';
var XLSXSample = require('xlsx');

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;
  @ViewChild(DxPopupComponent) popup: DxPopupComponent;
  @ViewChild("stepper") stepper: MatStepper;

  keyname: string = "accessToken";
  closeResult: string;
  dataSource1: any = {};
  dataSource2: any = {};
  dataSource3: any = {};

  itemList: any;
  user: any;

  newItemDetail: [];
  popupVisible: boolean = false;
  salesPersonSuggestions: any = null;
  brandSuggestions: DataSource;
  itemFamilySuggestions: DataSource;
  categorySuggestions: DataSource;
  subcategorySuggestions: DataSource;
  itemValue: Object;
  searchText;
  custDetail: [];
  p;
  itemCodeActive: boolean = false;
  isFileSelected1: boolean = false;
  importpopup: boolean;
  importFileData: any;
  rowCount1: Number = 0;
  rowCount2: Number = 0;
  rowCount3: Number = 0;
  itemcodefield: boolean = false;

  constructor(
    private httpDataService: ItemListHttpDataService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.router = router;

  }

  ngOnInit(): void {


    this.httpDataService.getItemList([""])
      .subscribe(GotItemList => {
        this.itemList = GotItemList;

        for (var i = 0; i < Object.keys(this.itemList).length; i++) {
          this.itemList[i]["UnitPrice"] = parseFloat(this.itemList[i]["UnitPrice"]).toFixed(2);
        }
      });


    this.httpDataService.handleConnectedbrand([""])
      .subscribe(getBrand => {
        this.brandSuggestions = new DataSource({
          store: <String[]>getBrand,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.handleConnecteditemFamily([""])
      .subscribe(getItemSizeGroup => {
        this.itemFamilySuggestions = new DataSource({
          store: <String[]>getItemSizeGroup,
          paginate: true,
          pageSize: 10
        });
      });

    this.httpDataService.handleConnectedcategory([""])
      .subscribe(category => {
        this.categorySuggestions = new DataSource({
          store: <String[]>category,
          paginate: true,
          pageSize: 10
        });
      });

    var thisComponent = this;

    this.dataSource1.store = new CustomStore({
      key: ["LineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount1 = 0;
        thisComponent.httpDataService.getRecords([""]).subscribe(data => {
          if (thisComponent.isFileSelected1) {
            thisComponent.rowCount1 = Object.keys(data).length;
            devru.resolve(data);
          }
          else
            devru.resolve();
        });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.deleteItemLines(["", key["LineNo"]])
          .subscribe(data => {
            if (data == 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateItemLines(["",
          Object.keys(newValues)[0],
          newValues[Object.keys(newValues)[0]],
          key["LineNo"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Lines : " + Object.keys(newValues)[0] + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataSource2.store = new CustomStore({
      key: ["LineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount2 = 0;
        thisComponent.httpDataService.getRecords2([""])
          .subscribe(dataStatus => {
            thisComponent.rowCount2 = Object.keys(dataStatus).length;
            devru.resolve(dataStatus);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.httpDataService.deleteItemLines(["", key["LineNo"]])
          .subscribe(dataStatus => {
            if (dataStatus == 0) {
              devru.reject("Error while Deleting the Lines, Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(dataStatus);
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.httpDataService.updateItemLines(["",
          Object.keys(newValues)[0],
          newValues[Object.keys(newValues)[0]],
          key["LineNo"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              devru.resolve(dataStatus);
            } else {
              devru.reject("Error while Updating the Lines : " + Object.keys(newValues)[0] + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      }
    });

    this.dataSource3.store = new CustomStore({
      key: ["LineNo"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.rowCount3 = 0;
        thisComponent.httpDataService.btnChkRepBarcode_clickHandler([""])
          .subscribe(dataStatus => {
            thisComponent.rowCount3 = Object.keys(dataStatus).length;
            devru.resolve(dataStatus);
          });
        return devru.promise();
      }
    });

  }

  onCategoryChanged(event: any) {
    this.newItemDetail["category"] = event.value;
    this.httpDataService.handleConnectedsubCategory(["", event.value])
      .subscribe(subcategory => {
        this.subcategorySuggestions = new DataSource({
          store: <String[]>subcategory,
          paginate: true,
          pageSize: 10
        });
      });
  }

  suggestionFormatForcategory(data) {
    return data ? data.Code : null;
  }

  suggestionFormatForsubcategory(data) {
    return data ? data.SubCode : null;
  }

  suggestionFormatForitemFamily(data) {
    return data ? data.Code : null;
  }

  suggestionFormatForSalesPerson(data) {
    return data ? data.Name : null;
  }

  suggestionFormatForBrand(data) {
    return data ? data.BrandCode : null;
  }

  suggestionFormatForItemFamily(data) {
    return data ? data.Code + " | " + data.Description : null;
  }


  itemCode(user: string) {
    UtilsForGlobalData.setLocalStorageKey('ItemCode', user);
    this.router.navigate(['/purchases/items-details']);
  }

  showInfo() {
    this.popupVisible = true;
    this.newItemDetail = [];
    this.newItemDetail["Auto"] = false;
    this.itemcodefield = false;
  }

  onSubCategoryChange(event: any) {
    this.newItemDetail["subcategory"] = event.value;
  }

  onBrandChange(event: any) {
    this.newItemDetail["brand"] = event.value;
  }

  onitemFamilyChanged(event: any) {
    this.newItemDetail["FamilyCode"] = event.value;
  }

  formSummary_fieldDataChanged(e) {
    if (e.dataField == 'Auto') {
      if (e.value == true) {
        this.itemcodefield = true;
        this.newItemDetail["Auto"] = true;
      } else {
        this.itemcodefield = false;
        this.newItemDetail["Auto"] = false;
      }
    }
  }

  Save(event) {
    if (this.newItemDetail["Auto"] == true) {
      if (this.newItemDetail["brand"] ? this.newItemDetail["brand"] != "" : false) {
        if (this.newItemDetail["category"] ? this.newItemDetail["category"] != '' : false) {
          if (this.newItemDetail["subcategory"] ? this.newItemDetail["subcategory"] != '' : false) {
            if (this.newItemDetail["FamilyCode"] ? this.newItemDetail["FamilyCode"] != '' : false) {
              this.httpDataService.createNewDocument(["", "ITEM", 'ALL', UtilsForGlobalData.getUserId()])
                .subscribe(data => {
                  if (data[1] === "DONE") {
                    this.toastr.success("Item added Suucessfully");
                    this.itemCode(data[0]);
                    this.httpDataService.updateItemwithAutoCode(["",
                      this.newItemDetail["brand"],
                      this.newItemDetail["category"],
                      this.newItemDetail["subcategory"],
                      this.newItemDetail["FamilyCode"],
                      data[0]
                    ]).subscribe(data => {
                      if (data == true) {

                      } else {
                        this.toastr.error("Error while updating the Item");
                      }
                    });
                  } else {
                    this.toastr.error("Error while Inserting Item, Error :" + data[1]);
                  }
                });
            } else {
              this.toastr.warning("Family Code is Required", "MISSING DATA");
            }
          } else {
            this.toastr.warning("SubCategory is Required", "MISSING DATA");
          }
        } else {
          this.toastr.warning("Category is Required", "MISSING DATA");
        }
      } else {
        this.toastr.warning("Brand is Required", "MISSING DATA");
      }
    } else {
      this.formWidget.instance.updateData(this.newItemDetail);
      var check: boolean = false;
      var data = this.formWidget.instance.option("formData");
      Object.keys(this.itemList).forEach(key => {
        if (this.itemList[key].ItemCode == data["ItemCode"]) {
          check = true;
        }
      });
      if (!check) {
        if (Object.keys(data).length != 0) {
          if (data["ItemCode"] && data["brand"] && data["category"] && data["subcategory"] && data["FamilyCode"]) {
            this.httpDataService.btnCreate_Handler(["",
              data["ItemCode"],
              data["brand"],
              data["category"],
              data["subcategory"],
              data["FamilyCode"]]).subscribe(getNewItemDetail => {
                if (getNewItemDetail > 0) {
                  this.toastr.success("Item added Suucessfully");
                  this.itemCode(data.ItemCode);
                } else {
                  this.toastr.error("Error while Inserting Item" + data["ItemCode"] + ", Error Status Code : INSERT-ERR");
                }
              });
          } else {
            this.toastr.warning("All Fields are Manditory!!", "MISSING DATA");
          }
        } else {
          this.toastr.warning("Item Data is Empty!!", "INSUFFICIENT DATA")
        }
      } else {
        this.toastr.warning("This ItemCode Already Exists!!", "DUPLICATE ITEM");
      }
    }
  }

  CustList(CustList: any): any {
    throw new Error("Method not implemented.");
  }

  import() {
    this.importpopup = true;
    this.isFileSelected1 = false;
    const file = document.querySelector('.selectedfile');
    file["value"] = '';
    var thisComponent = this;
    setTimeout(() => {
      thisComponent.stepper.selectedIndex = 0;
    }, 10);
  }

  clearFile() {
    const file = document.querySelector('.selectedfile');
    file["value"] = '';
  }

  onFileChange1(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      var sheet_name_list = wb.SheetNames;
      this.importFileData = XLSXSample.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);
      var isDone: boolean = true;
      if (Object.keys(this.importFileData).length == 0) {
        isDone = false;
      } else {
        this.isFileSelected1 = true;
      }
      if (isDone) {
        for (var i = 0; i < Object.keys(this.importFileData).length; i++) {
          if (this.importFileData[i].ImportedBy == undefined) {
            this.importFileData[i].ImportedBy = UtilsForGlobalData.getUserId();
          }
        }
        this.isFileSelected1 = true;
        this.httpDataService.btnImportItem_clickHandler(["", UtilsForGlobalData.getUserId()])
          .subscribe(btnImportItem_clickHandler => {
            this.httpDataService.importJsonSample(["", this.importFileData])
              .subscribe(importJson => {
                if (importJson == true) {
                  this.httpDataService.onImport([""])
                    .subscribe(importJson => {
                      if (Number(importJson) > 0) {
                        this.toastr.warning("Please Check the EXISTING ITEMS in Validate!!", "EXISTING ITEMS");
                      }
                      this.httpDataService.btnChkRepBarcode_clickHandler([""])
                        .subscribe(data => {
                          if (Object.keys(data).length > 0) {
                            this.toastr.warning("Please Check the DUPLICATE BARCODES in Validate!!", "DUPLICATE BARCODES");
                          }
                        });
                      this.httpDataService.getRecords2([""])
                        .subscribe(data => {
                          if (Object.keys(data).length > 0) {
                            this.toastr.warning("Please Check the EXISTING ITEMS in Validate!!", "EXISTING ITEMS");
                          }
                        });
                      this.gridContainer ? this.gridContainer.instance.refresh() : '';
                      this.gridContainer2 ? this.gridContainer2.instance.refresh() : '';
                      this.gridContainer3 ? this.gridContainer3.instance.refresh() : '';
                      var thisComponent = this;
                      setTimeout(() => {
                        thisComponent.stepper.selectedIndex = 1;
                      }, 10);
                    });
                } else {
                  this.toastr.error("Invalid Line in Code:" + importJson + ", Please Check For Chars: SPECIAL/BLANK/DUP/INVALID", "INSERT-ERR");
                }
              });
          });
      } else {
        this.toastr.warning("Import File Does not have any Rows!");
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onTabChange(event) {
    if (!this.isFileSelected1) {
      event.preventDefault();
      this.toastr.warning("Please Select The File (.csv,.xlxs)!!");
    }
  }

  btnImport_clickHandler() {
    if (this.isFileSelected1) {
      this.httpDataService.btnImport_clickHandler([""])
        .subscribe(btnImportItem_clickHandler => {
          if (btnImportItem_clickHandler[0].NOUOMCOUNT == 0) {
            this.httpDataService.INSERTItems(["",
              UtilsForGlobalData.getUserId()])
              .subscribe(importJson => {
                if (importJson[1] == 'DONE') {
                  this.isFileSelected1 = false;
                  this.toastr.success("Insert Records Completed!. SUMMARY: " + importJson[0], "Success");
                  this.importpopup = false;
                } else {
                  this.toastr.error("Insert Failed with Code : " + importJson[1] + " SUMMARY : " + importJson[0]);
                }
              });
          } else {
            this.toastr.warning("There are " + btnImportItem_clickHandler[0].NOUOMCOUNT + " lines With NO Base Unit of Measure,Import Not allowed!");
          }
        });
    } else {
      this.toastr.warning("Please Select The File (.csv,.xlxs)!!");
    }
  }

}
