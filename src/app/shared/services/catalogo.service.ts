import { Catalogo } from '../models/catalogo.model';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = environment.apiIntegracion + 'catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private http: HttpClient,
  ) { }

  async getCatalogoById(idCatalogo: string) {
    return firstValueFrom(this.http.get(`${API}/${idCatalogo}`))
      .then((res: any) => <Catalogo>res.data)
  }

}
