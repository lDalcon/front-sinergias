import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendario } from '../interface/calendario.interface';

const API = environment.apiIntegracion + 'calendario';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(
    private http: HttpClient,
  ) { }

  async getCalendarioActivo(trx: string) {
    return firstValueFrom(this.http.get(`${API}/${trx}`))
      .then((res: any) => <Calendario[]>res.data)
  }

  async getCalendarioByAno(ano: string) {
    return firstValueFrom(this.http.get(`${API}`, { params: { ano } }))
      .then((res: any) => <Calendario[]>res.data)
  }

  async actualizarPeriodo(calendario: Calendario) {
    return firstValueFrom(this.http.put(`${API}`, calendario))
  }
}
