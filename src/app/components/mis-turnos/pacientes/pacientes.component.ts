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

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent {
  turnos: any = [];
  query = '';
  activarResena = false;
  mensajeResena = '';

  activarEncuesta = false;

  errorRecepcion: boolean = false;
  errorEquipoTeconologia: boolean = false;
  errorAgendarCita: boolean = false;
  errorRecomendacion: boolean = false;
  errorMejoraCondicion: boolean = false;
  errorAtencionEspecialista: boolean = false;

  mensajeRecepcion: string = '';
  mensajeEquipoTeconología: string = '';
  mensajeAgendarCita: string = '';
  mensajeRecomendacion: string = '';
  mensajeMejoraCondicion: string = '';
  mensajeAtencionEspecialista: string = '';

  formEncuesta: FormGroup;

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.turnos = [
      {
        especialista: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        fecha: new Date('2024-11-06T15:00:00'),
        hora: '15:00',
        estado: 'No realizada',
      },
      {
        especialista: 'Dra. Ana López',
        especialidad: 'Pediatría',
        fecha: new Date('2024-11-07T10:30:00'),
        hora: '10:30',
        estado: 'Realizada',
        resena:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        especialista: 'Dr. Carlos Mendoza',
        especialidad: 'Dermatología',
        fecha: new Date('2024-11-08T13:00:00'),
        hora: '13:00',
        estado: 'Realizada',
      },
      {
        especialista: 'Dra. Laura Torres',
        especialidad: 'Ginecología',
        fecha: new Date('2024-11-09T09:00:00'),
        hora: '09:00',
        estado: 'No realizada',
      },
      {
        especialista: 'Dr. Ricardo Gómez',
        especialidad: 'Neurología',
        fecha: new Date('2024-11-10T14:30:00'),
        hora: '14:30',
        estado: 'Realizada',
      },
    ];

    this.formEncuesta = new FormGroup({
      calificacionPersonal: new FormControl('', [Validators.required]),
      equipoNecesario: new FormControl('', [Validators.required]),
      procesoAgendarRapido: new FormControl('', [Validators.required]),
      nivelRecomendacion: new FormControl('', [Validators.required]),
      mejoraEnSalud: new FormControl('', [Validators.required]),
      comentarioEspecialista: new FormControl('', [Validators.required]),
    });
  }

  obtenerTurnos() {
    if (this.query.length == 0) return this.turnos;

    return this.turnos.filter((turno: any) => {
      let nombreCompleto = turno['especialista'].toLowerCase();
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

  mostrarResena(resena: string) {
    this.mensajeResena = resena;
    this.activarResena = true;
  }

  guardarEncuesta() {
    this.errorRecepcion = false;
    this.errorEquipoTeconologia = false;
    this.errorAgendarCita = false;
    this.errorRecomendacion = false;
    this.errorMejoraCondicion = false;
    this.errorAtencionEspecialista = false;

    if (this.ValidarCampos()) {
      this.db
        .AgregarObjeto(this.formEncuesta.value, 'encuestas-pacientes')
        .then((e) => {
          Swal.fire({
            heightAuto: false,
            title: 'Encuesta registrada',
            background: '#dedede',
            color: '#000',
            confirmButtonColor: '#118ab2',
          }).then((e) => {
            if (e.isConfirmed) {
              this.formEncuesta.get('calificacionPersonal')?.setValue('');
              this.formEncuesta.get('equipoNecesario')?.setValue('');
              this.formEncuesta.get('procesoAgendarRapido')?.setValue('');
              this.formEncuesta.get('nivelRecomendacion')?.setValue('');
              this.formEncuesta.get('mejoraEnSalud')?.setValue('');
              this.formEncuesta.get('comentarioEspecialista')?.setValue('');
              this.activarEncuesta = false;
            }
          });
        });
    }
  }

  ValidarCampos() {
    let camposValidados = true;

    const controlCalPer = this.formEncuesta.controls['calificacionPersonal'];
    const controlEquNec = this.formEncuesta.controls['equipoNecesario'];
    const controlProcAgen = this.formEncuesta.controls['procesoAgendarRapido'];
    const controlNivelReco = this.formEncuesta.controls['nivelRecomendacion'];
    const controlMejSalud = this.formEncuesta.controls['mejoraEnSalud'];
    const controlComEspec =
      this.formEncuesta.controls['comentarioEspecialista'];

    if (controlCalPer.errors !== null) {
      camposValidados = false;
      this.errorRecepcion = true;
      if (controlCalPer.errors!['required']) {
        this.mensajeRecepcion = 'Debe completar este campo';
      }
    }
    if (controlEquNec.errors !== null) {
      camposValidados = false;
      this.errorEquipoTeconologia = true;
      if (controlEquNec.errors!['required']) {
        this.mensajeEquipoTeconología = 'Debe completar este campo';
      }
    }
    if (controlProcAgen.errors !== null) {
      camposValidados = false;
      this.errorAgendarCita = true;
      if (controlProcAgen.errors!['required']) {
        this.mensajeAgendarCita = 'Debe completar este campo';
      }
    }
    if (controlNivelReco.errors !== null) {
      camposValidados = false;
      this.errorRecomendacion = true;
      if (controlNivelReco.errors!['required']) {
        this.mensajeRecomendacion = 'Debe completar este campo';
      }
    }

    if (controlMejSalud.errors !== null) {
      camposValidados = false;
      this.errorMejoraCondicion = true;
      if (controlMejSalud.errors!['required']) {
        this.mensajeMejoraCondicion = 'Debe completar este campo';
      }
    }

    if (controlComEspec.errors !== null) {
      camposValidados = false;
      this.errorAtencionEspecialista = true;
      if (controlComEspec.errors!['required']) {
        this.mensajeAtencionEspecialista = 'Debe completar este campo';
      }
    }

    return camposValidados;
  }
}
