import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  HostListener,
} from '@angular/core';
import { Administrador } from '../classes/administrador';
import { Especialista } from '../classes/especialista';
import { Paciente } from '../classes/paciente';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';
import { DniPipe } from '../pipes/dni.pipe';

@Directive({
  selector: '[appMostrarCard]',
  standalone: true,
  providers: [DniPipe],
})
export class MostrarCardDirective {
  @Input('appMostrarCard') userInfo!: any;
  private tooltipElement!: HTMLElement;
  private isHoveringTooltip = false;
  subscription: Subscription | null = null;

  administradores: Administrador[] = [];
  especialistas: Especialista[] = [];
  pacientes: Paciente[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    protected db: DatabaseService,
    private dniPipe: DniPipe
  ) {
    this.obtenerAdmins();
    this.obtenerEspecialistas();
    this.obtenerPacientes();
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    let usuario: any;

    // Buscar al usuario en las listas
    this.administradores.forEach((admin) => {
      if (`${admin.nombre} ${admin.apellido}` === this.userInfo)
        usuario = admin;
    });

    this.pacientes.forEach((pac) => {
      if (`${pac.nombre} ${pac.apellido}` === this.userInfo) usuario = pac;
    });

    this.especialistas.forEach((esp) => {
      if (`${esp.nombre} ${esp.apellido}` === this.userInfo) usuario = esp;
    });

    if (usuario) {
      this.createTooltip(usuario, event);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    setTimeout(() => {
      if (!this.isHoveringTooltip) {
        this.removeTooltip();
      }
    }, 10);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.tooltipElement) {
      this.renderer.setStyle(
        this.tooltipElement,
        'top',
        `${event.clientY + 10}px`
      );
      this.renderer.setStyle(
        this.tooltipElement,
        'left',
        `${event.clientX + 10}px`
      );
    }
  }

  private createTooltip(usuario: any, event: MouseEvent) {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'card-tooltip');

    const cardHtml = `
      <div class="card">
        <div class="card-header">
          <img
            class="profile-img"
            src="${usuario.fotoPerfil}"
            alt="Imagen del usuario"
          />
          <div class="patient-info">
            <h2 class="patient-name">
              ${usuario.nombre} ${usuario.apellido}
            </h2>
            <p class="patient-specialty">${usuario.edad} años</p>
          </div>
        </div>
        <div class="card-body">
          <p>Correo: <strong>${usuario.email}</strong></p>
          <p>DNI: <strong>${this.dniPipe.transform(usuario.dni)}</strong></p>
        </div>
      </div>
    `;

    this.tooltipElement.innerHTML = cardHtml;

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(
      this.tooltipElement,
      'top',
      `${event.clientY + 40}px`
    );
    this.renderer.setStyle(
      this.tooltipElement,
      'left',
      `${event.clientX + 40}px`
    );
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'width', '400px');

    const body = document.querySelector('body');
    if (body) {
      this.renderer.appendChild(body, this.tooltipElement);

      this.renderer.listen(this.tooltipElement, 'mouseenter', () => {
        this.isHoveringTooltip = true;
      });

      this.renderer.listen(this.tooltipElement, 'mouseleave', () => {
        this.isHoveringTooltip = false;
        this.removeTooltip();
      });
    }
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(
        document.querySelector('body'),
        this.tooltipElement
      );
      this.tooltipElement = null!;
    }
  }

  obtenerAdmins() {
    const observableAdmin = this.db.traerObjetos('administradores');

    this.subscription = observableAdmin.subscribe((resultado) => {
      this.administradores = (resultado as any[]).map(
        (doc) =>
          new Administrador(
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.email,
            doc.fotoPerfil,
            doc.contrasena,
            doc.ingresosAlSistema
          )
      );
    });
  }

  obtenerEspecialistas() {
    const observableEspecialistas = this.db.traerObjetos('especialistas');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.especialistas = (resultado as any[]).map(
        (doc) =>
          new Especialista(
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.especialidades,
            doc.email,
            doc.fotoPerfil,
            doc.acceso,
            doc.ingresosAlSistema,
            doc.id
          )
      );
    });
  }

  obtenerPacientes() {
    const observablePacientes = this.db.traerObjetos('pacientes');

    this.subscription = observablePacientes.subscribe((resultado) => {
      this.pacientes = (resultado as any[]).map(
        (doc) =>
          new Paciente(
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.obraSocial,
            doc.email,
            doc.fotoPerfil,
            doc.fotoPortada,
            doc.ingresosAlSistema
          )
      );
    });
  }
}
