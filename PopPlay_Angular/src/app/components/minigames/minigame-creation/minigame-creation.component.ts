import { Component, inject, OnInit } from '@angular/core';
import { MinigameService } from '../../../services/minigame.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media, MinigameCreate, Theme, Type } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-minigame-creation',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './minigame-creation.component.html',
  styleUrl: './minigame-creation.component.css'
})
export class MinigameCreationComponent {
  creationForm: FormGroup;
  minigameServ = inject(MinigameService);

  minigame: MinigameCreate = {} as MinigameCreate;
  themes: Theme[] = [];
  types: Type[] = [];
  medias: Media[] = [];
  imageGuessId: number = 0;

  constructor(private fb: FormBuilder) { 
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

  onChange(event: any) {
    const file: File = event.target.files[0];
    console.log(file);

    if (file) {
      this.minigame.cover_url = file;
    };
  }

  submit() {
    if(this.creationForm.invalid || this.minigame.cover_url == null)
      return;

    // TODO: check if entered Theme/Type exist else create them

    this.minigame.name = this.creationForm.value.name;
    this.minigame.type_id = this.creationForm.value.type_id;
    this.minigame.theme_id = this.creationForm.value.theme_id;
    this.minigame.medias_id = this.creationForm.value.medias_id;
    
    console.log(this.minigame);
    
    this.minigameServ.create(this.minigame).subscribe({
      next: (data) => { console.log(data); },
      error: (err) => { console.log(err); }
    })
  }
}
