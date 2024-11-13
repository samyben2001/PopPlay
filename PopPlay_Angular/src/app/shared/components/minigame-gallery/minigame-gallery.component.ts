import { Component, Input } from '@angular/core';
import { MinigameCardComponent } from '../minigame-card/minigame-card.component';
import { Minigame } from '../../../models/models';

@Component({
  selector: 'app-minigame-gallery',
  standalone: true,
  imports: [MinigameCardComponent],
  templateUrl: './minigame-gallery.component.html',
  styleUrl: './minigame-gallery.component.css'
})
export class MinigameGalleryComponent {
  @Input() minigames: Minigame[] = []
}
