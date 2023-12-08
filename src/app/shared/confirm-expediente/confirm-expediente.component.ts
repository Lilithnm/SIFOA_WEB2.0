import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/models/modelos';
@Component({
  selector: 'app-confirm-expediente',
  templateUrl: './confirm-expediente.component.html',
  styleUrls: ['./confirm-expediente.component.scss']
})
export class ConfirmExpedienteComponent implements OnInit {

  ambiente: string|null ="";
  constructor(
    public dialogRef: MatDialogRef<ConfirmExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 


      this.ambiente= localStorage.getItem('Ambiente');
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cerrarDialogo(): void {
    this.dialogRef.close(false);
  }
  confirmado(): void {
    this.dialogRef.close(true);
  }

}
