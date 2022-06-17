import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
  ) { }

  canActivate() {
    let auth = this.sessionService.validarSesion();
    if (!auth) this.authService.logOut();
    return auth;
  }
}
