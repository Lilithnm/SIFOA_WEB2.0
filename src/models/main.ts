import {  BaseModel, UsuarioModel } from './catalogos';
import { CentrosModel } from './generales';


export class SolicitudModel extends BaseModel
{
     Estado!: BaseModel;
     UsuarioSolicita!: UsuarioModel;
     UsuarioAutoriza!: UsuarioModel;
     CentroSolicita!: CentrosModel;
     Observaciones!: string | null;
     FechaCaptura!: string | null;
     FechaSolicitud!: string | null;
     FechaProceso!: string | null;
     FechaLibera!: string | null;
     FechaEntrega !: string | null;
     Materiales!: SolicitudMaterialesModel[];
     IdentificadorOrigen!: number;
}


export class MaterialModel extends BaseModel
{
      IdentificadorSolicitud!: number;
      Material!: string;
      TextoMaterial!: string;
      Unidad!: string;
      Grupo!: BaseModel;
}


export class SolicitudMaterialesModel extends BaseModel
{
      IdentificadorSolicitud!: number;
      Material !: MaterialModel;
      CantidadSolicitada !: number;
      CantidadSurtida!: number;
      CantidadAlmacen!: number;
      EstatusMaterial!: BaseModel;
}

export class NotificacionModel extends BaseModel
{
      UsuarioID!: number;
      Texto !: string;
      Icono !: string;
      FechaHora!: Date;
      Leida!: number;
      Centro!: CentrosModel;
      Tipo!: number; 
      Url!: string;
}
