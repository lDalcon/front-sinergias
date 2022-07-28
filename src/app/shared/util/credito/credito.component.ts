import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICredito } from '../../interface/credito.interface';
import { CreditoService } from '../../services/credito.service';

@Component({
  selector: 'ut-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.css']
})
export class CreditoComponent implements OnInit {

  public creditos: ICredito[] = [];
  public creditoSelected?: ICredito;
  @Input() appendTo: any;
  @Input() idRegional: number;
  @Output() credito: EventEmitter<ICredito> = new EventEmitter<ICredito>();

  constructor(
    private creditoService: CreditoService
  ) { }

  ngOnInit(): void {
    this.listarCreditos();
  }

  listarCreditos() {
    let params = { saldo: 1, regional: this.idRegional };
    this.creditoService.listarCreditos(params)
      .then(res => {
        this.creditos = res.filter(x => x.estado === 'ACTIVO' && x.moneda === 'DOLAR (USD)' && x.saldoasignacion > 0);
      })
      .catch(err => console.log(err))
  }

  onRowSelect(event: any) {
    this.credito.emit(event.data)
  }

}
