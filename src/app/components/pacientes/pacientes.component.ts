import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../classes/turno';
import { Paciente } from '../../classes/paciente';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [],
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

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.obtenerTurnosFirestore();
    this.obtenerPacientes();
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
            doc.id,
            doc.historialClinico
          )
      );
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
}
