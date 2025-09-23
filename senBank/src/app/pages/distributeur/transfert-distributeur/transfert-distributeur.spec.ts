import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertDistributeur } from './transfert-distributeur';

describe('TransfertDistributeur', () => {
  let component: TransfertDistributeur;
  let fixture: ComponentFixture<TransfertDistributeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertDistributeur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfertDistributeur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
