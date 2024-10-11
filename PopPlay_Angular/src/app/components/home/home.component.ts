import { Component, inject } from '@angular/core';
import { MinigameService } from '../../services/minigame.service';
import { Minigame } from '../../models/models';
import { MinigameCardComponent } from '../../shared/components/minigame-card/minigame-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gameServ = inject(MinigameService);
  minigames: Minigame[] = [];

  constructor() {
    this.gameServ.get_all().subscribe(data => {
      this.minigames = data;
      console.log(this.minigames);
    });
  }
}
