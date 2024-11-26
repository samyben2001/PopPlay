import { Component, inject, OnInit } from '@angular/core';
import { MinigamePagination } from '../../models/models';
import { MinigameGalleryComponent } from '../../shared/components/minigames/minigame-gallery/minigame-gallery.component';
import { MinigameService } from '../../services/api/minigame.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  minigameServ = inject(MinigameService)
  minigames?: MinigamePagination;

  ngOnInit(): void {
    // Get all minigames from API
    this.minigameServ.get_all().subscribe({
      next: (data) => {
        this.minigames = data;
      },
      error: (err) => { console.log(err); }
    });
  }
}
