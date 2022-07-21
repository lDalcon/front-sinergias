import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

const API = environment.apiIntegracion + 'auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private router: Router
  ) { }

  login(params: { nick: string, password: string }) {
    return firstValueFrom(this.http.post(`${API}`, params))
      .then((res: any) => {
        this.sessionService.guardarToken(res.token);
        return <Usuario>res.data;
      })
      .then(usuario => {
        this.sessionService.usuario = usuario;
        this.sessionService.guardarUsuario(usuario)
        switch (usuario.menu.role) {
          case 'ADMIN':
            this.router.navigateByUrl('/admin')
            break;
          case 'TESORERIA':
            this.router.navigateByUrl('/dashboard/financiero')
            break;
          default:
            break;
        }
        //TODO: cambiar path origen
      })
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['auth', 'login'])
  }
}
