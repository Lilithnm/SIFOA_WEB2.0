import { BaseModel, TipoExpedienteModel, CentrosModel, EstadoModel, MunicipioModel, SistemasModel } from './catalogos';

export class ExpedienteBaseModel {
    Identificador!: number;
    IdentificadorOrigen!: number;
    IdentificadorOrigenString!: string;
    Numero!: number;
    Anio!: number;
    TipoExpediente!: TipoExpedienteModel;
    Centro!: CentrosModel;
    Sistema!: any;
    //ESistema!: ESistemas;
    Acusado!:string;
    Ofendido!: string;    
    Nomenclatura!: string;
    Clave!: string;
}


export class SalidaModel extends BaseModel {
    Fecha!: string;
}
export enum ESistemas {
    NO_DEFINIDO = 0,
    SISCONEXPE_CIVIL_v4 = 1,
    SISCONEXPE_CIVIL_v5 = 2,
    SISCONEXPE_PENAL_v5 = 3,
    SISCONEXPE_PENAL_v4 = 4,
    OFIPAR_CIVIL = 5,
    OFIPAR_PENAL = 6,
    ODP_ORAL_MERCANTIL = 7,
    SISTOCAS_CIVIL = 8,
    SISTOCAS_PENAL = 9,
    SIGO_v3 = 10,
    SIGO_v1 = 11,
    SIGOFAM = 12,
    SIGOMER = 13,
    SIGO_ADOLESCENTES = 14,
    SIGOEPA = 15,
    CEJA = 16,
    SIGOLAB = 17,
    SISTEMA_DE_ADMINISTRACION_JURIDICA_IMPUGNACION_ADOLESCENTES = 18,
    EJECUCION_DE_ADOLESCENTES = 19
}

export class ExpedienteModel extends ExpedienteBaseModel {
    //IdentificadorOrigen!: number;
    Indice!: number;
    Estatus!: number;
    FechaCreacion!: string;
    FechaRadicacion!: string;
    Materia!: string;
    Juicio!: JuicioModel;
    Salida!: SalidaModel;
}

export class PersonajeModel {
    Identificador!: number;
    IdentificadorOrigen!: number;
    IdExpediente!: number;
    Tipo!: number;
    Estatus!: number;
    Nombre!: string;
    Paterno!: string;
    Materno!: string;
    RFC!: string;
    CURP!: string;
    TipoPersonaje!: TipoPersonajeModel;
    Domicilios!: DomicilioModel[];
}

export class JuicioModel extends BaseModel {
    IdentificadorOrigen!: number;
}

export class TipoPersonajeModel extends BaseModel {
    IdentificadorOrigen!: number;
}

export class DomicilioModel {
    Identificador!: number;
    IdentificadorOrigen!: number;
    IdPersonaje!: number;
    Estatus!: number;
    NumeroInterno!: string;
    NumeroExterno!: string;
    Colonia!: string;
    Calle!: string;
    Comun!: boolean;
    Procesal!: boolean;
    Estado!: EstadoModel;
    Municipio!: MunicipioModel;
}

export class GeneralesModel
{
    Expediente!: ExpedienteModel;
    Personajes!: PersonajeModel[];
    Delitos!: DelitosModel[];
    Estatus!: number;
}

export class DelitosModel
{
    IdentificadorOrigen!: number;
    IdExpediente!: number;
    Nombre!: string;
}
