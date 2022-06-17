import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  headers: any;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.headers = { headers: { 'x-token': this.sessionService.token } }
  }

  

}
