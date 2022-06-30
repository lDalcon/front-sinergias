import { Component, OnInit } from '@angular/core';
import { Credito } from 'src/app/shared/models/credito.model';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CreditoService } from 'src/app/shared/services/credito.service';
import { ICredito } from 'src/app/shared/interface/credito.interface';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css'],
  providers: [MessageService]
})
export class CreditosComponent implements OnInit {

  public creditos: ICredito[] = [];
  public credito: Credito = new Credito();
  public isLoading: boolean = false;
  public displayCredito: boolean = false;
  public indexTab: number = 0;
  public macroEconomico: MacroEconomicos = new MacroEconomicos();
  constructor(
    private macroeconomicosService: MacroeconomicosService,
    private creditoService: CreditoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.listarCreditos()
  }

  agregarCredito() {
    this.credito = new Credito();
    this.displayCredito = true;
  }

  listarCreditos() {
    this.isLoading = true;
    this.creditoService.listarCreditos()
      .then(res => {
        this.isLoading = false;
        this.creditos = res;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  procesarCredito() {
    this.indexTab === 0 ? this.calcularAmortizacion() : this.guardarCredito();
  }

  calcularAmortizacion() {
    this.isLoading = true;
    this.credito.saldo = this.credito.capital;
    this.getTasaIndexada()
    this.creditoService.simularCredito(this.credito)
      .then(res => {
        this.credito = res;
        this.indexTab = 1;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err)
        this.isLoading = false;
      })
  }

  guardarCredito() {
    this.isLoading = true;
    this.creditoService.crearCredito(this.credito)
      .then(res => {
        this.isLoading = false;
        this.displayCredito = false;
        this.messageService.add({ severity: 'success', detail: res.message })
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', detail: err?.error?.message || 'Error al crear el crédito.' })
      })
  }

  getTasaIndexada() {
    this.macroeconomicosService.getMacroeconomicosByDateAndType(moment(this.credito.fechadesembolso).format('YYYY-MM-DD'), this.credito.indexado.descripcion)
      .then(res => this.macroEconomico = res)
      .catch(err => console.log(err))
  }
}
