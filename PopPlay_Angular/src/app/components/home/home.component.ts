import { Component, inject, OnDestroy } from '@angular/core';
import { MinigameService } from '../../services/minigame.service';
import { Minigame } from '../../models/models';
import { MinigameCardComponent } from '../../shared/components/minigame-card/minigame-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MinigameGalleryComponent } from '../../shared/components/minigame-gallery/minigame-gallery.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MinigameGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy{
  router = inject(Router);
  gameServ = inject(MinigameService);
  authServ = inject(AuthService);
  isConnected = this.authServ.isConnected;
  minigames?: Minigame[];
  subscription: Subscription = new Subscription();

  constructor() {
    this.subscription = this.gameServ.get_all().subscribe(data => {
      this.minigames = data;
    });
  }

  goToMinigameCreation() { 
    this.router.navigate(['/minigame/creation']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
