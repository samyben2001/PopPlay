import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountScoresComponent } from './account-scores.component';

describe('AccountScoresComponent', () => {
  let component: AccountScoresComponent;
  let fixture: ComponentFixture<AccountScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountScoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
