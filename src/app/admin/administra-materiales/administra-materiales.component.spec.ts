import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdministraMaterialesComponent } from './administra-materiales.component';
describe('AdministraMaterialesComponent', () => {
  let component: AdministraMaterialesComponent;
  let fixture: ComponentFixture<AdministraMaterialesComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministraMaterialesComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AdministraMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
