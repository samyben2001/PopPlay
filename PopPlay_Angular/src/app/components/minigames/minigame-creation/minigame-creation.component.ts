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
export class MinigameCreationComponent implements OnInit {
  minigameServ = inject(MinigameService);
  minigame: MinigameCreate = {
    name: '',
    theme_id: 0,
    type_id: 0,
    medias_id: [],
  };

  themes: Theme[] = [];
  types: Type[] = [];
  medias: Media[] = [];
  creationForm: FormGroup;

  constructor(private fb: FormBuilder) { 
    // Get all themes, types and medias from API
    this.minigameServ.get_themes().subscribe({
      next: (data) => { this.themes = data; },
      error: (err) => { console.log(err); }
    });
    
    this.minigameServ.get_types().subscribe({
      next: (data) => { this.types = data; },
      error: (err) => { console.log(err); }
    });
    
    this.minigameServ.get_medias().subscribe({
      next: (data) => { this.medias = data; },
      error: (err) => { console.log(err); }
    });
    
    // Using FormBuilder to create the FormGroup.
    this.creationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
      theme_id: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      medias_id: [''],
      cover: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    
  }

  submit() {
    console.log(this.creationForm.value);

    this.minigameServ.create(this.creationForm.value).subscribe({
      next: (data) => { console.log(data); },
      error: (err) => { console.log(err); }
    })
  }
}
