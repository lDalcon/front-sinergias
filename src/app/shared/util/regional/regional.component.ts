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
