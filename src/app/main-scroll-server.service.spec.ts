import { TestBed } from '@angular/core/testing';

import { MainScrollService } from './main-scroll.service';

describe('MainScrollServerService', () => {
  let service: MainScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
