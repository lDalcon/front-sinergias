import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  public enProceso: boolean = false;
  public password: string = '';
  public nick: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
  }

  login() {
    this.enProceso = true;
    this.authService.login({nick: this.nick, pass: this.password})
      .then()
      .catch(err => {
        console.warn(err)
        this.enProceso = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en Credenciales',  })
      })
  }
}
