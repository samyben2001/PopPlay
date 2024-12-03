import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationMediasQuizzComponent } from './creation-medias-quizz.component';

describe('CreationMediasQuizzComponent', () => {
  let component: CreationMediasQuizzComponent;
  let fixture: ComponentFixture<CreationMediasQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationMediasQuizzComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationMediasQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
