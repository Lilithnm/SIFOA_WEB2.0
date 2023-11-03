import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {  MaterialModel, SolicitudMaterialesModel, SolicitudModel } from '../../../models/main';
import { CatalogoService } from '../../../services/shared/catalogo.service';
import { BaseModel } from '../../../models/catalogos';

@Component({
  selector: 'app-surte-pedido',
  templateUrl: './surte-pedido.component.html',
  styleUrls: ['./surte-pedido.component.scss']
})
export class SurtePedidoComponent implements OnInit {

    estadoMaterial: BaseModel[] = [];

   @Input() solicitud: SolicitudModel = new SolicitudModel(0);

   public cantidades: any={}
   public estatus: any ={}
   public justifica: any ={}
   public activo: any ={}
    displayedColumns: string[] = ['Material', 'TextoMaterial','CantidadSolicitada','Unidad','CantidadSurtida', 
                                  'EstatusMaterial.Identificador','EstatusMaterial'];

  constructor( private svcCatalogos: CatalogoService   ) {
    this.obtieneEstados()

    }  
  ngOnInit(): void {    
    let contador =0;
    this.solicitud.Materiales;
    this.solicitud.Materiales.forEach(material => {
      this.estatus[contador]= 2
      this.cantidades[contador] = material.CantidadSolicitada
      material.CantidadSurtida = material.CantidadSolicitada
      material.EstatusMaterial.Identificador = 2
      this.activo[contador]=false;
      contador++; 
    });
  }

  obtieneEstados(){
 
    this.svcCatalogos.ObtenerCatalogo(new BaseModel(0), 5).subscribe(cat => {
          this.estadoMaterial = cat
       });
  }
  cambiaCantidad(index: number){
    if(this.cantidades[index]==0){
      this.estatus[index]= 4;      
    }
    if(this.cantidades[index] == this.solicitud.Materiales[index].CantidadSolicitada){
      this.estatus[index]= 2
    }
    if(this.cantidades[index]>0 &&this.cantidades[index] < this.solicitud.Materiales[index].CantidadSolicitada){
      this.estatus[index]= 3
    }    
    this.solicitud.Materiales[index].EstatusMaterial.Identificador = this.estatus[index];
    this.solicitud.Materiales[index].CantidadSurtida = this.cantidades[index];
  }


  cambiaEstatus(index: number){
    if(this.estatus[index] == 5 || this.estatus[index] == 4){
      this.cantidades[index]=0
     }
    if(this.estatus[index] == 2){
        this.cantidades[index]= this.solicitud.Materiales[index].CantidadSolicitada; 
    }   
    this.solicitud.Materiales[index].EstatusMaterial.Identificador = this.estatus[index];
    this.solicitud.Materiales[index].CantidadSurtida = this.cantidades[index];
  }

  cambiaJustifica(index: number){
   if(this.justifica[index]){    
    this.solicitud.Materiales[index].EstatusMaterial.Identificador = 5
    this.solicitud.Materiales[index].CantidadSurtida = 0   
    this.estatus[index]= 5
    this.cantidades[index] = 0
    this.activo[index]= true;
   }else{
    this.solicitud.Materiales[index].EstatusMaterial.Identificador = 4
    this.estatus[index]= 4
    this.activo[index]= false;
   }
  }

}

