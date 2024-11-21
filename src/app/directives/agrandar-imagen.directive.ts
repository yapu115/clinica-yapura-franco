import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAgrandarImagen]',
  standalone: true,
})
export class AgrandarImagenDirective {
  private previewBox: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    const imgSrc = this.el.nativeElement.src;

    this.previewBox = this.renderer.createElement('div');
    const previewImg = this.renderer.createElement('img');

    // Estilo para el cuadro
    this.renderer.setStyle(this.previewBox, 'position', 'absolute');
    this.renderer.setStyle(this.previewBox, 'border', '2px solid black');
    this.renderer.setStyle(this.previewBox, 'border-radius', '20px');
    this.renderer.setStyle(this.previewBox, 'background', 'black');
    this.renderer.setStyle(this.previewBox, 'padding', '2px');
    this.renderer.setStyle(
      this.previewBox,
      'box-shadow',
      '0px 4px 6px rgba(0, 0, 0, 0.1)'
    );
    this.renderer.setStyle(this.previewBox, 'z-index', '1000');

    this.renderer.setStyle(previewImg, 'width', '200px');
    this.renderer.setStyle(previewImg, 'height', 'auto');
    this.renderer.setStyle(previewImg, 'border-radius', '20px');

    this.renderer.setAttribute(previewImg, 'src', imgSrc);

    this.renderer.appendChild(this.previewBox, previewImg);

    this.renderer.appendChild(document.body, this.previewBox);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.previewBox) {
      const offsetX = 20;
      const offsetY = 10;
      this.renderer.setStyle(
        this.previewBox,
        'top',
        `${event.clientY + offsetY}px`
      );
      this.renderer.setStyle(
        this.previewBox,
        'left',
        `${event.clientX + offsetX}px`
      );
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.previewBox) {
      this.renderer.removeChild(document.body, this.previewBox);
      this.previewBox = null;
    }
  }
}
