import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { IForward } from 'src/app/shared/interface/forward.interface';
import { CierreForward } from 'src/app/shared/models/cierre-forward.model';
import { CreditoForward } from 'src/app/shared/models/credito-forward.model';
import { Forward } from 'src/app/shared/models/forward.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { ForwardService } from 'src/app/shared/services/forward.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { ExcelService } from 'src/app/shared/services/util/excel.service';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ForwardComponent implements OnInit {

  public canEdit: boolean = false;
  public creditoAsignar?: ICredito;
  public creditoForward: CreditoForward = new CreditoForward();
  public display: boolean = false;
  public displayAsignar: boolean = false;
  public displayCierre: boolean = false;
  public displayDetalle: boolean = false;
  public forward: Forward = new Forward();
  public forwards: IForward[] = []
  public header: string = '';
  public idforwardSelect: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public maxDate: Date = new Date();
  public minDate: Date = new Date();
  public regional?: number;
  public usuarioSesion: Usuario;
  public cierreForward: CierreForward = new CierreForward();
  
  constructor(
    private confirmationService: ConfirmationService,
    private excelService: ExcelService,
    private forwardService: ForwardService,
    private messageService: MessageService,
    private sessionService: SessionService,
  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Detalle', icon: 'pi pi-bars', command: () => this.ejecutarAccion('detalle') },
      { label: 'Asignar', icon: 'pi pi-plus', command: () => this.ejecutarAccion('asignar') },
      { label: 'Editar', icon: 'pi pi-pencil', command: () => this.ejecutarAccion('editar') },
      { label: 'Cerrar', icon: 'pi pi-times', command: () => this.ejecutarAccion('cerrar') }
    ];
  }

  agregarForward() {
    this.forward = new Forward();
    this.display = true;
  }

  listarForward() {
    this.isLoading = true;
    let params = { saldo: 1 }
    if (this.regional) params['regional'] = this.regional;
    this.forwardService.listar(params)
      .then(res => {
        this.isLoading = false;
        this.forwards = res;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  async ejecutarAccion(accion: string) {
    this.isLoading = true;
    this.forward = await this.forwardService.obtener(this.idforwardSelect);
    this.isLoading = false;
    switch (accion) {
      case 'detalle':
        this.canEdit = false;
        this.header = `Detalle Forward - ${this.forward.id}`;
        this.displayDetalle = true;
        break;
      case 'editar':
        this.canEdit = true;
        this.calculateMinMaxDate();
        this.header = `Editar Forward - ${this.forward.id}`;
        this.displayDetalle = true;
        break;
      case 'cerrar':
        this.cierreForward = new CierreForward();
        this.cierreForward.id = this.idforwardSelect; 
        this.cierreForward.valor = this.forward.saldo;
        this.header = `Cerrar Forward - ${this.forward.id}`;
        if (this.validarCierre()) this.displayCierre = true;
        break;
      case 'asignar':
        this.creditoForward = new CreditoForward();
        this.displayAsignar = true;
        break;
      default:
        this.messageService.add({ key: 'ext', severity: 'warm', detail: 'Acción no configurada' })
        break;
    }
  }

  asignarCredito() {
    if (!this.validarAsignacion()) return;
    this.forwardService.asignarCredito(this.creditoForward)
      .then(() => {
        this.messageService.add({ key: 'ext', severity: 'success', detail: 'Crédito asignado' })
        this.displayAsignar = false;
        this.listarForward();
      })
      .catch(err => {
        console.log(err);
        this.messageService.add({ key: 'dialog', severity: 'error', detail: 'Error al asignar crédito' })
      })
  }

  calcularValorCOP() {
    if (!this.forward.tasaforward || !this.forward.valorusd) return;
    this.forward.valorcop = this.forward.tasaforward * this.forward.valorusd;
  }

  guardarForward() {
    if (!this.validarForward()) return;
    this.isLoading = true;
    this.forwardService.guardar(this.forward)
      .then((res: any) => {
        this.isLoading = false;
        this.display = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message })
        this.listarForward();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: err.error.message })
        console.log(err)
      })
  }

  actualizarForward() {
    if (!this.validarForward()) return;
    this.isLoading = true;
    this.forwardService.actualizar(this.forward)
      .then((res: any) => {
        this.isLoading = false;
        this.displayDetalle = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message })
        this.listarForward();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: err.error.message })
        console.log(err)
      })
  }

  validarForward(): boolean {
    this.forward.saldoasignacion = this.forward.valorusd;
    let error: string[] = []
    if (!this.forward.fechaoperacion) error.push('La fecha de operación es obligatoria');
    if (!this.forward.fechacumplimiento) error.push('La fecha de cumplimiento es obligatoria');
    if (!this.forward.entfinanciera) error.push('La entidad financiera es obligatoria');
    if (!this.forward.regional) error.push('La regional es obligatoria');
    if (!this.forward.valorusd) error.push('El valor USD es obligatorio');
    if (!this.forward.tasaspot) error.push('La tasa SPOT es obligatoria');
    if (!this.forward.devaluacion) error.push('La devaluación es obligatoria');
    if (!this.forward.tasaforward) error.push('La tasa forward es obligatoria');
    if (!this.forward.valorcop) error.push('El valor COP obligatorio');
    if (!this.forward.saldoasignacion) error.push('El saldoasignacion es obligatorio');
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
  }

  validarAsignacion(): boolean {
    let error: string[] = []
    this.creditoForward.idcredito = this.creditoAsignar?.id || 0;
    this.creditoForward.idforward = this.forward?.id || 0;
    if (!this.creditoForward.ano || !this.creditoForward.periodo) error.push('El mes de asignación es obligatorio');
    if (this.creditoForward.valorasignado === 0) error.push(`El valor asignado debe ser mayor a USD$0`)
    if (this.creditoForward.valorasignado === 0) error.push(`El valor asignado debe ser mayor a USD$0`)
    if (this.creditoForward.valorasignado > this.creditoAsignar?.saldoasignacion) error.push(`El valor asignado supera el saldo del credito (USD$${this.creditoAsignar.saldoasignacion})`)
    if (this.creditoForward.valorasignado > this.forward.saldoasignacion) error.push(`El valor asignado supera el saldo del forward (USD$${this.forward.saldoasignacion})`)
    if (this.creditoForward.idcredito === 0) error.push(`El credito es obligatorio`);
    if (this.creditoForward.idforward === 0) error.push(`El forward es obligatorio`);
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
  }

  validarEdicionForward(): boolean {
    let error: string[] = [];
    if (this.forward.estado != 'ACTIVO') error.push('El crédito no se encuentra ACTIVO');
    return error.length === 0;
  }

  calculateMinMaxDate() {
    this.minDate = new Date(this.forward.ano, this.forward.periodo - 1, 1);
    this.maxDate = new Date(this.forward.ano, this.forward.periodo, 0);
  }

  exportExcel() {
    this.excelService.exportExcel(this.forwards, 'forwards')
  }

  devaluacion() {
    if (this.forward.fechaoperacion && this.forward.fechacumplimiento && this.forward.tasaforward && this.forward.tasaspot) {
      this.forward.dias = moment(this.forward.fechacumplimiento).diff(moment(this.forward.fechaoperacion), 'days');
      this.forward.devaluacion = ((Math.pow((this.forward.tasaforward / this.forward.tasaspot), (365 / this.forward.dias)) - 1) * 100);
    }
  }

  validarCierre(): boolean {
    let error: string[] = [];
    if (this.displayCierre) {
      if (!this.cierreForward.periodo) error.push('El periodo de cierre es obligatorio');
      if (!this.cierreForward.observaciones) error.push('Las observaciones son obligatorias');
    }
    if (this.forward.estado == 'CERRADO') error.push('El forward ya fue cerrado');
    this.forward.creditos.forEach(credito => {
      if (credito.saldoasignacion != 0) error.push(`El forward tiene un saldo ($${credito.saldoasignacion}) asociado al crédito ${credito.id}`);
    })
    if (error.length != 0) this.messageService.add({ key: 'ext', severity: 'warn', detail: error.join('. ') })
    return error.length === 0;
  }

  cerrarForward() {
    if(!this.validarCierre()) return
    this.confirmationService.confirm({
      header: 'Esta acción no es reversible',
      message: `¿Desea continuar con el cierre del forward ${this.forward.id}?`,
      accept: () => {
        this.forwardService.cerrarForward(this.cierreForward)
          .then((res: any) => {
            this.displayCierre = false;
            this.messageService.add({ key: 'ext', severity: 'success', detail: res.message });
          })
          .catch(err => {
            console.log(err);
            this.displayCierre = false;
            this.messageService.add({ key: 'ext', severity: 'warn', detail: err?.message || 'Error no controlado' });
          })
      },
      reject: () => {
        this.messageService.add({ key: 'ext', severity: 'warn', detail: 'Acción cancelada' });
        this.displayCierre = false;
      }
    })
  }

}
