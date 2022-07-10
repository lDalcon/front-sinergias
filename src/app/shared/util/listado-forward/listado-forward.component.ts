import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ut-listado-forward',
  templateUrl: './listado-forward.component.html',
  styleUrls: ['./listado-forward.component.css']
})
export class ListadoForwardComponent implements OnInit {

  @Input() data: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
