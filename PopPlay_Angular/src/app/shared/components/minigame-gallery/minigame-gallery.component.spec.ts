import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameGalleryComponent } from './minigame-gallery.component';

describe('MinigameGalleryComponent', () => {
  let component: MinigameGalleryComponent;
  let fixture: ComponentFixture<MinigameGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinigameGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigameGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
