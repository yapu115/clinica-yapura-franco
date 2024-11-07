import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent {
  turnos: any = [];
  query = '';

  activarResena = false;
  mensajeResena = '';

  constructor(protected db: DatabaseService, protected auth: AuthService) {
    this.turnos = [
      {
        especialista: 'Peter Parker',
        especialidad: 'Cardiología',
        fecha: new Date('2024-11-06T15:00:00'),
        hora: '15:00',
        estado: 'realizado',
        resena:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        paciente: 'Miles Morales',
      },
      {
        especialista: 'Dra. Ana López',
        especialidad: 'Pediatría',
        fecha: new Date('2024-11-07T10:30:00'),
        hora: '10:30',
        estado: 'realizado',
        resena:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        paciente: 'Kitty Pryde',
      },
      {
        especialista: 'Dr. Carlos Mendoza',
        especialidad: 'Dermatología',
        fecha: new Date('2024-11-08T13:00:00'),
        hora: '13:00',
        estado: 'Realizada',
        paciente: 'Harry Osborn',
      },
      {
        especialista: 'Dra. Laura Torres',
        especialidad: 'Ginecología',
        fecha: new Date('2024-11-09T09:00:00'),
        hora: '09:00',
        estado: 'No realizada',
        paciente: 'Miles Morales',
      },
      {
        especialista: 'Peter Parker',
        especialidad: 'Neurología',
        fecha: new Date('2024-11-10T14:30:00'),
        hora: '14:30',
        estado: 'solicitado',
        paciente: 'Harry Osborn',
      },
    ];
  }

  obtenerTurnos() {
    if (this.query.length == 0) return this.turnos;

    return this.turnos.filter((turno: any) => {
      let nombreCompleto = turno['especialista'].toLowerCase();
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
}
