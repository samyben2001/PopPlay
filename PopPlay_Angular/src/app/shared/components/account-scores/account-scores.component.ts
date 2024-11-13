import { Component, Input } from '@angular/core';
import { UserMinigameScore } from '../../../models/models';

@Component({
  selector: 'app-account-scores',
  standalone: true,
  imports: [],
  templateUrl: './account-scores.component.html',
  styleUrl: './account-scores.component.css'
})
export class AccountScoresComponent {
  @Input() scores: UserMinigameScore[] = []
}
