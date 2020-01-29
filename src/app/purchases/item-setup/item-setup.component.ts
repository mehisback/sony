import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/data/odata/store';
import { DxDataGridComponent } from 'devextreme-angular';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';

@Component({
  selector: 'app-item-setup',
  templateUrl: './item-setup.component.html',
  styleUrls: ['./item-setup.component.css']
})
export class ItemSetupComponent implements OnInit {
  @ViewChild("gridContainer2") gridContainer2: DxDataGridComponent;
  @ViewChild("gridContainer3") gridContainer3: DxDataGridComponent;
  @ViewChild("gridContainer9") gridContainer9: DxDataGridComponent;


  dataSource: CustomStore;
  dataSource2: CustomStore;
  dataSource3: CustomStore;
  Code: any;
  CodeforGettingCategory: any;
  CodeforGettingSubCategory: any;
  CodeforGettingSizeCategory: any;
  SuggestionsLookup: any;

  dataSource4: CustomStore;
  dataSource5: CustomStore;
  dataSource6: CustomStore;
  dataSource7: CustomStore;
  dataSource8: CustomStore;
  dataSource9: CustomStore;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSource = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getFamily", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getCategorySELECT", ["",
          key["Code"]]).subscribe(data => {
            if (Object.keys(data).length == 0) {
              dummyDataServive.getServerData("ItemSetup", "DELETERecordfamily", ["", key["Code"]])
                .subscribe(data => {
                  if (data > 0) {
                    devru.resolve(data);
                  } else {
                    devru.reject("Error while Deleting the Lines with Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
                  }
                });
            } else {
              devru.reject("Error while Deleting the Code: " + key["Code"] + ", Its Category Exists!!");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerfamily", ["",
          getUpdateValues(key, newValues, "Code"),
          getUpdateValues(key, newValues, "Description"),
          key["Code"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTfamily", ["",
            values["Code"],
            values["Description"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource2 = new CustomStore({
      key: ["Code", "Description", "FamilyCode", "ItemPrefix"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getCategorySELECT", ["",
          thisComponent.CodeforGettingCategory]).subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getSubCategorySELECT", ["",
          key["Code"]]).subscribe(data => {
            if (Object.keys(data).length == 0) {
              dummyDataServive.getServerData("ItemSetup", "DELETERecordcategory", ["",
                thisComponent.CodeforGettingCategory,
                key["Code"]]).subscribe(data => {
                  if (data > 0) {
                    devru.resolve(data);
                  } else {
                    devru.reject("Error while Removing the Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
                  }
                });
            } else {
              devru.reject("Error while Deleting the Code: " + key["Code"] + ", Its Sub-Category Exists!!");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlercategory", ["",
          getUpdateValues(key, newValues, "Code"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "ItemPrefix"),
          key["Code"],
          thisComponent.CodeforGettingCategory]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTcategory", ["",
            values["Code"],
            values["Description"],
            values["ItemPrefix"],
            thisComponent.CodeforGettingCategory]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource3 = new CustomStore({
      key: ["SubCode", "Description", "Category", "ItemPrefix"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getSubCategorySELECT", ["",
          thisComponent.CodeforGettingSubCategory]).subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordsubcategory", ["",
          key["SubCode"],
          thisComponent.CodeforGettingSubCategory]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the SubCode: " + key["SubCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlersubcategory", ["",
          getUpdateValues(key, newValues, "SubCode"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "ItemPrefix"),
          key["SubCode"],
          thisComponent.CodeforGettingSubCategory]).subscribe(data => {
            if (data == '1') {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the SubCode: " + getUpdateValues(key, newValues, "SubCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["SubCode"] ? values["SubCode"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTsubcategory", ["",
            values["SubCode"],
            values["Description"],
            values["ItemPrefix"],
            thisComponent.CodeforGettingSubCategory]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with SubCode: " + values["SubCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource4 = new CustomStore({
      key: ["Code", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getUOM", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecorduom", ["", key["Code"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Code: " + key["Code"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandleruom", ["",
          getUpdateValues(key, newValues, "Code"),
          getUpdateValues(key, newValues, "Description"),
          key["Code"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Code: " + getUpdateValues(key, newValues, "Code") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Code"] ? values["Code"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTuom", ["",
            values["Code"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Code: " + values["Code"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }

    });

    this.dataSource5 = new CustomStore({
      key: ["ColorCode", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getColor", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordcolor", ["", key["ColorCode"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the ColorCode: " + key["ColorCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlercolor", ["",
          getUpdateValues(key, newValues, "ColorCode"),
          getUpdateValues(key, newValues, "Description"),
          key["ColorCode"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the ColorCode: " + getUpdateValues(key, newValues, "ColorCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["ColorCode"] ? values["ColorCode"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTcolor", ["",
            values["ColorCode"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["ColorCode"] + ", Error Status Code is " + data[0]);
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }

    });

    this.dataSource6 = new CustomStore({
      key: ["BrandCode", "Description", "ItemPrefix"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getBrand", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordbrand", ["", key["BrandCode"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the BrandCode: " + key["BrandCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerbrand", ["",
          getUpdateValues(key, newValues, "BrandCode"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "ItemPrefix"),
          key["BrandCode"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the BrandCode: " + getUpdateValues(key, newValues, "BrandCode") + ", Error Status Code is UPDATE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["BrandCode"] ? values["BrandCode"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTbrand", ["",
            values["BrandCode"],
            values["Description"],
            values["ItemPrefix"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Code: " + values["BrandCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource7 = new CustomStore({
      key: ["Name", "Description"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getGender", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordgender", ["", key["Name"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the Name: " + key["Name"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlergender", ["",
          getUpdateValues(key, newValues, "Name"),
          getUpdateValues(key, newValues, "Description"),
          key["Name"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the Name: " + getUpdateValues(key, newValues, "Name") + ", Error Status Code is UPADTE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Name"] ? values["Name"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTgender", ["",
            values["Name"],
            values["Description"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with Name: " + values["Name"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource8 = new CustomStore({
      key: ["SizeCode", "Description", "MasterSize", "SizeSequence", "GroupID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getSize", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordsize", ["", key["SizeCode"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the SizeCode: " + key["SizeCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlersize", ["",
          getUpdateValues(key, newValues, "SizeCode"),
          getUpdateValues(key, newValues, "Description"),
          getUpdateValues(key, newValues, "SizeSequence"),
          getUpdateValues(key, newValues, "GroupID"),
          key["SizeCode"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the SizeCode: " + getUpdateValues(key, newValues, "SizeCode") + ", Error Status Code is UPADTE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["SizeCode"] ? values["SizeCode"] != '' : false) {
          dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlerINSERTsize", ["",
            values["SizeCode"],
            values["Description"],
            values["SizeSequence"],
            values["GroupID"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with SizeCode: " + values["SizeCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    this.dataSource9 = new CustomStore({
      key: ["SizeCode", "CategoryCode", "MasterSize", "SizeSequence", "GroupID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "getSizeCategorySELECT", ["",
          thisComponent.CodeforGettingSizeCategory])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetup", "DELETERecordsizeCategory", ["", key["SizeCode"], key["CategoryCode"]])
          .subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Deleting the CategoryCode: " + key["CategoryCode"] + ", Error Status Code is DELETE-ERR");
            }
          });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ItemSetupPage", "btnOK_clickHandlercategorysize", ["",
          getUpdateValues(key, newValues, "CategoryCode"),
          getUpdateValues(key, newValues, "SizeCode"),
          key["CategoryCode"],
          key["SizeCode"]]).subscribe(data => {
            if (data > 0) {
              devru.resolve(data);
            } else {
              devru.reject("Error while Updating the CategoryCode: " + getUpdateValues(key, newValues, "CategoryCode") + ", Error Status Code is UPADTE-ERR");
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["CategoryCode"] ? values["CategoryCode"] != '' : false) {
          dummyDataServive.getServerData("ItemSetup", "addsizeCategory", ["",
            values["CategoryCode"],
            values["SizeCode"]])
            .subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Adding the Lines with CategoryCode: " + values["CategoryCode"] + ", Error Status Code is INSERT-ERR");
              }
            });
        } else {
          devru.reject("Please Provide the Valid Code!!");
        }
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }


  onUserRowSelect(event) {
    this.CodeforGettingCategory = event.data.Code;
    this.CodeforGettingSubCategory = null;
    this.gridContainer2.instance.refresh();
    this.gridContainer3.instance.refresh();
  }


  onUserRowSelect2(event) {
    this.CodeforGettingSubCategory = event.data.Code;
    this.gridContainer3.instance.refresh();
  }

  onUserRowSelect3(event) {
    this.CodeforGettingSizeCategory = event.data.SizeCode;
    this.gridContainer9.instance.refresh();
    this.dataFromService.getServerData("ItemSetup", "getCategory", [""])
      .subscribe(data => {
        this.SuggestionsLookup = {
          paginate: true,
          pageSize: 20,
          loadMode: "raw",
          load: () => <String[]>data
        }
      });
  }

  ItemSetupOnInitNewRow(event, type) {
    if (type == 'CATEGORY') {
      if (this.CodeforGettingCategory != null) {
        event.data.FamilyCode = this.CodeforGettingCategory;
      } else {
        this.toastr.warning("Please Select the Family Code First!!");
        window.setTimeout(function () { event.component.cancelEditData(); }, 0);
      }
    }
    else if (type == 'SUBCATEGORY') {
      if (this.CodeforGettingSubCategory != null) {
        event.data.Category = this.CodeforGettingSubCategory;
      } else {
        this.toastr.warning("Please Select the Category Code First!!");
        window.setTimeout(function () { event.component.cancelEditData(); }, 0);
      }
    }
    else if (type == 'SIZECATEGORY') {
      if (this.CodeforGettingSizeCategory != null) {
        event.data.SizeCode = this.CodeforGettingSizeCategory;
      } else {
        this.toastr.warning("Please Select the Size Code First!!");
        window.setTimeout(function () { event.component.cancelEditData(); }, 0);
      }
    }
  }

  suggestionFormateForLookup(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "Code");
  }

  hoverFormateForLookup(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "Code");
  }


}
