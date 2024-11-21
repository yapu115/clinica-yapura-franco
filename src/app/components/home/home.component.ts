import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { EncuestasService } from '../../services/encuestas.service';
import { MostrarCardDirective } from '../../directives/mostrar-card.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MostrarCardDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isSidebarOpen: boolean = false;
  subscription: Subscription | null = null;

  entradasAlSistemaUsuarios: any[] = [];
  entradasAlSistemaAdmin: any[] = [];
  entradasAlSistemaEspecialistas: any[] = [];
  entradasAlSistemaPacientes: any[] = [];

  constructor(protected auth: AuthService, protected db: DatabaseService) {
    this.entradasAlSistemaUsuarios = [];
    this.obtenerAdmins();
    this.obtenerEspecialistas();
    this.obtenerPacientes();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async obtenerAdmins() {
    const observableAdmin = this.db.traerObjetos('administradores');

    const administradores = await firstValueFrom(observableAdmin);
    // this.entradasAlSistemaAdmin = [];
    administradores.forEach((admin: any) => {
      admin.ingresosAlSistema.forEach((fecha: any) => {
        fecha = fecha.toDate();
        this.entradasAlSistemaAdmin.push({
          usuario: `${admin.nombre} ${admin.apellido}`,
          fecha: `${fecha.getDate()}/${
            fecha.getMonth() + 1
          }/${fecha.getFullYear()}`,
          hora: this.obtenerFormatoMinutos(fecha),
          fechaCompleta: fecha,
        });
      });
    });
    this.entradasAlSistemaUsuarios.push(...this.entradasAlSistemaAdmin);
    this.entradasAlSistemaUsuarios.sort(
      (a, b) => b.fechaCompleta - a.fechaCompleta
    );
  }

  async obtenerEspecialistas() {
    const observableEspecialistas = this.db.traerObjetos('especialistas');

    const especialistas = await firstValueFrom(observableEspecialistas);
    especialistas.forEach((admin: any) => {
      admin.ingresosAlSistema.forEach((fecha: any) => {
        fecha = fecha.toDate();
        this.entradasAlSistemaEspecialistas.push({
          usuario: `${admin.nombre} ${admin.apellido}`,
          fecha: `${fecha.getDate()}/${
            fecha.getMonth() + 1
          }/${fecha.getFullYear()}`,
          hora: this.obtenerFormatoMinutos(fecha),
          fechaCompleta: fecha,
        });
      });
    });
    this.entradasAlSistemaUsuarios.push(...this.entradasAlSistemaEspecialistas);
    this.entradasAlSistemaUsuarios.sort(
      (a, b) => b.fechaCompleta - a.fechaCompleta
    );
  }
  async obtenerPacientes() {
    const observablePacientes = this.db.traerObjetos('pacientes');

    const pacientes = await firstValueFrom(observablePacientes);
    pacientes.forEach((p: any) => {
      p.ingresosAlSistema.forEach((fecha: any) => {
        fecha = fecha.toDate();
        this.entradasAlSistemaPacientes.push({
          usuario: `${p.nombre} ${p.apellido}`,
          fecha: `${fecha.getDate()}/${
            fecha.getMonth() + 1
          }/${fecha.getFullYear()}`,
          hora: this.obtenerFormatoMinutos(fecha),
          fechaCompleta: fecha,
        });
      });
    });
    this.entradasAlSistemaUsuarios.push(...this.entradasAlSistemaPacientes);
    this.entradasAlSistemaUsuarios.sort(
      (a, b) => b.fechaCompleta - a.fechaCompleta
    );
  }

  obtenerFormatoMinutos(fecha: any) {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;

    return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
  }
}
