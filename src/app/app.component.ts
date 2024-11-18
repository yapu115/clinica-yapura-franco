import { Component } from '@angular/core';
import {
  ChildrenOutletContexts,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';
import { animations } from './components/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [animations],
})
export class AppComponent {
  mostrarPanel = false;

  constructor(
    protected auth: AuthService,
    protected router: Router,
    protected load: LoadingService,
    private contexts: ChildrenOutletContexts
  ) {
    this.load.loading = true;
  }
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

  togglePanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }

  cerrarSesion() {
    this.mostrarPanel = false;
    this.auth.CerrarSesion();
    this.router.navigateByUrl('/');
  }

  verMiPerfil() {
    this.router.navigateByUrl('/mi-perfil');
    this.mostrarPanel = false;
  }
}
