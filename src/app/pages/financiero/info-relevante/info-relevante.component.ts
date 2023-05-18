import { Component, OnInit, ViewChild } from '@angular/core';
import { Regional } from 'src/app/shared/models/regional.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ConfirmationService, MessageService } from 'primeng/api';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SessionService } from 'src/app/shared/services/session.service';
import { InfoRelevanteService } from 'src/app/shared/services/info-relevante.service';

@Component({
  selector: 'app-info-relevante',
  templateUrl: './info-relevante.component.html',
  styleUrls: ['./info-relevante.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class InfoRelevanteComponent implements OnInit {

  public regional: Regional;
  public isLoading: boolean = false;
  public user: Usuario;
  public range: any;
  public data: any = [];
  public datasaldos: any[] = [];
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

  constructor(
    private confirmationService: ConfirmationService,
    private infoRelevanteService: InfoRelevanteService,
    private messageService: MessageService,
    public sessionService: SessionService,
  ) {
    this.user = this.sessionService.usuario;
  }

  ngOnInit(): void {
  }

  fechaSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    this.infoRelevanteService.listarInfoRelevante({ fecha: selectInfo.startStr, regional: this.regional.id })
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
  cambioMes(info: any) {
    this.currentDate = info
    this.listar({ fechainicial: info.startStr, fechafinal: info.endStr, regional: this.regional.id })
  }

  listar(params: { fechainicial: string, fechafinal: string, regional: number }) {
    this.isLoading = true;
    this.infoRelevanteService.listar(params)
      .then(res => {
        this.cargarInfo(res)
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err)
        this.messageService.add({ severity: 'warn', detail: err?.error?.message || 'Error no controlado.' })
        this.isLoading = false;
      })
  }

  cargarInfo(data: any[]) {
    let events: EventInput[] = []
    data.forEach((x: any) => {
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

  procesarInforelevante() {
    let saldos = this.datasaldos.filter((x: any) => x.valor == null)
    if (saldos.length > 0) return this.messageService.add({severity: 'warn', detail: 'Es necesario registrar todos los datos.'})
    this.confirmationService.confirm({
      header: `Atención!`,
      message: `Esta a punto de almacenar la información, una vez guardada, no será posible actualizarla. Desea continuar?`,
      closeOnEscape: false,
      accept: () => {
        this.infoRelevanteService.procesarInforelevante(this.datasaldos)
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
}
