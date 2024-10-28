import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  mostrarPanel = false;

  constructor(protected auth: AuthService) {}

  togglePanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }

  cerrarSesion() {
    this.mostrarPanel = false;
    this.auth.CerrarSesion();
  }
}
