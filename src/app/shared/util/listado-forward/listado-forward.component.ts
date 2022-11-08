import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ut-listado-forward',
  templateUrl: './listado-forward.component.html',
  styleUrls: ['./listado-forward.component.css']
})
export class ListadoForwardComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() hasActions: boolean = false;
  @Input() actions: any[] = [];
  @Input() viewResume: boolean = false;
  @Input() valorCredito: number = 1;

  public totalAsignacion: number = 0;
  public totalSaldo: number = 0;
  public procentajeCubierto: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.totalizarForwards();
  }

  totalizarForwards(){
    this.totalAsignacion = this.data.reduce((acc, cur)=> {
      if(cur.estado != 'REVERSADO') acc += cur.valorasignado
      return acc;
    }, 0);
    this.totalSaldo = this.data.reduce((acc, cur)=> {
      if(cur.estado != 'REVERSADO') acc += cur.saldoasignacion
      return acc;
    }, 0);
    this.procentajeCubierto = (this.totalAsignacion / this.valorCredito) * 100;
  }
}
