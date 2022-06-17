import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Regional } from '../models/regional.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'empresa';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public headers: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.headers = { headers: { 'x-token': this.sessionService.token } }
  }

  getReginalByNit(nit: string) {
    return firstValueFrom(this.http.get(`${API}/${nit}`, this.headers))
      .then((res: any) => <Regional[]>res.data)
  }
}