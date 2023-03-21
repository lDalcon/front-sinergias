import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CreditoForward } from '../../models/credito-forward.model';
import { Credito } from '../../models/credito.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ut-listado-forward',
  templateUrl: './listado-forward.component.html',
  styleUrls: ['./listado-forward.component.css']
})
export class ListadoForwardComponent implements OnInit {

  @Input() viewResume: boolean = false;
  @Input() credito: Credito = new Credito();
  @Input() canDelete: boolean = false;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();

  public aplAccion: boolean = false;
  public creditoForward: CreditoForward = new CreditoForward();
  public dataSelected: any;
  public display: boolean = false;
  public header: string = '';
  public procentajeCubierto: number = 0;
  public totalAsignacion: number = 0;
  public totalSaldo: number = 0;
  public valorLiberar: number = 0;

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.totalizarForwards();
    this.aplAccion = this.sessionService.usuario.menu.role == 'ADMIN' && this.canDelete;
  }

  totalizarForwards() {
    this.totalAsignacion = this.credito.forwards.reduce((acc, cur) => {
      if (cur.estado != 'REVERSADO') acc += cur.valorasignado
      return acc;
    }, 0);
    this.totalSaldo = this.credito.forwards.reduce((acc, cur) => {
      if (cur.estado != 'REVERSADO') acc += cur.saldoasignacion
      return acc;
    }, 0);
    this.procentajeCubierto = (this.totalAsignacion / this.credito.capital) * 100;
  }

  liberarForward() {
    this.creditoForward['valor'] = this.valorLiberar;
    this.validar();
    this.data.emit(this.creditoForward);
    this.display = false;
  }

  abrirLiberar(data: any) {
    if (data.saldoasignacion == 0) {
      this.creditoForward['error'] = ['El forward no tiene saldo'];
      this.data.emit(this.creditoForward);
      return
    }
    this.dataSelected = data;
    this.header = `Liberar Fwd ${data.id}`
    this.creditoForward.seq = data.seq;
    this.creditoForward.idcredito = this.credito.id;
    this.creditoForward.idforward = data.id;
    this.creditoForward.saldoasignacion = data.saldoasignacion;
    this.creditoForward.valorasignado = data.valorasignado;
    this.valorLiberar = data.saldoasignacion;
    this.display = true;
  }

  validar() {
    let error: string[] = [];
    if (this.creditoForward.ano < this.dataSelected.ano || this.creditoForward.periodo < this.dataSelected.periodo) error.push('El periodo ingresado es menor al periodo de asignación ');
    if (this.valorLiberar > this.dataSelected.saldoasignacion) error.push('El valor a liberar supera el saldo del forward');
    this.creditoForward['error'] = error;
  }

}
