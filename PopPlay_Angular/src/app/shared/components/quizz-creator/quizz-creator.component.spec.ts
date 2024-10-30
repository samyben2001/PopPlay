import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzCreatorComponent } from './quizz-creator.component';

describe('QuizzCreatorComponent', () => {
  let component: QuizzCreatorComponent;
  let fixture: ComponentFixture<QuizzCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
