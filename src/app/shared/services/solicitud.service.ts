import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud.model';

const API = environment.apiIntegracion + 'solicitud'

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(
    private http: HttpClient
  ) { }

  async listar(filtro: any) {
    return firstValueFrom(this.http.get(API, { params: filtro }))
      .then((res: any) => <any[]>res.data)
  }

  async guardar(solicitud: Solicitud) {
    return firstValueFrom(this.http.post(API, solicitud))
  }

  async obtener(id: number) {
    return firstValueFrom(this.http.get(`${API}/${id}`))
      .then((res: any) => <Solicitud>res.data)
  }
}
