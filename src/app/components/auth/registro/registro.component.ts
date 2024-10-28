import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    RouterOutlet,
    EspecialistasComponent,
    PacientesComponent,
    RouterLink,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  @ViewChild('container') container!: ElementRef;
  constructor(protected auth: AuthService) {}

  registrarEspecialistas(): void {
    this.container.nativeElement.classList.add('right-panel-active');
  }

  registrarPacientes(): void {
    this.container.nativeElement.classList.remove('right-panel-active');
  }
}
