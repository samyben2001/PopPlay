import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../../services/api/account.service';
import { CommonModule } from '@angular/common';
import { AccountInfosComponent } from '../../../shared/components/account/account-infos/account-infos.component';
import { MinigameGalleryComponent } from '../../../shared/components/minigames/minigame-gallery/minigame-gallery.component';
import { AccountScoresComponent } from '../../../shared/components/account/account-scores/account-scores.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, AccountInfosComponent, MinigameGalleryComponent, AccountScoresComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent{
  private _accountServ = inject(AccountService)
  account = this._accountServ.account

  isProfileActive: boolean = true
  isFavoritesActive: boolean = false
  isScoreActive: boolean = false
  isMyGamesActive: boolean = false

  goToProfile(){
    this.isProfileActive = true
    this.isFavoritesActive = false
    this.isScoreActive = false
    this.isMyGamesActive = false
  }

  goToFavorites(){
    this.isProfileActive = false
    this.isFavoritesActive = true
    this.isScoreActive = false
    this.isMyGamesActive = false
  }

  goToScore(){
    this.isProfileActive = false
    this.isFavoritesActive = false
    this.isScoreActive = true
    this.isMyGamesActive = false
  }

  goToMyGames(){
    this.isProfileActive = false
    this.isFavoritesActive = false
    this.isScoreActive = false
    this.isMyGamesActive = true
  }
}
