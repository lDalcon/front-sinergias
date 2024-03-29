import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.apiIntegracion + 'reporte'

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    private http: HttpClient
  ) { }

  getDataReporte(ano: number, periodo: number) {
    return firstValueFrom(this.http.get(`${API}`, { params: { ano, periodo } }))
      .then((res: any) => <any[]>res.data)
      .then(data => { return data })
  }

  obtenerDiferenciaCambio(paramentros: { fecha: Date, nick?: string, nit?: string }) {
    return firstValueFrom(this.http.post(`${API}/diferenciacambio`, paramentros))
  }

  getInfoRegistroSolicitud(regional: number) {
    return firstValueFrom(this.http.get(`${API}/infoRegistroSolicitud/${regional}`))  
      .then((res: any) => <any[]>res.data)
      .then(data => { return data })
  }

}
