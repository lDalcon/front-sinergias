import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Regional } from 'src/app/shared/models/regional.model';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { RegionalService } from 'src/app/shared/services/regional.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [MessageService]
})
export class UsuariosComponent implements OnInit {

  public estados: any[] = [{ estado: true, label: 'Activo' }, { estado: false, label: 'Inactivo' }];
  public isLoading: boolean = false;
  public items: MenuItem[] = [];
  public regionales: Regional[] = [];
  public roles: string[] = ['ADMIN', 'DEUDA', 'SALDOS', 'INFOFIN', 'DEUDASALDOS', 'SALDOSINFOFIN', 'DEUDASALDOSINFOFIN', 'DEUDASALDOSINFOFINCONS','DEUDAINFOFIN']
  public usuario: Usuario = new Usuario();
  public usuarios: Usuario[] = [];
  public usuarioSelected: Usuario = new Usuario();
  public displayAddUsuario: boolean = false;
  public displayEditUsuario: boolean = false;
  public displayAsociarEmpresa: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private regionalService: RegionalService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getUsuarios();
    this.getRegionales();
    this.items = [
      { label: 'Editar', icon: 'pi pi-bars', command: () => this.ejecutarAccion('editar') },
      { label: 'Asociar Empresa', icon: 'pi pi-credit-card', command: () => this.ejecutarAccion('asociarEmpresa') }
    ];
  }

  async ejecutarAccion(accion: string) {
    console.log(this.usuarioSelected)
    switch (accion) {
      case 'editar':
        this.displayEditUsuario = true;
        break;
      case 'asociarEmpresa':
        this.displayAsociarEmpresa = true;
        break;
      default:
        break;
    }
  }

  getRegionales() {
    this.regionalService.getAll()
      .then(res => this.regionales = res.filter(x => x.estado))
      .catch((err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message }))

  }

  getUsuarios() {
    this.usuarioService.getUsuarios()
      .then(res => this.usuarios = res)
      .catch((err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message }))
  }

  actualizarUsuario() {
    if (!this.validarUsuario(this.usuarioSelected, false)) return;
    this.isLoading = true
    this.usuarioService.actualizarUsuario(this.usuarioSelected)
      .then(() => {
        this.getUsuarios();
        this.messageService.add({ severity: 'success', summary: 'Usuario Actualizado' })
        this.displayEditUsuario = false;
        this.isLoading = false;
        this.usuario = new Usuario();
      })
      .catch((err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
        this.isLoading = false;
      })
  }


  crearUsuario() {
    if (!this.validarUsuario(this.usuario, true)) return;
    this.isLoading = true
    this.usuarioService.crearUsuario(this.usuario)
      .then(() => {
        this.getUsuarios();
        this.messageService.add({ severity: 'success', summary: 'Usuario Creado' })
        this.displayAddUsuario = false;
        this.isLoading = false;
        this.usuario = new Usuario();
      })
      .catch((err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
        this.isLoading = false;
      })
  }

  validarUsuario(usuario: Usuario, pass?: boolean) {
    let err: string[] = [];
    let regex: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    if (usuario.nick === '') err.push('El usuario es obligatorio')
    if (usuario.nombres === '') err.push('El nombre es obligatorio')
    if (usuario.apellidos === '') err.push('El apellido es obligatorio')
    if (pass && usuario.password.length < 6) err.push('La contraseña debe tener minimo 6 caracteres')
    if (usuario.email === '' || !regex.test(usuario.email)) err.push('El email no es válido')
    if (usuario.menu.role === '') err.push('El role es obligatorio')
    if (err.length > 0) return this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err.join('. ')}` })
    return err.length === 0 ? true : false;
  }

  guardarAsociarEmpresa(){
    this.isLoading = true;
    this.usuarioService.asociarEmpresas(this.usuarioSelected)
      .then(()=> {
        this.getUsuarios()
        this.isLoading = false;
        this.displayAsociarEmpresa = false;
        this.messageService.add({ severity: 'success', detail: `Empresas asociadas correctamente` })
      })
      .catch(err => {
        this.isLoading = false 
      })
  }
}
