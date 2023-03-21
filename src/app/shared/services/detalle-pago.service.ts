import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetallePago } from '../models/detalle-pago.model';

const API = environment.apiIntegracion + 'detallepago'
@Injectable({
  providedIn: 'root'
})
export class DetallePagoService {

  constructor(
    private http: HttpClient
  ) { }

  procesarDetallePago(pagos: DetallePago[]) {
    return firstValueFrom(this.http.post(`${API}`, pagos))
  }

  deletePago(detallepago: DetallePago){
    return firstValueFrom(this.http.delete(API, {body: detallepago}))
  }
}
