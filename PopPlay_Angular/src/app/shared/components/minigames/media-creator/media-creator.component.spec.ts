import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCreatorComponent } from './media-creator.component';

describe('MediaCreatorComponent', () => {
  let component: MediaCreatorComponent;
  let fixture: ComponentFixture<MediaCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
