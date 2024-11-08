import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { ToastTypes } from '../../../enums/ToastTypes';
import { MinigameService } from '../../../services/minigame.service';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.css'
})
export class LikeButtonComponent {
  private _authServ = inject(AuthService);
  private _accountServ = inject(AccountService);
  private _minigameServ = inject(MinigameService);
  private _toastServ = inject(ToastService);

  private _minigameId?: number;
  @Input() set minigameId(value: number) {
    this._minigameId = value;

    this._minigameServ.get_likes(value).subscribe({
      next: (data: any) => {
        this.nbLikes = data.liked_by.length;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  nbLikes: number = 0
  account = this._accountServ.account;

  get minigameId(): number | undefined {
    return this._minigameId;
  }


  userGamesLiked = computed(() => {
    if (!this.account())
      return [];

    return this.account()!.games_liked.map((game) => game.id)
  });


  toggleLikeMinigame(id: number) {
    try {
      this._accountServ.addLikedGame(id).subscribe({
        next: (data) => {
          if (this.userGamesLiked().includes(id)) {
            let index = this.userGamesLiked().indexOf(id);
            this.userGamesLiked().splice(index, 1);
            this.nbLikes = this.nbLikes - 1
          } else {
            this.userGamesLiked().push(id);
            this.nbLikes = this.nbLikes + 1
          }
          this._toastServ.Show('Game Liked', data.response);
        },
        error: (err) => {
          console.log(err);
        }
      })
    } catch (error: any) {
      this._toastServ.Show('Erreur lors l\'ajout de favoris', error.message, ToastTypes.ERROR);
    }

  }
}
