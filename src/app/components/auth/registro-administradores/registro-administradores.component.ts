import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { StorageService } from '../../../services/storage.service';
import { Router } from '@angular/router';
import { Administrador } from '../../../classes/administrador';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-registro-administradores',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './registro-administradores.component.html',
  styleUrl: './registro-administradores.component.css',
})
export class RegistroAdministradoresComponent {
  subscription: Subscription | null = null;

  formRegistro: FormGroup;
  imagenPerfil: Blob = new Blob();

  nombreError: boolean = false;
  apellidoError: boolean = false;
  edadError: boolean = false;
  DNIError: boolean = false;
  emailError: boolean = false;
  contrasenaError: boolean = false;
  imagenPerfilError: boolean = false;
  conexionError: boolean = false;

  mensajeNombre: string = '';
  mensajeApellido: string = '';
  mensajeEdad: string = '';
  mensajeDNI: string = '';
  mensajeEmail: string = '';
  mensajeContrasena: string = '';
  mensajeImagenPerfil: string = '';
  mensajeUsuario: string = '';

  constructor(
    protected auth: AuthService,
    protected db: DatabaseService,
    protected storage: StorageService,
    protected router: Router,
    protected load: LoadingService
  ) {
    this.formRegistro = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      edad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(115), // record por la persona mas vieja
        Validators.pattern('^[0-9]*$'),
      ]),
      dni: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^[^\\s]+$'),
      ]),
      imagenPerfil: new FormControl('', [Validators.required]),
    });
  }
  async Registro() {
    this.nombreError = false;
    this.apellidoError = false;
    this.edadError = false;
    this.DNIError = false;
    this.emailError = false;
    this.contrasenaError = false;
    this.conexionError = false;
    this.imagenPerfilError = false;
    if (this.ValidarCampos()) {
      this.load.loading = true;
      this.load.cargandoRegistro = true;
      await this.auth
        .RegistrarAdmin(this.formRegistro.value)
        .then(async (userCredential) => {
          const nombre = this.formRegistro.controls['nombre'].value;
          const apellido = this.formRegistro.controls['apellido'].value;
          const edad = this.formRegistro.controls['edad'].value;
          const dni = this.formRegistro.controls['dni'].value;
          const email = this.formRegistro.controls['email'].value;
          const contrasena = this.formRegistro.controls['contrasena'].value;
          const fotoPerfil = await this.storage.ObtenerImagenURL(
            // no puedo obtenerlo porque se debe hacer un await
            this.imagenPerfil,
            'ImagenesDePerfil'
          );
          this.db.AgregarObjeto(
            new Administrador(
              nombre,
              apellido,
              edad,
              dni,
              email,
              fotoPerfil,
              contrasena
            ),
            'administradores'
          );
          this.formRegistro.get('nombre')?.setValue('');
          this.formRegistro.get('apellido')?.setValue('');
          this.formRegistro.get('edad')?.setValue('');
          this.formRegistro.get('dni')?.setValue('');
          this.formRegistro.get('email')?.setValue('');
          this.formRegistro.get('imagenPerfil')?.setValue('');
          this.formRegistro.get('contrasena')?.setValue('');

          this.router.navigateByUrl('/');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Administrador registrado',
            showConfirmButton: false,
            timer: 1500,
            background: '#6c757d',
            color: '#e5dada',
            backdrop: false,
          });

          console.log('aaaa');
          this.load.cargandoRegistro = false;
          this.load.loading = false;
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/admin-restricted-operation':
              this.conexionError = true;
              this.mensajeUsuario =
                'Ingrese el mail y la contraseña para registrarse';
              break;
            case 'auth/missing-email':
              this.emailError = true;
              this.mensajeEmail = 'Mail no ingresado';
              break;
            case 'auth/invalid-email':
              this.emailError = true;
              this.mensajeEmail = 'Email Inválido';
              break;
            case 'auth/missing-password':
              this.contrasenaError = true;
              this.mensajeContrasena = 'Contraseña no ingresada';
              break;
            case 'auth/email-already-in-use':
              this.conexionError = true;
              this.mensajeUsuario = 'Este usuario ya está en registrado';
              break;
            default:
              this.conexionError = true;
              this.mensajeUsuario =
                'Ocurrió un error. Por favor, intente de nuevo.';
          }
        });
    }
  }

  ValidarCampos() {
    let camposValidados = true;
    const controlNombre = this.formRegistro.controls['nombre'];
    const controlApellido = this.formRegistro.controls['apellido'];
    const controlEdad = this.formRegistro.controls['edad'];
    const controlDni = this.formRegistro.controls['dni'];
    const controlMail = this.formRegistro.controls['email'];
    const controlContrasena = this.formRegistro.controls['contrasena'];
    const controlImagenPerfil = this.formRegistro.controls['imagenPerfil'];

    if (controlNombre.errors !== null) {
      camposValidados = false;
      this.nombreError = true;
      if (controlNombre.errors!['required']) {
        this.mensajeNombre = 'Ingrese el nombre de administrador';
      } else if (
        controlNombre.errors!['minlength'] ||
        controlNombre.errors!['maxlength']
      ) {
        this.mensajeNombre = 'El nombre debe tener entre 3 y 20 caracteres';
      }
    }
    if (controlApellido.errors !== null) {
      camposValidados = false;
      this.apellidoError = true;
      if (controlApellido.errors!['required']) {
        this.mensajeApellido = 'Ingrese el apellido de administrador';
      } else if (
        controlApellido.errors!['minlength'] ||
        controlApellido.errors!['maxlength']
      ) {
        this.mensajeApellido = 'El apellido debe tener entre 3 y 20 caracteres';
      } else if (controlApellido.errors!['pattern']) {
        this.mensajeApellido = 'El apellido debe ser letras ';
      }
    }
    if (controlEdad.errors !== null) {
      camposValidados = false;
      this.edadError = true;
      if (controlEdad.errors!['required']) {
        this.mensajeEdad = 'Ingrese la edad del administrador';
      } else if (
        controlEdad.errors!['minlength'] ||
        controlEdad.errors!['maxlength']
      ) {
        this.mensajeEdad = 'Ingrese una ead válida';
      } else if (controlEdad.errors!['pattern']) {
        this.mensajeEdad = 'La edad debe estar en números';
      }
    }
    if (controlDni.errors !== null) {
      camposValidados = false;
      this.DNIError = true;
      if (controlDni.errors!['required']) {
        this.mensajeDNI = 'Ingrese el dni del administrador';
      } else if (
        controlDni.errors!['minlength'] ||
        controlDni.errors!['maxlength']
      ) {
        this.mensajeDNI = 'Ingrese un dni válido';
      } else if (controlDni.errors!['pattern']) {
        this.mensajeDNI = 'El dni debe estar en números';
      }
    }
    if (controlMail.errors !== null) {
      camposValidados = false;
      this.emailError = true;
      if (controlMail.errors!['required']) {
        this.mensajeEmail = 'Ingrese un email';
      } else if (controlMail.errors!['email']) {
        this.mensajeEmail = 'Ingrese un email válido';
      }
    }
    if (controlContrasena.errors !== null) {
      camposValidados = false;
      this.contrasenaError = true;
      if (controlContrasena.errors!['required']) {
        this.mensajeContrasena = 'Ingrese su contraseña';
      } else if (
        controlContrasena.errors!['minlength'] ||
        controlContrasena.errors!['maxlength']
      ) {
        this.mensajeContrasena =
          'La contraseña debe tener entre 8 y 20 caracteres';
      } else if (controlContrasena.errors!['pattern']) {
        this.mensajeContrasena =
          'La contraseña no debe tener espacios en blanco';
      }
    }
    if (controlImagenPerfil.errors !== null) {
      camposValidados = false;
      this.imagenPerfilError = true;
      if (controlImagenPerfil.errors!['required']) {
        this.mensajeImagenPerfil = 'Suba una foto de perfil';
      }
    }
    return camposValidados;
  }
  nuevaImagenPerfilCargada($event: any) {
    const file = $event.target.files[0];
    this.imagenPerfil = new Blob([file], { type: file.type });
  }
}
