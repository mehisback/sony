import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import DataSource from "devextreme/data/data_source";
import { ServiceItemListHttpDataService } from './service-item-list-http-data.service';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';


@Component({
  selector: 'app-service-item-list',
  templateUrl: './service-item-list.component.html',
  styleUrls: ['./service-item-list.component.css']
})
export class ServiceItemListComponent implements OnInit {
  @ViewChild(DxFormComponent) formWidget: DxFormComponent;

  itemList: any;
  searchText;
  p;
  newItemDetail: any = {};
  popupVisible: boolean = false;
  itemFamilySuggestions: DataSource;
  categorySuggestions: DataSource;
  subcategorySuggestions: DataSource;

  constructor(
    private httpDataService: ServiceItemListHttpDataService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.httpDataService.getServiceItemList([""])
      .subscribe(GotItemList => {
        for (var i = 0; i < Object.keys(GotItemList).length; i++) {
          GotItemList[i]["UnitPrice"] = parseFloat(GotItemList[i]["UnitPrice"]).toFixed(2);
        }
        this.itemList = GotItemList;
      });

    this.httpDataService.handleConnectedvatPrdGrp([""])
      .subscribe(getBrand => {
        this.itemFamilySuggestions = new DataSource({
          store: <String[]>getBrand,
          paginate: true,
          pageSize: 10
        });
      });


    this.httpDataService.handleConnectedGENPOLICY([""])
      .subscribe(category => {
        this.categorySuggestions = new DataSource({
          store: <String[]>category,
          paginate: true,
          pageSize: 10
        });
      });
  }

  itemCode(user: string) {
    UtilsForGlobalData.setLocalStorageKey('ServiceCode', user);
    this.router.navigate(['/purchases/service-item-details']);
  }

  showInfo() {
    this.popupVisible = true;
    this.newItemDetail = {};
  }

  onDropDownChange(event,dataField){
    if(event.value != null){
      this.newItemDetail[dataField] = event.value;
    }
  }

  suggestionFormatForCode(data){
    return UtilsForSuggestion.autoFillSuggestionsFormatFor2(data,"Code","Description");
  }

  Save() {
    this.formWidget.instance.updateData(this.newItemDetail);
    var data = this.formWidget.instance.option("formData");
    if (Object.keys(data).length != 0) {
      if (data["Code"]) {
        this.httpDataService.insertNewServiceItem(["",
          data["Code"],
          data["TaxGroup"],
          data["PolicyGroup"]]).subscribe(dataStatus => {
            if (dataStatus > 0) {
              this.toastr.success("Service Code added Suucessfully");
              UtilsForGlobalData.setLocalStorageKey('ServiceCode', data["Code"]);
              this.router.navigate(['/purchases/service-item-details']);
            } else {
              this.toastr.warning("Duplicate Service Code");
            }
          });
      } else {
        this.toastr.warning("Service Code is Empty!!");
      }
    }
  }

}
