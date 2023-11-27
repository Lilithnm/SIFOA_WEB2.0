import { BaseModel, CentrosModel } from './catalogos';

export class InformacionTablaModel {
    Nombres: string[] = [];
    Propiedades: any[] = [];
}

export class AccionesModel {
    name!: string;
    value!: string;
    element !: any;
}

export class FileModel {
    Identificador!: number;
    Token!: string;
    Estatus!: number;
}

export class BusquedaRequestModel {
    dttFechaInicial!: Date | string | undefined;
    dttFechaFinal!: Date | string | undefined;
    intCentro!: number;
    intTipo!: number;
}

export class UsuarioModel extends BaseModel {
    Tickets!: TicketModel[];
    Rol!: Rol;
    Token!: string;
}

export class UsuarioMinModel {
    Id!: string;
    Nick!: string;
    Pass!: string;

    constructor(id: string, nick: string, pass: string) {
        this.Id = id;
        this.Nick = nick;
        this.Pass = pass;
    }
}

export class TicketModel extends BaseModel {
    Oficina!: CentrosModel;
    Rol!: BaseModel;
    Plataforma!: BaseModel;
    Modulos!: BaseModel[];
  Centro: any;
}


export class OficinaModel extends BaseModel {
    Clave!: string;
}

export interface DialogData {
    Title: string;
    Text: string;
    Text2: string;
    Text3: string;
  }


export class BeneficiarioMinModel{
    NombreCompleto!: string;
    Estatus!: string;
}

export enum Rol {
    Administrador = 'Administrador',
    Juez = 'Juez',
    Secretario = 'Secretario',
    Oficial = 'Oficial',
    Actuarios = 'Actuarios',
    Oficialia = 'Oficialia',
    Auditor = 'Auditor',
    Visitador = 'Visitador',
    JefeUnidad = 'JefeUnidad',
    Gestion = 'Gestion'
  }
  