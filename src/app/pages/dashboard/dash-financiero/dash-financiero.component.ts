import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import { ExcelService } from 'src/app/shared/services/util/excel.service';

@Component({
  selector: 'app-dash-financiero',
  templateUrl: './dash-financiero.component.html',
  styleUrls: ['./dash-financiero.component.css'],
  providers: [MessageService]
})
export class DashFinancieroComponent implements OnInit {

  public data: any[] = [];
  public isLoading: boolean = false;
  public fechaReporte: Date;

  constructor(
    private reporteService: ReporteService,
    private messageService: MessageService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {

  }

  obtenerDataReporte() {
    this.isLoading = true;
    this.reporteService.getDataReporte(this.fechaReporte.getFullYear(), this.fechaReporte.getMonth() + 1)
      .then(res => {
        this.data = res
        this.isLoading = false;
      })
  }
  exportExcel(){
    this.excelService.exportExcel(this.data, 'creditos')
  }
}
