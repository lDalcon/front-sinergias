export interface ICredito{
    id: number;
    ano: number;
    periodo: number;
    fechadesembolso: string;
    moneda: string;
    entfinanciera: string;
    regional: string;
    lineacredito: string;
    pagare: string;
    tipogarantia: string;
    capital: number;
    saldo: number;
    plazo: number;
    indexado: string;
    spread: number;
    tipointeres: string;
    amortizacionk: string;
    amortizacionint: string;
    saldoasignacion: number;
    estado: string;
    tasa: number;
    usuariocrea: string;
    fechacrea: Date;
    usuariomod: string;
    fechamod: Date;
}