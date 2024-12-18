import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Unsubscribe } from '@angular/fire/app-check';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { LoadingService } from '../../../services/loading.service';
import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatabaseService } from '../../../services/database.service';

export const animations = trigger('routeAnimations', [
  // from bottom
  transition('* => solicitar-turno', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(
      '300ms ease-out',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
  //zoom
  transition('* => mi-perfil', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: 'scale(1)',
          opacity: 1,
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ transform: 'scale(0)', opacity: 0 })], {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [
          animate(
            '300ms ease-out',
            style({ transform: 'scale(0)', opacity: 0 })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          animate(
            '300ms ease-in',
            style({ transform: 'scale(1)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),

  //slide from right
  transition('* => registrarse', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '100%' })], { optional: true }),
    group([
      query(':leave', [animate('500ms ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('700ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),

  // slide from left
  transition('registrarse <=> ingresar-registrarse', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [animate('200ms ease-out', style({ left: '100%', opacity: 0 }))],
        { optional: true }
      ),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),

  // fade in

  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    group([
      query(':leave', [animate('300ms ease-out', style({ opacity: 0 }))], {
        optional: true,
      }),
      query(':enter', [animate('300ms ease-in', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Funcionalidad
  formInicioSesion: FormGroup;
  authSubscription?: Unsubscribe;

  // validaciones
  intentosInicioSesion: number;

  mailError: boolean = false;
  contrasenaError: boolean = false;
  usuarioNoEncontrado: boolean = false;

  mensajeMail: string = '';
  mensajeContrasena: string = '';
  mensajeUsuario: string = '';

  // Constructor
  constructor(
    protected auth: AuthService,
    protected router: Router,
    protected load: LoadingService,
    protected db: DatabaseService
  ) {
    this.formInicioSesion = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required]),
    });
    this.intentosInicioSesion = 0;

    console.log(this.load.email);

    this.usuarioNoEncontrado = this.load.errorUsuario;
    this.mensajeUsuario = this.load.mensajeUsuario;
    this.formInicioSesion.get('email')?.setValue(this.load.email);
    this.formInicioSesion.get('contrasena')?.setValue(this.load.contrasena);
  }

  login() {
    this.mailError = false;
    this.contrasenaError = false;
    this.usuarioNoEncontrado = false;
    if (this.ValidarCampos()) {
      this.load.cargandoLogin = true;
      this.load.loading = true;

      this.auth
        .IniciarSesion(this.formInicioSesion.value)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await this.auth.esperarTipoDeUsuario();

          if (this.auth.tipoDeUsuario === 'administrador') {
            this.confirmarInicioSesion();
          } else if (
            (this.auth.tipoDeUsuario === 'paciente' ||
              this.auth.tipoDeUsuario === 'especialista') &&
            !user.emailVerified
          ) {
            throw new Error('correo-no-verificado');
          } else if (this.auth.tipoDeUsuario === 'especialista') {
            if (this.auth.usuario.acceso === 'denegado') {
              throw new Error('acceso-denegado-especialista');
            } else if (this.auth.usuario.acceso === 'pendiente') {
              throw new Error('acceso-pendiente-especialista');
            } else {
              this.confirmarInicioSesion();
            }
          } else {
            this.confirmarInicioSesion();
          }
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/missing-email':
              this.mailError = true;
              this.mensajeMail = 'Mail incompleto';
              break;
            case 'auth/invalid-email':
              this.mailError = true;
              this.mensajeMail = 'Mail inválido';
              break;
            case 'auth/missing-password':
              this.contrasenaError = true;
              this.mensajeContrasena = 'Contraseña incompleta';
              break;
            case 'auth/wrong-password':
              this.contrasenaError = true;
              this.mensajeContrasena = 'Contraseña Incorrecta';
              break;
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
              this.mensajeUsuario = 'Usuario no encontrado';
              this.usuarioNoEncontrado = true;
              if (this.intentosInicioSesion > 2) {
                this.formInicioSesion.patchValue({
                  email: '',
                  contraseña: '',
                });
                this.mensajeUsuario = 'Ingrese los datos nuevamente';
              }
              this.intentosInicioSesion++;
              break;
          }
          if (error.message === 'correo-no-verificado') {
            this.usuarioNoEncontrado = true;
            this.mensajeUsuario =
              'Debe verificar su correo para iniciar sesión';
          } else if (error.message === 'acceso-pendiente-especialista') {
            this.usuarioNoEncontrado = true;
            this.mensajeUsuario = 'Su acceso está pendiente de ser permitido';
          } else if (error.message === 'acceso-denegado-especialista') {
            this.usuarioNoEncontrado = true;
            this.mensajeUsuario =
              'Su acceso fue denegado por los adminitradores';
          }

          this.load.guardarDatosLogin(
            true,
            this.mensajeUsuario,
            this.formInicioSesion.controls['email'].value,
            this.formInicioSesion.controls['contrasena'].value
          );
          this.auth.CerrarSesion();
          this.load.loading = false;
          this.load.cargandoLogin = false;
        });
    }
  }

  ValidarCampos() {
    let camposValidados = true;

    const controlMail = this.formInicioSesion.controls['email'];
    const controlContrasena = this.formInicioSesion.controls['contrasena'];

    if (controlMail.errors !== null) {
      camposValidados = false;
      this.mailError = true;
      if (controlMail.errors!['required']) {
        this.mensajeMail = 'Ingrese su email';
      } else if (controlMail.errors!['email']) {
        this.mensajeMail = 'Ingrese un email válido';
      }
    }

    if (controlContrasena.errors !== null) {
      camposValidados = false;
      this.contrasenaError = true;
      if (controlContrasena.errors!['required']) {
        this.mensajeContrasena = 'Ingrese su contraseña';
      }
    }

    return camposValidados;
  }

  confirmarInicioSesion() {
    this.load.cargandoLogin = false;
    this.load.loading = false;
    this.auth.usuario.ingresosAlSistema.push(new Date());
    let coleccion;
    if (this.auth.tipoDeUsuario === 'administrador')
      coleccion = 'administradores';
    else coleccion = `${this.auth.tipoDeUsuario}s`;
    this.db.ModificarObjeto(this.auth.usuario, coleccion);
    this.formInicioSesion.get('email')?.setValue('');
    this.formInicioSesion.get('contrasena')?.setValue('');
    this.router.navigate(['/']);
    this.auth.usuarioLogueado = true;

    // Swal.fire({
    //   position: 'top-end',
    //   icon: 'success',
    //   title: 'Sesión iniciada',
    //   showConfirmButton: false,
    //   timer: 1500,
    //   background: '#6c757d',
    //   color: '#e5dada',
    //   backdrop: false,
    // });
  }

  iniciarOsborn() {
    this.formInicioSesion.patchValue({
      email: 'oscorp616@gmail.com',
      contrasena: 'GreenG115',
    });
  }

  iniciarJameson() {
    this.formInicioSesion.patchValue({
      email: 'jameson@gmail.com',
      contrasena: 'Bugle115',
    });
  }

  iniciarParker() {
    this.formInicioSesion.patchValue({
      email: 'aultimis@gmail.com',
      contrasena: 'Spiderman115',
    });
  }

  iniciarStacy() {
    this.formInicioSesion.patchValue({
      email: 'yapufranco935@gmail.com',
      contrasena: 'George115',
    });
  }
  iniciarMorales() {
    this.formInicioSesion.patchValue({
      email: 'morales616@gmail.com',
      contrasena: 'Prowler115',
    });
  }

  iniciarPryde() {
    this.formInicioSesion.patchValue({
      email: 'bohade1285@anypng.com',
      contrasena: 'Invincible115',
    });
  }

  iniciarHarry() {
    this.formInicioSesion.patchValue({
      email: 'yapufranco115@gmail.com',
      contrasena: 'Globulina115',
    });
  }
}
