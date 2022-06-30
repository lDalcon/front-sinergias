import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICredito } from '../interface/credito.interface';
import { Credito } from '../models/credito.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'credito'
@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  headers: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.headers = { headers: { 'x-token': this.sessionService.token } }
  }

  async simularCredito(credito: Credito): Promise<Credito> {
    return firstValueFrom(this.http.post(`${API}/simular`, credito, this.headers))
      .then((res: any) => <Credito>res.data)
      .then(res => {
        res.fechadesembolso = new Date(res.fechadesembolso);
        return res;
      })
      .then(data => { return data; })
  }

  async crearCredito(credito: Credito){
    return firstValueFrom(this.http.post(`${API}`, credito, this.headers))
    .then((res: any)=> <{ok:boolean, message: string}>res)
    .then(data => { return data; })
  }

  async listarCreditos(){
    return firstValueFrom(this.http.get(`${API}`, this.headers))
    .then((res: any)=> <ICredito[]>res.data)
    .then(data => { return data; })
  }

}
