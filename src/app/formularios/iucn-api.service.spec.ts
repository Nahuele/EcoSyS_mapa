import { TestBed } from '@angular/core/testing';

import { IucnApiService } from './iucn-api.service';

describe('IucnApiService', () => {
  let service: IucnApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IucnApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
