import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrancheageComponent } from './trancheage.component';

describe('TrancheageComponent', () => {
  let component: TrancheageComponent;
  let fixture: ComponentFixture<TrancheageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrancheageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrancheageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
