import { Menu } from "./menu.model";

export class Usuario {
    nick: string = '';
    nombre: string = '';
    apellido: string = '';
    password: string = '';
    role: string = '';
    menu: Menu = new Menu();
    estado: boolean = true;
}