import { Component, OnInit } from '@angular/core';
import { Credito } from 'src/app/shared/models/credito.model';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css'],
  providers: [MessageService]
})
export class CreditosComponent implements OnInit {

  public creditos: Credito[] = [];
  public credito: Credito = new Credito();
  public isLoading: boolean = false;
  public displayCredito: boolean = false;
  public indexTab: number = 0;
  public macroEconomico: MacroEconomicos = new MacroEconomicos();
  constructor(
    private macroeconomicosService: MacroeconomicosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

  }

  agregarCredito() {
    this.credito = new Credito();
    this.displayCredito = true;
  }

  procesarCredito() {
    this.indexTab === 0 ? this.calcularAmortizacion() : this.guardarCredito();
  }

  async calcularAmortizacion() {
    this.indexTab = 1;
    this.isLoading = true;
    this.macroEconomico = await this.getTasaIndexada()
    this.credito.amortizacion = [];
    this.credito.amortizacion.push({
      nper: 0,
      fechaPeriodo: this.credito.fechadesembolso,
      tasaIdxEA: this.macroEconomico.valor,
      spreadEA: this.credito.spread,
      tasaEA: this.macroEconomico.valor + this.credito.spread,
      saldoCapital: this.credito.capital,
      valorInteres: 0,
      abonoCapital: 0,
      pagoTotal: 0,
      interesCausado: 0,
      actualizaIdx: false,
    })
    for (let i = 1; i <= this.credito.plazo; i++) {
      this.credito.amortizacion.push({
        nper: i,
        fechaPeriodo: new Date(new Date(this.credito.amortizacion[i - 1].fechaPeriodo).setDate(this.credito.amortizacion[i - 1].fechaPeriodo.getDate() + 30)),
        tasaIdxEA: this.macroEconomico.valor,
        spreadEA: this.credito.spread,
        tasaEA: this.macroEconomico.valor + this.credito.spread,
        saldoCapital: this.credito.capital,
        valorInteres: 0,
        abonoCapital: 0,
        pagoTotal: 0,
        interesCausado: 0,
        actualizaIdx: false
      })
    }
    this.isLoading = false;
  }

  guardarCredito() {

  }

  getTasaIndexada(): Promise<MacroEconomicos> {
    return new Promise((resolve, reject) => {
      this.macroeconomicosService.getMacroeconomicosByDateAndType(moment(this.credito.fechadesembolso).format('YYYY-MM-DD'), this.credito.indexado.descripcion)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

}
