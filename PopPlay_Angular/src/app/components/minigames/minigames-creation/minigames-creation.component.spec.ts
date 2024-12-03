import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigamesCreationComponent } from './minigames-creation.component';

describe('MinigamesCreationComponent', () => {
  let component: MinigamesCreationComponent;
  let fixture: ComponentFixture<MinigamesCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinigamesCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinigamesCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
