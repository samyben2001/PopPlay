import { Component, inject, Input } from '@angular/core';
import { Minigame } from '../../../../models/models';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/api/auth.service';
import { GameTypes } from '../../../../enums/GameTypes';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-minigame-card',
  standalone: true,
  imports: [LikeButtonComponent],
  templateUrl: './minigame-card.component.html',
  styleUrl: './minigame-card.component.css'
})
export class MinigameCardComponent {
  private _router = inject(Router);
  private _authServ = inject(AuthService);
  protected GameTypes = GameTypes

  @Input() minigame!: Minigame;
  isConnected = this._authServ.isConnected


  startGame() {
    this._router.navigate(['/minigame/play/', this.minigame.id]);
  }

  updateGame(id: number) {
    this._router.navigate(['/minigame/update/', id]);
  }
}
