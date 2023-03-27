import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Solicitud } from 'src/app/shared/models/solicitud.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SolicitudesService } from 'src/app/shared/services/solicitud.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  providers: [MessageService]
})
export class SolicitudComponent implements OnInit {

  public display: boolean = false;
  public displayDetalle: boolean = false;
  public estado: string = 'TODOS';
  public estados: string[] = ['TODOS', 'ESTUDIO', 'POR DESEMBOLSAR', 'RECHAZADO', 'DESEMBOLSADO'];
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public minDate = new Date();
  public regional?: number;
  public solicitud: Solicitud = new Solicitud();
  public solicitudes: any[] = []
  public usuarioSesion: Usuario;
  public header: string;
  public idSolicitudSelect: number;
  public dataRelevante: any[] = [];
  public total: any;

  constructor(
    private messageService: MessageService,
    private solicitudService: SolicitudesService,
    private sessionService: SessionService,
    private reporteService: ReporteService,
  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Detalle', icon: 'pi pi-bars', command: () => this.ejecutarAccion('detalle') },
      { label: 'Cerrar', icon: 'pi pi-times', command: () => this.ejecutarAccion('cerrar') }
    ];
    if (this.usuarioSesion.role == 'ADMIN') {
      this.items.push({ label: 'Tramitar', icon: 'pi pi-times', command: () => this.ejecutarAccion('tramitar') })
    }
  }

  listarSolicitudes() {
    this.isLoading = true;
    let params: any = {};
    if (this.estado != 'TODOS') params['estado'] = this.estado;
    if (this.regional) params['regional'] = this.regional;
    this.solicitudService.listar(params)
      .then(res => {
        this.isLoading = false;
        this.solicitudes = res;
      })
  }

  nuevaSolicitud() {
    this.solicitud = new Solicitud();
    this.dataRelevante = [];
    this.display = true;
  }

  guardarSolicitud() {
    if (!this.validarSolicitudGuardar()) return
    this.solicitudService.guardar(this.solicitud)
      .then((res: any) => {
        this.display = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message })
      })
      .catch(err => {
        console.log(err)
      })
  }

  validarSolicitudGuardar() {
    let err: string[] = []
    if (!this.solicitud.fechareq) err.push('La fecha es requerida');
    if (!this.solicitud.moneda) err.push('La moneda es requerida');
    if (!this.solicitud.plazo) err.push('El plazo es requerido');
    if (!this.solicitud.capital) err.push('El monto de la deuda es requerido');
    if (!this.solicitud.regional) err.push('La empresa es requerida');
    if (err.length > 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: err.join('. ') })
    return err.length == 0;
  }

  async ejecutarAccion(accion: string) {
    this.solicitud = await this.solicitudService.obtener(this.idSolicitudSelect);
    switch (accion) {
      case 'detalle':
        this.header = `Detalle crédito - ${this.solicitud.id}`;
        this.displayDetalle = true;
        break;
      default:
        this.messageService.add({ key: 'ext', severity: 'warn', detail: 'Acción no configurada' });
        break;
    }
  }

  getInfoRegistroSolicitud() {
    this.reporteService.getInfoRegistroSolicitud(this.solicitud.regional.id)
      .then(res => {
        this.total = {saldocop: 0, saldousd: 0, vencimientocop: 0, vencimientousd: 0}
        res.forEach( x => {
          this.total.saldocop += x.saldocop
          this.total.saldousd += x.saldousd
          this.total.vencimientocop += x.vencimientocop
          this.total.vencimientousd += x.vencimientousd
        })
        this.dataRelevante = res;
      })
      .catch(err => {
        console.log(err)
      })
  }
}
