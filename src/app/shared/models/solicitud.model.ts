import { Regional } from "./regional.model";
import { ValorCatalogo } from "./valor-catalogo";

export class Solicitud {
    id: number;
    ano: number;
    periodo: number;
    fechareq: Date;
    moneda: ValorCatalogo;
    regional: Regional;
    capital: number;
    desembolso: number;
    desistido: number;
    plazo: number;
    observaciones: string;
    idcredito: number;
    estado: string;
    usuariocrea: string;
    fechacrea: Date;
    usuariomod: string;
    fechamod: Date;
}