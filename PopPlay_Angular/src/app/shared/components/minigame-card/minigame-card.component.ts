import { Component, inject, Input } from '@angular/core';
import { Minigame } from '../../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minigame-card',
  standalone: true,
  imports: [],
  templateUrl: './minigame-card.component.html',
  styleUrl: './minigame-card.component.css'
})
export class MinigameCardComponent {
  private _router = inject(Router);

  @Input() minigame!: Minigame;

  startGame() {
    this._router.navigate(['/minigame/play/', this.minigame.id]);
  }
}
