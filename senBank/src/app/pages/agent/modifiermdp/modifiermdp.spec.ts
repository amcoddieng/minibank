import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modifiermdp } from './modifiermdp';

describe('Modifiermdp', () => {
  let component: Modifiermdp;
  let fixture: ComponentFixture<Modifiermdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modifiermdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modifiermdp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
