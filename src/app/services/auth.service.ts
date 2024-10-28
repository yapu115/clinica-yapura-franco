import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
  public tipoDeUsuario = '';

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
              this.tipoDeUsuario = 'paciente';
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
                this.tipoDeUsuario = 'especialista';
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
                this.tipoDeUsuario = 'administrador';
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
    return createUserWithEmailAndPassword(this.auth, email, contrasena).then(
      (userCredential) => {
        const user = userCredential.user;

        return sendEmailVerification(user);
      }
    );
  }

  IniciarSesion({ email, contrasena }: any) {
    return signInWithEmailAndPassword(this.auth, email, contrasena);
  }

  CerrarSesion() {
    return signOut(this.auth);
  }
}
