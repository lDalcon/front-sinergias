import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';

const API = environment.apiIntegracion + 'empresa';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return firstValueFrom(this.http.get(`${API}`))
      .then((res: any) => <Empresa[]>res.data)
  }
}