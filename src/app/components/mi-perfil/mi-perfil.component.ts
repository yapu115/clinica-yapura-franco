import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import { Turno } from '../../classes/turno';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  subscription: Subscription | null = null;
  @ViewChild('turnosPDF', { static: false }) turnosPDF!: ElementRef;

  turnos: any;
  logoURL: string = '/home_logo.png';

  mostrarModal = false;
  especialidades: any[] = [];
  especialidadSeleccionada = 'todas';

  constructor(protected auth: AuthService, protected db: DatabaseService) {
    this.obtenerTurnosFirestore();
  }

  obtenerTurnosFirestore() {
    const observableEspecialistas = this.db.traerObjetos('turnos');

    this.subscription = observableEspecialistas.subscribe((resultado) => {
      this.turnos = (resultado as any[])
        .map(
          (doc) =>
            new Turno(
              doc.especialista,
              doc.especialidad,
              doc.paciente,
              doc.fecha.toDate(),
              doc.estado,
              doc.resena,
              doc.id,
              doc.historialClinico
            )
        )
        .filter(
          (turno) =>
            turno.paciente ===
              `${this.auth.usuario.nombre} ${this.auth.usuario.apellido}` &&
            turno.estado === 'realizado'
        );
    });
  }

  abrirModal() {
    this.mostrarModal = true;
    this.especialidades = [
      ...new Set(this.turnos.map((turno: Turno) => turno.especialidad)),
    ];
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.especialidades = [];
  }

  generarPDF(especialidad: string) {
    let turnosPDF;

    if (especialidad === 'todas' || especialidad === '') {
      turnosPDF = this.turnos;
    } else {
      turnosPDF = this.turnos.filter(
        (turno: Turno) => turno.especialidad === especialidad
      );
    }
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const marginX = 15;
    let currentY = 20;
    const espaciadoEntreTurnos = 15;

    doc.addImage(this.logoURL, 'PNG', marginX, currentY, 40, 40);
    currentY += 55;

    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text(
      `Historial Clínico - ${this.auth.usuario.nombre} ${this.auth.usuario.apellido}`,
      pageWidth / 2,
      currentY,
      { align: 'center' }
    );
    currentY += 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 15;

    doc.setFontSize(12);
    turnosPDF.forEach((turno: any, index: any) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 37, 41);
      doc.text(turno.especialista, marginX, currentY);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${turno.fecha.getDate()}/${
          turno.fecha.getMonth() + 1
        }/${turno.fecha.getFullYear()}`,
        pageWidth - marginX - 20,
        currentY
      );
      currentY += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Altura: ${turno.historialClinico.altura} cm`,
        marginX,
        currentY
      );
      doc.text(
        `Peso: ${turno.historialClinico.peso} kg`,
        marginX + 50,
        currentY
      );
      currentY += 7;

      doc.text(
        `Temperatura: ${turno.historialClinico.temperatura} °C`,
        marginX,
        currentY
      );
      doc.text(
        `Presión: ${turno.historialClinico.presion} mmHg`,
        marginX + 50,
        currentY
      );
      currentY += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 248, 255);
      doc.rect(marginX, currentY - 3, pageWidth - 2 * marginX, 10, 'F');
      doc.setTextColor(0, 51, 102);
      doc.text('Observaciones:', marginX + 2, currentY + 4);
      currentY += 15;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      turno.historialClinico.datosAdicionales.forEach((dato: any) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(`${dato.clave}: ${dato.valor}`, marginX + 5, currentY);
        currentY += 7;
      });

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(50, 50, 50);
      doc.text(`Reseña: ${turno.resena}`, marginX, currentY);
      currentY += espaciadoEntreTurnos;

      doc.setDrawColor(200, 200, 200);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      currentY += 5;
    });

    doc.save('historial-clinico.pdf');
    this.cerrarModal();
  }
}
