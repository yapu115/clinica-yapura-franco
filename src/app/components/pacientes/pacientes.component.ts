import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../classes/turno';
import { Paciente } from '../../classes/paciente';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent {
  subscription: Subscription | null = null;
  turnos: any;
  pacientes: any;

  pacienteSeleccionado: Paciente | null = null;
  mostrarHistorialClinico: boolean = false;
  turnosPacienteSeleccionado: any;

  pacientesConTurno: any = [];
  query = '';

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.obtenerPacientes();
    this.obtenerTurnosFirestore();
  }

  obtenerTurnosFirestore() {
    const observableEspecialistas = this.db.traerObjetos('turnos');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.turnos = (resultado as any[])
        .filter((doc) => doc.estado === 'realizado')
        .map(
          (doc) =>
            new Turno(
              doc.especialista,
              doc.especialidad,
              doc.paciente,
              doc.fecha.toDate(),
              doc.estado,
              doc.resena,
              doc.id,
              doc.historialClinico
            )
        );
      this.filtrarPacientesConTurnosRealizados();
    });
  }

  obtenerPacientes() {
    const observablePacientes = this.db.traerObjetos('pacientes');

    this.subscription = observablePacientes.subscribe((resultado) => {
      this.pacientes = (resultado as any[]).map(
        (doc) =>
          new Paciente(
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.obraSocial,
            doc.email,
            doc.fotoPerfil,
            doc.fotoPortada
          )
      );
    });
  }

  filtrarPacientesConTurnosRealizados() {
    const pacientesUnicos = new Set();

    this.turnos.forEach((t: any) => {
      if (
        t.especialista ===
          `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}` &&
        t.estado === 'realizado'
      ) {
        this.pacientes.forEach((p: Paciente) => {
          if (t.paciente === `${p.nombre} ${p.apellido}`) {
            if (!pacientesUnicos.has(p.dni)) {
              pacientesUnicos.add(p.dni);
              this.pacientesConTurno.push(p);
            }
          }
        });
      }
    });
    console.log(this.pacientesConTurno);
  }

  desplegarHistorialClinico(p: Paciente) {
    this.mostrarHistorialClinico = true;
    this.turnosPacienteSeleccionado = this.turnos.filter(
      (turno: any) => turno.paciente === `${p.nombre} ${p.apellido}`
    );
    this.pacienteSeleccionado = p;
  }
}
