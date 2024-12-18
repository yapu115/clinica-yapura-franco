import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAdministradoresComponent } from './registro-administradores.component';

describe('RegistroAdministradoresComponent', () => {
  let component: RegistroAdministradoresComponent;
  let fixture: ComponentFixture<RegistroAdministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAdministradoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
