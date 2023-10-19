import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.apiIntegracion + 'saldosdiario'

@Injectable({
  providedIn: 'root'
})
export class SaldosdiarioService {

  constructor(
    private http: HttpClient,
  ) { }

  async listar(params: {fechainicial: string, fechafinal: string, regional: number}) {
    return firstValueFrom(this.http.get(API, { params }))
      .then((res: any) => <any[]>res.data)
  }

  async listarSaldos(params: any){
    return firstValueFrom(this.http.get(`${API}/dia`, { params }))
  }

  async guardarSaldo(data: any){
    return firstValueFrom(this.http.post(API, data))
  }

  async procesarSaldos(data: any){
    return firstValueFrom(this.http.post(`${API}/procesar`, data))
  }

  async borrarInfoDia(data: any){
    return firstValueFrom(this.http.delete(`${API}`, {body: data}));
  }
}

