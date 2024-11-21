import {
  Directive,
  HostListener,
  Input,
  Renderer2,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appEnviarMail]',
  standalone: true,
})
export class EnviarMailDirective {
  @Input('appEnviarMail') email!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.email) {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        this.email
      )}`;
      window.open(gmailUrl, '_blank');
    } else {
      console.error('No se proporcionó un correo electrónico válido.');
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'color', 'blue');
    this.renderer.setStyle(
      this.el.nativeElement,
      'text-decoration',
      'underline'
    );
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'color');
    this.renderer.removeStyle(this.el.nativeElement, 'text-decoration');
    this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
    this.renderer.removeStyle(this.el.nativeElement, 'cursor');
  }
}
