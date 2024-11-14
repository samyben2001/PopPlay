import { Component, Input } from '@angular/core';
import { UserMinigameScore } from '../../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-scores.component.html',
  styleUrl: './account-scores.component.css'
})
export class AccountScoresComponent {
  @Input() scores: UserMinigameScore[] = []
  isSortedByName?: boolean
  isSortedByType?: boolean
  isSortedByScore?: boolean
  isSortedByDate?: boolean = false

  sortBy(field: string) {
    switch (field) {
      case 'name':
        if (!this.isSortedByName) {
          this.isSortedByName = true
          this.scores.sort((a, b) => {
            return a.game.name.localeCompare(b.game.name);
          });
        } else {
          this.isSortedByName = false
          this.scores.sort((a, b) => {
            return b.game.name.localeCompare(a.game.name);
          });
        }
        break;
      case 'type':
        if (!this.isSortedByType) {
          this.isSortedByType = true
          this.scores.sort((a, b) => {
            return a.game.type.name.localeCompare(b.game.type.name);
          });
        } else {
          this.isSortedByType = false
          this.scores.sort((a, b) => {
            return b.game.type.name.localeCompare(a.game.type.name);
          });
        }
        break;
      case 'score':
        if (!this.isSortedByScore) {
          this.isSortedByScore = true
          this.scores.sort((a, b) => {
            return a.score - b.score;
          });
        } else {
          this.isSortedByScore = false
          this.scores.sort((a, b) => {
            return b.score - a.score;
          });
        }
        break;
      case 'date':
        if (!this.isSortedByDate) {
          this.isSortedByDate = true
          this.scores.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
        } else {
          this.isSortedByDate = false
          this.scores.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
        break;
      default:
        this.scores.sort(() => {
          return 0;
        });
    }
  }
}
