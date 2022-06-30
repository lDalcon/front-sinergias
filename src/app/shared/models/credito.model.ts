import { Regional } from "./regional.model";
import { ValorCatalogo } from "./valor-catalogo";
export class Credito {
    id: number;
    ano: number;
    periodo: number;
    fechadesembolso: Date;
    moneda: ValorCatalogo;
    entfinanciera: ValorCatalogo;
    regional: Regional;
    lineacredito: ValorCatalogo;
    pagare: string;
    tipogarantia: ValorCatalogo;
    capital: number;
    saldo: number;
    plazo: number;
    indexado: ValorCatalogo;
    spread: number;
    tipointeres: ValorCatalogo;
    amortizacionk: ValorCatalogo;
    amortizacionint: ValorCatalogo;
    tasa: number;
    usuariocrea: string;
    fechacrea: Date;
    usuariomod: string;
    fechamod: Date;
    amortizacion: Amortizacion[] = [];
}

export class Amortizacion {
    nper: number = -1;
    fechaPeriodo: Date = new Date('1900-01-01');
    tasaIdxEA: number = 0;
    spreadEA: number = 0;
    tasaEA: number = 0;
    saldoCapital: number = 0;
    valorInteres: number = 0;
    abonoCapital: number = 0;
    pagoTotal: number = 0;
    interesCausado: number;
    actualizaIdx: boolean = false;
}