import { Component, OnInit } from '@angular/core';
import { Credito } from 'src/app/shared/models/credito.model';
import { CreditoService } from 'src/app/shared/services/credito.service';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import { MenuItem, MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css'],
  providers: [MessageService]
})
export class CreditosComponent implements OnInit {

  public canEdit: boolean = false;
  public credito: Credito = new Credito();
  public creditos: ICredito[] = [];
  public displayCredito: boolean = false;
  public displayCreditoDetalle: boolean = false;
  public displayCreditoPago: boolean = false;
  public idCreditoSelect: number = 0;
  public indexTab: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public macroEconomico: MacroEconomicos = new MacroEconomicos();

  constructor(
    private creditoService: CreditoService,
    private macroeconomicosService: MacroeconomicosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.listarCreditos();
    this.items = [
      { label: 'Detalle', icon: 'pi pi-bars', command: () => this.detalleCredito() },
      { label: 'Pago', icon: 'pi pi-times', command: () => this.pagoCredito() },
      // { separator: true },
      // { label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup'] }
    ];
  }

  agregarObligacion() {
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

  obtenerCredito() {
    this.isLoading = true;
    this.creditoService.obtenerCredito(this.idCreditoSelect)
      .then(res => {
        this.isLoading = false;
        this.credito = res
        this.displayCreditoDetalle = true;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
  }

  detalleCredito() {
    this.canEdit = false;
    this.indexTab = 0;
    this.obtenerCredito();
  }

  modificarCredito() {
    this.canEdit = true;
    this.indexTab = 0;
    this.obtenerCredito();
  }

  pagoCredito() {

  }

  calcularAmortizacion() {
    if (!this.validarCredito()) return;
    this.isLoading = true;
    this.credito.saldo = this.credito.capital;
    if (this.credito.moneda.id === 501) this.credito.saldoasignacion = this.credito.capital;
    if (this.credito.indexado?.config?.catalogo) this.getTasaIndexada()
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
    if (this.displayCreditoDetalle) {
      this.displayCreditoDetalle = false;
      return
    }
    this.isLoading = true;
    this.creditoService.crearCredito(this.credito)
      .then(res => {
        this.isLoading = false;
        this.displayCredito = false;
        this.messageService.add({ key: 'ext', severity: 'success', detail: res.message });
        this.listarCreditos();
      })
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'ext', severity: 'error', detail: err?.error?.message || 'Error al crear el crédito.' })
      })
  }

  getTasaIndexada() {
    this.macroeconomicosService.getMacroeconomicosByDateAndType(moment(this.credito.fechadesembolso).format('YYYY-MM-DD'), this.credito.indexado.descripcion)
      .then(res => this.macroEconomico = res)
      .catch(err => console.log(err))
  }

  validarCredito(): boolean {
    let error: string[] = []
    if (!this.credito.regional) error.push('La regional es obligatoria');
    if (!this.credito.moneda) error.push('La moneda es obligatoria');
    if (!this.credito.entfinanciera) error.push('La entidad es obligatoria');
    if (!this.credito.lineacredito) error.push('La linea de credito es obligatoria');
    if (!this.credito.pagare) error.push('El pagaré es obligatoria');
    if (!this.credito.tipogarantia) error.push('El tipo de garantia es obligatoria');
    if (!this.credito.fechadesembolso) error.push('La fecha de desembolso es obligatoria');
    if (!this.credito.capital) error.push('El valor de desembolso es obligatoria');
    if (!this.credito.plazo) error.push('El plazo es obligatoria');
    if (!this.credito.indexado) error.push('El indexado es obligatoria');
    if (!this.credito.spread) error.push('El spread es obligatoria');
    if (!this.credito.tipointeres) error.push('El tipo de interes es obligatoria');
    if (!this.credito.amortizacionk) error.push('La amortizacion de capital es obligatoria');
    if (!this.credito.amortizacionint) error.push('La amortizacion de interes es obligatoria');
    if (error.length != 0) this.messageService.add({ key: 'dialog', severity: 'warn', detail: error.join('. ') })
    return error.length === 0 ? true : false;
  }

  validarPagare() {
    if (!this.credito.pagare || !this.credito.entfinanciera) return;
    this.isLoading = true;
    this.creditoService.validarPagare(this.credito.pagare, this.credito.entfinanciera.id)
      .then(() => this.isLoading = false)
      .catch(err => {
        this.isLoading = false;
        this.messageService.add({ key: 'dialog', severity: 'warn', detail: err.error.message })
        this.credito.pagare = '';
      })
  }
}
