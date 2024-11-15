import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameCardComponent } from './minigame-card.component';

describe('MinigameCardComponent', () => {
  let component: MinigameCardComponent;
  let fixture: ComponentFixture<MinigameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinigameCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
