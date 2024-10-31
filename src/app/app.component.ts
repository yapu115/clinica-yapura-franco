import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  mostrarPanel = false;

  constructor(
    protected auth: AuthService,
    protected router: Router,
    protected load: LoadingService
  ) {
    this.load.loading = true;
  }

  togglePanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }

  cerrarSesion() {
    this.mostrarPanel = false;
    this.auth.CerrarSesion();
    this.router.navigateByUrl('/');
  }
}
