import { Component, computed, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../../../services/api/account.service';
import { ToastService } from '../../../../services/tools/toast.service';
import { ToastTypes } from '../../../../enums/ToastTypes';
import { MinigameService } from '../../../../services/api/minigame.service';
import { Minigame } from '../../../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.css'
})
export class LikeButtonComponent implements OnDestroy{
  private _accountServ = inject(AccountService);
  private _minigameServ = inject(MinigameService);
  private _toastServ = inject(ToastService);

  private _minigame?: Minigame;
  @Input() set minigame(value: Minigame) {
    this._minigame = value;

    this.subscriptions.push(this._minigameServ.get_likes(value.id).subscribe({
      next: (data: any) => {
        this.nbLikes = data.liked_by.length;
      },
      error: (err) => {
        console.log(err);
      }
    }));
  }
  
  subscriptions: Subscription[] = []
  nbLikes: number = 0
  account = this._accountServ.account;

  get minigame(): Minigame | undefined {
    return this._minigame;
  }


  userGamesLiked = computed(() => {
    if (!this.account())
      return [];

    return this.account()!.games_liked.results.map((game) => game.id)
  });


  toggleLikeMinigame(id: number) {
    try {
      this.subscriptions.push(this._accountServ.addLikedGame(id).subscribe({
        next: (data) => {
          if (this.userGamesLiked().includes(id)) {
            let index = this.userGamesLiked().indexOf(id);
            this.userGamesLiked().splice(index, 1);
            this.account()!.games_liked.results = this.account()!.games_liked.results.filter((game) => game.id !== id);
            this.nbLikes = this.nbLikes - 1
          } else {
            this.userGamesLiked().push(id);
            this.account()!.games_liked.results.push(this._minigame!);
            this.nbLikes = this.nbLikes + 1
          }
          this._toastServ.Show('Game Liked', data.response);
        },
        error: (err) => {
          console.log(err);
        }
      }))
    } catch (error: any) {
      this._toastServ.Show('Erreur lors l\'ajout de favoris', error.message, ToastTypes.ERROR);
    }

  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
