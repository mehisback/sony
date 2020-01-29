import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import {
  DxDataGridModule, DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule, DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent, DxSelectBoxModule, DxButtonModule, DxNumberBoxModule
} from 'devextreme-angular';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SpinnerComponent } from './shared/spinner.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserIdleModule } from 'angular-user-idle';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { FormioModule } from 'angular-formio';
//import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { MatButtonModule, MatCheckboxModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatIconModule } from '@angular/material';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopupModule,
    DxValidatorModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxFormModule,
    DxButtonModule,
    NgxPaginationModule,
    DxNumberBoxModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    UserIdleModule.forRoot({ idle: 600, timeout: 300, ping: 0 }),
    FormioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatCheckboxModule,
    MatStepperModule,
    /* WebBluetoothModule.forRoot({
      enableTracing: true
    }), */
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    LoginComponent,
    NavigationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
