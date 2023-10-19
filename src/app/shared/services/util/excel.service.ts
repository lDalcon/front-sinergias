import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportExcel(data: any[], name: string) {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, name);
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  leerArchivo(file: File) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => {
        let data = fileReader.result
        let workbook = xlsx.read(data, { type: 'binary' })
        try {
          workbook.SheetNames.forEach(sheet => {
            resolve(xlsx.utils.sheet_to_json(workbook.Sheets[sheet]))
          })
        } catch (error) {
          reject(error)
        }
      }
    })
  }
}
