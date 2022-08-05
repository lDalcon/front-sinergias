import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MenuItem, MessageService } from 'primeng/api';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { IForward } from 'src/app/shared/interface/forward.interface';
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
  providers: [MessageService]
})
export class ForwardComponent implements OnInit {

  public canEdit: boolean = false;
  public creditoAsignar?: ICredito;
  public creditoForward: CreditoForward = new CreditoForward();
  public display: boolean = false;
  public displayAsignar: boolean = false;
  public displayDetalle: boolean = false;
  public forward: Forward = new Forward();
  public forwards: IForward[] = []
  public idforwardSelect: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public usuarioSesion: Usuario;
  public regional?: number;

  constructor(
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
      { label: 'Asignar', icon: 'pi pi-plus', command: () => this.ejecutarAccion('asignar') }
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
        this.displayDetalle = true;
        break;
      case 'asignar':
        this.creditoForward = new CreditoForward();
        this.displayAsignar = true;
        break;
      default:
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
      .then(res => {
        this.isLoading = false;
        this.display = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: 'Forward creado!' })
        this.listarForward();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: 'Error al crear forward' })
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
    if (this.creditoForward.valorasignado === 0) error.push(`El valor asignado debe ser mayor a USD$0`)
    if (this.creditoForward.valorasignado === 0) error.push(`El valor asignado debe ser mayor a USD$0`)
    if (this.creditoForward.valorasignado > this.creditoAsignar?.saldoasignacion) error.push(`El valor asignado supera el saldo del credito (USD$${this.creditoAsignar.saldoasignacion})`)
    if (this.creditoForward.valorasignado > this.forward.saldoasignacion) error.push(`El valor asignado supera el saldo del forward (USD$${this.forward.saldoasignacion})`)
    if (this.creditoForward.idcredito === 0) error.push(`El credito es obligatorio`);
    if (this.creditoForward.idforward === 0) error.push(`El forward es obligatorio`);
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
  }

  exportExcel() {
    this.excelService.exportExcel(this.forwards, 'forwards')
  }

  devaluacion(){
    if(this.forward.fechaoperacion && this.forward.fechacumplimiento && this.forward.tasaforward && this.forward.tasaspot){
      this.forward.dias = moment(this.forward.fechacumplimiento).diff(moment(this.forward.fechaoperacion), 'days');
      this.forward.devaluacion = (Math.pow((this.forward.tasaforward / this.forward.tasaspot), (365 / this.forward.dias)) - 1) * 100;
    }
  }

}
