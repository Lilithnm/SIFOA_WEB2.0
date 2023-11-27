import { ExpedienteBaseModel, ExpedienteModel, PersonajeModel } from './generales';
import { BancoModel, BaseModel } from './catalogos';
import { BeneficiarioMinModel } from './modelos';

export class MainBaseModel
{
    Identificador!: number;
    Folio!: string;
    ExpedienteMaat!: ExpedientesMaatModel;
    Expediente!: ExpedienteBaseModel;
    Domicilio!: BaseModel;
    Municipio!: BaseModel;
    Estado!: number;
    EstadoTxt!: string;
    Estatus!: number;
    Observaciones!: string;
    CP!: string;
    Telefono!: string;
    Referencia!: string;
    Actor!: string;
    DEmandado!: string;
    constructor() {
        this.Expediente = new ExpedienteBaseModel();
    }
}


export class GarantiaModel extends MainBaseModel
{
    Personaje!: PersonajeModel;
    Banco!: BancoModel;
    Anexo!: BaseModel;
    Concepto!: BaseModel;
    Fecha!: string;
    FechaCaptura!: string;
    FechaVigencia!: string;
    FolioAnterior!: string;
    Convenio!: string;    
    Importe!: number;
    override Observaciones!: string;
    MontoDepositos!: number;
    MontoDevoluciones!: number;
    IdGarantiaTransferida!:number;
    Devoluciones!: DevolucionModel[];
    Depositos!: DepositoModel[];
    constructor() {
        super();
        this.Personaje = new PersonajeModel();
        this.Banco = new BancoModel();
        this.Concepto = new BaseModel();
        this.Anexo = new BaseModel();
    }
}
export class MultaModel extends MainBaseModel
{
    Personaje!: PersonajeModel;
    Banco!: BaseModel;
    BancoFinalizar!: BaseModel;
    Concepto!: BaseModel;
    Garantia!: BaseModel;
    Fecha!: string;
    FechaCaptura!: string;
    FechaVigencia!: string;
    FechaDeposito!: string;
    FechaCompensacion!: string;
    FechaEndosamiento!: string;
    FechaLiberacion!: string;
    FechaDevolucion!: string;
    FechaFinalizacion!: string;
    FolioAnterior!: string;
    Convenio!: string;
    Importe!: number;
    override Observaciones!: string;
    Beneficiarios!: BeneficiarioModel[];
    Poliza!: PolizaModel;    
    NombreEndosa!: string;
    NombreLibera!: string;
    ReferenciaDevolucion!: string;
}
export class PolizaModel extends MainBaseModel{
    Poliza!: string;
}

export class BeneficiarioModel extends MainBaseModel{
    Personaje!: PersonajeModel;
    TipoIdentificacion!: string;
    Vigencia!: string;
    NumeroIdentificacion!: string;
    NoEmpleado!: number;
    NombreEmpleado!: string;
}


export class DepositoModel extends MainBaseModel
{
    IdGarantia!: number;
    Monto!: number;
    Banco!: BaseModel;
    FechaDeposito!: string;
    FechaRecepcion!: string;
    NumeroDocumento!: string;
    Poliza!: PolizaModel;
}

export class AnexoModel extends MainBaseModel
{     
     Origen!: BaseModel;
     Concepto!: BaseModel;
     Banco!: BaseModel;
     override Domicilio!: BaseModel;
     Depositante!: BaseModel;
     Monto!: number;
     Oficina!: string;
     FechaEmision!: string;
     FechaRegistro!: string;
     FechaContable!: string;
     FechaEmisionT!: string;
     FechaRegistroT!: string;
     FechaContableT!: string;     
     FechaCaptura!: string;
     FechaDeposito!: string;
     constructor() {
         super();
         this.Municipio = new BaseModel();
         this.Origen = new BaseModel();
         this.Concepto = new BaseModel();
         this.Banco = new BaseModel();
         this.Domicilio = new BaseModel();
         this.Depositante = new BaseModel();
     }
}


export class DevolucionModel extends MainBaseModel
{
    IdGarantia!: number;
    Tipo!: number;
    Monto!: number;
    NumeroDocumento!: string;
    Beneficiarios!: BeneficiarioModel[];
    ReferenciaDevolucion!: string;
    Banco!: BaseModel;
    FechaEndosamiento!: string;
    Reactivaciones!: number;
    Concepto!: string;
    FechaLiberacion!: string;
    FechaDevolucion!: string;
    FechaFinalizacion!: string;
    FechaVigencia!: string;
    NombreEndosa!: string;
    NombreLibera!: string;
    FechaConciliacionSap!: string;
    FechaConciliacion!: string;
    IdMultaGenerada!: number;
    Poliza!: PolizaModel;
    ListaCoincidencias!: BeneficiarioMinModel[]
}

export class TramiteEliminadoModel 
{
    IdTramite!: number;
    Motivo!: string;

}

export class TransferibleModel extends BaseModel
{
    Tipo!: number;
    IdentificadorElemento!: number;
    IdentificadorExpediente!: number;
    Folio!: string;
    Monto!: number;
    MontoTransferible!: number;
    EsTransferible!: number;
    MotivoRechazo!: string;
    Estado!: number;
}

export class TransferenciaModel extends BaseModel
{
    Folio!: string;
    Tipo!: BaseModel;
    ExpedienteOrigen!: ExpedienteBaseModel;
    ExpedienteDestino!: ExpedienteBaseModel;
    FechaTransferencia!: string;
    FechaCancelacion!: string;
    FechaAceptacion!: string;
    Observaciones!: string|void;
    Transferibles!: TransferibleModel[];
    FechaCaptura!: string;
    Estado!: number;
    Multas!: MultaModel[];
    Anexos!: AnexoModel[];
    Garantias!: GarantiaModel[];

}
    
    export class ReporteBusquedaModel extends BaseModel
{
    Juzgado!: string;
    JuzgadoNombre!: string;
    FechaInicio!: string;
    FechaFin!: string;
    TipoAnexo!: string;
    EstadoAnexo!: string;
    EstadoMulta!: string;
    EstadoGarantia!: string;
    EstadoDevolucion!: string;
    IncluirAnexosEliminados!: number;
    Expediente!: string;
    FolioAnexo!: string;
    DepositosAnulados!: number;
    DocumentosPgj!: number;
    DevolucionesAnuladas!: number;
}

    
export class ReporteResultModel extends BaseModel
{
    Expediente!: ExpedienteModel;
    Multas!: MultaModel[];
    Anexos!: AnexoModel[];
    Garantias!: GarantiaModel[];
}



export class MigracionMaatModel 
{
    IdExpedienteSifoa!: number;
    Acreedor!: string;
    ExpedientesMigrar!: ExpedientesMaatModel[];
    Error!: string;
}


export class ExpedientesMaatModel 
{
    ExpedienteID!: number;
    ExpedienteMaat!: string;
    Ofendido!: string;
    Acusado!: string;
    Juzgaado!: string;
    Error!: string;
}





