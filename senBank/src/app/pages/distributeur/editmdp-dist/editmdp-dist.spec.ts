import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmdpDist } from './editmdp-dist';

describe('EditmdpDist', () => {
  let component: EditmdpDist;
  let fixture: ComponentFixture<EditmdpDist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmdpDist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmdpDist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
