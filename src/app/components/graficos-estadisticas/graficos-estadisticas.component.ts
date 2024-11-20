import { Component, OnInit } from '@angular/core';
import {
  Chart,
  PieController,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  RadarController,
  BubbleController,
  PointElement,
  LineElement,
  RadialLinearScale,
  LineController,
} from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { EncuestasService } from '../../services/encuestas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-graficos-estadisticas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './graficos-estadisticas.component.html',
  styleUrl: './graficos-estadisticas.component.css',
})
export class GraficosEstadisticasComponent implements OnInit {
  chart: any;
  chart2: any;

  fechas: any[] = [];
  fechaSeleccionada: any = this.generarFechaHoy();

  constructor(
    protected auth: AuthService,
    protected estadisticas: EncuestasService
  ) {
    Chart.register(
      PieController,
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      RadarController,
      BubbleController,
      RadialLinearScale,
      Tooltip,
      Legend,
      PointElement,
      LineElement,
      LineController
    );
    this.generarFechas();
  }

  ngOnInit() {
    this.iniciarCanva();
  }

  iniciarCanva() {
    const especialidades = this.estadisticas.especialidades;
    const turnos = this.estadisticas.turnos;

    let listaCantidadTurnos: any = [];
    especialidades.forEach((e: any) => {
      const especialidadTurno = turnos.filter(
        (t: any) => t.especialidad === e
      ).length;
      listaCantidadTurnos.push(especialidadTurno);
    });

    this.crearCanva('myPieChart', listaCantidadTurnos, especialidades);

    const fecha = this.fechaSeleccionada.valor;
    let listaCantidadTurnosPorDia: any = [];
    especialidades.forEach((e: any) => {
      const especialidadTurno = turnos.filter(
        (t: any) =>
          t.especialidad === e &&
          `${t.fecha.getDate()}/${t.fecha.getMonth()}/${t.fecha.getFullYear()}` ===
            `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`
      ).length;
      listaCantidadTurnosPorDia.push(especialidadTurno);
    });

    this.crearCanvaBar(
      'myPieChart2',
      listaCantidadTurnosPorDia,
      especialidades
    );
  }

  crearCanvaConFecha(fecha: Date) {
    console.log(fecha);

    const especialidades = this.estadisticas.especialidades;
    const turnos = this.estadisticas.turnos;

    let listaCantidadTurnos: any = [];
    especialidades.forEach((e: any) => {
      const especialidadTurno = turnos.filter(
        (t: any) =>
          t.especialidad === e &&
          `${t.fecha.getDate()}/${t.fecha.getMonth()}/${t.fecha.getFullYear()}` ===
            `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`
      ).length;
      listaCantidadTurnos.push(especialidadTurno);
    });

    console.log(listaCantidadTurnos);
    this.chart2.data.datasets[0].data = listaCantidadTurnos;
    this.chart2.update();
  }

  //  10/04    -     06/03      -      25/04
  //  20 / derm

  crearCanva(div: string, datos: any[], etiquetas: any[]) {
    const ctx = document.getElementById(div) as HTMLCanvasElement;

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: 'turnos',
              data: datos,
              backgroundColor: [
                'rgba(75, 0, 130, 0.6)', // Indigo oscuro
                'rgba(139, 0, 0, 0.6)', // Rojo oscuro
                'rgba(0, 100, 0, 0.6)', // Verde oscuro
                'rgba(72, 61, 139, 0.6)', // Azul oscuro
                'rgba(47, 79, 79, 0.6)', // Gris oscuro
                'rgba(128, 0, 128, 0.6)', // Púrpura oscuro
                'rgba(0, 0, 128, 0.6)', // Azul marino
              ],
              borderColor: [
                'rgba(75, 0, 130, 1)', // Indigo oscuro
                'rgba(139, 0, 0, 1)', // Rojo oscuro
                'rgba(0, 100, 0, 1)', // Verde oscuro
                'rgba(72, 61, 139, 1)', // Azul oscuro
                'rgba(47, 79, 79, 1)', // Gris oscuro
                'rgba(128, 0, 128, 1)', // Púrpura oscuro
                'rgba(0, 0, 128, 1)', // Azul marino
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: 'black', // Cambia el color del texto de la leyenda a negro
              },
            },
          },
        },
      });
    }
  }

  crearCanvaBar(div: string, datos: any[], etiquetas: any[]) {
    const ctx = document.getElementById(div) as HTMLCanvasElement;

    if (ctx) {
      this.chart2 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: 'Turnos',
              data: datos,
              backgroundColor: [
                'rgba(139, 0, 0, 0.6)', // Rojo oscuro
                'rgba(75, 0, 130, 0.6)', // Indigo oscuro
                'rgba(0, 100, 0, 0.6)', // Verde oscuro
                'rgba(72, 61, 139, 0.6)', // Azul oscuro
                'rgba(47, 79, 79, 0.6)', // Gris oscuro
                'rgba(128, 0, 128, 0.6)', // Púrpura oscuro
                'rgba(0, 0, 128, 0.6)', // Azul marino
              ],
              borderColor: [
                'rgba(139, 0, 0, 1)', // Rojo oscuro
                'rgba(75, 0, 130, 1)', // Indigo oscuro
                'rgba(0, 100, 0, 1)', // Verde oscuro
                'rgba(72, 61, 139, 1)', // Azul oscuro
                'rgba(47, 79, 79, 1)', // Gris oscuro
                'rgba(128, 0, 128, 1)', // Púrpura oscuro
                'rgba(0, 0, 128, 1)', // Azul marino
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              padding: 20,
            },
            legend: {
              position: 'top',
              labels: {
                color: 'black',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'black',
                stepSize: 1,
              },
              grid: {
                color: 'black',
              },
            },
            x: {
              ticks: {
                color: 'black',
              },
            },
          },
        },
      });
    }
  }

  onFechaSeleccionada(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.fechaSeleccionada = new Date(selectedValue);
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    this.crearCanvaConFecha(this.fechaSeleccionada);
  }

  generarFechas() {
    const hoy = new Date();
    for (let i = 0; i < 16; i++) {
      const nuevaFecha = new Date();
      nuevaFecha.setDate(hoy.getDate() + i);
      const dia = nuevaFecha.getDate().toString().padStart(2, '0');
      const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
      const año = nuevaFecha.getFullYear();
      this.fechas.push({ formato: `${dia}/${mes}/${año}`, valor: nuevaFecha });
    }
  }

  generarFechaHoy() {
    const nuevaFecha = new Date();
    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const año = nuevaFecha.getFullYear();
    return { formato: `${dia}/${mes}/${año}`, valor: nuevaFecha };
  }
}
