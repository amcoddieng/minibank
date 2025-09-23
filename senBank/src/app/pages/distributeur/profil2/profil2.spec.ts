import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profil2 } from './profil2';

describe('Profil2', () => {
  let component: Profil2;
  let fixture: ComponentFixture<Profil2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profil2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profil2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
