import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeCreatorComponent } from './theme-creator.component';

describe('ThemeCreatorComponent', () => {
  let component: ThemeCreatorComponent;
  let fixture: ComponentFixture<ThemeCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
