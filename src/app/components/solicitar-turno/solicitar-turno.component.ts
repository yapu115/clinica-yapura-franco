import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import { Especialista } from '../../classes/especialista';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Turno } from '../../classes/turno';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
})
export class SolicitarTurnoComponent {
  formTurno: FormGroup;
  subscription: Subscription | null = null;

  especialistas: Especialista[] = [];
  especialidades: string[] = [];
  nombresEspecialistas: string[] = [];
  turnos: Turno[] = [];

  especialistasError: boolean = false;
  especialidadError: boolean = false;
  fechaError: boolean = false;
  horarError: boolean = false;
  pacienteError: boolean = false;

  mensajeEspecialista = 'Debe ingresar un especialista';
  mensajeEspecialidad = 'Debe ingresar una especialidad';
  mensajeFecha = 'Debe ingresar una fecha para el turno';
  mensajeHora = 'Debe ingresar la hora del turno';
  mensajePaciente = 'Debe ingresar un paciente';

  proximosDias: string[] = [];
  horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  diaSeleccionado: string | null = null;
  horarioSeleccionado: string | null = null;

  constructor(
    protected auth: AuthService,
    protected db: DatabaseService,
    protected router: Router
  ) {
    this.obtenerEspecialistas();
    this.obtenerTurnos();
    this.obtenerProximosDias();

    this.formTurno = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      especialista: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      hora: new FormControl('', [Validators.required]),
      paciente: new FormControl('', [Validators.required]),
    });
  }

  guardarTurno() {
    this.especialistasError = false;
    this.especialidadError = false;
    this.fechaError = false;
    this.horarError = false;
    this.pacienteError = false;

    if (this.ValidarCampos()) {
      const especialidad = this.formTurno.controls['especialidad'].value;
      const especialista = this.formTurno.controls['especialista'].value;
      const fecha = this.formTurno.controls['fecha'].value;
      const hora = this.formTurno.controls['hora'].value;
      const paciente = this.formTurno.controls['paciente'].value;

      let turno;
      if (this.auth.tipoDeUsuario === 'paciente') {
        turno = new Turno(
          especialista,
          especialidad,
          `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}`,
          fecha,
          hora,
          'solicitado'
        );
      } else if (this.auth.tipoDeUsuario === 'administrador') {
        let turno = new Turno(
          especialista,
          especialidad,
          paciente,
          fecha,
          hora,
          'solicitado'
        );
      }
      this.db.AgregarObjeto(turno, 'turnos').then((resp) => {
        this.formTurno.reset();

        this.router.navigate(['/']);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno solicitado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
      });
    }
  }

  ValidarCampos() {
    let camposValidados = true;

    const controlEspecialidad = this.formTurno.controls['especialidad'];
    const controlEspecialista = this.formTurno.controls['especialista'];
    const controlFecha = this.formTurno.controls['fecha'];
    const controlHora = this.formTurno.controls['hora'];
    const controlPaciente = this.formTurno.controls['paciente'];

    if (controlEspecialidad.errors !== null) {
      camposValidados = false;
      this.especialidadError = true;
    }

    if (controlEspecialista.errors !== null) {
      camposValidados = false;
      this.especialistasError = true;
    }

    if (controlFecha.errors !== null) {
      camposValidados = false;
      this.fechaError = true;
    }

    if (controlHora.errors !== null) {
      camposValidados = false;
      this.horarError = true;
    }

    if (this.auth.tipoDeUsuario === 'administrador')
      if (controlPaciente.value === '') {
        camposValidados = false;
        this.pacienteError = true;
      }
    return camposValidados;
  }

  obtenerEspecialidades() {
    this.especialidades = [];
    const controlespecialista = this.formTurno.controls['especialista'].value;
    if (controlespecialista === '') {
      this.especialistas.forEach((espec) => {
        espec.especialidades.forEach((especialidad: string) => {
          if (!this.especialidades.includes(especialidad))
            this.especialidades.push(especialidad);
        });
      });
    } else {
      this.especialistas.forEach((espec) => {
        if (`${espec.nombre} ${espec.apellido}` === controlespecialista) {
          this.especialidades = espec.especialidades;
        }
      });
    }

    return this.especialidades;
  }

  obtenerNombresEspecialistas() {
    this.nombresEspecialistas = [];
    const controlespecialidad = this.formTurno.controls['especialidad'].value;
    if (controlespecialidad === '') {
      this.especialistas.forEach((espec) => {
        this.nombresEspecialistas.push(`${espec.nombre} ${espec.apellido}`);
      });
    } else {
      this.especialistas.forEach((espec) => {
        espec.especialidades.forEach((especialidad) => {
          if (controlespecialidad === especialidad) {
            this.nombresEspecialistas.push(`${espec.nombre} ${espec.apellido}`);
          }
        });
      });
    }

    return this.nombresEspecialistas;
  }

  obtenerCambiosListas() {
    this.obtenerEspecialidades();
    this.obtenerNombresEspecialistas();
  }

  obtenerEspecialistas() {
    const observableEspecialistas = this.db.traerObjetos('especialistas');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.especialistas = (resultado as any[])
        // .filter((doc) => doc.acceso === 'permitido')
        .map(
          (doc) =>
            new Especialista(
              doc.nombre,
              doc.apellido,
              doc.edad,
              doc.dni,
              doc.especialidad,
              doc.email,
              doc.fotoPerfil,
              doc.acceso,
              doc.id
            )
        );
    });
  }

  obtenerTurnos() {
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
            doc.resena
          )
      );
    });
  }

  obtenerHorariosDisponibles() {
    const controlespecialista = this.formTurno.controls['especialista'].value;
    const controlDia = this.formTurno.controls['fecha'].value;

    if (controlespecialista === '') return this.horarios;

    let horariosDisponibles = this.horarios;

    this.turnos.forEach((turno) => {
      if (turno.especialista === controlespecialista) {
        if (controlDia === turno.fecha) {
          horariosDisponibles = horariosDisponibles.filter(
            (hora) => hora !== controlDia
          );
        }
      }
    });

    return horariosDisponibles;
  }

  obtenerProximosDias() {
    const hoy = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(hoy);
      date.setDate(hoy.getDate() + i + 1);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      this.proximosDias.push(`${day}/${month}`);
    }
  }

  seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
    this.formTurno.get('fecha')?.setValue(dia);
  }

  seleccionarHorario(horario: string) {
    this.horarioSeleccionado = horario;
    this.formTurno.get('hora')?.setValue(horario);
  }
}
