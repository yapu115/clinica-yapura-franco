import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Turno } from '../../../classes/turno';

@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './especialistas.component.html',
  styleUrl: './especialistas.component.css',
})
export class EspecialistasComponent {
  turnos: Turno[] = [];
  query = '';
  subscription: Subscription | null = null;

  activarResena = false;
  mensajeResena = '';

  ingresarHistorialClinico: boolean = true;
  formHistorialClinico: FormGroup;

  errorAltura: boolean = false;
  errorPeso: boolean = false;
  errorTemperatura: boolean = false;
  errorPresion: boolean = false;
  errorDatosAdicionales: boolean = false;

  mensajeAltura: string = '';
  mensajePeso: string = '';
  mensajeTemperatura: string = '';
  mensajePresion: string = '';
  mensajeDatosAdicionales: string = '';
  indiceMensajeDatosAdicionales: number = -1;

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.obtenerTurnosFirestore();

    this.formHistorialClinico = new FormGroup({
      altura: new FormControl('', [Validators.required, Validators.min(0)]),
      peso: new FormControl('', [Validators.required, Validators.min(0)]),
      temperatura: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      presion: new FormControl('', [Validators.required]),
      datosAdicionales: new FormArray([]),
    });
  }

  get datosAdicionales(): FormArray {
    return this.formHistorialClinico.get('datosAdicionales') as FormArray;
  }

  obtenerTurnosFirestore() {
    const observableEspecialistas = this.db.traerObjetos('turnos');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.turnos = (resultado as any[]).map(
        (doc) =>
          new Turno(
            doc.especialista,
            doc.especialidad,
            doc.paciente,
            doc.fecha,
            doc.hora,
            doc.estado,
            doc.resena,
            doc.id
          )
      );
    });
  }

  obtenerTurnos() {
    let misTurnos: any[] = [];

    this.turnos.forEach((turno: any) => {
      if (
        turno.especialista ===
        `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}`
      ) {
        misTurnos.push(turno);
      }
    });

    console.log(misTurnos);
    if (this.query.length == 0) return misTurnos;

    return misTurnos.filter((turno: any) => {
      let nombreCompleto = turno['paciente'].toLowerCase();
      let especialidad = turno['especialidad'].toLowerCase();
      return (
        nombreCompleto.includes(this.query.toLowerCase()) ||
        especialidad.includes(this.query.toLowerCase())
      );
    });
  }

  cancelarTurno(turno: any) {
    Swal.fire({
      title: 'Cancelar Turno',
      text: 'Por favor, indica la razón de la cancelación:',
      input: 'text',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#e63946',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
      inputValidator: (result) =>
        !result && 'Debes ingresar una razón para cancelar el turno',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno cancelado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        const razon = result.value;
        turno.estado = 'cancelado';
        turno.mensajeCancelacion = result.value;
        this.db.ModificarObjeto(turno, 'turnos');
        console.log('Razón de cancelación:', razon);
      }
    });
  }

  rechazarTurno(turno: any) {
    Swal.fire({
      title: 'Rechazar Turno',
      text: 'Por favor, indica la razón pára rechazar el turno:',
      input: 'text',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#e63946',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
      inputValidator: (result) =>
        !result && 'Debes ingresar una razón para rechazar el turno',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno rechazado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        const razon = result.value;
        turno.estado = 'rechazado';
        turno.mensajeCancelacion = result.value;
        this.db.ModificarObjeto(turno, 'turnos');
        console.log('Razón de cancelación:', razon);
      }
    });
  }

  aceptarTurno(turno: any) {
    Swal.fire({
      title: '¿Aceptar turno?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#409f43',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno Aceptado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        turno.estado = 'no realizado';
        this.db.ModificarObjeto(turno, 'turnos');
      }
    });
  }

  finalizarTurno(turno: any) {
    Swal.fire({
      title: 'Finalizar Turno',
      text: 'Deje una reseña:',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#409f43',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
      inputValidator: (result) =>
        !result && 'Debes ingresar la reseña para finalizar el turno',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno Finalizado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        const resena = result.value;
        turno.estado = 'realizado';
        turno.resena = resena;
        this.ingresarHistorialClinico = true;
        this.db.ModificarObjeto(turno, 'turnos');
      }
    });
  }

  mostrarResena(resena: string) {
    this.mensajeResena = resena;
    this.activarResena = true;
  }

  agregarDatoAdicional(): void {
    const dato = new FormGroup({
      clave: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
    });
    this.datosAdicionales.push(dato);
  }

  eliminarDato(indice: number): void {
    this.datosAdicionales.removeAt(indice);
  }

  registrarHistorialClinico() {
    this.errorAltura = false;
    this.errorPeso = false;
    this.errorPresion = false;
    this.errorTemperatura = false;
    this.errorDatosAdicionales = false;

    if (this.ValidarCampos()) {
      this.db;
      // .AgregarObjeto(this.formHistorialClinico.value, 'encuestas-pacientes')
      // .then((e) => {
      //   Swal.fire({
      //     heightAuto: false,
      //     title: 'Encuesta registrada',
      //     background: '#dedede',
      //     color: '#000',
      //     confirmButtonColor: '#118ab2',
      //   }).then((e) => {
      //     if (e.isConfirmed) {
      //       this.formHistorialClinico.reset();
      //       this.ingresarHistorialClinico = false;
      //     }
      //   });
      // });
    }
  }

  ValidarCampos() {
    let camposValidados = true;

    const controlAltura = this.formHistorialClinico.controls['altura'];
    const controlPeso = this.formHistorialClinico.controls['peso'];
    const controlTemperatura =
      this.formHistorialClinico.controls['temperatura'];
    const controlPresion = this.formHistorialClinico.controls['presion'];

    this.datosAdicionales.controls.forEach((control, indice) => {
      const keyControl = control.get('clave');
      const valueControl = control.get('valor');

      if (keyControl?.errors || valueControl?.errors) {
        this.errorDatosAdicionales = true;
        this.mensajeDatosAdicionales =
          'Todos los campos adicionales deben tener sus datos';
        this.indiceMensajeDatosAdicionales = indice;
      }
    });

    if (controlAltura.errors !== null) {
      camposValidados = false;
      this.errorAltura = true;
      if (controlAltura.errors!['required']) {
        this.mensajeAltura = 'Debe ingresar la altura del paciente';
      } else if (controlAltura.errors!['min']) {
        this.mensajeAltura = 'Debe ingresar una altura válida';
      }
    }
    if (controlPeso.errors !== null) {
      camposValidados = false;
      this.errorPeso = true;
      if (controlPeso.errors!['required']) {
        this.mensajePeso = 'Debe ingresar el paso del paciente';
      } else if (controlPeso.errors!['min']) {
        this.mensajePeso = 'Debe ingresar un peso válida';
      }
    }
    if (controlTemperatura.errors !== null) {
      camposValidados = false;
      this.errorTemperatura = true;
      if (controlTemperatura.errors!['required']) {
        this.mensajeTemperatura = 'Debe ingresar la temperatura del paciente';
      } else if (controlTemperatura.errors!['min']) {
        this.mensajeTemperatura = 'Debe ingresar una temperatura válida';
      }
    }
    if (controlPresion.errors !== null) {
      camposValidados = false;
      this.errorPresion = true;
      if (controlPresion.errors!['required']) {
        this.mensajePresion = 'Debe ingresar la presión del paciente';
      } else if (controlPresion.errors!['min']) {
        this.mensajePresion = 'Debe ingresar una presión válida';
      }
    }

    return camposValidados;
  }
}
