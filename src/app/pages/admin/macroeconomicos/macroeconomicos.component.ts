import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';

@Component({
  selector: 'app-macroeconomicos',
  templateUrl: './macroeconomicos.component.html',
  styleUrls: ['./macroeconomicos.component.css'],
  providers: [MessageService]
})
export class MacroeconomicosComponent implements OnInit {

  public isLoading: boolean = false;
  public macroeconomicos : MacroEconomicos[]

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

}
