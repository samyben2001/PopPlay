import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent{
  private _accountServ = inject(AccountService)
  account = this._accountServ.account

  isProfileActive: boolean = true
  isFavoritesActive: boolean = false
  isScoreActive: boolean = false

  goToProfile(){
    this.isProfileActive = true
    this.isFavoritesActive = false
    this.isScoreActive = false
  }

  goToFavorites(){
    this.isProfileActive = false
    this.isFavoritesActive = true
    this.isScoreActive = false
  }

  goToScore(){
    this.isProfileActive = false
    this.isFavoritesActive = false
    this.isScoreActive = true
  }
}
