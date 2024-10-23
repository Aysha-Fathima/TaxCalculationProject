import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxcomparisonComponent } from './taxcomparison.component';

describe('TaxcomparisonComponent', () => {
  let component: TaxcomparisonComponent;
  let fixture: ComponentFixture<TaxcomparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxcomparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxcomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
