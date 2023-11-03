import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CoordinadorRoutingModule } from './coordinador-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';


import { NgxSpinnerModule } from 'ngx-spinner';
import { SolicitudesTablaComponent } from './solicitud/solicitudes-tabla.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { AdministraSolicitudesComponent } from './administra-solicitudes/administra-solicitudes.component';


import { ConfirmarPedidoComponent } from './confirmar-pedido/confirmar-pedido.component';

import { SurtePedidoComponent } from './surte-pedido/surte-pedido.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdministraPeriodosComponent } from './administra-periodos/administra-periodos.component';
import { SolicitudesHistorialComponent } from './solicitudes-historial/solicitudes-historial.component';


@NgModule({
  declarations: [
      DashboardComponent,
      SolicitudesTablaComponent,
      NuevaSolicitudComponent,
      ConfirmarPedidoComponent,
      AdministraSolicitudesComponent,
      AdministraPeriodosComponent,
      SolicitudesHistorialComponent,
      SurtePedidoComponent
    ],
  imports: [
    CommonModule,
    CoordinadorRoutingModule,
    SweetAlert2Module.forRoot(),
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    MatIconModule,
    MatButtonModule,
    NgApexchartsModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatDialogModule,
    MatMenuModule,
    MatSortModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressBarModule,
    ComponentsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ComponentsModule,
    MatAutocompleteModule

  ],
})
export class CoordinadorModule {}