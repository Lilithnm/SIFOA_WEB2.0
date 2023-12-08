import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { GeneralesModel } from 'src/models/generales';
@Component({
  selector: 'app-formulario-generales',
  templateUrl: './formulario-generales.component.html',
  styleUrls: ['./formulario-generales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioGeneralesComponent implements OnInit, OnChanges {

  @Input() modGenerales: GeneralesModel = new GeneralesModel();
  Delitos = 'Delitos';
  constructor() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modGenerales'].currentValue !== changes['modGenerales'].previousValue)
    {
      this.Delitos = (this.modGenerales.Expediente.Sistema !== 12 && this.modGenerales.Expediente.Sistema !== 13)  ? 'Delitos' : 'Acciones procesales';
    }
  }

  ngOnInit(): void {
  }

}
