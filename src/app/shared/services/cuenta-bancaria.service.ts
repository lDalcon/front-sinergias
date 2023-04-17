import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuentaBancaria } from '../models/cuenta-bancaria.model';

const API = environment.apiIntegracion + 'cuentabancaria'

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {

  constructor(
    private http: HttpClient
  ) { }

  async crearCuenta(cuentaBancaria: CuentaBancaria) {
    return firstValueFrom(this.http.post(API, cuentaBancaria))
  }
}
