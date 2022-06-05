import { TestBed } from '@angular/core/testing';

import { FirefoxExtensionService } from './firefox-extension.service';

describe('FirefoxExtensionService', () => {
  let service: FirefoxExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirefoxExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
