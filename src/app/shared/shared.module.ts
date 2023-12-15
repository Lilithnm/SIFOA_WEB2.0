import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { FeatherIconsModule } from './components/feather-icons/feather-icons.module';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from './modal/modal.component';
import { LiberarConfirmComponent } from './liberar-confirm/liberar-confirm.component';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ModalComponent,
    LiberarConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FeatherIconsModule,
    MatIconModule,
    MatListModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FeatherIconsModule,
  ],
})
export class SharedModule {}
