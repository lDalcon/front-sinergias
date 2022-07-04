import { Menu } from "./menu.model";
import { Regional } from "./regional.model";

export class Usuario {
    nick: string = '';
    nombres: string = '';
    apellidos: string = '';
    password: string = '';
    email: string = '';
    role: string = '';
    menu: Menu = new Menu();
    regionales: Regional[] = [];
    estado: boolean = true;
}