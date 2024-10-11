import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigamePlayerComponent } from './minigame-player.component';

describe('MinigamePlayerComponent', () => {
  let component: MinigamePlayerComponent;
  let fixture: ComponentFixture<MinigamePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinigamePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigamePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
