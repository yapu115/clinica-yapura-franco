import { Component } from '@angular/core';
import { Administrador } from '../../classes/administrador';
import { Especialista } from '../../classes/especialista';
import { Paciente } from '../../classes/paciente';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink],
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

  constructor(protected auth: AuthService, protected db: DatabaseService) {
    const observableAdmin = this.db.traerObjetos('administradores');

    this.subscription = observableAdmin.subscribe((resultado) => {
      this.obtenerAdmins();
      this.obtenerEspecialistas();
      this.obtenerPacientes();
    });
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
            doc.fotoPerfil
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
            doc.especialidad,
            doc.email,
            doc.fotoPerfil,
            doc.acceso,
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
            doc.fotoPortada
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
    }).then((result) => {
      if (result.isConfirmed) {
        especialista.acceso = 'permitido';
        this.db.ModificarObjeto(especialista, 'especialistas');
        Swal.fire('Acceso Permitido', '', 'success');
      } else if (result.isDenied) {
        especialista.acceso = 'denegado';
        this.db.ModificarObjeto(especialista, 'especialistas');
        Swal.fire('Acceso Denegado', '', 'info');
      }
    });
  }
}
