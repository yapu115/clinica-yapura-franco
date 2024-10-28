import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'registrarse',
    loadComponent: () =>
      import('./components/auth/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/usuarios/usuarios.component').then(
        (m) => m.UsuariosComponent
      ),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'registrar-administradores',
    loadComponent: () =>
      import(
        './components/auth/registro-administradores/registro-administradores.component'
      ).then((m) => m.RegistroAdministradoresComponent),
    // canDeactivate: [noAuthGuard],
  },

  {
    path: 'error',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
  },
];
