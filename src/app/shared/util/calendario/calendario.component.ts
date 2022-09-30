import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Calendario } from '../../interface/calendario.interface';
import { CalendarioService } from '../../services/calendario.service';

@Component({
  selector: 'ut-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  @Input() appendTo: any;
  @Input() trx: string = '';
  @Input() disabled: boolean = false;
  @Input() mes: string = '';
  @Output() onSelect: EventEmitter<Calendario> = new EventEmitter<Calendario>();

  public calendarios: Calendario[];
  public calendario: Calendario;

  constructor(
    private calendarioService: CalendarioService
  ) { }

  ngOnInit(): void {
    if(this.mes != '') this.cargarMesDefault()
    else this.obtenerCalendarioActivo()
  }

  obtenerCalendarioActivo(){
    this.calendarioService.getCalendarioActivo(this.trx)
      .then(res => this.calendarios = res)
  }
  
  onSelectValor() {
    this.onSelect.emit(this.calendario)
  }

  cargarMesDefault(){
    this.calendario.mes = this.mes;
    this.calendarios = [];
    this.calendarios.push(this.calendario);
  }

}
