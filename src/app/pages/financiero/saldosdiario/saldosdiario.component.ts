import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Calendario } from 'src/app/shared/interface/calendario.interface';
import { Regional } from 'src/app/shared/models/regional.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { SaldosdiarioService } from 'src/app/shared/services/saldosdiario.service';
import { SessionService } from 'src/app/shared/services/session.service';

const dayMs = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-saldosdiario',
  templateUrl: './saldosdiario.component.html',
  styleUrls: ['./saldosdiario.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class SaldosdiarioComponent implements OnInit {

  public regional: Regional;
  public isLoading: boolean = false;
  public user: Usuario;
  public range: any;
  public data: any = [];
  public datasaldos: any = [];
  public headers: any[];
  public colspan: number = 0;
  public minDate: Date;
  public maxDate: Date;
  public mes: Calendario;
  public fechaselecionada: Date;
  public displayDate: boolean = false;
  public header: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private saldosdiarioService: SaldosdiarioService,
    public sessionService: SessionService,
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

  listar(params: any) {
    this.saldosdiarioService.listar(params)
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
        this.messageService.add({ severity: 'error', detail: 'Error al guardar el registro' })
      })
  }

  mesSeleccionado(mes: Calendario) {
    this.minDate = new Date(mes.fechainicial + 'T00:00:00');
    this.maxDate = new Date(mes.fechafinal + 'T00:00:00');
    this.fechaselecionada = new Date(mes.fechainicial + 'T00:00:00')
    this.listar({ fechainicial: mes.fechainicial, fechafinal: mes.fechafinal, regional: this.regional.id })
  }

  getStyle(date: any) {
    if (date.otherMonth) return { textDecoration: 'line-through' }
    switch (this.data[date.day - 1].estado) {
      case 'PENDIENTE':
        return { color: '#d36507', textDecoration: 'underline' }
      case 'PARCIAL':
        return { color: '#003dc7', textDecoration: 'underline' }
      case 'OK':
        return { color: '#099113' }
      default:
        return { textDecoration: 'line-through' }
    }
  }

  fechaSelect() {
    this.saldosdiarioService.listarSaldos({ fecha: moment(this.fechaselecionada).format('YYYY-MM-DD'), regional: this.regional.id})
      .then((res: any) => {
        this.datasaldos = res.data;
        if(this.datasaldos.length == 0) return this.messageService.add({ severity: 'warn', detail: 'No existen datos para los filtros aplicados.' })
        this.header = `${this.regional.nombre} - ${ moment(this.fechaselecionada).format('YYYY-MM-DD')}`
        this.displayDate = true;
      })
      .catch(err => {
        console.log(err)
        this.messageService.add({ severity: 'error', detail: 'Error al obtener saldos' })
      })
  }

  procesarSaldos(){
    let saldos = this.datasaldos.filter((x:any)=> x.valor)
    this.confirmationService.confirm({
      header: `Atención!`,
      message: `Esta a punto de almacenar saldos para ${saldos.length} cuenta(s), una vez guardada esta inforación, no será posible actualizarla. Desea continuar?`,
      closeOnEscape: false,
      accept: () => {
        this.saldosdiarioService.procesarSaldos(saldos)
          .then(()=> {
            this.messageService.add({severity: 'success', detail: 'Registros almacenados correctamente'})
            this.data = []
            this.displayDate = false;
          })
          .catch(err => {
            console.log(err)
            this.messageService.add({ severity: 'error', detail: 'Error al guardar saldos' })
          })
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', detail: 'Acción cancelada' });
        this.displayDate = false;
      }
    })
  }
}
