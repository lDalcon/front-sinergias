import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICredito } from '../interface/credito.interface';
import { Credito } from '../models/credito.model';

const API = environment.apiIntegracion + 'credito'
@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  constructor(
    private http: HttpClient,
  ) { }

  async simularCredito(credito: Credito): Promise<Credito> {
    return firstValueFrom(this.http.post(`${API}/simular`, credito))
      .then((res: any) => <Credito>res.data)
      .then(res => {
        res.fechadesembolso = new Date(res.fechadesembolso);
        return res;
      })
      .then(data => { return data; })
  }

  async crearCredito(credito: Credito) {
    return firstValueFrom(this.http.post(`${API}`, credito))
      .then((res: any) => <{ ok: boolean, message: string }>res)
      .then(data => { return data; })
  }

  async listarCreditos(params?: any) {
    return firstValueFrom(this.http.get(`${API}`, { params }))
      .then((res: any) => <ICredito[]>res.data)
      .then(data => { return data; })
  }

  async obtenerCredito(id: number) {
    return firstValueFrom(this.http.get(`${API}/${id}`))
      .then((res: any) => <Credito>res.data)
      .then(credito => {
        credito.fechacrea = new Date(credito.fechacrea);
        credito.fechamod = new Date(credito.fechamod);
        credito.fechadesembolso = new Date(credito.fechadesembolso);
        return credito;
      })
      .then(data => { return data; })
  }

  async validarPagare(pagare: string, entfinanciera: number) {
    return firstValueFrom(this.http.get(`${API}/${pagare}/${entfinanciera}`))
  }

}
