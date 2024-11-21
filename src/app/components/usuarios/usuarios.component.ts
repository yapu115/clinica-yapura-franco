import { Component } from '@angular/core';
import { Administrador } from '../../classes/administrador';
import { Especialista } from '../../classes/especialista';
import { Paciente } from '../../classes/paciente';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { Turno } from '../../classes/turno';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { AgrandarImagenDirective } from '../../directives/agrandar-imagen.directive';
import { EnviarMailDirective } from '../../directives/enviar-mail.directive';
// import { saveAs } from 'file-saver';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    AgrandarImagenDirective,
    EnviarMailDirective,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  subscription: Subscription | null = null;

  administradores: Administrador[] = [];
  especialistas: Especialista[] = [];
  pacientes: Paciente[] = [];

  mostrarInfoAdministradores: boolean = true;
  mostrarInfoEspecialistas: boolean = false;
  mostrarInfoPacientes: boolean = false;

  turnos: any;
  turnosPacienteSeleccionado: any;
  mostrarHistorialClinico: boolean = false;

  pacienteSeleccionado: Paciente | null = null;

  constructor(protected auth: AuthService, protected db: DatabaseService) {
    this.obtenerAdmins();
    this.obtenerEspecialistas();
    this.obtenerPacientes();
    this.obtenerTurnosFirestore();
  }

  mostrarAdministradores() {
    this.mostrarInfoAdministradores = true;
    this.mostrarInfoEspecialistas = false;
    this.mostrarInfoPacientes = false;
  }

  mostrarEspecialistas() {
    this.mostrarInfoAdministradores = false;
    this.mostrarInfoEspecialistas = true;
    this.mostrarInfoPacientes = false;
  }

  mostrarPacientes() {
    this.mostrarInfoAdministradores = false;
    this.mostrarInfoEspecialistas = false;
    this.mostrarInfoPacientes = true;
  }

  obtenerAdmins() {
    const observableAdmin = this.db.traerObjetos('administradores');

    this.subscription = observableAdmin.subscribe((resultado) => {
      this.administradores = (resultado as any[]).map(
        (doc) =>
          new Administrador(
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.email,
            doc.fotoPerfil,
            doc.contrasena,
            doc.ingresosAlSistema
          )
      );
    });
  }

  obtenerEspecialistas() {
    const observableEspecialistas = this.db.traerObjetos('especialistas');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.especialistas = (resultado as any[]).map(
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
            doc.ingresosAlSistema,
            doc.id
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
            doc.fotoPortada,
            doc.ingresosAlSistema
          )
      );
    });
  }

  cambiarEstadoAcceso(especialista: Especialista) {
    Swal.fire({
      title: '¿Permitir Acceso al especialista?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Permitir',
      denyButtonText: `Denegar`,
      confirmButtonColor: '#409f43',
      denyButtonColor: '#b81414',
      background: '#4f9dde',
      color: '#222',
    }).then((result) => {
      if (result.isConfirmed) {
        especialista.acceso = 'permitido';
        console.log(especialista);
        this.db.ModificarObjeto(especialista, 'especialistas');
        Swal.fire({
          title: 'Acceso Permitido',
          icon: 'success',
          background: '#4f9dde',
          color: '#222',
          confirmButtonColor: '#004b97',
        });
      } else if (result.isDenied) {
        especialista.acceso = 'denegado';
        this.db.ModificarObjeto(especialista, 'especialistas');
        Swal.fire({
          title: 'Acceso Denegado',
          icon: 'info',
          background: '#4f9dde',
          color: '#222',
          confirmButtonColor: '#004b97',
        });
      }
    });
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
      console.log(this.turnos);
    });
  }

  desplegarHistorialClinico(p: Paciente) {
    this.mostrarHistorialClinico = true;
    this.turnosPacienteSeleccionado = this.turnos.filter(
      (turno: any) => turno.paciente === `${p.nombre} ${p.apellido}`
    );
    this.pacienteSeleccionado = p;
  }

  turnosFiltrados(paciente: any): Turno[] {
    return this.turnos.filter(
      (t: any) => t.paciente === `${paciente.nombre} ${paciente.apellido}`
    );
  }

  descargarExcel() {
    // Encabezados del archivo
    const encabezados = [
      'Paciente',
      'Especialista',
      'Especialidad',
      'Fecha',
      'Hora',
    ];

    // Convertir datos a formato CSV
    let contenido = encabezados.join(',') + '\n';
    this.turnosPacienteSeleccionado.forEach((t: Turno) => {
      const fila = [
        t.paciente,
        t.especialista,
        t.especialidad,
        `${t.fecha.getDate()}/${
          t.fecha.getMonth() + 1
        }/${t.fecha.getFullYear()}`,
        `${t.fecha.getHours()}:${t.fecha.getMinutes()}`,
      ].join(',');
      contenido += fila + '\n';
    });
    console.log(contenido);

    // Crear un Blob con el contenido en formato CSV
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });

    // Crear enlace dinámico para la descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turnos_${this.pacienteSeleccionado?.apellido}.csv`; // Nombre del archivo
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
