import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValorCatalogo } from '../models/catalogo.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  public headers: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.headers = { headers: { 'x-token': this.sessionService.token } }
  }

  getCatalogoById(idCatalogo: string) {
    return firstValueFrom(this.http.get(`${API}/${idCatalogo}`, this.headers))
      .then((res: any) => <ValorCatalogo[]>res.data)
  }

}
