import { Component, inject, Input } from '@angular/core';
import { MinigameCardComponent } from '../minigame-card/minigame-card.component';
import { MinigamePagination } from '../../../../models/models';
import { GameSearchComponent } from '../game-search/game-search.component';
import { PaginatorService } from '../../../../services/api/paginator.service';

@Component({
  selector: 'app-minigame-gallery',
  standalone: true,
  imports: [MinigameCardComponent, GameSearchComponent],
  templateUrl: './minigame-gallery.component.html',
  styleUrl: './minigame-gallery.component.css'
})
export class MinigameGalleryComponent {
  paginatorService = inject(PaginatorService)
  @Input() searchEnabled: boolean = false

  pages: number[] = []
  private _minigames?: MinigamePagination
  @Input()
  set minigames(minigames: MinigamePagination | undefined) {
    this._minigames = minigames

    for (let i = 1; i <= minigames?.total_pages!; i++) {
      this.pages.push(i)
      console.log(this.pages)
    }
    console.log(this.minigames)
  }
  get minigames() {
    return this._minigames
  }
  

  changePaginationPage(path: string | undefined) {
    console.log(path)
    this.paginatorService.navigate(path!).subscribe({
      next: (data) => {
        // FIXME: refacto this
        if(path?.includes('account') && path?.includes('games_liked')) {
          this.minigames = data.games_liked;
        }else if(path?.includes('account') && path?.includes('minigames')) {
          this.minigames = data.minigames;
        }else{
          this.minigames = data;
        }
      },
      error: (err) => { console.log(err); }
    })
  }

  goToPage(page: number) {
    // TODO: implement this 
    throw new Error('Method not implemented.');
  }
}
