export class Especialista {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidad: string;
  email: string;
  fotoPerfil: any;
  acceso: string;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    especialidad: string,
    email: string,
    fotoPerfil: any,
    accesoPermitido: string,
    id: string = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidad = especialidad;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
    this.acceso = accesoPermitido;
  }
}
