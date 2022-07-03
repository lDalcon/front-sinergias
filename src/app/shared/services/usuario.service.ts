import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { SessionService } from './session.service';

const API = environment.apiIntegracion + 'usuario'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  crearUsuario(usuario: Usuario) {
    return firstValueFrom(this.http.post(`${API}`, usuario))
  }

  getUsuarios() {
    return firstValueFrom(this.http.get(`${API}`))
      .then((res: any) => <Usuario[]>res.data)
      .then(data => { return data; })
  }
}
