import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import { Turno } from '../../classes/turno';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  subscription: Subscription | null = null;

  turnos: any;

  constructor(protected auth: AuthService, protected db: DatabaseService) {
    this.obtenerTurnosFirestore();
  }

  obtenerTurnosFirestore() {
    const observableEspecialistas = this.db.traerObjetos('turnos');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.turnos = (resultado as any[])
        .map(
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
        )
        .filter(
          (turno) =>
            turno.paciente ===
              `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}` &&
            turno.estado === 'realizado'
        );
    });
  }
}
