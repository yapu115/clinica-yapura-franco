export class Paciente {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  obraSocial: string;
  email: string;
  fotoPerfil: any;
  fotoPortada: any;

  constructor(
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    obraSocial: string,
    email: string,
    fotoPerfil: any,
    fotoPortada: any
  ) {
    this.id = '';
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.obraSocial = obraSocial;
    this.email = email;
    this.fotoPerfil = fotoPerfil;
    this.fotoPortada = fotoPortada;
  }
}