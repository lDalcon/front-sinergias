import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ut-listado-credito',
  templateUrl: './listado-credito.component.html',
  styleUrls: ['./listado-credito.component.css']
})
export class ListadoCreditoComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() hasActions: boolean = false;
  @Input() actions: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
