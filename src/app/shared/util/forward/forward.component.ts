import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ut-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css']
})
export class ForwardComponent implements OnInit {

  public forwardSelected: any;
  @Input() data: any[] = [];
  @Input() appendTo: any
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onRowSelect(event: any) {
    this.forward.emit(event.data);
  }
}
