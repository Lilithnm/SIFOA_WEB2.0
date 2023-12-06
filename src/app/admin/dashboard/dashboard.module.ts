import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentsModule } from './../../shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { MatOption, MatOptionModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {  MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    MainComponent,
    SpinnerComponent,
  ],
  imports: [
    MatAutocompleteModule,
    MatCheckboxModule,
    CommonModule,
    NgxSpinnerModule,
    DashboardRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgScrollbarModule,
    MatIconModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
    MatOptionModule
  ],
})
export class DashboardModule {}
