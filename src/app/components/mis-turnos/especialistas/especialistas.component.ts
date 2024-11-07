import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Turno } from '../../../classes/turno';

@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './especialistas.component.html',
  styleUrl: './especialistas.component.css',
})
export class EspecialistasComponent {
  turnos: Turno[] = [];
  query = '';
  subscription: Subscription | null = null;

  activarResena = false;
  mensajeResena = '';

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.obtenerTurnosFirestore();
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
            doc.id
          )
      );
    });
  }

  obtenerTurnos() {
    let misTurnos: any[] = [];

    this.turnos.forEach((turno: any) => {
      if (
        turno.especialista ===
        `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}`
      ) {
        misTurnos.push(turno);
      }
    });

    console.log(misTurnos);
    if (this.query.length == 0) return misTurnos;

    return misTurnos.filter((turno: any) => {
      let nombreCompleto = turno['paciente'].toLowerCase();
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

  rechazarTurno(turno: any) {
    Swal.fire({
      title: 'Rechazar Turno',
      text: 'Por favor, indica la razón pára rechazar el turno:',
      input: 'text',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#e63946',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
      inputValidator: (result) =>
        !result && 'Debes ingresar una razón para rechazar el turno',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno rechazado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        const razon = result.value;
        turno.estado = 'rechazado';
        turno.mensajeCancelacion = result.value;
        this.db.ModificarObjeto(turno, 'turnos');
        console.log('Razón de cancelación:', razon);
      }
    });
  }

  aceptarTurno(turno: any) {
    Swal.fire({
      title: '¿Aceptar turno?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#409f43',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno Aceptado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        turno.estado = 'no realizado';
        this.db.ModificarObjeto(turno, 'turnos');
      }
    });
  }

  finalizarTurno(turno: any) {
    Swal.fire({
      title: 'Finalizar Turno',
      text: 'Deje una reseña:',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonColor: '#118ab2',
      confirmButtonColor: '#409f43',
      confirmButtonText: 'Finalizar',
      cancelButtonText: 'Volver',
      background: '#dedede',
      color: '#000',
      inputValidator: (result) =>
        !result && 'Debes ingresar la reseña para finalizar el turno',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Turno Finalizado',
          showConfirmButton: false,
          timer: 1500,
          background: '#6c757d',
          color: '#e5dada',
          backdrop: false,
        });
        const resena = result.value;
        turno.estado = 'realizado';
        turno.resena = resena;
        this.db.ModificarObjeto(turno, 'turnos');
      }
    });
  }

  mostrarResena(resena: string) {
    this.mensajeResena = resena;
    this.activarResena = true;
  }
}
