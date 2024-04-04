import { AdminRoutingModule } from './admin-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { MAT_DATE_LOCALE, MatOption, MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {  MatAutocompleteModule } from '@angular/material/autocomplete';
import { MainComponent } from './dashboard/main.component';
import { ComponentsModule } from '../shared/components/components.module';
import { GeneralesComponent } from './generales/generales.component';
import { PersonajesComponent } from './generales/personajes/personajes.component';
import { DomicilioComponent } from './generales/domicilio/domicilio.component';
import { ConfirmExpedienteComponent } from '../shared/confirm-expediente/confirm-expediente.component';
import { AnexosComponent } from './operacion/anexos/anexos.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormAnexoComponent } from './operacion/anexos/form-anexo/form-anexo.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ModalComponent } from '../shared/modal/modal.component';
import { LiberarConfirmComponent } from '../shared/liberar-confirm/liberar-confirm.component';
import { EditarAnexoComponent } from './operacion/anexos/editar-anexo/editar-anexo.component';
import { CanjearAnexo } from './operacion/anexos/canjear-anexo/canjear-anexo.component';
import { GarantiasComponent } from './operacion/garantias/garantias.component';
import { FormGarantiaComponent } from './operacion/garantias/form-garantia/form-garantia.component';
import { DepositosGarantiaComponent } from './operacion/garantias/depositos-garantia/depositos-garantia.component';
import { EditarGarantiaComponent } from './operacion/garantias/editar-garantia/editar-garantia.component';
import { EventService } from 'src/services/shared/event.service';



@NgModule({
  declarations: [   
    MainComponent,
    GeneralesComponent,
    PersonajesComponent,
    DomicilioComponent,
    SpinnerComponent,
    ConfirmExpedienteComponent,
    ModalComponent,
    AnexosComponent,
    FormAnexoComponent,
    EditarAnexoComponent,
    CanjearAnexo,
    LiberarConfirmComponent,
    GarantiasComponent,
    FormGarantiaComponent,
    EditarGarantiaComponent,
    DepositosGarantiaComponent

  ],
  imports: [
    CurrencyMaskModule,
    MatDialogModule,
    CommonModule, 
    MatCheckboxModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    ComponentsModule,
    AdminRoutingModule, 
    NgxDatatableModule,
    MatIconModule,    
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
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    CommonModule,
    NgxSpinnerModule,
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
    MatOptionModule,
    MatTabsModule,
    MatProgressSpinnerModule   
  ],     
   providers: [
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: []},
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    EventService
]
})
export class AdminModule {}


