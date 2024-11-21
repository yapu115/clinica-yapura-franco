import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mostrarNombre',
  standalone: true,
})
export class MostrarNombrePipe implements PipeTransform {
  transform(
    persona: {
      nombre: string;
      apellido: string;
      especialidad?: string;
      especialista?: string;
    },
    formato: 'nombreApellido' | 'doctor' | 'doctorEspecialidad' | 'especialista'
  ): string {
    if (!persona) {
      return '';
    }

    const { nombre, apellido, especialidad, especialista } = persona;

    switch (formato) {
      case 'nombreApellido':
        return `${nombre} ${apellido}`;
      case 'doctor':
        return `Dr/a. ${nombre} ${apellido}`;
      case 'doctorEspecialidad':
        return `Dr/a. ${nombre} ${apellido} - ${especialidad || ''}`.trim();
      case 'especialista':
        return `Dr/a. ${especialista} - ${especialidad || ''}`.trim();
      default:
        return `${nombre} ${apellido}`;
    }
  }
}
