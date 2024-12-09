import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzCreationComponent } from './quizz-creation.component';

describe('QuizzCreationComponent', () => {
  let component: QuizzCreationComponent;
  let fixture: ComponentFixture<QuizzCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
