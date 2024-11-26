import { Component, inject, Input } from '@angular/core';
import { MinigameCardComponent } from '../minigame-card/minigame-card.component';
import { MinigamePagination } from '../../../../models/models';
import { GameSearchComponent } from '../game-search/game-search.component';
import { PaginatorService } from '../../../../services/api/paginator.service';
import { PaginatorComponent } from '../../tools/paginator/paginator.component';

@Component({
  selector: 'app-minigame-gallery',
  standalone: true,
  imports: [MinigameCardComponent, GameSearchComponent, PaginatorComponent],
  templateUrl: './minigame-gallery.component.html',
  styleUrl: './minigame-gallery.component.css'
})
export class MinigameGalleryComponent {
  paginatorService = inject(PaginatorService)
  @Input() searchEnabled: boolean = false

  pages: number[] = []
  @Input() minigames?: MinigamePagination

  onPageChanged($event: number) {
    let path = this.minigames?.next ? this.minigames.next : this.minigames?.previous ? this.minigames.previous : undefined

    if(!path) return

    let regex = new RegExp(/page=(\d+)/);

    if (path?.includes('account') && path?.includes('games_liked')) {
      regex = /games_liked=(\d+)/;
      path.replace(regex, `games_liked=${$event}`);
    } else if (path?.includes('account') && path?.includes('minigames')) {
      regex = /minigames=(\d+)/;
      path.replace(regex, `minigames=${$event}`);
    } else {
      path.replace(regex, `page=${$event}`);
    }
    
    this.paginatorService.navigate(path).subscribe(data => this.minigames = data);
  }
}
