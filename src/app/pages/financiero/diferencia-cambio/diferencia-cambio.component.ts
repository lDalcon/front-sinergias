import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DiferenciaCambio } from 'src/app/shared/interface/diferencia-cambio.interface';
import { Regional } from 'src/app/shared/models/regional.model';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import { SessionService } from 'src/app/shared/services/session.service';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Component({
  selector: 'app-diferencia-cambio',
  templateUrl: './diferencia-cambio.component.html',
  styleUrls: ['./diferencia-cambio.component.css'],
  providers: [MessageService]
})
export class DiferenciaCambioComponent implements OnInit {

  public data: DiferenciaCambio;
  public fechaReporte: Date;
  public regional: Regional;
  public isLoading: boolean = false;

  constructor(
    private messageService: MessageService,
    private reporteService: ReporteService,
    public sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.data = { dc_consolidado: [], dc_credito: [], dc_forward: [], dc_resumen_credito: [] };
  }

  obtenerDiferenciaCambio() {
    if (!this.validarFiltroReporte()) return;
    this.isLoading = true;
    let fecha = new Date(this.fechaReporte.getFullYear(), this.fechaReporte.getMonth() + 1, 0);
    this.reporteService.obtenerDiferenciaCambio({ fecha, nick: this.sessionService.usuario.nick, nit: this.regional.nit })
      .then((res: any) => {
        this.messageService.add({ severity: 'success', detail: res.message });
        this.data = res.data[0];
        this.isLoading = false;
      })
      .catch(err => {
        this.messageService.add({ severity: 'error', detail: err.message });
        this.isLoading = false;
      })
  }

  validarFiltroReporte() {
    let errors: string[] = [];
    if (!this.fechaReporte) errors.push('La fecha es obligatoria');
    if (!this.regional) errors.push('La regional es obligatoria');
    if (errors.length > 0) this.messageService.add({ severity: 'warn', detail: `${errors.join('. ')}` })
    return errors.length === 0 ? true : false;
  }

  exportar() {
    if (this.data.dc_consolidado.length === 0) return;
    const dc_consolidado = xlsx.utils.json_to_sheet(this.data.dc_consolidado);
    const dc_credito = xlsx.utils.json_to_sheet(this.data.dc_credito);
    const dc_resumen_credito = xlsx.utils.json_to_sheet(this.data.dc_resumen_credito);
    const dc_forward = xlsx.utils.json_to_sheet(this.data.dc_forward);
    const workbook = {
      Sheets: { dc_consolidado, dc_credito, dc_resumen_credito, dc_forward },
      SheetNames: ['dc_consolidado', 'dc_credito', 'dc_resumen_credito', 'dc_forward']
    };
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.saveAsExcel(excelBuffer)

  }

  private saveAsExcel(buffer: any) {
    const data = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, `diferenciaencambio_${new Date().getTime()}`);
  }
}
