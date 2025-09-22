import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Annulation } from './annulation';

describe('Annulation', () => {
  let component: Annulation;
  let fixture: ComponentFixture<Annulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Annulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Annulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
