import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CreditoForward } from '../../models/credito-forward.model';
import { Credito } from '../../models/credito.model';

@Component({
  selector: 'ut-listado-forward',
  templateUrl: './listado-forward.component.html',
  styleUrls: ['./listado-forward.component.css']
})
export class ListadoForwardComponent implements OnInit {

  @Input() viewResume: boolean = false;
  @Input() credito: Credito = new Credito();
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  public totalAsignacion: number = 0;
  public totalSaldo: number = 0;
  public procentajeCubierto: number = 0;
  public creditoForward: CreditoForward = new CreditoForward();
  public display: boolean = false;
  public valorLiberar: number = 0;
  public header: string = '';
  public dataSelected: any;

  constructor() { }

  ngOnInit(): void {
    this.totalizarForwards();
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
    if(data.saldoasignacion == 0) {
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
    if ((this.dataSelected.valorasignado - this.valorLiberar) > this.dataSelected.saldoasignacion) error.push('El valor a liberar supera el saldo del forward');
    this.creditoForward['error'] = error;
  }

}
