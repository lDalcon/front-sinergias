import { Regional } from "./regional.model";
import { ValorCatalogo } from "./valor-catalogo";

export class CuentaBancaria{
    id: number = 0
    regional: Regional = new Regional();
    tipocuenta: ValorCatalogo = new ValorCatalogo();
    entfinanciera: ValorCatalogo = new ValorCatalogo();
    ncuenta: string = '';
    moneda: ValorCatalogo = new ValorCatalogo();
    fechaapertura: Date;
    estado: boolean = true;
}