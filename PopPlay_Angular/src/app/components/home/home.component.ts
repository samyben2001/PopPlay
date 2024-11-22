import { Component } from '@angular/core';
import { MinigamePagination } from '../../models/models';
import { MinigameGalleryComponent } from '../../shared/components/minigames/minigame-gallery/minigame-gallery.component';
import { GameSearchComponent } from '../../shared/components/minigames/game-search/game-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameGalleryComponent, GameSearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  minigames?: MinigamePagination;
}
