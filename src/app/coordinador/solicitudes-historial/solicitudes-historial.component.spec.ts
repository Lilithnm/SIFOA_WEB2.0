import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SolicitudesHistorialComponent } from './solicitudes-historial.component';
describe('SolicitudesHistorialComponent', () => {
  let component: SolicitudesHistorialComponent;
  let fixture: ComponentFixture<SolicitudesHistorialComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesHistorialComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
