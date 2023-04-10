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

  async listar(params: any) {
    return firstValueFrom(this.http.get(API, { params }))
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
}

