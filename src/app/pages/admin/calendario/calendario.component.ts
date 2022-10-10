import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Calendario } from 'src/app/shared/interface/calendario.interface';
import { CalendarioService } from 'src/app/shared/services/calendario.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  providers: [MessageService]
})
export class CalendarioComponent implements OnInit {

  public calendario: Calendario[] = [];
  public isLoading: boolean = false;
  public calendarioSelected: Calendario;
  public items: MenuItem[] = [];
  public display: boolean = false;

  constructor(
    private calendarioService: CalendarioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerCalendario();
    this.items = [
      { label: 'Editar', icon: 'pi pi-bars', command: () => this.ejecutarAccion('editar') },
    ];
  }

  obtenerCalendario() {
    this.isLoading = true;
    this.calendarioService.getCalendarioByAno('2022')
      .then(res => {
        this.calendario = res;
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.messageService.add({ severity: 'err', detail: err.error.message })
      })
  }

  ejecutarAccion(accion: string) {
    switch (accion) {
      case 'editar':
        this.display = true;
        break;
      default:
        break;
    }
  }

  actualizarPeriodo() {
    this.isLoading = true;
    this.calendarioService.actualizarPeriodo(this.calendarioSelected)
      .then(() => {
        this.messageService.add({ severity: 'success', detail: 'Periodo actualizado!' });
        this.display = false;
        this.obtenerCalendario();
      })
      .catch(err => {
        console.log(err);
        this.messageService.add({ severity: 'error', detail: 'Error al actualizar!' });
        this.display = false;
        this.obtenerCalendario();
      })
  }
}
