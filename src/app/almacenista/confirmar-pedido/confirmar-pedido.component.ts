import { Component, Input, OnInit} from '@angular/core';
import {  SolicitudMaterialesModel, SolicitudModel } from '../../../models/main';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.component.html',
  styleUrls: ['./confirmar-pedido.component.scss']
})
export class ConfirmarPedidoComponent  implements OnInit{



  @Input() solicitud: SolicitudModel = new SolicitudModel(0);
  materiales: SolicitudMaterialesModel[]=[]
  matFiltrados: SolicitudMaterialesModel[]=[];

  displayedColumns: string[] = ['Surtido','Material', 'TextoMaterial', 'CantidadSolicitada', 'Unidad'];
  dataSource = this.matFiltrados;
  constructor(   ) {

    }
  ngOnInit(): void {
    
    this.materiales = this.solicitud.Materiales;
    this.matFiltrados =  this.materiales.filter(mat => mat.CantidadSurtida > 0);


  }

  

}
