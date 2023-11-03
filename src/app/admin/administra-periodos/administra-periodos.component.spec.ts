import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdministraSolicitudesComponent } from './administra-solicitudes.component';
describe('AdministraSolicitudesComponent', () => {
  let component: AdministraSolicitudesComponent;
  let fixture: ComponentFixture<AdministraSolicitudesComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministraSolicitudesComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AdministraSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
