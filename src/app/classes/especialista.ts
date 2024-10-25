export class Especialista {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidad: string;
  email: string;
  fotoPerfil: any;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    especialidad: string,
    email: string,
    fotoPerfil: any
  ) {
    this.id = '';
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidad = especialidad;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
  }
}
