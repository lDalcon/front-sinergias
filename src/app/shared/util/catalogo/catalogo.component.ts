import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogo } from '../../models/catalogo.model';
import { ValorCatalogo } from '../../models/valor-catalogo';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'ut-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  @Input() appendTo: any;
  @Input() default: ValorCatalogo;
  @Input() disabled: boolean = false;
  @Input() idCatalogo: string = '';
  @Output() onSelect: EventEmitter<ValorCatalogo> = new EventEmitter<ValorCatalogo>();

  public catalogo: Catalogo = new Catalogo();
  public valorCatalogo: ValorCatalogo;

  constructor(
    private catalogoService: CatalogoService
  ) { }

  ngOnInit(): void {
    this.getCatalogoById();
  }

  getCatalogoById() {
    this.catalogoService.getCatalogoById(this.idCatalogo)
      .then(res => {
        this.catalogo = res;
        if (this.default) this.valorCatalogo = this.default;
      })
      .catch(err => console.log(err))
  }

  onSelectValor() {
    this.onSelect.emit(this.valorCatalogo)
  }
}
