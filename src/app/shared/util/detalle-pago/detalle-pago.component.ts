import { Component, Input, OnInit } from '@angular/core';
import { DetallePago } from '../../models/detalle-pago.model';

@Component({
  selector: 'ut-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {

  private _data: DetallePago[] = [];
  @Input() prefix: string = '';
  @Input() aplAccion: boolean = false;

  @Input() get data(): DetallePago[] {
    return this._data;
  }

  set data(value: DetallePago[]) {
    this._data = value;
  }

  constructor() { }

  ngOnInit(): void {

  }

  deleteRow(index: number) {
    this._data.splice(index, 1);
  }
}
