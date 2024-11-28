import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MinigamePagination, Theme, Type } from '../../../../models/models';
import { MinigameService } from '../../../../services/api/minigame.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-search',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule, MultiSelectModule],
  templateUrl: './game-search.component.html',
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent implements OnInit, OnDestroy {
  minigameServ = inject(MinigameService);
  minigames?: MinigamePagination
  @Output() minigameSelectedEvent = new EventEmitter<MinigamePagination>();
  themes: Theme[] = [];
  types: Type[] = [];
  nameSearched: string = '';
  typesSearched: number[] = [];
  themesSearched: number[] = [];
  selectedThemes: Theme[] = [];
  selectedTypes: Type[] = [];
  subscriptions: Subscription[] = []

  ngOnInit(): void {
    this.subscriptions.push(this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.types = data;
      },
      error: (err) => { console.log(err); }
    })
    );

    this.subscriptions.push(this.minigameServ.get_themes().subscribe({
      next: (data) => {
        this.themes = data;
        this.themes.forEach(theme => theme.customName = theme.name + ' (' + theme.category.name + ')');
      },
      error: (err) => { console.log(err); }
    })
    );
  }

  onNameChanged() {
      let nameQuery = this.nameSearched.length >= 2 ? this.nameSearched : '';
      this.subscriptions.push(this.minigameServ.get_all(nameQuery, this.typesSearched, this.themesSearched).subscribe(data => {
        this.minigames = data;
        this.minigameSelectedEvent.emit(this.minigames);
      })
      );
  }

  onTypesChanged($event: MultiSelectChangeEvent) {
    this.typesSearched = $event.value;
    this.subscriptions.push(this.minigameServ.get_all(this.nameSearched, this.typesSearched, this.themesSearched).subscribe(data => {
      this.minigames = data;
      this.minigameSelectedEvent.emit(this.minigames);
    })
    );
  }

  onThemesChanged($event: MultiSelectChangeEvent) {
    this.themesSearched = $event.value;
    this.subscriptions.push(this.minigameServ.get_all(this.nameSearched, this.typesSearched, this.themesSearched).subscribe(data => {
      this.minigames = data;
      this.minigameSelectedEvent.emit(this.minigames);
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
