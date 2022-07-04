import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IForward } from '../interface/forward.interface';
import { Forward } from '../models/forward.model';

const API = environment.apiIntegracion + 'forward';

@Injectable({
  providedIn: 'root'
})
export class ForwardService {

  constructor(
    private http: HttpClient
  ) { }

  async crearForward(forward: Forward) {
    return firstValueFrom(this.http.post(`${API}`, forward))
  }

  async listarForward() {
    return firstValueFrom(this.http.get(`${API}`))
      .then((res: any) => <IForward[]>res.data)
      .then(data => { return data; })
  }
}
