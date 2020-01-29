import { Component, Injectable, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import 'rxjs/add/operator/map';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
@Injectable()
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any = [];

  roleId: String = UtilsForGlobalData.getUserRoleId();
  menuLevel1: any = [];
  menuLevel2: any = [];
  menuLevel3: any = [];

  ROUTES: RouteInfo[] = [];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public dataServices: DataService,
  ) { }
  // End open close
  ngOnInit() {
    this.getData();
  }

  getData() {
    var devru1 = $.Deferred();
    this.dataServices.getServerData("globalData", "menus", ['', this.roleId])
      .subscribe(data => {
        devru1.resolve(data);
        this.menuLevel1 = data;
        this.menuLevel1 = JSON.parse(this.menuLevel1);

      });
    this.getMenuLevel2Data();




  }
  getMenuLevel2Data() {
    var devru2 = $.Deferred();
    this.dataServices.getServerData("globalData", "menu2", ['', this.roleId])
      .subscribe(data => {
        devru2.resolve(data);
        this.menuLevel2 = data;
        this.menuLevel2 = JSON.parse(this.menuLevel2);
        this.getMenuLevel3Data();
      });
  }

  getMenuLevel3Data() {
    var devru3 = $.Deferred();
    this.dataServices.getServerData("globalData", "menu3", ['', this.roleId])
      .subscribe(data => {
        devru3.resolve(data);
        this.menuLevel3 = data;
        this.menuLevel3 = JSON.parse(this.menuLevel3);
        this.compareDataSet1();

      });

  }

  compareDataSet1() {

    for (var i = 0; i < Object.keys(this.menuLevel1).length; i++) {
      this.menuLevel1[i]['submenu'] = [];
      for (var j = 0; j < Object.keys(this.menuLevel2).length; j++) {
        this.menuLevel2[j]['submenu'] = [];
        if (this.menuLevel2[j]['pid'] == this.menuLevel1[i]['id']) {

          this.menuLevel1[i]['submenu'].push(this.menuLevel2[j]);
        }
      }
    }
    this.compareDataSet2();
  }

  compareDataSet2() {
    for (var i = 0; i < Object.keys(this.menuLevel1).length; i++) {
      for (var j = 0; j < Object.keys(this.menuLevel1[i]['submenu']).length; j++) {
        this.menuLevel1[i]['submenu'][j]['submenu'] = [];
        for (var k = 0; k < Object.keys(this.menuLevel3).length; k++) {
          this.menuLevel3[k]['submenu'] = [];
          if (this.menuLevel3[k]['pid'] == this.menuLevel1[i]['submenu'][j]['id']) {
            this.menuLevel1[i]['submenu'][j]['submenu'].push(this.menuLevel3[k]);
          }
        }
      }

    }

    this.ROUTES = this.menuLevel1;
    ROUTES.values = this.menuLevel1;
    UtilsForGlobalData.setLocalStorageKey('getJsonRouter', JSON.stringify(this.menuLevel1));
    this.assignmenu();
  }

  assignmenu() {
    this.sidebarnavItems = this.ROUTES.filter(sidebarnavitem => sidebarnavitem);

    $(function () {
      $('.sidebartoggler').on('click', function () {
        if ($('#main-wrapper').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('#main-wrapper').addClass('mini-sidebar');
        } else {
          $('body').trigger('resize');
          $('#main-wrapper').removeClass('mini-sidebar');
        }
      });
    });

  }

}






