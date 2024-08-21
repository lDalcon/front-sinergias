import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { EAumCapital } from 'src/app/shared/enum/aumento-capital.enum';
import { IAumentoCapital } from 'src/app/shared/interface/aumento-capital.interface';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { Credito } from 'src/app/shared/models/credito.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { AumentoCapitalService } from 'src/app/shared/services/aumento-capital.service';
import { CreditoService } from 'src/app/shared/services/credito.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ConstructorComponent implements OnInit {
  public usuarioSesion: Usuario;
  public creditos: ICredito[] = [];
  public credito: Credito;
  public idCreditoSelected: number = 0;
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public displayDesembolsar: boolean = false;
  public displayRevalorizar: boolean = false;
  public displayDetalle: boolean = false;
  public aumentoCapital: IAumentoCapital;
  public detalleAumentoCap: IAumentoCapital[] = [];
  public header: string = '';
  public totalDeuda: number = 0;

  constructor(
    private sessionService: SessionService,
    private creditoService: CreditoService,
    private messageService: MessageService,
    private aumentoCapitalService: AumentoCapitalService
  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    this.listarCreditos();
    this.items = [
      {
        label: 'Histórico',
        icon: 'pi pi-history',
        command: () => this.ejecutarAccion('detalle'),
      },
      {
        label: 'Revalorizar',
        icon: 'pi pi-angle-double-up',
        command: () => this.ejecutarAccion('revalorizar'),
      },
      {
        label: 'Desembolsar',
        icon: 'pi pi-dollar',
        command: () => this.ejecutarAccion('desembolso'),
      },
    ];
  }

  listarCreditos() {
    this.isLoading = true;
    this.creditoService
      .listarCreditos({ lineacredito: 603, estado: 'ACTIVO' })
      .then((res) => (this.creditos = res))
      .catch((err) => console.log(err))
      .finally(() => (this.isLoading = false));
  }

  async ejecutarAccion(accion: string) {
    this.credito = await this.creditoService.obtenerCredito(this.idCreditoSelected);
    switch (accion) {
      case 'detalle':
        this.header = `Detalle (${this.idCreditoSelected})`;
        this.listarAumentoCapital(this.idCreditoSelected);
        break;
      case 'desembolso':
        this.header = `Crear desembolso (${this.idCreditoSelected})`;
        this.aumentoCapital = {
          tipo: EAumCapital.DESEMBOLSO,
          idcredito: this.credito.id
        };
        this.displayDesembolsar = true;
        break;
      case 'revalorizar':
        this.header = `Revalorizar deuda (${this.idCreditoSelected})`;
        this.aumentoCapital = {
          tipo: EAumCapital.REVALORIZAR,
          idcredito: this.credito.id,
        }
        this.totalDeuda = this.credito.saldo;
        this.displayRevalorizar = true;
        break;
      default:
        this.messageService.add({
          key: 'ext',
          severity: 'warn',
          detail: 'Acción no configurada',
        });
        break;
    }
  }

  guardar(){
    if (!this.validarAumentoCapital()) return;
    this.isLoading = true;
    this.aumentoCapitalService.guardar(this.aumentoCapital)
      .then(res=> this.messageService.add({ severity: 'success', key: 'ext', detail: res.message }))
      .catch(err => this.messageService.add({ severity: 'warn', key: 'ext', detail: err.error.message || err.message }))
      .finally(()=> {
        this.isLoading = false;
        this.displayDesembolsar = false;
        this.displayRevalorizar = false;
        this.listarCreditos();
      })

  }

  validarAumentoCapital(){
    console.log(moment(this.aumentoCapital.fecha).diff(this.credito.fechadesembolso, 'day'));
    let err: string[] = [];
    if (!this.aumentoCapital.fecha) err.push('La fecha es obligatoria.');
    if (!this.aumentoCapital.valor) err.push('El valor es obligatorio.');
    if (moment(this.credito.fechadesembolso).diff(this.aumentoCapital.fecha, 'day') > 0) err.push(`La fecha del nuevo desembolso no puede ser menor al desembolso inicial.`) 
    if (err.length > 0 ) this.messageService.add({ severity: 'warn', key: 'dialog', detail: err.join('. ') })
    else {
      this.aumentoCapital.fecha = 
        this.aumentoCapital.tipo === EAumCapital.REVALORIZAR ? 
        moment(this.aumentoCapital.fecha).endOf('M').format('YYYY-MM-DD') : 
        moment(this.aumentoCapital.fecha).format('YYYY-MM-DD');
    }
    return err.length == 0;
  }

  listarAumentoCapital(idcredito: number) {
    this.isLoading = true;
    this.aumentoCapitalService.listar(idcredito)
      .then((res) => {
        if (res.data.length === 0 ) return this.messageService.add({ severity: 'info', key: 'ext', detail: 'No existen detalles asociados al credito.'})
        this.detalleAumentoCap = res.data;
        this.displayDetalle = true;
      })
      .catch(err => this.messageService.add({ severity: 'warn', key: 'ext', detail: err.error.message || err.message }))
      .finally(()=> this.isLoading = false)
  }
}
