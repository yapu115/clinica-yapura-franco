export class Turno {
  id: string;
  especialista: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: string;
  resena: string;
  paciente: string;
  historialClinico: any;

  constructor(
    especialista: string,
    especialidad: string,
    paciente: string,
    fecha: string,
    hora: string,
    estado: string,
    resena: string = '',
    id: string = '',
    historialClinico: any = ''
  ) {
    this.id = id;
    this.especialista = especialista;
    this.especialidad = especialidad;
    this.paciente = paciente;
    this.fecha = fecha;
    this.hora = hora;
    this.estado = estado;
    this.resena = resena;
    this.historialClinico = historialClinico;
  }
}
