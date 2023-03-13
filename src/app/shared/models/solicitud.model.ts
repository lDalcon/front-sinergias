import { Regional } from "./regional.model";
import { ValorCatalogo } from "./valor-catalogo";

export class Solicitud {
    id: number;
    ano: number;
    periodo: number;
    fechareq: Date;
    moneda: ValorCatalogo;
    entfinanciera: ValorCatalogo;
    regional: Regional;
    lineacredito: ValorCatalogo;
    tipogarantia: ValorCatalogo;
    capital: number;
    plazo: number;
    indexado: ValorCatalogo;
    spread: number;
    tasa: number;
    tipointeres: ValorCatalogo;
    amortizacionk: ValorCatalogo;
    amortizacionint: ValorCatalogo;
    observaciones: string;
    idcredito: number;
    estado: string;
    usuariocrea: string;
    fechacrea: Date;
    usuariomod: string;
    fechamod: Date;
}