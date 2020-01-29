import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../data.service';
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  itemimagePath = '';
  popupVisible2: boolean = false;
  base64image;
  itemImageData: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dataServices: DataService
  ) { }

  ngOnInit() {
    this.getImag();
  }

  getImag() {
    this.dataServices.getServerData("ecommerce", "getLogoLocation", ["",
      UtilsForGlobalData.getUserId()]).subscribe(getCustImage => {
        this.itemImageData = getCustImage[0];
        this.itemimagePath = 'http://139.59.22.238' + this.itemImageData["ImagePath"] + this.itemImageData["ImageName"];
        console.log(this.itemimagePath);
      });
  }

  showInfo() {
    this.popupVisible2 = true;
  }

  processFile(imageInput) {
    var files = imageInput.files;
    var file = files[0];

    var t = file.type.split('/').pop().toLowerCase();
    if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
      this.toastr.error("Please select a valid image file");
    }
    else if (file.size > 1024000) {
      this.toastr.error("Max Upload size is 1MB only");
    } else {
      this.dataServices.getBase64(files[0])
        .then(gotbase64backimg => {
          this.base64image = gotbase64backimg;
          this.base64image = this.base64image.split(",")[1];
          this.dataServices.getServerData("item", "updateImageNew", ["", UtilsForGlobalData.getUserId(), this.base64image])
            .subscribe(updateImage => {
              if (updateImage == 1) {
                this.toastr.success("Logo Updated!");
              } else {
                this.toastr.error("Something went wrong!");
              }
              this.popupVisible2 = false;
              this.getImag();
            });
        }
        );
    }
  }

}
