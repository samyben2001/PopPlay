import { Component, EventEmitter, inject, Input, OnInit, Output, WritableSignal } from '@angular/core';
import { Media, MinigameCreate, Quiz } from '../../../../models/models';
import { Subscription } from 'rxjs';
import { MinigameService } from '../../../../services/api/minigame.service';
import { GameTypes } from '../../../../enums/GameTypes';
import { ButtonComponent } from '../../../../shared/components/tools/button/button.component';
import { MediaSelectorComponent } from '../../../../shared/components/minigames/media-selector/media-selector.component';
import { BtnTypes } from '../../../../enums/BtnTypes';
import { MediaTypes } from '../../../../enums/MediaTypes';
import { CommonModule } from '@angular/common';
import { QuizzCreationComponent } from './quizz-creation/quizz-creation.component';

@Component({
  selector: 'app-creation-medias-quizz',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    MediaSelectorComponent,
    QuizzCreationComponent],
  templateUrl: './creation-medias-quizz.component.html',
  styleUrl: './creation-medias-quizz.component.css'
})
export class CreationMediasQuizzComponent implements OnInit {
  private minigameServ = inject(MinigameService);
  @Input() minigame!: WritableSignal<MinigameCreate>;
  @Output() mediaQuizzSubmitted = new EventEmitter<MinigameCreate>();
  @Output() mediaQuizzCancelled = new EventEmitter<MinigameCreate>();

  protected btnTypes = BtnTypes
  protected mediaTypes = MediaTypes

  protected isMediasSelectorVisible: boolean = false;
  protected isSomeMediaSelected: boolean = false;
  protected imageGuessId!: number;
  protected quizzId!: number
  protected blindTestId!: number

  protected subscriptions: Subscription[] = []

  ngOnInit(): void {
    this.getTypesId();
  }

  private getTypesId() {
    this.subscriptions.push(this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.imageGuessId = data.find(type => type.name == GameTypes.IMAGE_GUESSING)!.id;
        this.quizzId = data.find(type => type.name == GameTypes.QUIZZ)!.id;
        this.blindTestId = data.find(type => type.name == GameTypes.BLIND_TEST)!.id;
      },
      error: (err) => { console.log(err); }
    }));
  }

  // Medias
  protected openMediasSelector() {
    this.isMediasSelectorVisible = true;
  }

  protected onSelectedMedias(medias: Media[] | null) {
    if (medias) {
      this.minigame!().medias_id = [...medias];
      this.isSomeMediaSelected = true
    } else {
      this.minigame!().medias_id = [];
    }
    this.isMediasSelectorVisible = false;
  }

  removeMedia(media: Media) {
    this.minigame!().medias_id = this.minigame!().medias_id.filter((m) => m.id != media.id);
  }

  onQuizzValidated($event: Quiz[]) {
    this.minigame!().quizz_id = $event
  }

  back() {
    //TODO:  add reset button instead
    // this.minigame!().medias_id = []
    // this.minigame!().quizz_id = []
    this.minigame!().quizz_id = this.minigame!().quizz_id.filter((quizz: any) => quizz.question !='' && quizz.answers != '') // remove empty quizz
    this.mediaQuizzCancelled.emit();
  }

  next() {
    this.minigame!().quizz_id = this.minigame!().quizz_id.filter((quizz: any) => quizz.question !='' && quizz.answers != '') // remove empty quizz
    this.mediaQuizzSubmitted.emit();
  }
}
