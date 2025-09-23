import { TestBed } from '@angular/core/testing';

import { AuthGard } from './auth-gard';

describe('AuthGard', () => {
  let service: AuthGard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
