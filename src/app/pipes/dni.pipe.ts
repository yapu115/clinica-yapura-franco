import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni',
  standalone: true,
})
export class DniPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) return '';

    const dni = value.toString();

    const dniFormateado = dni.replace(/\D/g, '');

    return dniFormateado.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1-');
    // Encuentra números (\d).
    // Aplica un guión (-) cada tres dígitos, comenzando desde la derecha, sin agregarlo al final.
  }
}
