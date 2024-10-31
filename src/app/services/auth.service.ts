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
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // usuario info
  usuario: any = null;
  usuarioDeDB: any = null;
  authSubscription?: Unsubscribe;

  contraseñaLogueada = '';
  emailLogueado = '';

  usuarioEncontrado: boolean = false;
  usuarioLogueado: boolean = false;

  public tipoDeUsuario = '';

  constructor(
    protected db: DatabaseService,
    protected auth: Auth,
    protected load: LoadingService
  ) {
    this.authSubscription = this.auth.onAuthStateChanged((auth) => {
      if (auth?.email) {
        this.usuario = auth;
        this.tipoDeUsuario = '';
        this.usuarioEncontrado = false;

        const observable = this.db.traerObjetos('pacientes');
        observable.subscribe((resultado) => {
          resultado.forEach((usuario) => {
            this.usuarioDeDB = usuario;
            if (this.usuarioDeDB.email == this.usuario.email) {
              this.usuario = this.usuarioDeDB;
              this.tipoDeUsuario = 'paciente';
              if (!this.load.cargandoLogin || !this.load.cargandoRegistro) {
                this.load.loading = false;
              }
              this.usuarioEncontrado = true;
            }
          });
          if (this.usuarioEncontrado) {
            this.usuarioLogueado = true;
          }
        });

        if (!this.usuarioEncontrado) {
          const observable = this.db.traerObjetos('administradores');
          observable.subscribe((resultado) => {
            resultado.forEach((usuario) => {
              this.usuarioDeDB = usuario;
              if (this.usuarioDeDB.email == this.usuario.email) {
                this.usuario = this.usuarioDeDB;
                this.tipoDeUsuario = 'administrador';
                this.usuarioEncontrado = true;
                if (!this.load.cargandoLogin || !this.load.cargandoRegistro) {
                  this.load.loading = false;
                }
              }
            });
            if (this.usuarioEncontrado) {
              this.usuarioLogueado = true;
            }
          });
        }

        if (!this.usuarioEncontrado) {
          const observable = this.db.traerObjetos('especialistas');
          observable.subscribe((resultado) => {
            resultado.forEach((usuario) => {
              this.usuarioDeDB = usuario;
              if (this.usuarioDeDB.email == this.usuario.email) {
                this.usuario = this.usuarioDeDB;
                this.tipoDeUsuario = 'especialista';
                console.log(this.tipoDeUsuario);
                this.usuarioEncontrado = true;
                if (!this.load.cargandoLogin || !this.load.cargandoRegistro) {
                  this.load.loading = false;
                }
              }
            });
            if (this.usuarioEncontrado) {
              this.usuarioLogueado = true;
            }
          });
        }
      } else {
        this.usuarioEncontrado = false;
        this.tipoDeUsuario = '';
        this.usuario = null;
        if (!this.load.cargandoLogin || !this.load.cargandoRegistro) {
          this.load.loading = false;
        }
      }
    });
  }

  async esperarTipoDeUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const intervalo = setInterval(() => {
        if (this.tipoDeUsuario !== null && this.usuarioEncontrado) {
          clearInterval(intervalo);
          resolve();
        }
      }, 100);
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

  async RegistrarAdmin({ email, contrasena }: any) {
    let emailActual = this.usuario.email;
    let contrsenaActual = this.usuario.contrasena;
    await createUserWithEmailAndPassword(this.auth, email, contrasena);
    await signOut(this.auth);
    await signInWithEmailAndPassword(this.auth, emailActual, contrsenaActual);
  }

  IniciarSesion({ email, contrasena }: any) {
    return signInWithEmailAndPassword(this.auth, email, contrasena);
  }

  CerrarSesion() {
    this.usuarioLogueado = false;
    return signOut(this.auth);
  }
}
