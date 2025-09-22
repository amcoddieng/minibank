import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editmdp } from './editmdp';

describe('Editmdp', () => {
  let component: Editmdp;
  let fixture: ComponentFixture<Editmdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editmdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editmdp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
