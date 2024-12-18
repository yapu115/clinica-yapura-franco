export class Administrador {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  email: string;
  fotoPerfil: any;
  contrasena: any;
  ingresosAlSistema: Date[];

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    email: string,
    fotoPerfil: any,
    contrasena: any,
    ingresosAlSistema: Date[],
    id: string = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
    this.contrasena = contrasena;
    this.ingresosAlSistema = ingresosAlSistema;
  }
}
