import { Component, Input } from '@angular/core';
import { Minigame } from '../../../models/models';

@Component({
  selector: 'app-minigame-card',
  standalone: true,
  imports: [],
  templateUrl: './minigame-card.component.html',
  styleUrl: './minigame-card.component.css'
})
export class MinigameCardComponent {
  @Input() minigame!: Minigame;

  startGame() {
    throw new Error('Method not implemented.');
  }
}
