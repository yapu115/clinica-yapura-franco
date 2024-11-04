import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';

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
  containerClass = '';
  @ViewChild('container') container!: ElementRef;
  constructor(protected auth: AuthService, protected load: LoadingService) {
    if (!load.regPaciente) {
      this.containerClass = 'right-panel-active';
      this.load.loading = false;
    }
  }

  registrarEspecialistas(): void {
    this.containerClass = 'right-panel-active';
    // this.container.nativeElement.classList.add('right-panel-active');
  }

  registrarPacientes(): void {
    // this.container.nativeElement.classList.remove('right-panel-active');
    this.containerClass = '';
  }
}
