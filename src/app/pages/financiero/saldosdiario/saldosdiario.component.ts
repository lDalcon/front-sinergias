import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Regional } from 'src/app/shared/models/regional.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { SaldosdiarioService } from 'src/app/shared/services/saldosdiario.service';
import { SessionService } from 'src/app/shared/services/session.service';

const dayMs = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-saldosdiario',
  templateUrl: './saldosdiario.component.html',
  styleUrls: ['./saldosdiario.component.css'],
  providers: [MessageService]
})
export class SaldosdiarioComponent implements OnInit {

  public regional: Regional;
  public isLoading: boolean = false;
  public user: Usuario;
  public range: any;
  public data: any = [];
  public headers: any[];
  public colspan: number = 0;

  constructor(
    private messageService: MessageService,
    public sessionService: SessionService,
    private saldosdiarioService: SaldosdiarioService
  ) {
    this.user = this.sessionService.usuario;
  }

  ngOnInit(): void {
  }

  createRange() {
    if (!this.range[1]) {
      this.data = [];
      return;
    }
    let days = Math.abs(this.range[0] - this.range[1]) / dayMs + 1;
    if (days > 30) {
      this.range[1] = null;
      return;
    }
    this.headers = [];
    let day = new Date(this.range[0]);
    this.headers.push(moment(new Date(day)).format('YYYY-MM-DD'));
    for (let i = 1; i < days; i++) {
      this.headers.push(moment(new Date(day.setDate(day.getDate() + 1))).format('YYYY-MM-DD'));
    }
    this.colspan = this.headers.length
  }

  listar() {
    this.saldosdiarioService.listar({ fechainicial: moment(this.range[0]).format('YYYY-MM-DD'), fechafinal: moment(this.range[1]).format('YYYY-MM-DD'), regional: this.regional.id })
      .then((res: any) => {
        this.data = res.data
      })
  }

  guardarSaldo(cuenta: any, index: number) {
    let data = {
      idcuenta: cuenta.idcuenta,
      fecha: cuenta.detalle[index].fecha,
      valor: cuenta.detalle[index].valor
    }
    this.saldosdiarioService.guardarSaldo(data)
      .then((res: any) => {
        this.messageService.add({ severity: 'success', detail: res.message })
      })
      .catch(err => {
        console.log(err)
        this.messageService.add({ severity: 'err', detail: 'Error al guardar el registro' })
        this.listar()
      })
  }
}
