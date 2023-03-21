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
  @Input() canDelete: boolean = false;
  @Input() prefix: string = '';
  @Input() get data(): DetallePago[] {
    return this._data;
  }
  set data(value: DetallePago[]) {
    this._data = value;
  }
  @Output() onDelete: EventEmitter<DetallePago> = new EventEmitter<DetallePago>();

  public aplAccion: boolean = false;
  public detallePago: DetallePago = new DetallePago();
  public display: boolean = false;
  public header: string = ''
  public minDate: Date;
  public maxDate: Date = new Date();
  public fechaRev: Date = new Date();

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.aplAccion = this.sessionService.usuario.menu.role == 'ADMIN' && this.canDelete;
  }

  deleteRow(detallepago: DetallePago) {
    this.minDate = new Date(detallepago.fechapago);
    this.header = `Reversar Pago ${detallepago.seq}`
    this.detallePago = detallepago;
    this.display = true;
  }

  deleteDetallePago() {
    this.detallePago.fechapago = this.fechaRev
    this.onDelete.emit(this.detallePago)
    this.display = false;
  }
}
