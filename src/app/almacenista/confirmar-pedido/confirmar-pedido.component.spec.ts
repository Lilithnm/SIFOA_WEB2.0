import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmarPedidoComponent } from './confirmar-pedido.component';

describe('ConfirmarPedidoComponent', () => {
  let component: ConfirmarPedidoComponent;
  let fixture: ComponentFixture<ConfirmarPedidoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
