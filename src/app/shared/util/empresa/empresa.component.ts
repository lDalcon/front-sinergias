import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Empresa } from '../../models/empresa.model';

@Component({
  selector: 'ut-empresa',
  templateUrl: './empresa.component.html',
})
export class EmpresaComponent implements OnInit {
  @Input() appendTo: any;
  @Input() default: Empresa;
  @Input() disabled: boolean = false;
  @Input() nit: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() empresas: Empresa[] = [];
  @Input() showClear: boolean = false;
  @Output() onSelect: EventEmitter<Empresa> = new EventEmitter<Empresa>();

  public empresa: Empresa;

  constructor() {}

  ngOnInit(): void {
    if (this.default) this.empresa = this.default;
  }

  onSelectValor() {
    this.onSelect.emit(this.empresa);
  }
}
