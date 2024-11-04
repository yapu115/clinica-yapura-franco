import { Component } from '@angular/core';
import { LoadingService } from '../../../../services/loading.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ingreso-registro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ingreso-registro.component.html',
  styleUrl: './ingreso-registro.component.css',
})
export class IngresoRegistroComponent {
  constructor(protected load: LoadingService, protected route: Router) {}

  ingresarPaciente() {
    this.load.regPaciente = true;
    this.route.navigateByUrl('/registrarse');
  }

  ingresarEspecialista() {
    this.load.regPaciente = false;
    this.route.navigateByUrl('/registrarse');
    this.load.loading = true;
  }
}
