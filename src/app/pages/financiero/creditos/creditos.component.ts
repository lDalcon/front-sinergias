import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Credito } from 'src/app/shared/models/credito.model';
import { CreditoService } from 'src/app/shared/services/credito.service';
import { DetallePago } from 'src/app/shared/models/detalle-pago.model';
import { DetallePagoService } from 'src/app/shared/services/detalle-pago.service';
import { ExcelService } from 'src/app/shared/services/util/excel.service';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { ValorCatalogo } from 'src/app/shared/models/valor-catalogo';
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CreditosComponent implements OnInit {

  public aplTRM: boolean = false;
  public canEdit: boolean = false;
  public canEditTRM: boolean = false;
  public credito: Credito = new Credito();
  public creditos: ICredito[] = [];
  public detallePago: DetallePago = new DetallePago();
  public display: boolean = false;
  public displayDetalle: boolean = false;
  public displayPago: boolean = false;
  public fechaPago: Date;
  public idCreditoSelect: number = 0;
  public indexTab: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public macroEconomico: MacroEconomicos = new MacroEconomicos();
  public pagos: DetallePago[] = [];
  public regional?: number;
  public totalDesembolso: number = 0;
  public totalSaldo: number = 0;
  public usuarioSesion: Usuario;

  constructor(
    private confirmationService: ConfirmationService,
    private creditoService: CreditoService,
    private detallePagoService: DetallePagoService,
    private excelService: ExcelService,
    private macroeconomicosService: MacroeconomicosService,
    private messageService: MessageService,
    private sessionService: SessionService,
  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Detalle', icon: 'pi pi-bars', command: () => this.ejecutarAccion('detalle') },
      { label: 'Pago', icon: 'pi pi-credit-card', command: () => this.ejecutarAccion('pago') }
    ];
  }

  async ejecutarAccion(accion: string) {
    this.isLoading = true;
    this.credito = await this.creditoService.obtenerCredito(this.idCreditoSelect);
    this.isLoading = false;
    switch (accion) {
      case 'detalle':
        this.indexTab = 0;
        this.canEdit = false;
        this.displayDetalle = true;
        break;
      case 'pago':
        this.detallePago = new DetallePago();
        this.pagos = [];
        this.displayPago = true;
        break;
      default:
        break;
    }
  }

  agregarObligacion() {
    this.credito = new Credito();
    this.display = true;
    this.indexTab = 0;
  }

  listarCreditos() {
    this.isLoading = true;
    let params = { saldo: 1 }
    if (this.regional) params['regional'] = this.regional;
    this.creditoService.listarCreditos(params)
      .then(res => {
        this.isLoading = false;
        this.creditos = res;
        this.totalDesembolso = this.creditos.reduce((acc, cur) => acc+= cur.capital, 0)
        this.totalSaldo = this.creditos.reduce((acc, cur) => acc+= cur.saldo, 0)
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  procesarCredito() {
    this.indexTab === 0 ? this.calcularAmortizacion() : this.guardarCredito();
  }

  obtenerCredito() {
    this.isLoading = true;
    this.creditoService.obtenerCredito(this.idCreditoSelect)
      .then(res => {
        this.isLoading = false;
        this.credito = res
        this.displayDetalle = true;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  detalleCredito() {
    this.canEdit = false;
    this.indexTab = 0;
    this.obtenerCredito();
  }

  modificarCredito() {
    this.canEdit = true;
    this.indexTab = 0;
    this.obtenerCredito();
  }

  calcularAmortizacion() {
    if (!this.validarCredito()) return;
    this.isLoading = true;
    this.credito.saldo = this.credito.capital;
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

  guardarCredito() {
    if (this.displayDetalle) {
      this.displayDetalle = false;
      return
    }
    this.isLoading = true;
    this.creditoService.crearCredito(this.credito)
      .then(res => {
        this.isLoading = false;
        this.display = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message });
        this.listarCreditos();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: err?.error?.message || 'Error al crear el crédito.' })
      })
  }

  getTasaIndexada() {
    this.macroeconomicosService.getMacroeconomicosByDateAndType(moment(this.credito.fechadesembolso).format('YYYY-MM-DD'), this.credito.indexado.descripcion)
      .then(res => this.macroEconomico = res)
      .catch(err => console.log(err))
  }


  guardarDetallePago() {
    if (!this.validarDetallePago()) return;
    this.pagos.push(this.detallePago);
    this.detallePago = new DetallePago();
    this.detallePago.fechapago = this.fechaPago;
  }

  limpiarDetallePago() {
    this.detallePago = new DetallePago()
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
    if (!this.credito.spread) error.push('El spread es obligatoria');
    if (!this.credito.tipointeres) error.push('El tipo de interes es obligatoria');
    if (!this.credito.amortizacionk) error.push('La amortizacion de capital es obligatoria');
    if (!this.credito.amortizacionint) error.push('La amortizacion de interes es obligatoria');
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
  }

  validarDetallePago() {
    let error: string[] = []
    this.detallePago.idcredito = this.credito.id;
    if (!this.detallePago.fechapago) error.push('La fecha de pago es obligatoria');
    if (!this.detallePago.tipopago) error.push('El tipo de pago es obligatorio');
    if (!this.detallePago?.formapago) error.push('La forma de pago es obligatoria');
    if (this.detallePago?.formapago === 'FORWARD' && !this.detallePago.idforward) error.push('El forward es obligatorio');
    if (this.detallePago?.valor <= 0) error.push('El valor del pago debe ser mayor a $0');
    if (this.credito.moneda.id === 501 && this.detallePago.trm === 0) error.push('El valor de la TRM debe ser distinto a $0');
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
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

  seleccionForward(event: any) {
    let fechaPago: string = moment(this.detallePago.fechapago).format('YYYY-MM-DD');
    if (fechaPago != event.fechacumplimiento) {
      this.aplTRM = true;
      this.canEditTRM = true;
      this.detallePago.trm = 0;
      this.messageService.add({ key: 'dialog', severity: 'warn', detail: 'La fecha de cumplimiento no coincide con la fecha de pago, se debe indicar la tasa.' })
    } else {
      this.aplTRM = true;
      this.canEditTRM = false;
      this.detallePago.trm = event.tasaspot;
    }
    this.detallePago.idforward = event.id;
  }

  seleccionFormaPago(event: ValorCatalogo) {
    if (event.descripcion === 'SPOT') {
      this.aplTRM = true;
      this.canEditTRM = true;
    }
    else this.aplTRM = false;
    this.detallePago.formapago = event.descripcion;
  }

  cambioFechaPago() {
    this.detallePago.idforward = undefined;
    this.detallePago.formapago = undefined;
    this.fechaPago = this.detallePago.fechapago;
  }

  guardarPagos() {
    if (this.pagos.length === 0) return this.messageService.add({ key: 'dialog', severity: 'warn', detail: 'Debe asignar pagos para continuar' });
    let totalCapital: number = this.pagos.reduce((acc, cur) => acc += cur.tipopago === 'Capital' ? cur.valor : 0, 0);
    let totalInteres: number = this.pagos.reduce((acc, cur) => acc += cur.tipopago === 'Interes' ? cur.valor : 0, 0);
    if (totalCapital > this.credito.saldo) return this.messageService.add({ key: 'dialog', severity: 'warn', detail: 'Los pagos a capital superan el saldo adeudado' });
    let message: string = `Resumen de pago: 
    Capital: ${Intl.NumberFormat('en-US', { style: 'currency', currency: this.credito.moneda.config.prefix, minimumFractionDigits: 0 }).format(totalCapital)}. 
    Interes: ${Intl.NumberFormat('en-US', { style: 'currency', currency: this.credito.moneda.config.prefix, minimumFractionDigits: 0 }).format(totalInteres)}. 
    ¿Desaea continuar?`
    this.confirmationService.confirm({
      message,
      header: 'Atención',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        this.detallePagoService.procesarDetallePago(this.pagos)
          .then(() => {
            this.isLoading = false;
            this.messageService.add({ key: 'ext', severity: 'success', detail: 'Pagos registrados.' });
            this.displayPago = false;
            this.listarCreditos();
          })
          .catch(err => {
            console.log(err);
            this.isLoading = false;
            this.messageService.add({ key: 'dialog', severity: 'error', detail: 'Error al registrar los pagos' });

          })
      },
      reject: () => {
        this.messageService.add({ key: 'dialog', severity: 'warn', detail: 'Acción cancelada' });
      }
    });
  }

  exportExcel() {
    this.excelService.exportExcel(this.creditos, 'obligaciones')
  }
}
