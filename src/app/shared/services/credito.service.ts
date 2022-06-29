import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  simularCredito(credito: Credito) {
    return firstValueFrom(this.http.post(`${API}/simular`, credito, this.headers))
      .then((res: any) => <Credito>res.data)
      .then(res => {
        res.fechadesembolso = new Date(res.fechadesembolso);
        return res;
      })
      .then(data => { return data; })
  }

}
