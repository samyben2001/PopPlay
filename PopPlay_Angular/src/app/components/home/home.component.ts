import { Component, inject } from '@angular/core';
import { MinigameService } from '../../services/minigame.service';
import { Minigame } from '../../models/models';
import { MinigameCardComponent } from '../../shared/components/minigame-card/minigame-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MinigameGalleryComponent } from '../../shared/components/minigame-gallery/minigame-gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);
  gameServ = inject(MinigameService);
  authServ = inject(AuthService);
  isConnected = this.authServ.isConnected;
  minigames?: Minigame[];

  constructor() {
    this.gameServ.get_all().subscribe(data => {
      this.minigames = data;
      console.log(data);
    });
  }

  goToMinigameCreation() { 
    this.router.navigate(['/minigame/creation']);
  }
}
