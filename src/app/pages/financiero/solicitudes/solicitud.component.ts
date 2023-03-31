import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Credito } from 'src/app/shared/models/credito.model';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { Solicitud } from 'src/app/shared/models/solicitud.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { CreditoService } from 'src/app/shared/services/credito.service';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SolicitudesService } from 'src/app/shared/services/solicitud.service';
import * as moment from 'moment';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  providers: [MessageService]
})
export class SolicitudComponent implements OnInit {

  public credito: Credito = new Credito();
  public dataRelevante: any[] = [];
  public display: boolean = false;
  public displayCrearCredito: boolean = false;
  public displayDetalle: boolean = false;
  public displayValorDesembolso: boolean = false;
  public estado: string = 'TODOS';
  public estados: string[] = ['TODOS', 'ESTUDIO', 'POR DESEMBOLSAR', 'RECHAZADO', 'DESEMBOLSADO'];
  public header: string;
  public idSolicitudSelect: number;
  public indexTab: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public minDate = new Date();
  public regional?: number;
  public solicitud: Solicitud = new Solicitud();
  public solicitudes: any[] = []
  public total: any;
  public usuarioSesion: Usuario;
  public macroEconomico: MacroEconomicos = new MacroEconomicos();


  constructor(
    private creditoService: CreditoService,
    private messageService: MessageService,
    private reporteService: ReporteService,
    private sessionService: SessionService,
    private solicitudService: SolicitudesService,
    private macroeconomicosService: MacroeconomicosService,

  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    if (this.usuarioSesion.menu.role == 'ADMIN') {
      this.items.push({ label: 'Desembolsar', icon: 'pi pi-credit-card', command: () => this.ejecutarAccion('Desembolsar') })
      this.items.push({ label: 'Cerrar', icon: 'pi pi-times', command: () => this.ejecutarAccion('Cerrar') })
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
        this.listarSolicitudes();
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
      case 'Desembolsar':
        this.credito = new Credito();
        this.credito.idsolicitud = this.solicitud.id;
        this.credito.moneda = this.solicitud.moneda;
        this.credito.regional = this.solicitud.regional;
        this.credito.plazo = this.solicitud.plazo;
        this.credito.capital = this.solicitud.capital - this.solicitud.desembolso;
        this.header = `Desembolsar solicitud - ${this.solicitud.id}`;
        this.displayValorDesembolso = true;
        break;
      default:
        this.messageService.add({ key: 'ext', severity: 'warn', detail: 'Acción no configurada' });
        break;
    }
  }

  getInfoRegistroSolicitud() {
    this.reporteService.getInfoRegistroSolicitud(this.solicitud.regional.id)
      .then(res => {
        this.total = { saldocop: 0, saldousd: 0, vencimientocop: 0, vencimientousd: 0 }
        res.forEach(x => {
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


  validarPagare() {
    if (!this.credito.pagare || !this.credito.entfinanciera) return;
    this.isLoading = true;
    this.creditoService.validarPagare(this.credito.pagare, this.credito.entfinanciera.id)
      .then(() => this.isLoading = false)
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'dialog', severity: 'warn', detail: err.error.message })
        this.credito.pagare = '';
      })
  }

  guardarValorDesembolso() {
    if (this.credito.capital == 0) return this.messageService.add({ key: 'dialog', severity: 'warn', detail: 'Debe ingresar el valor a desembolsar' })
    this.indexTab = 0;
    this.displayValorDesembolso = false;
    this.displayCrearCredito = true;
  }

  calcularAmortizacion() {
    if (!this.validarCredito()) return;
    this.isLoading = true;
    this.credito.saldo = this.credito.capital;
    this.credito.estado = this.credito.capital > 0 ? 'ACTIVO' : 'CXC';
    if (this.credito.moneda.id === 501) this.credito.saldoasignacion = this.credito.capital;
    if (this.credito.indexado?.config?.catalogo) this.getTasaIndexada()
    this.creditoService.simularCredito(this.credito)
      .then(res => {
        this.credito = res;
        this.indexTab = 1;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err)
        this.isLoading = false;
      })
  }

  validarCredito(): boolean {
    let error: string[] = []
    if (!this.credito.regional) error.push('La regional es obligatoria');
    if (!this.credito.moneda) error.push('La moneda es obligatoria');
    if (!this.credito.entfinanciera) error.push('La entidad es obligatoria');
    if (!this.credito.lineacredito) error.push('La linea de credito es obligatoria');
    if (!this.credito.pagare) error.push('El pagaré es obligatoria');
    if (!this.credito.tipogarantia) error.push('El tipo de garantia es obligatoria');
    if (!this.credito.fechadesembolso) error.push('La fecha de desembolso es obligatoria');
    if (!this.credito.capital) error.push('El valor de desembolso es obligatoria');
    if (!this.credito.plazo) error.push('El plazo es obligatoria');
    if (!this.credito.indexado) error.push('El indexado es obligatoria');
    if (!this.credito.tipointeres) error.push('El tipo de interes es obligatoria');
    if (!this.credito.amortizacionk) error.push('La amortizacion de capital es obligatoria');
    if (!this.credito.amortizacionint) error.push('La amortizacion de interes es obligatoria');
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0;
  }

  getTasaIndexada() {
    this.macroeconomicosService.getMacroeconomicosByDateAndType(moment(this.credito.fechadesembolso).format('YYYY-MM-DD'), this.credito.indexado.descripcion)
      .then(res => this.macroEconomico = res)
      .catch(err => console.log(err))
  }

  procesarCredito() {
    this.indexTab === 0 ? this.calcularAmortizacion() : this.guardarCredito();
  }

  guardarCredito() {
    if (this.displayDetalle) {
      this.displayDetalle = false;
      return
    }
    this.displayCrearCredito = false;
    this.isLoading = true;
    this.creditoService.crearCredito(this.credito)
      .then(res => {
        this.isLoading = false;
        this.display = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message });
        this.listarSolicitudes();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: err?.error?.message || 'Error al crear el crédito.' })
      })
  }
}
