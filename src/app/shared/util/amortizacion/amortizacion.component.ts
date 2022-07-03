import { Component, Input, OnInit } from '@angular/core';
import { Amortizacion } from '../../models/credito.model';

@Component({
  selector: 'ut-amortizacion',
  templateUrl: './amortizacion.component.html',
  styleUrls: ['./amortizacion.component.css']
})
export class AmortizacionComponent implements OnInit {

  @Input() data: Amortizacion[] = [];
  @Input() prefix: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
