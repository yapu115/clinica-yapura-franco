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
    data: { animation: 'home' },
  },

  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: { animation: 'iniciar-sesion' },
  },
  {
    path: 'ingresar-registrarse',
    loadComponent: () =>
      import(
        './components/auth/registro/ingreso-registro/ingreso-registro.component'
      ).then((m) => m.IngresoRegistroComponent),
    data: { animation: 'ingresar-registrarse' },
  },

  {
    path: 'registrarse',
    loadComponent: () =>
      import('./components/auth/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
    data: { animation: 'registrarse' },
  },
  //pacientes
  {
    path: 'turnos',
    loadComponent: () =>
      import('./components/turnos/turnos.component').then(
        (m) => m.TurnosComponent
      ),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'solicitar-turno',
    loadComponent: () =>
      import('./components/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
    data: { animation: 'solicitar-turno' },
  },
  {
    path: 'mis-turnos-paciente',
    loadComponent: () =>
      import('./components/mis-turnos/pacientes/pacientes.component').then(
        (m) => m.PacientesComponent
      ),
    data: { animation: 'mis-turnos-paciente' },
  },
  //especialista
  {
    path: 'mis-turnos-especialista',
    loadComponent: () =>
      import(
        './components/mis-turnos/especialistas/especialistas.component'
      ).then((m) => m.EspecialistasComponent),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'pacientes',
    loadComponent: () =>
      import('./components/pacientes/pacientes.component').then(
        (m) => m.PacientesComponent
      ),
    // canDeactivate: [noAuthGuard],
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./components/mi-perfil/mi-perfil.component').then(
        (m) => m.MiPerfilComponent
      ),
    data: { animation: 'mi-perfil' },
  },
  //admin
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
    path: 'graficos-estadisticas',
    loadComponent: () =>
      import(
        './components/graficos-estadisticas/graficos-estadisticas.component'
      ).then((m) => m.GraficosEstadisticasComponent),
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
