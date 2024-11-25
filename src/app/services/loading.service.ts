import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public loading: boolean = false;

  // datos login
  cargandoLogin: boolean = false;

  errorUsuario: boolean = false;
  mensajeUsuario: string = '';

  email: string = '';
  contrasena: string = '';

  // registro
  cargandoRegistro: boolean = false;

  // regpac
  regPaciente = false;

  formRegistro: any;
  mensajeRegistro: string = '';
  constructor() {}

  guardarDatosLogin(
    error: boolean,
    mensaje: string,
    email: string,
    contrasena: string
  ) {
    this.errorUsuario = error;
    this.mensajeUsuario = mensaje;
    this.email = email;
    this.contrasena = contrasena;
  }

  guardarDatosRegistro(
    error: boolean,
    mensaje: string,
    formRegistro: FormGroup
  ) {
    this.errorUsuario = error;
    this.formRegistro = formRegistro;
    this.mensajeRegistro = mensaje;
  }
}
