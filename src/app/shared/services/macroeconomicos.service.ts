import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MacroEconomicos } from '../models/macroeconomicos.model';

const API = environment.apiIntegracion + 'macroeconomicos'

@Injectable({
  providedIn: 'root'
})
export class MacroeconomicosService {

  constructor(
    private http: HttpClient,
  ) { }

  getMacroeconomicosByDate(fecha: string) {
    return firstValueFrom(this.http.get(`${API}/${fecha}`))
      .then((res: any) => <MacroEconomicos[]>res.data)
      .then(data => { return data; })
  }

  getMacroeconomicosByDateAndType(fecha: string, tipo: string) {
    return firstValueFrom(this.http.get(`${API}/${fecha}/${tipo}`))
      .then((res: any) => {
        res.data.fecha = new Date(`${res.data.fecha.substring(0,10)}T00:00:00`);
        return res;
      })
      .then((res: any) => <MacroEconomicos>res.data)
      .then(data => { return data; })
  }

  import(data: any[]){
    return firstValueFrom(this.http.post(`${API}/importar`, data))
  }
}
