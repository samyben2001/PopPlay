import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameCreationComponent } from './minigame-creation.component';

describe('MinigameCreationComponent', () => {
  let component: MinigameCreationComponent;
  let fixture: ComponentFixture<MinigameCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinigameCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigameCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
