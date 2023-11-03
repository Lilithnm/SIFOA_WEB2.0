import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdministraPeriodosComponent } from './administra-periodos.component';
describe('AdministraPeriodosComponent', () => {
  let component: AdministraPeriodosComponent;
  let fixture: ComponentFixture<AdministraPeriodosComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministraPeriodosComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AdministraPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
