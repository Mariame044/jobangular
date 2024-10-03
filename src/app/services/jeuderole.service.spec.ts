import { TestBed } from '@angular/core/testing';

import { JeuderoleService } from './jeuderole.service';

describe('JeuderoleService', () => {
  let service: JeuderoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JeuderoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
