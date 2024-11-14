import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MinigameService } from '../../../services/minigame.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media, Minigame, Quiz, Theme, Type } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MediaSelectorComponent } from '../../../shared/components/media-selector/media-selector.component';
import { ToastService } from '../../../services/toast.service';
import { ToastTypes } from '../../../enums/ToastTypes';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ThemeCreatorComponent } from "../../../shared/components/theme-creator/theme-creator.component";
import { ActivatedRoute, Router } from '@angular/router';
import { GameTypes } from '../../../enums/GameTypes';
import { QuizzCreatorComponent } from '../../../shared/components/quizz-creator/quizz-creator.component';

@Component({
  selector: 'app-minigame-creation',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MediaSelectorComponent,
    ThemeCreatorComponent,
    QuizzCreatorComponent,
    InputTextModule,
    AutoCompleteModule,
    DropdownModule,
    FloatLabelModule,
    ThemeCreatorComponent],
  templateUrl: './minigame-creation.component.html',
  styleUrl: './minigame-creation.component.css'
})
export class MinigameCreationComponent implements OnInit {
  toastService = inject(ToastService);
  minigameServ = inject(MinigameService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  creationForm: FormGroup = new FormGroup({});

  themes: Theme[] = [];
  @ViewChild('themeDropdown') themeDropdown!: Dropdown;
  types: Type[] = [];
  medias: Media[] = [];
  imageGuessId!: number;
  quizzId!: number
  isMediasSelectorVisible: boolean = false;
  isThemeCreatorVisible: boolean = false;
  isQuizzCreatorVisible: boolean = false;
  mediasSelected: Media[] = [];
  quizzSelected: Quiz[] = [];
  selectedCover: string | null = null;

  gameID?: number = -1;
  gameToUpdate?: Minigame
  isCoverUpdated: boolean = false

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // Get all themes, types and medias from API
    this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.types = data;
        this.imageGuessId = this.types.find(type => type.name == GameTypes.IMAGE_GUESSING)!.id;
        this.quizzId = this.types.find(type => type.name == GameTypes.QUIZZ)!.id;
      },
      error: (err) => { console.log(err); }
    });

    this.minigameServ.get_themes().subscribe({
      next: (data) => { this.themes = data; },
      error: (err) => { console.log(err); }
    });

    this.minigameServ.get_medias().subscribe({
      next: (data) => { this.medias = data; },
      error: (err) => { console.log(err); }
    });

    // if gameID is provided, Update else Creation
    this.gameID = this.activatedRoute.snapshot.params['gameID'];
    if (this.gameID) {
      this.minigameServ.get_by_id(this.gameID).subscribe({
        next: (game) => {
          this.gameToUpdate = game
          console.log(this.gameToUpdate)
          this.creationForm = this.fb.group({
            id: [this.gameToUpdate.id],
            name: [this.gameToUpdate.name, [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
            cover_url: [''],
            type_id: [this.gameToUpdate.type.id, [Validators.required]],
            theme_id: [this.gameToUpdate.theme.id, [Validators.required]],
            medias_id: [this.gameToUpdate.medias],
            quizz_id: [this.gameToUpdate.quizz],
          });
          this.mediasSelected = this.gameToUpdate.medias
          this.quizzSelected = this.gameToUpdate.quizz
          this.selectedCover = this.gameToUpdate.cover_url
        }
      })
    } else {
      // Using FormBuilder to create the FormGroup.
      this.creationForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
        cover_url: ['', [Validators.required]],
        type_id: ['', [Validators.required]],
        theme_id: ['', [Validators.required]],
        medias_id: [[]],
        quizz_id: [[]],
      });
    }
  }

  // Cover
  onCoverSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCover = file.name;
      this.creationForm.patchValue({ cover_url: file });
      // check if it's an update or create
      if (this.gameToUpdate)
        this.isCoverUpdated = true
    };
  }

  // Theme
  openThemesCreator() {
    this.isThemeCreatorVisible = true;
  }

  onThemeCreated(theme: Theme | null) {
    if (theme) {
      this.themes.push(theme);
      this.themeDropdown.value = theme.name;
      this.creationForm.patchValue({ theme_id: theme.id });
    }
    this.isThemeCreatorVisible = false;
  }

  // Medias
  openMediasSelector() {
    this.isMediasSelectorVisible = true;
  }

  onSelectedMedias(medias: Media[] | null) {
    this.mediasSelected = medias ? [...medias] : [];
    this.isMediasSelectorVisible = false;
  }

  removeMedia(media: Media) {
    this.mediasSelected = this.mediasSelected.filter((m) => m.id != media.id);
  }

  // Quizz
  openQuizzCreator() {
    this.isQuizzCreatorVisible = true;
  }

  onQuizzCreated(quizz: Quiz[] | null) {
    this.quizzSelected = quizz ? [...quizz] : [];
    this.isQuizzCreatorVisible = false;
  }

  delete(){
    this.minigameServ.delete(this.gameToUpdate!.id).subscribe({
      next: (data) => {
        console.log(data)
        this.toastService.Show("Minigame Supprimé", `Minigame ${this.gameToUpdate!.name} supprmimé avec succès`, ToastTypes.SUCCESS, 3000);
        this.router.navigate(['']);
      },
      error: (err) => { console.log(err); }
    })
  }

  // Submit
  submit() {
    if (this.creationForm.invalid)
      return;

    if (!this.gameID)
      this.createGame();
    else
      this.updateGame();
  }

  private createGame() {
    this.creationForm.patchValue({ medias_id: this.mediasSelected });
    this.creationForm.patchValue({ quizz_id: this.quizzSelected });

    this.minigameServ.create(this.creationForm.value).subscribe({
      next: (data) => {
        this.toastService.Show("Minigame Créé", `Minigame ${data.name} créé avec succès`, ToastTypes.SUCCESS, 3000);
        this.router.navigate(['']);
      },
      error: (err) => { console.log(err); }
    });
  }

  private updateGame() {
    this.creationForm.patchValue({ medias_id: this.mediasSelected });
    this.creationForm.patchValue({ quizz_id: this.quizzSelected });

    this.minigameServ.update(this.creationForm.value).subscribe({
      next: (data) => {
        this.toastService.Show("Minigame Mis à jour", `Minigame ${data.name} mis à jour avec succès`, ToastTypes.SUCCESS, 3000);
        this.router.navigate(['']);
      },
      error: (err) => { console.log(err); }
    });
  }
}
