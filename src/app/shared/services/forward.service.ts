import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IForward } from '../interface/forward.interface';
import { CierreForward } from '../models/cierre-forward.model';
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

  async actualizar(forward: Forward) {
    return firstValueFrom(this.http.put(`${API}`, forward))
  }

  async listar(params?: any) {
    return firstValueFrom(this.http.get(`${API}`, { params }))
      .then((res: any) => <IForward[]>res.data)
      .then(forwards => {
        forwards.forEach(forward => {
          forward.fechacumplimiento = forward.fechacumplimiento.substring(0,10);
          forward.fechaoperacion = forward.fechaoperacion.substring(0,10);
        });
        return forwards;
      })
      .then(data => { return data; })
  }

  async obtener(id: number) {
    return firstValueFrom(this.http.get(`${API}/${id}`))
      .then((res: any) => res.data)
      .then((forward: any) => {
        forward.fechaoperacion = new Date(`${forward.fechaoperacion.substring(0,10)}T00:00:00`);
        forward.fechacumplimiento = new Date(`${forward.fechacumplimiento.substring(0,10)}T00:00:00`);
        return forward;
      })
      .then((res: any) => <Forward>res)
      .then(data => { return data; })
  }

  async asignarCredito(creditoForward: CreditoForward) {
    return firstValueFrom(this.http.post(`${API}/asignarCredito`, creditoForward))
  }

  async cerrarForward(cierreForward: CierreForward){
    return firstValueFrom(this.http.post(`${API}/cerrar`, cierreForward))
  }

  async liberarForward(data: any){
    return firstValueFrom(this.http.put(`${API}/liberar`, data));
  }
}
