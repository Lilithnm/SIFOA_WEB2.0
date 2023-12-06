export class BaseModel{
    Identificador!: number;
    Nombre!: string;
    Descripcion!: string;
    Estatus!: number;
}

export class BancoModel extends BaseModel {
    Convenio!: number;
    TipoAnexo!: number;
    CuentaSAPIngreso!: number;
    CuentaSAPEgreso!: number;
    Moneda!: number;
}

export class CentrosModel extends BaseModel {
    CentroDgti!: CentrosDgtiModel;
    CentroCosto!: CentrosCostoModel;
    CentroRh!: CentrosRHModel;
    Acreedor!: AcreedorModel;
    FolioMAAT!:number;
    FolioMAATMulta!:number;
    Produccion!:number;

    constructor(Id?: number) {
        super();
        this.CentroDgti = new CentrosDgtiModel();
        this.CentroCosto = new CentrosCostoModel();
        this.CentroRh = new CentrosRHModel();
        this.CentroDgti.UbicacionesId = Id ? Id : 0;
        this.FolioMAAT = 0;
    }
}

export class CentrosCostoModel extends BaseModel {
    CentroCosto!: string;
    IdentificadorMunicipio!: number;
    IdMatAnterior!: number;
    Ramo!: RamosIndustrialesModel;
    CentroDetalle!: CentrosCostoDetalleModel;
}

export class CentrosCostoDetalleModel extends BaseModel {
    Acreedor!: string;
    Sociedad!: string;
    CentroCosto!: string;
    Denominacion!: string;
    ValidoHasta!: string;
    ValidoDesde!: string;
    AreaJerarquica!: string;
    Division!: string;
}

/*public class CentrosCostoDetalleModel : BaseModel
{
    public string Sociedad { get; set; }
    public string CentroCosto { get; set; }
    public string Denominacion { get; set; }
    public string ValidoHasta { get; set; }
    public string ValidoDesde { get; set; }
    public string Acreedor { get; set; }
    public string Division { get; set; }
    public string AreaJerarquica { get; set; }
    public string Clase { get; set; }
    public string Moneda { get; set; }
}*/




export class AcreedorModel extends BaseModel
{
    Acreedor!: string;
    Ramo!: RamosIndustrialesModel;
    
}


export class RamosIndustrialesModel extends BaseModel {
    Ramo!: string;
    CveRamo!: string;
}
export class CentrosDgtiModel extends BaseModel {
    CentroTrabajo!: string;
    Juzgado!: string;
    IdentificadorMateria!: number;
    UbicacionesId!: number;
    IdentificadorMunicipio!: number;
}

export class CentrosRHModel extends BaseModel {
    CentroTrabajoId!: string;
    CentroTrabajoNombre!: string;
    IdentificadorMunicipio!: number;
}

export class ConceptoModel extends BaseModel
{

}

export class ElementoModel extends BaseModel
{

}

export class EstadoModel extends BaseModel
{
    PaisId!: number;
}

export class MateriaModel extends BaseModel
{

}

export class MunicipioModel extends BaseModel
{
    EstadoId!: number;
}

export class TipoAnexoModel extends BaseModel
{

}
export class TipoExpedienteModel extends BaseModel {
    IdentificadorOrigen!: number;
    Prefijo!: string;
}

export class TipoJuicioModel extends BaseModel
{
    Materia!: number;
}

export class PaisModel extends BaseModel
{

}

export class SistemasModel extends BaseModel
{
    IdCentroTrabajo!:number;
}
