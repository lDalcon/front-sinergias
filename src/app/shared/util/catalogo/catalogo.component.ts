import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValorCatalogo } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'ut-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  @Input() idCatalogo: string = '';
  @Input() idValorCatalogo: number = -1;
  @Input() appendTo: any;
  @Input() disabled: boolean = false;
  @Output() onSelect: EventEmitter<ValorCatalogo> = new EventEmitter<ValorCatalogo>();

  public valoresCatalogo: ValorCatalogo[] = [];
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
        this.valoresCatalogo = res;
        if(this.idValorCatalogo != -1) this.valorCatalogo = this.valoresCatalogo.find(x=> x.id === this.idValorCatalogo)
      })
      .catch(err => console.log(err))
  }

  onSelectValor() {
    this.onSelect.emit(this.valorCatalogo)
  }
}
