export interface DiferenciaCambio {
    dc_consolidado: DcConsolidado[];
    dc_credito: DcCredito[];
    dc_forward: DcForward[];
    dc_resumen_credito: DcResumenCredito[];
}

export interface DcConsolidado {
    ano: number;
    deudanocubierta: number;
    deudausd: number;
    dicambiototalacumfwd: number;
    dicambiototalfwd: number;
    difcambiodeudanocubierta: number;
    difcambiomesactual: number;
    difcambiomesactualfw: number;
    difcambiomesanterior: number;
    difcambiomesanteriorfw: number;
    difcambiototalacum: number;
    difcambiototalacummesactual: number;
    difcambiototalacummesanterior: number;
    forward: number;
    lineacredito: string;
    periodo: number;
    regional: string;
}

export interface DcCredito {
    ano: number;
    capital: number;
    entfinanciera: string;
    fechadesembolso: Date;
    idcredito: number;
    lineacredito: string;
    pagare: string;
    periodo: number;
    plazo: number;
    razonsocial: string;
    regional: string;
    saldo: number;
}

export interface DcForward {
    ano: number;
    devaluacion: number;
    dias: number;
    diascausados: number;
    difacumulada: number;
    diftasa: number;
    difxcausar: number;
    difxdia: number;
    entfinanciera: string;
    fechacumplimiento: Date;
    fechadesembolso?: Date;
    fechaoperacion: Date;
    idcredito: number;
    idforward: number;
    lineacredito: string;
    periodo: number;
    regional: string;
    saldoforward: number;
    saldoforwardcop: number;
    tasadeuda: number;
    tasaforward: number;
    tasaspot: number;
    totaldifcambio: number;
    valorcop: number;
    valorusd: number;
}

export interface DcResumenCredito {
    ano: number;
    deudanocubierta: number;
    dias: number;
    diasalcierre: number;
    difcambioacum: number;
    difcambiodeudacubierta: number;
    difcambiodeudanocubierta: number;
    difcambiodeudanocubiertaacum: number;
    difcambioxdia: number;
    diftasa: number;
    fechadesembolso: Date;
    idcredito: number;
    lineacredito: string;
    pagare: string;
    periodo: number;
    regional: string;
    saldocoptrmdesmbolso: number;
    saldocredito: number;
    saldoforward: number;
    saldoforwardcop: number;
    tasafwdprom: number;
    totaldifcambio: number;
    trmdesmbolso: number;
}
