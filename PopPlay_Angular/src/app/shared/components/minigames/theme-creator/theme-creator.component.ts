import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MediaService } from '../../../../services/api/media.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Theme, ThemeCategory } from '../../../../models/models';
import { MinigameService } from '../../../../services/api/minigame.service';
import { ButtonComponent } from '../../tools/button/button.component';
import { BtnTypes } from '../../../../enums/BtnTypes';

@Component({
  selector: 'app-theme-creator',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DropdownModule, FloatLabelModule, ButtonComponent],
  templateUrl: './theme-creator.component.html',
  styleUrl: './theme-creator.component.css'
})
export class ThemeCreatorComponent implements OnInit {
  gameServ = inject(MinigameService);
  router = inject(Router);
  fb = inject(FormBuilder);
  protected btnTypes = BtnTypes

  @Input() isVisible: boolean = false
  @Output() themeCreatedEvent = new EventEmitter<Theme | null>()
  themeForm: FormGroup = new FormGroup({});
  categories: ThemeCategory[] = [];

  ngOnInit(): void {
    // Get all media types
    this.gameServ.get_themeCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => { console.log(err); }
    });

    // Initialize the form
    this.themeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
    })
  }


  submit() {
    if (this.themeForm.invalid)
      return;
    let theme: Theme = {
      name: this.themeForm.value.name,
      category: this.themeForm.value.category
    };
    this.gameServ.create_theme(theme).subscribe({
      next: (data) => {
        if (data) {
          this.themeCreatedEvent.emit(data);
        }
      },
      error: (err) => { console.log(err); }
    })
  }

  dismiss() {
    this.themeCreatedEvent.emit(null);
    this.themeForm.reset();
  }

}
