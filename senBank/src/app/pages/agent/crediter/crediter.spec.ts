import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crediter } from './crediter';

describe('Crediter', () => {
  let component: Crediter;
  let fixture: ComponentFixture<Crediter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crediter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Crediter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
