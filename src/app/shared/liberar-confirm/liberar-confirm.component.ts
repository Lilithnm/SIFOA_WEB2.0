import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeneficiarioMinModel, DialogData } from 'src/app/models/modelos';

@Component({
  selector: 'app-liberar-confirm',
  templateUrl: './liberar-confirm.component.html',
  styleUrls: ['./liberar-confirm.component.scss']
})
export class LiberarConfirmComponent implements OnInit {

  @Input() Titulo!: string;
  @Input() Text!: string;
  Beneficiarios: BeneficiarioMinModel[]=[];
  
  constructor(
    public dialogRef: MatDialogRef<LiberarConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {Beneficiarios:BeneficiarioMinModel[]}) {
      this.Beneficiarios  = data.Beneficiarios;
      console.log(this.Beneficiarios)
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
