import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IForward } from 'src/app/shared/interface/forward.interface';
import { Forward } from 'src/app/shared/models/forward.model';
import { ForwardService } from 'src/app/shared/services/forward.service';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css'],
  providers: [MessageService]
})
export class ForwardComponent implements OnInit {

  public displayForward: boolean = false;
  public displayForwardDetalle: boolean = false;
  public forward: Forward = new Forward();
  public forwards: IForward[] = []
  public isLoading: boolean = false;
  public idforwardSelect: number = 0;

  constructor(
    private forwardService: ForwardService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.listarForward()
  }

  agregarForward() {
    this.forward = new Forward();
    this.displayForward = true;
  }

  listarForward() {
    this.isLoading = true;
    this.forwardService.listarForward()
      .then(res => {
        this.isLoading = false;
        this.forwards = res;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  calcularValorCOP() {
    if (!this.forward.tasaforward || !this.forward.valorusd) return;
    this.forward.valorcop = this.forward.tasaforward * this.forward.valorusd;
  }

  guardarForward() {
    if (!this.validarForward()) return;
    this.isLoading = true;
    this.forwardService.crearForward(this.forward)
      .then(res => {
        this.isLoading = false;
        this.displayForward = false;
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
}
