import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule,
  DxDateBoxModule
} from 'devextreme-angular';
import { FormioModule } from 'angular-formio';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule
} from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';

import { SalesorderListComponent } from './salesorder-list/salesorder-list.component';
import { SalesorderDetailsComponent } from './salesorder-details/salesorder-details.component';
import { SalesRoutes } from './sales.routing';
import { FilterPipe } from './customer-list/filter.pipe';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { SalesreturnListComponent } from './salesreturn-list/salesreturn-list.component';
import { SalesreturnDetailsComponent } from './salesreturn-details/salesreturn-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { SalesQuoteListComponent } from './sales-quote-list/sales-quote-list.component';
import { SalesQuoteDetailsComponent } from './sales-quote-details/sales-quote-details.component';
import { CustomerGroupSetupComponent } from './customer-group-setup/customer-group-setup.component';
import { ManageSalesListComponent } from './manage-sales-list/manage-sales-list.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(SalesRoutes),
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxPopupModule,
    DxValidatorModule,
    NgxPaginationModule,
    ClickOutsideModule,
    FormioModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  declarations: [
    SalesorderListComponent,
    SalesorderDetailsComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    FilterPipe,
    SalesreturnListComponent,
    SalesreturnDetailsComponent,
    SalesQuoteListComponent,
    SalesQuoteDetailsComponent,
    CustomerGroupSetupComponent,
    ManageSalesListComponent
  ],
  providers: [
    AuthGuardService
  ],
})
export class SalesModule { }
