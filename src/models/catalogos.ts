import { CentrosModel } from "./generales";

export class BaseModel{
    Identificador!: number;
    Nombre!: string;
    Descripcion!: string;
    Estatus!: number;
    constructor(Identificador: number) {
        this.Identificador = Identificador
    }
}
export class UsuarioModel extends BaseModel
{
    Tickets!: TicketModel[];
    Token!: string;
    Rol!: Rol;
    Correo!: string;
}
export class TicketModel extends BaseModel
{
      Centro!:CentrosModel;
      Rol!: RolModel;
      Plataforma!: PlataformaModel;
      Modulos!: ModuloModel[];
}

export class OficinaModel extends BaseModel
{
      Clave!:string ;
}
export class RolModel extends BaseModel   {   }
export class PlataformaModel extends BaseModel  {  }
export class ModuloModel extends BaseModel { }

export class UsuarioMinModel
{
      Id!:string ;
      Nick!: string ;
      Pass!: string ;
      constructor(id: string, nick: string, pass: string) {
        this.Id = id;
        this.Nick = nick;
        this.Pass = pass;
    }
}

export class ContenedorMaestroModel<T>
{
    Contenedor!: ContenedorModel<T> ;
}
export class ContenedorModel<T>
{
    Elementos!:T[] ;
}

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
export interface DialogData {
    Title: string;
    Text: string;
    Text2: string;
    Text3: string;
  }

export enum Rol {
    Solicitante = 'Solicitante',
    Coordinador = 'Coordinador',
    Admin = 'Admin',
    Almacenista = 'Almacenista',
    Capturista = 'Capturista',
    Todos = 'Todos'
  }
  