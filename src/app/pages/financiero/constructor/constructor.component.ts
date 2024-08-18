import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ICredito } from 'src/app/shared/interface/credito.interface';
import { Usuario } from 'src/app/shared/models/usuario.model';
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
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public displayDesembolsar: boolean = false;
  public displayRevalorizar: boolean = false;

  constructor(
    private sessionService: SessionService,
    private creditoService: CreditoService,
    private messageService: MessageService
  ) {
    this.usuarioSesion = this.sessionService.usuario;
  }

  ngOnInit(): void {
    this.listarCreditos();
    this.items = [
      {
        label: 'Desembolsar',
        icon: 'pi pi-dollar',
        command: () => this.ejecutarAccion('desembolso'),
      },
      {
        label: 'Revalorizar',
        icon: 'pi pi-angle-double-up',
        command: () => this.ejecutarAccion('revalorizar'),
      },
    ];
  }

  listarCreditos() {
    this.isLoading = true;
    this.creditoService
      .listarCreditos({ lineacredito: 603 })
      .then((res) => (this.creditos = res))
      .catch((err) => console.log(err))
      .finally(() => (this.isLoading = false));
  }

  ejecutarAccion(accion: string) {
    switch (accion) {
      case 'desembolso':
        break;
      case 'revalorizar':
        break;
      case 'anular':
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
}
