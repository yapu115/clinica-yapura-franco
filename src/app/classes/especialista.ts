export class Especialista {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidades: string[];
  email: string;
  fotoPerfil: any;
  acceso: string;
  ingresosAlSistema: Date[];

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    especialidades: string[],
    email: string,
    fotoPerfil: any,
    accesoPermitido: string,
    ingresosAlSistema: Date[],
    id: string = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidades = especialidades;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
    this.acceso = accesoPermitido;
    this.ingresosAlSistema = ingresosAlSistema;
  }
}
