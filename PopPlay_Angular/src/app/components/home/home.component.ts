import { Component, inject, OnDestroy } from '@angular/core';
import { MinigameService } from '../../services/api/minigame.service';
import { Minigame } from '../../models/models';
import { MinigameCardComponent } from '../../shared/components/minigames/minigame-card/minigame-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';
import { MinigameGalleryComponent } from '../../shared/components/minigames/minigame-gallery/minigame-gallery.component';
import { Subscription } from 'rxjs';
import { GameSearchComponent } from '../../shared/components/minigames/game-search/game-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameGalleryComponent, GameSearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  minigames: Minigame[] = [];
}
