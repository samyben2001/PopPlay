import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Minigame, MinigameCreate, Quiz } from '../../../models/models';
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
  protected minigame: WritableSignal<MinigameCreate> 
  protected gameToUpdate?: Minigame
  protected gameInfosText: any

  
  constructor() {
    this.minigame = signal<MinigameCreate>({
      name: 'test',
      type_id: 2,
      theme_id: 1,
      cover_url: undefined,
      medias_id: [],
      quizz_id: [],
    })
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
