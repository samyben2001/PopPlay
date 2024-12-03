import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationValidationComponent } from './creation-validation.component';

describe('CreationValidationComponent', () => {
  let component: CreationValidationComponent;
  let fixture: ComponentFixture<CreationValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
