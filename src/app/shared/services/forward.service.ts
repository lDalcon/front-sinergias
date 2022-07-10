import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IForward } from '../interface/forward.interface';
import { CreditoForward } from '../models/credito-forward.model';
import { Forward } from '../models/forward.model';

const API = environment.apiIntegracion + 'forward';

@Injectable({
  providedIn: 'root'
})
export class ForwardService {

  constructor(
    private http: HttpClient
  ) { }

  async guardar(forward: Forward) {
    return firstValueFrom(this.http.post(`${API}`, forward))
  }

  async listar() {
    return firstValueFrom(this.http.get(`${API}`))
      .then((res: any) => <IForward[]>res.data)
      .then(data => { return data; })
  }

  async obtener(id: number) {
    return firstValueFrom(this.http.get(`${API}/${id}`))
      .then((res: any) => <Forward>res.data)
      .then(forward => {
        forward.fechaoperacion = new Date(forward.fechaoperacion);
        forward.fechacumplimiento = new Date(forward.fechacumplimiento);
        forward.fechacrea = new Date(forward.fechacrea);
        forward.fechamod = new Date(forward.fechamod);
        return forward;
      })
      .then(data => { return data; })
  }

  async asignarCredito(creditoForward: CreditoForward){
    return firstValueFrom(this.http.post(`${API}/asignarCredito`, creditoForward))
  }
}
