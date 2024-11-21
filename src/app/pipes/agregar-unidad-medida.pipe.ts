import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agregarUnidadMedida',
  standalone: true,
})
export class AgregarUnidadMedidaPipe implements PipeTransform {
  transform(value: string | number, type: 'cm' | 'kg' | '°C' | 'mmHg'): string {
    if (value === null || value === undefined) {
      return '';
    }

    const formattedValue =
      typeof value === 'number' ? value.toFixed(2) : value.toString();

    switch (type) {
      case 'cm':
        return `${formattedValue} cm`;
      case 'kg':
        return `${formattedValue} kg`;
      case '°C':
        return `${formattedValue} °C`;
      case 'mmHg':
        return `${formattedValue} mmHg`;
      default:
        return formattedValue;
    }
  }
}
