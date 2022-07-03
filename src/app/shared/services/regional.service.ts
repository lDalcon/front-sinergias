import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Regional } from '../models/regional.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'regional';

@Injectable({
  providedIn: 'root'
})
export class RegionalService {

  constructor(
    private http: HttpClient,
  ) { }

  getReginalByNit(nit: string) {
    return firstValueFrom(this.http.get(`${API}/${nit}`))
      .then((res: any) => <Regional[]>res.data)
  }
}





