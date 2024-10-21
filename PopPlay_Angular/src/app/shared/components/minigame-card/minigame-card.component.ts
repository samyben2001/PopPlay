import { Component, inject, Input } from '@angular/core';
import { Minigame } from '../../../models/models';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-minigame-card',
  standalone: true,
  imports: [],
  templateUrl: './minigame-card.component.html',
  styleUrl: './minigame-card.component.css'
})
export class MinigameCardComponent {
  private _router = inject(Router);
  private _authServ = inject(AuthService);

  @Input() minigame!: Minigame;
  isConnected = this._authServ.isConnected


  startGame() {
    this._router.navigate(['/minigame/play/', this.minigame.id]);
  }

  updateGame(id: number) {
    this._router.navigate(['/minigame/update/', id]);
  }
}
