import { TestBed } from '@angular/core/testing';

import { ThemeCreatorService } from './theme-creator.service';

describe('ThemeCreatorService', () => {
  let service: ThemeCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
