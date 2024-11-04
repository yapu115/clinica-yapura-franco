import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoRegistroComponent } from './ingreso-registro.component';

describe('IngresoRegistroComponent', () => {
  let component: IngresoRegistroComponent;
  let fixture: ComponentFixture<IngresoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
