import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { ArchwizardModule } from 'angular-archwizard';
import {
  DxSelectBoxModule,
  DxTextAreaModule, DxCheckBoxModule,
  DxFormModule,
  DxProgressBarModule,
  DxFormComponent,
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxValidatorModule,
  DxNumberBoxModule,
  DxTooltipModule,
  DxPieChartModule,
  DxDateBoxModule,
  DxValidationSummaryModule
} from 'devextreme-angular';
import { SetupComponent } from './setup/setup.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxNumberBoxModule,
    DxTooltipModule,
    DxPieChartModule,
    DxDateBoxModule,
    DxProgressBarModule,
    ArchwizardModule
  ],
  declarations: [
    NotFoundComponent,
    LoginComponent,
    SetupComponent,
  ]
})
export class AuthenticationModule { }
