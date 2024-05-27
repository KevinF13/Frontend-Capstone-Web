import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionEmpleadosComponent } from './informacion-empleados.component';

describe('InformacionEmpleadosComponent', () => {
  let component: InformacionEmpleadosComponent;
  let fixture: ComponentFixture<InformacionEmpleadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionEmpleadosComponent]
    });
    fixture = TestBed.createComponent(InformacionEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
