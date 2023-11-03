import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NuevaSolicitudComponent } from './nueva-solicitud.component';

describe('NuevaSolicitudComponent', () => {
  let component: NuevaSolicitudComponent;
  let fixture: ComponentFixture<NuevaSolicitudComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
