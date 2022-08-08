import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ReporteService } from 'src/app/shared/services/reporte.service';

@Component({
  selector: 'app-dash-gerencia',
  templateUrl: './dash-gerencia.component.html',
  styleUrls: ['./dash-gerencia.component.css'],
  providers: [MessageService]

})
export class DashGerenciaComponent implements OnInit {

  public fechaReporte: Date;
  public dataReporte: any = { total: 0, data: [] }
  public isLoading: boolean = false;
  constructor(
    public reporteService: ReporteService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  getInfoReporte() {
    if (!this.fechaReporte) return this.messageService.add({ severity: 'warn', detail: 'La fecha es obligatoria' })
    this.isLoading = true;
    this.reporteService.getDataReporte(this.fechaReporte.getFullYear(), this.fechaReporte.getMonth() + 1)
      .then(res => {
        this.dataReporte = this.procesarDataReporte(res)
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false;
      })
  }

  procesarDataReporte(dataReporte: any[]) {
    let info = { total: 0, data: [] }
    for (let i = 0; i < dataReporte.length; i++) {
      info.total += dataReporte[i]['saldofinalcop'];
      let idxEmp = info.data.findIndex(x => x.data.label === dataReporte[i]['razonsocial'])
      if (idxEmp === -1) {
        info.data.push({
          data: { label: dataReporte[i]['razonsocial'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
          children: []
        })
        info.data[info.data.length - 1].children.push({
          data: { label: dataReporte[i]['moneda'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
          children: []
        })
        info.data[info.data.length - 1].children[0].children.push({
          data: { label: dataReporte[i]['tipo'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
          children: []
        })
        info.data[info.data.length - 1].children[0].children[0].children.push({
          data: { label: dataReporte[i]['lineacredito'], total: dataReporte[i]['saldofinalcop'], participacion: 0 }
        })
      }
      else {
        info.data[idxEmp].data.total += dataReporte[i]['saldofinalcop']
        let idxMon = info.data[idxEmp].children.findIndex(x => x.data.label === dataReporte[i]['moneda'])
        if (idxMon === -1) {
          info.data[idxEmp].children.push({
            data: { label: dataReporte[i]['moneda'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
            children: []
          })
          info.data[idxEmp].children[info.data[idxEmp].children.length - 1].children.push({
            data: { label: dataReporte[i]['tipo'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
            children: []
          })
          info.data[idxEmp].children[info.data[idxEmp].children.length - 1].children[0].children.push({
            data: { label: dataReporte[i]['lineacredito'], total: dataReporte[i]['saldofinalcop'], participacion: 0 }
          })
        }
        else {
          info.data[idxEmp].children[idxMon].data.total += dataReporte[i]['saldofinalcop'];
          let idxTipo = info.data[idxEmp].children[idxMon].children.findIndex(x => x.data.label === dataReporte[i]['tipo'])
          if (idxTipo === -1) {
            info.data[idxEmp].children[idxMon].children.push({
              data: { label: dataReporte[i]['tipo'], total: dataReporte[i]['saldofinalcop'], participacion: 0 },
              children: []
            })
            info.data[idxEmp].children[idxMon].children[info.data[idxEmp].children[idxMon].children.length - 1].children.push({
              data: { label: dataReporte[i]['lineacredito'], total: dataReporte[i]['saldofinalcop'], participacion: 0 }
            })
          }
          else {
            info.data[idxEmp].children[idxMon].children[idxTipo].data.total += dataReporte[i]['saldofinalcop'];
            let idxLinea = info.data[idxEmp].children[idxMon].children[idxTipo].children.findIndex(x => x.data.label === dataReporte[i]['lineacredito'])
            if (idxLinea === -1) {
              info.data[idxEmp].children[idxMon].children[idxTipo].children.push({
                data: { label: dataReporte[i]['lineacredito'], total: dataReporte[i]['saldofinalcop'], participacion: 0 }
              })
            }
            else {
              info.data[idxEmp].children[idxMon].children[idxTipo].children[idxLinea].data.total += dataReporte[i]['saldofinalcop'];
            }
          }
        }
      }
    }
    info.data = info.data.map(emp => {
      emp.children = emp.children.map(mon => {
        mon.children = mon.children.map(tipo => {
          tipo.children = tipo.children.map(linea => {
            linea.data.participacion = (linea.data.total / tipo.data.total) * 100;
            return linea;
          })
          tipo.data.participacion = (tipo.data.total / mon.data.total) * 100;
          tipo.children = tipo.children.sort((a,b)=> b.data.total - a.data.total);
          return tipo;
        })
        mon.data.participacion = (mon.data.total / emp.data.total) * 100;
        mon.children = mon.children.sort((a,b)=> b.data.total - a.data.total);
        return mon;
      })
      emp.data.participacion = (emp.data.total / info.total) * 100;
      emp.children = emp.children.sort((a,b)=> b.data.total - a.data.total);
      return emp
    })
    info.data = info.data.sort((a,b)=> b.data.total - a.data.total);
    return info;
  }

}
