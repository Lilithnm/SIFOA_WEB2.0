export class MigradosModel
{   ExpedienteSIFOA!: string;
    ExpedienteMAAT!: string;
    Juzgado!: string;
    Tipo!: string;
    Folio!: string;
    FolioAnterior!: string;
    MontoDepositado!: number;
    MontoDevolucion!: number;
    MontoDevolver!: number;
    Banco!: string;
    Estado!: string;
    Concepto!: string;
    FechaDeposito!: string|null;
    FechaEndoso!: string|null;
    FechaLibera!: string|null;
    FechaFin!: string|null;
    FechaConc!: string |null;
    PolizaDep!: string;
    PolizaDev!: string;
    Referencia!: string;
    Beneficiario!: string;
    PJE!: string;
    TConcepto!: string;
    Libero!: string;
    Endoso!: string;
    FechaM!: string|null;
    UsuarioM!: string;
}

export class DevueltosModel
{   
    Expediente!: string;
    Juzgado!: string;
    Tipo!: string;
    Folio!: string;
    FolioAnterior!: string;
    MontoDepositado!: number;
    MontoDevolucion!: number;
    MontoDevolver!: number;
    Banco!: string;
    Estado!: string;
    Concepto!: string;
    FechaDeposito!: string|null;
    FechaEndoso!: string|null;
    FechaLibera!: string|null;
    FechaFin!: string|null;
    FechaConc!: string |null;
    PolizaDep!: string;
    PolizaDev!: string;
    Referencia!: string;
    Beneficiario!: string;
    Empleado!: string;
    PJE!: string;
    TConcepto!: string;
    Libero!: string;
    Endoso!: string;
}
