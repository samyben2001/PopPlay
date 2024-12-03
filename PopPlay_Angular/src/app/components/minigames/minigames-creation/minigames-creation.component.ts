import { Component } from '@angular/core';
import { Minigame } from '../../../models/models';
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
  protected gameToUpdate? : Minigame
}
