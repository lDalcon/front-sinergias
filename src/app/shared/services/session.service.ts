import { EventEmitter, Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _token: string = '';
  private _usuario: Usuario;
  public menu$: EventEmitter<MenuItem[]> = new EventEmitter<MenuItem[]>();


  constructor() {
    this._token = sessionStorage.getItem('token') || '';
    this._usuario = JSON.parse(sessionStorage.getItem('usr') || JSON.stringify(new Usuario()));
    if (this._usuario.menu.opciones.length != 0) this.menu$.emit(this._usuario.menu.opciones);
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(usuario: Usuario) {
    this._usuario = usuario;
  }

  get token() {
    return this._token;
  }

  guardarUsuario(usuario: Usuario) {
    this.menu$.emit(usuario.menu.opciones)
    sessionStorage.setItem('usr', JSON.stringify(usuario));
  }

  guardarToken(token: string) {
    this._token = token;
    sessionStorage.setItem('token', token)
  }

  validarSesion(): boolean {
    let session = sessionStorage.getItem('usr') || '';
    return session === '' ? false : true;
  }

  refreshMenu() {
    this.menu$.emit(this._usuario.menu.opciones)
  }
}
