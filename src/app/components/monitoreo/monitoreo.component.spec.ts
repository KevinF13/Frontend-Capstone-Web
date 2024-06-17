import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoComponent } from './monitoreo.component';

describe('MonitoreoComponent', () => {
  let component: MonitoreoComponent;
  let fixture: ComponentFixture<MonitoreoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoreoComponent]
    });
    fixture = TestBed.createComponent(MonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
