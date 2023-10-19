import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { MacroEconomicos } from 'src/app/shared/models/macroeconomicos.model';
import { MacroeconomicosService } from 'src/app/shared/services/macroeconomicos.service';
import { ExcelService } from 'src/app/shared/services/util/excel.service';

@Component({
  selector: 'app-macroeconomicos',
  templateUrl: './macroeconomicos.component.html',
  styleUrls: ['./macroeconomicos.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class MacroeconomicosComponent implements OnInit {
  public isLoading: boolean = false;
  public macroeconomicos: MacroEconomicos[];
  public data: any[] = [];
  public messages: Message[] = [];

  @ViewChild('fileupload') fileupload: FileUpload;

  constructor(
    private messageService: MessageService,
    private macroService: MacroeconomicosService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  onSelectFile(data: any) {
    if (data.currentFiles){
      this.isLoading = true;
      this.excelService.leerArchivo(data.currentFiles[0]).then((res: any) => {
        this.data = res;
        this.validateData(res);
      });
    }
  }

  validateData(data: any[]) {
    this.messages = [];
    if(data.length <= 200) 
      for (let i = 0; i < data.length; i++) {
        if (!data[i]?.ano)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) El año es obligatorio.`,
          });
        if (data[i]?.ano != new Date().getFullYear())
          this.messages.push({
            severity: 'warn',
            detail: `(${i + 2}) El año de carga es distinto al actual.`,
          });
        if (data[i]?.periodo < 1 || data[i]?.periodo > 12)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) El periodo debe ser numerico y estar entre 1 y 12.`,
          });
        if (!data[i].tipo)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) El tipo es obligatorio.`,
          });
        if (!data[i].unidad)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) La unidad es obligatoria.`,
          });
        if (!data[i]?.fecha)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) La fecha es obligatoria.`,
          });
        if (typeof(data[i].fecha) != 'string')
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) La fecha debe estar en formato texto ('YYYY-MM-DD').`,
          });
        if (typeof(data[i].valor) != 'number')
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) El valor debe ser númerico`,
          });
        if (!data[i]?.fecha)
          this.messages.push({
            severity: 'error',
            detail: `(${i + 2}) La fecha es obligatoria.`,
          });
      }
    else this.messages.push({severity: 'error', detail: 'El archivo supera los 300 registros.'})
    if (this.messages.filter((message) => message.severity === 'error').length > 0)
      this.fileupload.clear();
    this.isLoading = false;
  }

  onBeforeUpload() {
    this.isLoading = true;
    this.macroService
      .import(this.data)
      .then((res:any) => {
        this.messageService.add({severity:'success', detail: res.data})
      })
      .catch((err) => {
        this.messageService.add({severity:'warn', detail: err?.message})
      })
      .finally(()=>{
        this.isLoading = false;
        this.fileupload.clear();
        this.data = [];
      })
  }
}
