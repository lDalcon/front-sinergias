import { Regional } from "./regional.model";
import { ValorCatalogo } from "./valor-catalogo";

export class Forward {
    id: number;
    ano: number;
    periodo: number;
    fechaoperacion: Date;
    fechacumplimiento: Date;
    entfinanciera: ValorCatalogo;
    regional: Regional;
    valorusd: number;
    tasaspot: number;
    devaluacion: number;
    tasaforward: number;
    valorcop: number;
    saldoasignacion: number;
    estado: string;
    usuariocrea: string;
    fechacrea: Date;
    usuariomod: string;
    fechamod: Date;
}