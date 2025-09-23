import { TestBed } from '@angular/core/testing';

import { COMPTEService } from './compteservice';

describe('COMPTEService', () => {
  let service: COMPTEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(COMPTEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
