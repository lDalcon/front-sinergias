
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Regional } from 'src/app/shared/models/regional.model';
import { SaldosdiarioService } from 'src/app/shared/services/saldosdiario.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { Usuario } from 'src/app/shared/models/usuario.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CuentaBancaria } from 'src/app/shared/models/cuenta-bancaria.model';
import { CuentaBancariaService } from 'src/app/shared/services/cuenta-bancaria.service';

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
  public fechaselecionada: Date;
  public displayDate: boolean = false;
  public displayCuenta: boolean = false;
  public header: string = '';
  public existData: boolean = false;
  public calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.fechaSelect.bind(this),
    datesSet: this.cambioMes.bind(this)
  };
  public currentDate: any;
  @ViewChild('calendar') calendar: FullCalendarComponent;
  public cuentaBancaria: CuentaBancaria = new CuentaBancaria()

  constructor(
    private confirmationService: ConfirmationService,
    private cuentabancariaService: CuentaBancariaService,
    private messageService: MessageService,
    private saldosdiarioService: SaldosdiarioService,
    public sessionService: SessionService,
  ) {
    this.user = this.sessionService.usuario;
  }

  ngOnInit(): void {
  }

  listar(params: { fechainicial: string, fechafinal: string, regional: number }) {
    this.isLoading = true;
    this.saldosdiarioService.listar(params)
      .then(res => {
        this.cargarSaldos(res)
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err)
        this.messageService.add({ severity: 'warn', detail: err?.error?.message || 'Error no controlado.' })
        this.isLoading = false;
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

  cambioMes(info: any) {
    this.currentDate = info
    this.listar({ fechainicial: info.startStr, fechafinal: info.endStr, regional: this.regional.id })
  }

  fechaSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    this.saldosdiarioService.listarSaldos({ fecha: selectInfo.startStr, regional: this.regional.id })
      .then((res: any) => {
        this.datasaldos = res.data;
        if (this.datasaldos.length == 0) return this.messageService.add({ severity: 'warn', detail: 'No existen datos para los filtros aplicados.' })
        this.header = `${this.regional.nombre} - ${selectInfo.startStr}`
        this.displayDate = true;
        calendarApi.unselect();
      })
      .catch(err => {
        console.log(err)
        this.messageService.add({ severity: 'error', detail: 'Error al obtener saldos' })
        calendarApi.unselect();

      })
  }

  procesarSaldos() {
    let saldos = this.datasaldos.filter((x: any) => x.valor != null)
    this.confirmationService.confirm({
      header: `Atención!`,
      message: `Esta a punto de almacenar saldos para ${saldos.length} cuenta(s), una vez guardada esta información, no será posible actualizarla. Desea continuar?`,
      closeOnEscape: false,
      accept: () => {
        this.saldosdiarioService.procesarSaldos(saldos)
          .then(() => {
            this.messageService.add({ severity: 'success', detail: 'Registros almacenados correctamente' })
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

  cargarSaldos(data: any[]) {
    let events: EventInput[] = []
    data.forEach((x: any) => {
      events.push({
        date: x.fecha,
        editable: false,
        title: `${Intl.NumberFormat('en-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(x.saldousd)}`,
        backgroundColor: '#c7ba5d30',
        textColor: 'black'
      })
      events.push({
        date: x.fecha,
        editable: false,
        title: `${Intl.NumberFormat('en-US', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(x.saldocop)}`,
        backgroundColor: '#c7ba5d30',
        textColor: 'black'
      })
      events.push({
        date: x.fecha,
        editable: false,
        title: `${x.estado}`,
        backgroundColor: x.estado == 'OK' ? 'green' : x.estado == 'PENDIENTE' ? 'orange' : 'blue',
        textColor: 'white'
      })
    })
    this.calendarOptions.events = events;
  }

  guardarCuenta() {
    this.cuentaBancaria.regional = this.regional;
    if(!this.validarCuenta()) return;
    this.cuentabancariaService.crearCuenta(this.cuentaBancaria)
      .then(res=> {
        console.log(res);
        this.displayCuenta = false;
        this.cuentaBancaria = new CuentaBancaria();
        this.cambioMes(this.currentDate);
        this.messageService.add({severity: 'success', detail: 'Cuenta Creada.'})
      })
      .catch(err=> {
        console.log(err);
        this.messageService.add({severity: 'error', detail: err?.error?.message || 'Error al crear cuenta.'})
      })
  }

  validarCuenta() {
    let err: string[] = [];
    if (this.cuentaBancaria.entfinanciera.id == -1) err.push('La entidad financiera es obligatoria');
    if (this.cuentaBancaria.tipocuenta.id == -1) err.push('El tipo de cuenta es obligatorio');
    if (this.cuentaBancaria.moneda.id == -1) err.push('La moneda es obligatoria');
    if (this.cuentaBancaria.ncuenta == '' || this.cuentaBancaria.ncuenta.length < 3) err.push('El número de cuenta es obligatorio');
    if (!this.cuentaBancaria.fechaapertura) err.push('La fecha de apertura es obligatoria')
    if (err.length > 0) this.messageService.add({ severity: 'warn', detail: `${err.join('. ')}` })
    return err.length == 0
  }
}
