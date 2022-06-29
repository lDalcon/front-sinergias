import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Usuario } from 'src/app/shared/models/usuario.model';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [MessageService]
})
export class UsuariosComponent implements OnInit {

  public verModalAddUsuario: boolean = false;
  public roles: string[] = ['ADMIN', 'COMPRAS', 'EQP']
  public usuario: Usuario = new Usuario();
  public isLoading: boolean = false;
  public usuarios: Usuario[] = []

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // this.getUsuarios()
  }

  getUsuarios() {
    this.usuarioService.getUsuarios()
      .then(res => this.usuarios = res)
      .catch((err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message }))
  }

  crearUsuario() {
    this.isLoading = true
    let err = this.validarUsuario();
    if (err.length > 0) return this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err.join('. ')}` })
    this.usuarioService.crearUsuario(this.usuario)
      .then(() => {
        this.getUsuarios();
        this.messageService.add({ severity: 'success', summary: 'Usuario Creado' })
        this.verModalAddUsuario = false;
        this.isLoading = false;
      })
      .catch((err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
        this.isLoading = false;
      })
  }

  validarUsuario() {
    let err: string[] = [];
    if (this.usuario.nick === '') err.push('El usuario es obligatorio')
    if (this.usuario.nombre === '') err.push('El nombre es obligatorio')
    if (this.usuario.apellido === '') err.push('El apellido es obligatorio')
    if (this.usuario.password.length < 6) err.push('La contraseña debe tener minimo 6 caracteres')
    if (this.usuario.role === '') err.push('El role es obligatorio')
    return err;
  }
}
