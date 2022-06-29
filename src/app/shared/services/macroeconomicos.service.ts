import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MacroEconomicos } from '../models/macroeconomicos.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'macroeconomicos'

@Injectable({
  providedIn: 'root'
})
export class MacroeconomicosService {

  headers: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.headers = { headers: { 'x-token': this.sessionService.token } }
  }

  getMacroeconomicosByDate(fecha: string) {
    return firstValueFrom(this.http.get(`${API}/${fecha}`, this.headers))
      .then((res: any) => <MacroEconomicos[]>res.data)
      .then(data => { return data; })
  }

  getMacroeconomicosByDateAndType(fecha: string, tipo: string) {
    return firstValueFrom(this.http.get(`${API}/${fecha}/${tipo}`, this.headers))
      .then((res: any) => {
        res.data.fecha = new Date(res.data.fecha);
        return res;
      })
      .then((res: any) => <MacroEconomicos>res.data)
      .then(data => { return data; })
  }
}
