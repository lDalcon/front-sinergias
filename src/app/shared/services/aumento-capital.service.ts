import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAumentoCapital } from '../interface/aumento-capital.interface';
import { firstValueFrom } from 'rxjs';

const API = environment.apiIntegracion + 'aumento-capital';

@Injectable({
  providedIn: 'root',
})
export class AumentoCapitalService {
  constructor(private http: HttpClient) {}

  async guardar(aumentoCapital: IAumentoCapital) {
    return firstValueFrom(this.http.post(API, aumentoCapital))
      .then((res: any) => <{ ok: boolean; message: string }>res)
      .then((data) => {
        return data;
      });
  }
}
