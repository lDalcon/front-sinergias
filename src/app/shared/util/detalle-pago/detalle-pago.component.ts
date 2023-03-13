import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DetallePago } from '../../models/detalle-pago.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ut-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {

  private _data: DetallePago[] = [];
  @Input() prefix: string = '';
  @Input() get data(): DetallePago[] {
    return this._data;
  }
  set data(value: DetallePago[]) {
    this._data = value;
  }
  @Output() onDelete: EventEmitter<DetallePago> = new EventEmitter<DetallePago>();

  public aplAccion: boolean = false;

  constructor(
    private sessionService: SessionService
  ) {
    this.aplAccion = this.sessionService.usuario.menu.role == 'ADMIN';
  }

  ngOnInit(): void {
  }

  deleteRow(detallepago: DetallePago) {
    this.onDelete.emit(detallepago)
  }
}
