import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { DxSelectBoxModule,
  DxTextAreaModule,DxCheckBoxModule,
  DxFormModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxAutocompleteModule,
  DxValidatorModule  } from 'devextreme-angular';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(DashboardRoutes),
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    DxValidatorModule,
    DxAutocompleteModule
  ],
  declarations: [
    Dashboard1Component
  ],
  providers: [
    AuthGuardService
  ]
})
export class DashboardModule {}
