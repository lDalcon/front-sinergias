import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Regional } from '../../models/regional.model';
import { RegionalService } from '../../services/regional.service';

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
  @Output() onSelect: EventEmitter<Regional> = new EventEmitter<Regional>();

  public regionales: Regional[] = [];
  public regional: Regional;

  constructor(
    private regionalService: RegionalService
  ) { }

  ngOnInit(): void {
    this.getCatalogoById();
  }

  getCatalogoById() {
    this.regionalService.getReginalByNit(this.nit)
      .then(res => {
        this.regionales = res;
        if (this.default) this.regional = this.default;
      })
      .catch(err => console.log(err))
  }

  onSelectValor() {
    this.onSelect.emit(this.regional)
  }
}
