import { Component, Input} from '@angular/core';
import {  SolicitudMaterialesModel } from '../../../models/main';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.component.html',
  styleUrls: ['./confirmar-pedido.component.scss']
})
export class ConfirmarPedidoComponent {



  @Input() materiales: SolicitudMaterialesModel[]=[];

  displayedColumns: string[] = ['Material', 'TextoMaterial', 'CantidadSolicitada', 'Unidad'];
  dataSource = this.materiales;
  constructor(   ) {
    }
  

}
