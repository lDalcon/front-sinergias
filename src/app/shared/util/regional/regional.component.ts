import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Regional } from '../../models/regional.model';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'ut-regional',
  templateUrl: './regional.component.html',
  styleUrls: ['./regional.component.css']
})
export class RegionalComponent implements OnInit {

  @Input() nit: string = '';
  @Input() idRegional: number = -1;
  @Input() appendTo: any;
  @Input() disabled: boolean = false;
  @Output() onSelect: EventEmitter<Regional> = new EventEmitter<Regional>();

  public regionales: Regional[] = [];
  public regional: Regional;

  constructor(
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getCatalogoById();
  }

  getCatalogoById() {
    this.empresaService.getReginalByNit(this.nit)
      .then(res => {
        this.regionales = res;
        if(this.idRegional != -1) this.regional = this.regionales.find(x=> x.id === this.idRegional)
      })
      .catch(err => console.log(err))
  }

  onSelectValor() {
    this.onSelect.emit(this.regional)
  }
}
