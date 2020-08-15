import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectFormComponent } from './proyect-form.component';

describe('ProyectFormComponent', () => {
  let component: ProyectFormComponent;
  let fixture: ComponentFixture<ProyectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
