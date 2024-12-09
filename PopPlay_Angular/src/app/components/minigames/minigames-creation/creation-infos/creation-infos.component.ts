import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild, WritableSignal } from '@angular/core';
import { MinigameCreate, Theme, Type } from '../../../../models/models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MinigameService } from '../../../../services/api/minigame.service';
import { Subscription } from 'rxjs';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ButtonComponent } from '../../../../shared/components/tools/button/button.component';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ThemeCreatorComponent } from '../../../../shared/components/minigames/theme-creator/theme-creator.component';
import { BtnTypes } from '../../../../enums/BtnTypes';

@Component({
  selector: 'app-creation-infos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputTextModule,
    AutoCompleteModule,
    DropdownModule,
    FloatLabelModule,
    ThemeCreatorComponent,
  ],
  templateUrl: './creation-infos.component.html',
  styleUrl: './creation-infos.component.css'
})
export class CreationInfosComponent implements OnInit, OnDestroy {
  minigameServ = inject(MinigameService);
  fb = inject(FormBuilder);

  btnTypes = BtnTypes

  creationForm: FormGroup = new FormGroup({});
  themes: Theme[] = [];
  isThemeCreatorVisible: boolean = false;
  types: Type[] = [];

  subscriptions: Subscription[] = []

  @Input() minigame!: WritableSignal<MinigameCreate>;
  @Output() infosSubmitted = new EventEmitter<any>();
  @ViewChild('themeDropdown') themeDropdown!: Dropdown;

  ngOnInit(): void {
    // Get all themes, types and medias from API
    this.getTypes();
    this.getThemes();
    this.initForm();
  }

  private getThemes() {
    this.subscriptions.push(this.minigameServ.get_themes().subscribe({
      next: (data) => {
        this.themes = data;
        this.themes.forEach(theme => theme.customName = theme.name + ' (' + theme.category.name + ')');
      },
      error: (err) => { console.log(err); }
    }));
  }

  private getTypes() {
    this.subscriptions.push(this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.types = data;
      },
      error: (err) => { console.log(err); }
    }));
  }

  private initForm() {
    this.creationForm = this.fb.group({
      name: [this.minigame!().name, [Validators.required, Validators.minLength(3)]],
      type_id: [this.minigame!().type_id, [Validators.required]],
      theme_id: [this.minigame!().theme_id, [Validators.required]],
      cover_url: [this.minigame!().cover_url, [Validators.required]],
      medias_id: [this.minigame!().medias_id],
      quizz_id: [this.minigame!().quizz_id],
    });
  }

  // Cover
  protected onCoverSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.creationForm.patchValue({ cover_url: file });
    };
  }

  // Theme
  protected openThemesCreator() {
    this.isThemeCreatorVisible = true;
  }

  protected onThemeCreated(theme: Theme | null) {
    if (theme) {
      this.themes.push(theme);
      this.themeDropdown.value = theme.name;
      this.creationForm.patchValue({ theme_id: theme.id });
    }
    this.isThemeCreatorVisible = false;
  }

  protected submit() {
    if (this.creationForm.invalid) return;

    // Reset medias and quizz if type changed
    if(this.minigame().type_id != this.creationForm.get('type_id')!.value){
      this.minigame().medias_id = [];
      this.minigame().quizz_id = [];
    }

    this.minigame!.set(this.creationForm.value);
    const typeName = this.types.find(type => type.id == this.creationForm.value.type_id)!.name
    const themeName = this.themes.find(theme => theme.id == this.creationForm.value.theme_id)!.customName
    this.infosSubmitted.emit({ type: typeName, theme: themeName });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
