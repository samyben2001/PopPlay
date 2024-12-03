import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationInfosComponent } from './creation-infos.component';

describe('CreationInfosComponent', () => {
  let component: CreationInfosComponent;
  let fixture: ComponentFixture<CreationInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
