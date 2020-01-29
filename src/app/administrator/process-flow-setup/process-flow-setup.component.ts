import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-process-flow-setup',
  templateUrl: './process-flow-setup.component.html',
  styleUrls: ['./process-flow-setup.component.css']
})
export class ProcessFlowSetupComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;
  @ViewChild("gridContainerPF") gridContainerPF: DxDataGridComponent;
  @ViewChild("gridContainerRole") gridContainerRole: DxDataGridComponent;

  dataSourceDoctype: any = null;
  dataSourceSeq: any = null;
  currModule: any;
  currDocument: any;
  seqDetails: [] = null;
  duplicateseqDetails: string[] = [];
  chkResult1: boolean = false;
  firstCheckValue: any;
  currSeq: any;
  chkResult2: boolean = false;
  chkResult3: boolean = false;
  chkResult4: boolean = false;
  ActionTypeEditable: boolean = false;
  dataSourcelength: any;
  dataSourceRole: CustomStore;
  PopupRole: boolean = false;
  dataSourceRolePop: CustomStore;
  selectedRole: any = null;

  constructor(private dataFromService: DataService,
    public router: Router,
    private toastr: ToastrService) {
    this.choice3_ValueChanged = this.choice3_ValueChanged.bind(this);
  }

  ngOnInit() {
    var dummyDataServive = this.dataFromService;
    var thisComponent = this;

    this.dataSourceDoctype = new CustomStore({
      key: ["DocumentName"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ProcessFlowSetup", "getDocumentType", [""])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });

    this.dataSourceSeq = new CustomStore({
      key: ["Sequence"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ProcessFlowSetup", "getProcessFlowSetup", ['', thisComponent.currModule, thisComponent.currDocument])
          .subscribe(data => {
            thisComponent.dataSourcelength = Number(Object.keys(data).length);
            devru.resolve(data);
          });
        return devru.promise();
      }
    });

    this.dataSourceRole = new CustomStore({
      key: ["RoleID"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("ProcessFlowSetup", "getRole", ['', thisComponent.currModule, thisComponent.currDocument, thisComponent.currSeq])
          .subscribe(data => {
            devru.resolve(data);
          });
        return devru.promise();
      }
    });

  }


  onFocusedRowChanged(event) {
    var data = event.data;
    this.currModule = data.Module;
    this.currDocument = data.DocumentType;
    this.currSeq = null;
    this.assignToDuplicate([]);
    this.seqDetails = [];
    this.gridContainerPF.instance.refresh();
  }

  onFocusedRowChanged1(event) {
    this.clearData();
    this.currSeq = event.data["Sequence"];
    var result = [];
    result.push(event.data);
    this.assignToDuplicate(result);
    this.seqDetails = event.data;
    if (this.seqDetails["FinalStep"] == 'No') {
      this.seqDetails["FinalStep"] = false;
    } else {
      this.seqDetails["FinalStep"] = true;
    }
    if (this.seqDetails["ResultIsChoice"] == 'No') {
      this.seqDetails["ResultIsChoice"] = false;
      if (this.currSeq == '1' || this.currSeq == '2') {
        this.formWidget.instance.itemOption("Result1", "editorOptions", { text: this.seqDetails["Result1"] })
        this.chkResult1 = true;
        this.chkResult2 = false;
        this.chkResult3 = false;
        this.seqDetails["Result1"] = false;
        this.ActionTypeEditable = true;
      }
    }
    else {
      this.seqDetails["ResultIsChoice"] = true;
      this.ActionTypeEditable = false;
      this.enableResult();
    }
    this.gridContainerRole.instance.refresh();

  }

  assignToDuplicate(data) {
    // copy properties from Customer to duplicateSalesHeader
    this.duplicateseqDetails = [];
    for (var i = 0, len = data.length; i < len; i++) {
      this.duplicateseqDetails["" + i] = {};
      for (var prop in data[i]) {
        this.duplicateseqDetails[i][prop] = data[i][prop];
      }
    }
  }

  enableResult() {
    this.chkResult1 = true;
    this.chkResult2 = true;
    this.chkResult3 = true;
    if (this.seqDetails["Result1"] != null || this.seqDetails["Result1"] == "") {
      this.formWidget.instance.itemOption("Result1", "editorOptions", { text: this.seqDetails["Result1"] });
    } else {
      this.chkResult1 = false;
    }
    if (this.seqDetails["Result2"] != null || this.seqDetails["Result2"] == "") {
      this.formWidget.instance.itemOption("Result2", "editorOptions", { text: this.seqDetails["Result2"] });
    } else {
      this.chkResult2 = false;
    }

    if (this.seqDetails["Result3"] == null || this.seqDetails["Result3"] == "") {
      this.formWidget.instance.itemOption("Result3", "editorOptions", { text: '' });
      if (this.currSeq == '1' || this.currSeq == '2') {
        this.chkResult3 = false;
      } else {
        this.chkResult3 = true;
      }
    } else {
      this.formWidget.instance.itemOption("Result3", "editorOptions", { text: this.seqDetails["Result3"] });
      this.chkResult3 = true;
    }
  }

  choice3_ValueChanged(e) {
    if (this.currSeq != "1" || this.currSeq != "2") {
      if (this.seqDetails["Result3"] != null) {
        if (e.value == false) {
          this.dataFromService.getServerData("ProcessFlowSetup", "chkResult3_changeHandler1", ["", this.currDocument, this.currSeq])
            .subscribe(updateFlow => {
              if (updateFlow > 0) {
                this.formWidget.instance.itemOption("Result3", "editorOptions", { text: '' });
              }
            });
        }
        else {
          this.dataFromService.getServerData("ProcessFlowSetup", "chkResult3_changeHandler2", ["", this.currDocument, this.currSeq])
            .subscribe(updateFlow => {
              if (updateFlow > 0) {
                this.formWidget.instance.itemOption("Result3", "editorOptions", { text: 'ON-HOLD' });
              }
            });
        }
      }
    }

  }

  btnAddSequence_clickHandler() {
    if (this.currDocument != null) {
      if (this.dataSourcelength == 0) {
        this.dataFromService.getServerData("ProcessFlowSetup", "btnAddSequence_clickHandler1", ["", this.currModule, this.currDocument])
          .subscribe(addSequence => {
            if (addSequence > 0) {
              this.onInsertFirstStepResponse();
            }
          });
      }
      else {
        this.dataFromService.getServerData("ProcessFlowSetup", "btnAddSequence_clickHandler2", ["", this.currDocument,
          this.dataSourcelength]).subscribe(updateSequence => {
            if (updateSequence > 0) {
              this.onUpdateForInsertResponse();
            }
          });
      }
    }
    else {
      this.toastr.warning("Please Select the Document Name First !!");
    }
  }

  onInsertFirstStepResponse() {
    this.dataFromService.getServerData("ProcessFlowSetup", "onInsertFirstStepResponse", ["", this.currModule, this.currDocument])
      .subscribe(firstresponse => {
        if (firstresponse > 0) {
          this.onInsertSecondStepResponse();
        }
      });
  }
  onInsertSecondStepResponse() {
    this.dataFromService.getServerData("ProcessFlowSetup", "onInsertSecondStepResponse", ["", this.currModule, this.currDocument])
      .subscribe(secondresponse => {
        if (secondresponse > 0) {
          this.gridContainerPF.instance.refresh();
        }
      });
  }
  onUpdateForInsertResponse() {
    this.dataFromService.getServerData("ProcessFlowSetup", "onUpdateForInsertResponse", ["", this.currModule, this.currDocument, this.dataSourcelength + 1, this.dataSourcelength - 1])
      .subscribe(onUpdate1res => {
        if (onUpdate1res > 0) {
          this.gridContainerPF.instance.refresh();
        } else {
          this.toastr.error("");
        }
      });
  }

  btnDelSequence_clickHandler() {
    if (this.currDocument != null) {
      if (this.dataSourcelength < 4) {
        this.toastr.warning("Nothing to delete!!", "Not Allowed");
      } else {
        this.dataFromService.getServerData("ProcessFlowSetup", "btnDelSequence_clickHandler", ["", this.currDocument, this.dataSourcelength - 1])
          .subscribe(onDelete => {
            if (onDelete > 0) {
              this.onUpdateForDeleteResponse();
            } else {
              this.toastr.warning("Error While Deleting the Lines Error Status Code : DELETE-ERR");
            }
          });
      }
    } else {
      this.toastr.warning("Please Select the Document Name First !!");
    }
  }

  onUpdateForDeleteResponse() {
    this.dataFromService.getServerData("ProcessFlowSetup", "onUpdateForDeleteResponse", ["", this.currDocument, this.dataSourcelength])
      .subscribe(onDelete => {
        if (onDelete > 0) {
          this.toastr.success("Deleted Successfully!!");
          this.gridContainerPF.instance.refresh();
          this.clearData();
        }
      });
  }


  clearData() {
    this.currSeq = null;
    /* this.seqDetails["ActionType"] = "";
    this.seqDetails["FlowLevel"] = "";
    this.seqDetails["FinalStep"] = false;
    this.seqDetails["ResultIsChoice"] = false; */
  }

  btnAddRole_clickHandler() {
    if (this.currSeq != null) {
      this.PopupRole = true;
      var dummyDataServive = this.dataFromService;
      this.dataSourceRolePop = new CustomStore({
        key: ["RoleID"],
        load: function (loadOptions) {
          var devru = $.Deferred();
          dummyDataServive.getServerData("globalLookup", "handleConnectedRole", [''])
            .subscribe(data => {
              devru.resolve(data);
            });
          return devru.promise();
        }
      });
    } else {
      this.toastr.warning("Please Select the Sequence First !!");
    }
  }

  onFocusedRowChangedRoleGrid(event) {
    var data = event.data;
    if (data["RoleID"] != null) {
      if (this.currDocument != null && this.currSeq != null && this.currModule != null) {
        this.dataFromService.getServerData("ProcessFlowSetup", "handleLookup", ["", data["RoleID"], this.currModule, this.currDocument, this.currSeq])
          .subscribe(onInsertRole => {
            if (onInsertRole > 0) {
              this.PopupRole = false;
              this.toastr.success("Role Inserted Successfully");
              this.gridContainerRole.instance.refresh();
            } else {
              this.toastr.error("Failed to Insert Role, Error Status Code : INSERT-ERR");
            }
          });
      } else {
        this.toastr.warning("Please Select the DocumentName/Sequence First !!");
      }
    }
  }

  onFocusedRowChangedRole(event) {
    var data = event.data;
    this.selectedRole = data["RoleID"];
  }

  btnDelRole_clickHadler() {
    if (this.selectedRole != null) {
      if (this.currDocument != null && this.currSeq != null && this.currModule != null) {
        this.dataFromService.getServerData("ProcessFlowSetup", "btnDelRole_clickHadler", ["", this.selectedRole, this.currModule, this.currDocument, this.currSeq])
          .subscribe(onDeleteRole => {
            if (onDeleteRole > 0) {
              this.toastr.success("Role Deleted Successfully!!");
              this.gridContainerRole.instance.refresh();
            } else {
              this.toastr.error("Failed to Delete Role, Error Status Code : DELETE-ERR");
            }
          });
      }
    } else {
      this.toastr.warning("Please Select the Role ID first !!");
    }
  }

  form_fieldDataChanged(event) {
    if (Object.keys(this.duplicateseqDetails).length > 0 && this.currSeq != null) {
      if ((event.value != undefined || event.value != null) && this.duplicateseqDetails[0][event.dataField] != event.value) {
        if (event.dataField == 'ActionType') {
          this.dataFromService.getServerData("ProcessFlowSetup", "updateActionType", ["", this.seqDetails["ActionType"], this.currDocument, this.currSeq])
            .subscribe(onUpdateAction => {
              if (onUpdateAction > 0) {
                this.duplicateseqDetails[0]["" + event.dataField] = event.value;
                this.toastr.success("Action Type Updated Successfully");
              } else {
                this.toastr.error("Failed to Action Type, Error Status Code : UPDATE-ERR");
              }
            });
        }else if (event.dataField == 'Result3') {
          if (this.currSeq != "1" || this.currSeq != "2") {
            if (this.seqDetails["Result3"] != null) {
              if (event.value == false) {
                this.dataFromService.getServerData("ProcessFlowSetup", "chkResult3_changeHandler1", ["", this.currDocument, this.currSeq])
                  .subscribe(updateFlow => {
                    if (updateFlow > 0) {
                      this.seqDetails["Result3"] = false;
                      this.formWidget.instance.itemOption("Result3", "editorOptions", { text: '' });
                    }
                  });
              }
              else {
                this.dataFromService.getServerData("ProcessFlowSetup", "chkResult3_changeHandler2", ["", this.currDocument, this.currSeq])
                  .subscribe(updateFlow => {
                    if (updateFlow > 0) {
                      this.seqDetails["Result3"] = true;
                      this.formWidget.instance.itemOption("Result3", "editorOptions", { text: 'ON-HOLD' });
                    }
                  });
              }
            }
          }
        }
      }
    }
  }


}

