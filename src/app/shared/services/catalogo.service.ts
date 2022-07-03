import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Catalogo } from '../models/catalogo.model';

const API = environment.apiIntegracion + 'catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private http: HttpClient,
  ) { }

  getCatalogoById(idCatalogo: string) {
    return firstValueFrom(this.http.get(`${API}/${idCatalogo}`))
      .then((res: any) => <Catalogo>res.data)
  }

}
