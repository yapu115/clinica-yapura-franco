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
import { Paciente } from '../../classes/paciente';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { LoadingService } from '../../services/loading.service';
import { MostrarNombrePipe } from '../../pipes/mostrar-nombre.pipe';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule,
    MostrarNombrePipe,
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
})
export class SolicitarTurnoComponent {
  formTurno: FormGroup;
  subscription: Subscription | null = null;

  especialistas: Especialista[] = [];
  pacientes: Paciente[] = [];
  especialidades: string[] = [];
  nombresEspecialistas: string[] = [];
  nombresPacientes: string[] = [];
  turnos: any[] = [];

  especialistasError: boolean = false;
  especialidadError: boolean = false;
  fechaError: boolean = false;
  pacienteError: boolean = false;

  mensajeEspecialista = 'Debe ingresar un especialista';
  mensajeEspecialidad = 'Debe ingresar una especialidad';
  mensajeFecha = 'Debe ingresar una fecha para el turno';
  mensajePaciente = 'Debe ingresar un paciente';

  diaSeleccionado: string | null = null;

  // -------------------------------
  fechaSeleccionada: any = null;
  turnosDisponibles: any[] = [];

  especialistaSeleccionado: any = null;
  especialidadSeleccionada: any = null;
  // -------------------------------

  constructor(
    protected auth: AuthService,
    protected db: DatabaseService,
    protected router: Router,
    protected load: LoadingService
  ) {
    this.obtenerEspecialistas();
    this.obtenerPacientes();
    this.obtenerTurnos();
    // this.cargarTurnos();

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
    this.pacienteError = false;

    if (this.ValidarCampos()) {
      const especialidad = this.formTurno.controls['especialidad'].value;
      const especialista = this.formTurno.controls['especialista'].value;
      const fecha = this.formTurno.controls['fecha'].value;
      const paciente = this.formTurno.controls['paciente'].value;

      this.load.loading = true;
      let turno;
      if (this.auth.tipoDeUsuario === 'paciente') {
        turno = new Turno(
          especialista,
          especialidad,
          `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}`,
          fecha,
          'solicitado'
        );
      } else if (this.auth.tipoDeUsuario === 'administrador') {
        turno = new Turno(
          especialista,
          especialidad,
          paciente,
          fecha,
          'solicitado'
        );
      }
      this.db.AgregarObjeto(turno, 'turnos').then((resp) => {
        this.formTurno.reset();

        this.router.navigate(['/']);
        this.load.loading = false;
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
    const controlPaciente = this.formTurno.controls['paciente'];

    if (controlEspecialista.errors !== null) {
      camposValidados = false;
      this.especialistasError = true;
    }

    if (controlEspecialidad.errors !== null) {
      camposValidados = false;
      if (controlEspecialista.value !== '') this.especialidadError = true;
    }

    if (controlFecha.errors !== null) {
      camposValidados = false;
      if (controlEspecialidad.value !== '') this.fechaError = true;
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

  asignarEspecialista(e: Especialista) {
    this.formTurno.get('especialista')?.setValue(`${e.nombre} ${e.apellido}`);
    this.especialistaSeleccionado = e;
    this.especialistasError = false;
  }

  asignarEspecialidad(e: string) {
    this.formTurno.get('especialidad')?.setValue(e);
    this.especialidadSeleccionada = e;
    this.especialidadError = false;
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

  obtenerNombresPacientes() {
    this.nombresPacientes = [];
    this.pacientes.forEach((pac) => {
      this.nombresPacientes.push(`${pac.nombre} ${pac.apellido}`);
    });

    return this.nombresPacientes;
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
              doc.especialidades,
              doc.email,
              doc.fotoPerfil,
              doc.acceso,
              doc.id
            )
        );
    });
  }

  obtenerPacientes() {
    const observableEspecialistas = this.db.traerObjetos('pacientes');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.pacientes = (resultado as any[])
        // .filter((doc) => doc.acceso === 'permitido')
        .map(
          (doc) =>
            new Paciente(
              doc.nombre,
              doc.apellido,
              doc.edad,
              doc.dni,
              doc.obraSocial,
              doc.email,
              doc.fotoPerfil,
              doc.fotoPortada,
              doc.dni
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
            doc.estado,
            doc.resena
          )
      );
      this.cargarTurnos();
    });
  }

  cargarTurnos() {
    const horariosPorDia = [
      '09:00',
      '10:30',
      '12:00',
      '13:30',
      '15:00',
      '16:30',
    ];
    const hoy = new Date();
    for (let i = 0; i < 15; i++) {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() + i);

      horariosPorDia.forEach((hora) => {
        const [horas, minutos] = hora.split(':').map(Number);
        const fechaCompleta = new Date(dia);
        fechaCompleta.setHours(horas, minutos, 0, 0);

        this.turnosDisponibles.push({ fecha: fechaCompleta, disponible: true });
      });
    }

    const turnosOcupados = this.turnos.map((turno) => turno.fecha.toDate());

    this.turnosDisponibles = this.turnosDisponibles.filter((turno) => {
      return !turnosOcupados.some(
        (ocupado: Date) => ocupado.getTime() === turno.fecha.getTime()
      );
    });
  }

  seleccionarDia(dia: any) {
    this.turnosDisponibles.forEach((t) => (t.seleccionado = false));
    dia.seleccionado = true;
    this.diaSeleccionado = dia;
    this.formTurno.get('fecha')?.setValue(dia.fecha);
  }

  quitarTildes(texto: string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  asignarImagenDefault(event: Event): void {
    (event.target as HTMLImageElement).src = '/especialidades/default.png';
  }
}
