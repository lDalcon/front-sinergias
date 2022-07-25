import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import * as FileSaver from 'file-saver';

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

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "creditos");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
