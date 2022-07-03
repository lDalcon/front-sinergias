import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Regional } from '../models/regional.model';

const API = environment.apiIntegracion + 'empresa';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient,
  ) { }

  getReginalByNit(nit: string) {
    return firstValueFrom(this.http.get(`${API}/${nit}`))
      .then((res: any) => <Regional[]>res.data)
  }
}