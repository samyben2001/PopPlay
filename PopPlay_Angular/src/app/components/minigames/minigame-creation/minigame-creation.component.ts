import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MinigameService } from '../../../services/minigame.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media, Theme, Type } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MediaSelectorComponent } from '../../../shared/components/media-selector/media-selector.component';
import { ToastService } from '../../../services/toast.service';
import { ToastTypes } from '../../../enums/ToastTypes';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';
import { ThemeCreatorComponent } from "../../../shared/components/theme-creator/theme-creator.component";

@Component({
  selector: 'app-minigame-creation',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MediaSelectorComponent,
    ThemeCreatorComponent,
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
  creationForm: FormGroup = new FormGroup({});

  themes: Theme[] = [];
  @ViewChild('themeDropdown') themeDropdown!: Dropdown;
  types: Type[] = [];
  medias: Media[] = [];
  imageGuessId: number = 0;
  isMediasSelectorVisible: boolean = false;
  isThemeCreatorVisible: boolean = false;
  mediasSelected: Media[] = [];
  selectedCover: string | null = null;

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // Get all themes, types and medias from API
    this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.types = data;
        this.imageGuessId = this.types.find(type => type.name == "Images Guessing")!.id;
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

    // Using FormBuilder to create the FormGroup.
    this.creationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
      cover_url: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      theme_id: ['', [Validators.required]],
      medias_id: [[]],
    });
  }

  onCoverSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCover = file.name;
      this.creationForm.patchValue({ cover_url: file });
    };
  }

  openThemesCreator() {
    this.isThemeCreatorVisible = true;
  }

  onThemeCreated(theme: Theme | null) {
    if(theme) {
      this.themes.push(theme);
      this.themeDropdown.value = theme.name;
      this.creationForm.patchValue({ theme_id: theme.id });
    }
    this.isThemeCreatorVisible = false;
  }

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

  submit() {
    if (this.creationForm.invalid)
      return;
      
    this.createGame();
  }

  private createGame() {
    this.creationForm.patchValue({ medias_id: this.mediasSelected });

    this.minigameServ.create(this.creationForm.value).subscribe({
      next: (data) => {
        this.toastService.Show("Minigmae Created", `Minigmae ${data.name} created successfully`, ToastTypes.SUCCESS, 3000);
      },
      error: (err) => { console.log(err); }
    });
  }
}
