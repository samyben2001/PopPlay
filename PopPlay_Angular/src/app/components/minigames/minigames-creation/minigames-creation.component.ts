import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MinigameCreate } from '../../../models/models';
import { CreationInfosComponent } from './creation-infos/creation-infos.component';
import { CreationMediasQuizzComponent } from './creation-medias-quizz/creation-medias-quizz.component';
import { CreationValidationComponent } from './creation-validation/creation-validation.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MinigameService } from '../../../services/api/minigame.service';

@Component({
  selector: 'app-minigames-creation',
  standalone: true,
  imports: [CreationInfosComponent, CreationMediasQuizzComponent, CreationValidationComponent],
  templateUrl: './minigames-creation.component.html',
  styleUrl: './minigames-creation.component.css'
})
export class MinigamesCreationComponent {
  private minigameServ = inject(MinigameService);
  private activatedRoute = inject(ActivatedRoute);
  protected actualStep: number = 1
  protected minigame?: WritableSignal<MinigameCreate>
  protected gameInfosText: any

  protected gameID?: number;

  subscriptions: Subscription[] = []

  constructor() {
    this.gameID = this.activatedRoute.snapshot.params['gameID'];

    if (this.gameID) {
      this.subscriptions.push(this.minigameServ.get_by_id(this.gameID).subscribe({
        next: (game) => {
          this.minigame = signal<MinigameCreate>({
            id: game.id,
            name: game.name,
            type_id: game.type.id,
            theme_id: game.theme.id,
            cover_url: game.cover_url,
            medias_id: game.medias,
            quizz_id: game.quizz,
          })
        },
      }));
    } else {
      this.minigame = signal<MinigameCreate>({
        name: '',
        type_id: undefined,
        theme_id: undefined,
        cover_url: undefined,
        medias_id: [],
        quizz_id: [],
      })
    }
  }

  protected onInfosReceived(infosText: any) {
    this.gameInfosText = infosText
    this.actualStep = 2
  }

  protected onMediaQuizzCancelled() {
    this.actualStep = 1
  }
  protected onMediaQuizzReceived() {
    this.actualStep = 3
  }

  protected onGameCreationCancelled() {
    this.actualStep = 2
  }
}
