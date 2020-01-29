import { Component, AfterViewInit, Input } from '@angular/core';
import { RouteInfo } from '../../shared/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { DataService } from '../../data.service';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import UtilsForSuggestion from '../../Utility/UtilsForSuggestion';
import UtilsForGlobalData from '../../Utility/UtilsForGlobalData';

let sidesubmenu: any = [];
let sidesubmenul2: any = [];

const data: any = require('./data.json');
declare var $: any;

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css'],
  providers: [DatePipe]
})
export class Dashboard1Component implements AfterViewInit {
  @Input()
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any = [];
  globalData: Object;
  roleId: String = UtilsForGlobalData.getUserRoleId();
  userID: String = UtilsForGlobalData.getUserId();
  slectedMenu: any = null;
  slectedMenu2: any = null;
  submenuV = false;
  slectedMenu3: any = [];
  globalDataTest: any = [];
  slectedMenu4: Object;
  subtitle: string;
  globalDataTest2: any = [];
  arrchanged: any;
  resultArr: any;
  globalDataTest3: any = [];
  ROUTES: RouteInfo[] = [];
  menuSugesstionforSearch: any;
  DataforAccountTable: any;
  netProfit: any;
  netProfitperc;
  grossProfit: any;
  currentDate: String = UtilsForGlobalData.getCurrentDate();
  pieChartforAP = [];
  pieChartforAPlables = [];
  pieChartforAR = [];
  pieChartforARlables = [];
  FormDate: any = {};
  getDataforRowOne: any;
  getDataforRowTwobyOne: any;
  getDataforRowTwobyTwo: any;
  getDataforRowTwobyThree: any;
  getDataforRowTwobyFive: any;
  getDataforRowTwobyFour: any;
  dataforTopCustomers: any;
  dataforTopVendors: any;
  dataforRowOne: any;
  dataforRowOneR: any;
  dataforRowOneO: any;
  dataforRowOneU: any;
  dataforRowtwoP: string;
  dataforRowtwoA: string;
  dataforRowtwoI: string;
  dataforRowtwoO: string;
  dataforRowtwoCost;
  dataforRowtwoOrders: string;
  newElementforArray: {};
  dataforRowtwoPOO: string;
  dataforRowtwoPOA: string;
  dataforRowtwoPOR: string;
  dataforRowtwoPOI: string;
  dataforRowtwoPOP: string;
  DataforCurrentRatio: any;
  currentRatio: number;
  public lineChartData2 = null;
  netProfitforGraph: any;
  datarrayfordashboard2: any;
  data0: Number = 0;
  data1: Number = 0;
  data2: Number = 0;
  cssStringVar: any;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    public dataServices: DataService
  ) {

    window.addEventListener('beforeunload', (event) => {
      event.returnValue = `Are you sure you want to leave?`;
    });

    if (localStorage.getItem("accessToken") === null) {
      this.router.navigate(['/']);
    }
  }

  addExpandClass(element: any) {
    this.slectedMenu2 = [];
    let jsonObj: any = this.sidebarnavItems;
    for (let prop in jsonObj) {
      sidesubmenu = jsonObj[prop].submenu;

      for (let prop2 in sidesubmenu) {

        if (sidesubmenu[prop2]['pid'] === element) {
          this.slectedMenu = sidesubmenu;
          break;
        }


      }
    }
  }
  addActiveClass(element: any) {
    let jsonObj: any = this.sidebarnavItems;
    for (let prop in jsonObj) {
      sidesubmenu = jsonObj[prop].submenu;
      for (let prop2 in sidesubmenu) {
        if (sidesubmenu[prop2]['pid'] === element) {
          this.slectedMenu = sidesubmenu;
          break;
        }
        sidesubmenul2 = sidesubmenu[prop2].submenu;
        for (let prop3 in sidesubmenul2) {
          if (sidesubmenul2[prop3]['pid'] === element) {
            this.slectedMenu2 = sidesubmenul2;
            break;
          }
        }
      }
    }
  }

  ngOnInit() {
    var date = new Date();
    this.FormDate.DocumentFromDate = date.setDate(date.getDate() - 180);
    this.FormDate.DocumentToDate = new Date();

    this.FormDate.DocumentFromDate = this.datePipe.transform(this.FormDate.DocumentFromDate, 'yyyy-MM-dd');
    this.FormDate.DocumentToDate = this.datePipe.transform(this.FormDate.DocumentToDate, 'yyyy-MM-dd');

    this.getGlobalData();
    this.getDataforAccountTable();
    this.getdataforARGraph();
    this.getdataforAPGraph();
    this.getDataforCurrentR();
  }

  getdataforAPGraph() {
    this.dataServices.getServerData("Dashboard2_Reports", "stat_apoverdue", ['', this.currentDate, this.userID])
      .subscribe(stat_apoverdue => {
        this.pieChartforAP = Object.values(stat_apoverdue[1][0]);
      });
  }

  getdataforARGraph() {
    this.dataServices.getServerData("Dashboard2_Reports", "stat_aroverdue", ['', this.currentDate, this.userID])
      .subscribe(stat_aroverdue => {
        this.pieChartforAR = Object.values(stat_aroverdue[1][0]);
      });
  }

  getGlobalData() {
    var devru = $.Deferred();
    this.dataServices.getServerData("globalData", "menus", ['', this.roleId])
      .subscribe(data => {
        devru.resolve(data);
        this.globalDataTest = data;
        this.globalDataTest = JSON.parse(this.globalDataTest);
        this.getGlobalData2();
      });

  }

  getDataforCurrentR() {
    this.dataServices.getServerData("dashboardNew", "getDataforCurrentRatio", ['', this.userID])
      .subscribe(getDataforCurrentRatio => {
        this.DataforCurrentRatio = getDataforCurrentRatio[1];
        this.currentRatio = Number(this.DataforCurrentRatio[0]["CURRENT RATIO"]);
        this.currentRatio = -(this.currentRatio);
      });
  }

  getDataforAccountTable() {
    this.dataServices.getServerData("dashboardNew", "getDataforAccountTable", ['', this.userID])
      .subscribe(getDataforAccountTable => {
        this.DataforAccountTable = getDataforAccountTable[1];
        if (this.DataforAccountTable[1] == undefined) {
          this.data1 = 0;
        } else {
          this.data1 = this.DataforAccountTable[1]["FY_AMT"];
        }
        if (this.DataforAccountTable[0] == undefined) {
          this.data0 = 0;
        } else {
          this.data0 = this.DataforAccountTable[0]["FY_AMT"];
        }
        if (this.DataforAccountTable[2] == undefined) {
          this.data2 = 0;
        } else {
          this.data2 = this.DataforAccountTable[2]["FY_AMT"];
        }

        this.netProfit = Number((-1) * Number(this.data1) - (Number(this.data0) + Number(this.data2))).toFixed(2);
        if (this.netProfit > 0) {
          this.cssStringVar = 'green-color';
        } else {
          this.cssStringVar = 'red-color';
        }
        this.newElementforArray = {};
        this.newElementforArray["MainType"] = "TOTAL";
        this.newElementforArray["FY_AMT"] = this.netProfit;
        this.newElementforArray["PY_AMT"] = "0";

        this.netProfitperc = (Number(this.netProfit / Number(this.data1))).toFixed(2);
        this.netProfitforGraph = this.netProfit;
        this.netProfit = this.formatNumber(this.netProfit);

        this.DataforAccountTable.push(this.newElementforArray);


        this.grossProfit = Number(Number(-(this.data1)) - Number(this.data2)).toFixed(2);
        this.grossProfit = this.formatNumber(this.grossProfit);

        if (this.grossProfit > 0) {
          this.cssStringVar = 'red-color';
        } else {
          this.cssStringVar = 'green-color';
        }

        this.DataforAccountTable[0]["FY_AMT"] = -(this.DataforAccountTable[0]["FY_AMT"]);
        this.DataforAccountTable[1]["FY_AMT"] = -(this.DataforAccountTable[1]["FY_AMT"]);
        this.DataforAccountTable[2]["FY_AMT"] = Number(this.DataforAccountTable[2]["FY_AMT"]).toFixed(2);

        this.lineChartData2 = [
          { data: [String(this.DataforAccountTable[1]["FY_AMT"])], label: 'Revenue' },
          { data: [String(this.DataforAccountTable[0]["FY_AMT"])], label: 'Expense' },
          { data: [this.DataforAccountTable[2]["FY_AMT"]], label: 'COGS' },
          { data: [this.netProfitforGraph], label: 'Net Profit' }
        ];

        // for (var i = 0; i < Object.keys(this.DataforAccountTable).length; i++) {
        //   this.DataforAccountTable[i]["FY_AMT"] = -this.DataforAccountTable[i]["FY_AMT"];
        // }

      });
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


  getGlobalData2() {
    var devru = $.Deferred();
    this.dataServices.getServerData("globalData", "menu2", ['', this.roleId])
      .subscribe(data => {
        devru.resolve(data);
        this.globalDataTest2 = data;
        this.globalDataTest2 = JSON.parse(this.globalDataTest2);
        this.getGlobalData3();
      });



  }


  getGlobalData3() {
    var devru = $.Deferred();
    this.dataServices.getServerData("globalData", "menu3", ['', this.roleId])
      .subscribe(data => {
        devru.resolve(data);
        this.globalDataTest3 = data;
        this.globalDataTest3 = JSON.parse(this.globalDataTest3);
        this.compareData();
        this.getSuggessionforSearch();
      });
  }

  getSuggessionforSearch() {
    this.dataServices.getServerData("globalData", "searchSuggession", ['', this.roleId])
      .subscribe(data => {
        this.menuSugesstionforSearch = new DataSource({
          store: <String[]>data,
          paginate: true,
          pageSize: 10
        });
      });
  }

  compareData() {

    for (var i = 0; i < Object.keys(this.globalDataTest).length; i++) {
      this.globalDataTest[i]['submenu'] = [];
      for (var j = 0; j < Object.keys(this.globalDataTest2).length; j++) {
        this.globalDataTest2[j]['submenu'] = [];
        if (this.globalDataTest2[j]['pid'] == this.globalDataTest[i]['id']) {
          this.globalDataTest[i]['submenu'].push(this.globalDataTest2[j]);
        }
      }
    }


    this.compareData1();
  }

  compareData1() {
    for (var i = 0; i < Object.keys(this.globalDataTest).length; i++) {
      for (var j = 0; j < Object.keys(this.globalDataTest[i]['submenu']).length; j++) {
        this.globalDataTest[i]['submenu'][j]['submenu'] = [];
        for (var k = 0; k < Object.keys(this.globalDataTest3).length; k++) {
          this.globalDataTest3[k]['submenu'] = [];
          if (this.globalDataTest3[k]['pid'] == this.globalDataTest[i]['submenu'][j]['id']) {
            this.globalDataTest[i]['submenu'][j]['submenu'].push(this.globalDataTest3[k]);
          }
        }
      }

    }
    this.ROUTES = this.globalDataTest;
    this.assignmenu();
  }

  assignmenu() {

    this.sidebarnavItems = this.ROUTES.filter(sidebarnavitem => sidebarnavitem);



    $(function () {
      $('.sidebartoggler').on('click', function () {
        if ($('#main-wrapper').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('#main-wrapper').removeClass('mini-sidebar');
        } else {
          $('body').trigger('resize');
          $('#main-wrapper').addClass('mini-sidebar');
        }
      });
    });


  }

  suggestionFormateForSearch(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "title");
  }

  suggestionFormate(data) {
    return UtilsForSuggestion.autoFillSuggestionsFormatFor1(data, "path");
  }

  hover(data) {
    return UtilsForSuggestion.hoverSuggestionsFormatFor1(data, "title");
  }

  onSearchValueChanged(event) {
    if (event.event == undefined) {
      this.router.navigate([event.value]);
    }
  }

  formSummary_fieldDataChanged(e) {
    if ((e.value != undefined || e.value != null)) {
      if (e.dataField == "DocumentFromDate") {
        this.FormDate.DocumentFromDate = e.value;
        this.getDataforRow1();
      }
      if (e.dataField == "DocumentToDate") {
        this.FormDate.DocumentToDate = e.value;
        this.getDataforRow1();
      }
    }
  }


  onTabChange(event: NgbTabChangeEvent) {
    if (event.nextId == 'Operations') {
      this.getDataforRow1();
    }
  }



  getDataforRow1() {
    this.dataServices.getServerData("Dashboard2_Reports1", "stat_dashboard2_1", ['', this.FormDate.DocumentFromDate, this.FormDate.DocumentToDate, this.userID])
      .subscribe(stat_dashboard2_1 => {
        this.dataforTopCustomers = stat_dashboard2_1[5];
        this.datarrayfordashboard2 = stat_dashboard2_1[13];
        this.dataforTopVendors = stat_dashboard2_1[9];
        for (var i = 0; i < Object.keys(this.dataforTopVendors).length; i++) {
          this.dataforTopVendors[i]["Amount"] = -this.dataforTopVendors[i]["Amount"];
        }

        this.dataforRowOneR = Number(stat_dashboard2_1[1][0]["VALUE"]).toFixed(2);
        this.dataforRowOneR = this.formatNumber(this.dataforRowOneR);
        this.dataforRowOneO = Number(stat_dashboard2_1[1][1]["VALUE"]).toFixed(0);
        this.dataforRowOneU = Number(stat_dashboard2_1[1][2]["VALUE"]).toFixed(0);


        this.dataforRowtwoP = Number(stat_dashboard2_1[3][0]["VALUE"]).toFixed(0);
        this.dataforRowtwoA = Number(stat_dashboard2_1[3][4]["VALUE"]).toFixed(0);
        this.dataforRowtwoO = Number(stat_dashboard2_1[3][1]["VALUE"]).toFixed(0);
        this.dataforRowtwoI = Number(stat_dashboard2_1[3][5]["VALUE"]).toFixed(0);

        this.dataforRowtwoCost = -(Number(stat_dashboard2_1[7][0]["VALUE"]).toFixed(0));
        this.dataforRowtwoCost = this.formatNumber(this.dataforRowtwoCost);
        this.dataforRowtwoOrders = Number(stat_dashboard2_1[7][1]["VALUE"]).toFixed(0);

        this.dataforRowtwoPOO = Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "OPEN").VALUE).toFixed(0);
        this.dataforRowtwoPOA = Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "APPROVED").VALUE).toFixed(0);
        this.dataforRowtwoPOR = Number(Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "GRCOMPLETE").VALUE) + Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "GRPARTIAL").VALUE)).toFixed(0);
        this.dataforRowtwoPOI = Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "INVOICED").VALUE).toFixed(0);
        this.dataforRowtwoPOP = Number(this.datarrayfordashboard2.find(item => item.DOCUMENTTYPE == "PAID").VALUE).toFixed(0);

      });
  }

  ngAfterViewInit() { }

  // This is for the dashboar line chart
  // lineChart
  public lineChartData: Array<any> = [
    { data: [50, 130, 80, 70, 180, 105, 250, 80, 90, 120, 80, 220], label: 'Cash IN' },
    { data: [80, 100, 60, 200, 150, 100, 150, 80, 70, 180, 105, 150], label: 'Cash OUT' }
  ];


  public lineChartLabels: Array<any> = [
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar'
  ];
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          scaleLabel: { labelString: 'number of months ' },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: 'rgba(120, 130, 140, 0.13)'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            color: 'rgba(120, 130, 140, 0.13)'
          }
        }
      ]
    },
    lineTension: 10,
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(36,210,181,0)',
      borderColor: 'rgba(36,210,181,1)',
      pointBackgroundColor: 'rgba(36,210,181,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(36,210,181,0.5)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(32,174,227,0)',
      borderColor: 'rgba(32,174,227,1)',
      pointBackgroundColor: 'rgba(32,174,227,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(32,174,227,0.5)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(103,114,229,0)',
      borderColor: 'rgba(103,114,229,1)',
      pointBackgroundColor: 'rgba(103,114,229,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103,114,229,0.5)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  // bar chart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    barThickness: 5
  };

  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [100, 200, 100, 300], label: 'Iphone 8' },
    { data: [130, 100, 140, 200], label: 'Iphone X' }
  ];
  public barChartColors: Array<any> = [
    { backgroundColor: '#FF5C6C' },
    { backgroundColor: '#00ACEB' },
    { backgroundColor: '#F4B81D' },
    { backgroundColor: '#24d2b5' }
  ];

  // This is for the donute chart
  donuteChart1: Chart = {
    type: 'Pie',
    data: data['Pie'],
    options: {
      donut: true,
      showLabel: false,
      donutWidth: 30
    }
    // events: {
    //   draw(data: any): boolean {
    //     return data;
    //   }
    // }
  };

  // Doughnut
  public doughnutChartLabels: string[] = ['AR', 'AP'];

  public doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';

  // Sales Analytics Pie chart
  public pieChartLabels: string[] = ['current', '1-30Days', '31-60Days', '61-90Days', 'MoreThan90Days']
  public pieChartType = 'pie';

}