import { BaseModel } from './catalogos';

export class ErrorModel
{
      Mensaje!: string;
      Detalle!: string;
      StatusCode!: number;
}
export class MinervaGModel
{
}

export class CentrosModel extends BaseModel
{
    CentroDgti!:CentrosDgtiModel ;
    CentroMateriales!:CentroMaterialesModel ;
    Periodo!: number;
}
export class CentrosDgtiModel extends BaseModel
{
    CentroTrabajo!: string;
    Juzgado!: string;
    Municipio!: MunicipioModel;
    UbicacionesId!: number;
}
export class CentroMaterialesModel extends BaseModel
{
    CentroCosto!: string;
    Denominacion!: string;
    CentroTrabajo!:string ;
    Zona!: number ;
}

export class MunicipioModel extends BaseModel
{
    EstadoId!: number;
}
