import { Injectable } from '@angular/core';

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
}
