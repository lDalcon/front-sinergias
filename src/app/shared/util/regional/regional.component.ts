import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Regional } from '../../models/regional.model';

@Component({
  selector: 'ut-regional',
  templateUrl: './regional.component.html',
  styleUrls: ['./regional.component.css']
})
export class RegionalComponent implements OnInit {

  @Input() appendTo: any;
  @Input() default: Regional;
  @Input() disabled: boolean = false;
  @Input() nit: string = '';
  @Input() showClear: boolean = false;
  @Input() placeholder: string = 'Seleccione una opción';
  @Output() onSelect: EventEmitter<Regional> = new EventEmitter<Regional>();

  @Input() regionales: Regional[] = [];
  public regional: Regional;

  constructor() { }

  ngOnInit(): void {
    if (this.default) this.regional = this.default;
    console.log(this.regionales)
    
  }
  
  onSelectValor() {
    this.onSelect.emit(this.regional)
  }
}
