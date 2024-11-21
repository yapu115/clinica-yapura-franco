import { Injectable } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { DatabaseService } from './database.service';
import { Especialista } from '../classes/especialista';
import { Turno } from '../classes/turno';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  subscription: Subscription | null = null;
  especialidades: any = [];
  especialistas: any[] = [];
  turnos: any = [];

  constructor(protected db: DatabaseService) {
    this.obtenerTurnosEspecialidadesTotales();
    this.obtenerTurnosFirestore();
  }

  async obtenerTurnosEspecialidadesTotales() {
    const observableEspecialistas = this.db.traerObjetos('especialistas');

    const especialistas = await firstValueFrom(observableEspecialistas);

    especialistas.forEach((e: any) => {
      e.especialidades.forEach((especialidad: string) => {
        if (!this.especialidades.includes(especialidad))
          this.especialidades.push(especialidad);
      });
      if (!this.especialistas.includes(`${e.nombre} ${e.apellido}`))
        this.especialistas.push(`${e.nombre} ${e.apellido}`);
    });
  }

  async obtenerTurnosFirestore() {
    this.turnos = [];
    const observableTurnos = this.db.traerObjetos('turnos');

    const turnos = await firstValueFrom(observableTurnos);
    this.turnos = (turnos as any[]).map(
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
  }
}
