import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profilhead } from './profilhead';

describe('Profilhead', () => {
  let component: Profilhead;
  let fixture: ComponentFixture<Profilhead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profilhead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profilhead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
