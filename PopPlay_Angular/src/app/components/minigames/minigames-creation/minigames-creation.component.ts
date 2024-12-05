import { Component, OnInit } from '@angular/core';
import { Minigame, MinigameCreate } from '../../../models/models';
import { CreationInfosComponent } from './creation-infos/creation-infos.component';
import { CreationMediasQuizzComponent } from './creation-medias-quizz/creation-medias-quizz.component';
import { CreationValidationComponent } from './creation-validation/creation-validation.component';

@Component({
  selector: 'app-minigames-creation',
  standalone: true,
  imports: [CreationInfosComponent, CreationMediasQuizzComponent, CreationValidationComponent],
  templateUrl: './minigames-creation.component.html',
  styleUrl: './minigames-creation.component.css'
})
export class MinigamesCreationComponent {
  protected actualStep: number = 1
  protected minigame!: MinigameCreate
  protected gameToUpdate?: Minigame

  protected onInfosReceived(minigame: MinigameCreate) {
    this.minigame = minigame
    this.minigame.medias_id = [];
    this.minigame.quizz_id = [];
    this.actualStep = 2
  }

  protected onMediaQuizzCancelled(minigame: MinigameCreate) {
    //TODO: check in creation-infos component if minigame empty or not after back from media
    this.minigame = minigame
    this.actualStep = 1
  }
  protected onMediaQuizzReceived(minigame: MinigameCreate) {
    this.minigame = minigame
    this.actualStep = 3
  }
}
