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
  chart3: any;
  chart4: any;

  fechas: any[] = [];
  fechaSeleccionada: any = this.generarFechaHoy();

  fechasInicio: any[] = [];
  fechasFinal: any[] = [];

  fechaInicioSeleccionada: any = this.generarFechaHoy().valor;
  fechaFinalSeleccionada: any = this.generarFechaFuturo().valor;

  tipoTurnosSeleccionado = 'solicitado';

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

  async ngOnInit() {
    await Promise.all([
      this.estadisticas.obtenerTurnosEspecialidadesTotales(),
      this.estadisticas.obtenerTurnosFirestore(),
    ]);
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

    const especialistas = this.estadisticas.especialistas;

    const fechaInicial = this.fechaInicioSeleccionada;
    const fechaFinal = this.fechaFinalSeleccionada;

    let turnosPorEspecialidadEnRango: any = [];

    especialistas.forEach((especialista) => {
      const turnosSolicitados = turnos.filter(
        (t: any) =>
          t.especialista === especialista &&
          t.estado === 'solicitado' &&
          this.estaEnRango(t.fecha, fechaInicial, fechaFinal)
      ).length;
      turnosPorEspecialidadEnRango.push(turnosSolicitados);
    });

    this.crearCanva2(
      'myPieChart3',
      turnosPorEspecialidadEnRango,
      especialistas
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

  modificarCanvaFechaInicialFinal(
    fechaInicial: Date,
    fechaFinal: Date,
    tipoTurnos: string
  ) {
    const turnos = this.estadisticas.turnos;

    const especialistas = this.estadisticas.especialistas;

    let turnosPorEspecialidadEnRango: any = [];

    especialistas.forEach((especialista) => {
      const turnosSolicitados = turnos.filter(
        (t: any) =>
          t.especialista === especialista &&
          t.estado === tipoTurnos &&
          this.estaEnRango(t.fecha, fechaInicial, fechaFinal)
      ).length;
      turnosPorEspecialidadEnRango.push(turnosSolicitados);
    });

    this.chart3.data.datasets[0].data = turnosPorEspecialidadEnRango;
    this.chart3.update();
  }

  // PRIMER CANVA
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

  // SEGUNDO CANVA
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

  // TERCER CANVA
  crearCanva2(div: string, datos: any[], etiquetas: any[]) {
    const ctx = document.getElementById(div) as HTMLCanvasElement;

    if (ctx) {
      this.chart3 = new Chart(ctx, {
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

  onFechaSeleccionada(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.fechaSeleccionada = new Date(selectedValue);
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    this.crearCanvaConFecha(this.fechaSeleccionada);
  }

  onFechaInicialSeleccionada(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.fechaInicioSeleccionada = new Date(selectedValue);

    this.fechasFinal = [];
    this.fechas.forEach((f) => {
      if (f.valor > this.fechaInicioSeleccionada) this.fechasFinal.push(f);
    });
    this.fechasFinal.sort((a, b) => b.valor - a.valor);
    this.modificarCanvaFechaInicialFinal(
      this.fechaInicioSeleccionada,
      this.fechaFinalSeleccionada,
      this.tipoTurnosSeleccionado
    );
  }

  onFechaFinalSeleccionada(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.fechaFinalSeleccionada = new Date(selectedValue);

    this.fechasInicio = [];
    this.fechas.forEach((f) => {
      if (f.valor < this.fechaFinalSeleccionada) this.fechasInicio.push(f);
    });
    this.modificarCanvaFechaInicialFinal(
      this.fechaInicioSeleccionada,
      this.fechaFinalSeleccionada,
      this.tipoTurnosSeleccionado
    );
  }

  onTipoTurnoActualizado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.tipoTurnosSeleccionado = selectedValue;
    this.modificarCanvaFechaInicialFinal(
      this.fechaInicioSeleccionada,
      this.fechaFinalSeleccionada,
      this.tipoTurnosSeleccionado
    );
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
      this.fechasInicio.push({
        formato: `${dia}/${mes}/${año}`,
        valor: nuevaFecha,
      });
      this.fechasFinal.push({
        formato: `${dia}/${mes}/${año}`,
        valor: nuevaFecha,
      });
    }
    this.fechasFinal.sort((a, b) => b.valor - a.valor);
  }

  generarFechaHoy() {
    const nuevaFecha = new Date();
    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const año = nuevaFecha.getFullYear();
    return { formato: `${dia}/${mes}/${año}`, valor: nuevaFecha };
  }

  generarFechaFuturo() {
    const nuevaFecha = new Date();
    nuevaFecha.setDate(new Date().getDate() + 15);
    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const año = nuevaFecha.getFullYear();
    return { formato: `${dia}/${mes}/${año}`, valor: nuevaFecha };
  }

  estaEnRango(fecha: Date, inicio: Date, fin: Date) {
    return fecha >= inicio && fecha <= fin;
  }
}
