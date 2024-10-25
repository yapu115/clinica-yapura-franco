import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // usuario info
  usuario: any = null;
  usuarioDeDB: any = null;
  authSubscription?: Unsubscribe;

  usuarioEncontrado: boolean = false;

  constructor(protected db: DatabaseService, protected auth: Auth) {
    this.authSubscription = this.auth.onAuthStateChanged((auth) => {
      if (auth?.email) {
        this.usuario = auth;

        const observable = db.traerObjetos('pacientes');
        observable.subscribe((resultado) => {
          resultado.forEach((usuario) => {
            this.usuarioDeDB = usuario;
            if (this.usuarioDeDB.email == this.usuario.email) {
              this.usuario = this.usuarioDeDB;
            }
          });
        });

        if (!this.usuarioEncontrado) {
          const observable = db.traerObjetos('especialistas');
          observable.subscribe((resultado) => {
            resultado.forEach((usuario) => {
              this.usuarioDeDB = usuario;
              if (this.usuarioDeDB.email == this.usuario.email) {
                this.usuario = this.usuarioDeDB;
              }
            });
          });
        }

        if (!this.usuarioEncontrado) {
          const observable = db.traerObjetos('administradores');
          observable.subscribe((resultado) => {
            resultado.forEach((usuario) => {
              this.usuarioDeDB = usuario;
              if (this.usuarioDeDB.email == this.usuario.email) {
                this.usuario = this.usuarioDeDB;
              }
            });
          });
        }
      } else {
        this.usuario = null;
      }
    });
  }

  RegistrarUsuario({ email, contrasena }: any) {
    return createUserWithEmailAndPassword(this.auth, email, contrasena);
  }

  IniciarSesion({ email, contrasena }: any) {
    return signInWithEmailAndPassword(this.auth, email, contrasena);
  }

  CerrarSesion() {
    return signOut(this.auth);
  }
}
