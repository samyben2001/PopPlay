import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaAnswer, Minigame } from '../../../models/models';
import { MinigameService } from '../../../services/minigame.service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-minigame-player',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule],
  templateUrl: './minigame-player.component.html',
  styleUrl: './minigame-player.component.css'
})
export class MinigamePlayerComponent implements OnInit {
  private _router = inject(Router)
  private _ar = inject(ActivatedRoute)
  private _gameServ = inject(MinigameService)
  minigame!: Minigame

  actualMediaIndex: number = 0
  timer: number = 0
  score: number = 0
  answer: string = ''
  attempts: number = 0
  blurAmount: number = 50
  protected MAX_ATTEMPTS: number = 3

  ngOnInit(): void {
    this._gameServ.get_by_id(this._ar.snapshot.params['gameId']).subscribe({
      next: (data) => {
        this.minigame = data
      },
      error: (err) => {
        console.log(err)
        this._router.navigate(['/error'])
      }
    })

  }


  try() {
    let correctAnswers = this.minigame.medias[this.actualMediaIndex].answers
    this.attempts++

    if (this.answer != '') {
      for (let index = 0; index < correctAnswers.length; index++) {
        if (correctAnswers[index].answer.toLowerCase() == this.answer.toLowerCase()) {
          this.score++
          this.actualMediaIndex++
          this.attempts = 0
          break
        }
      }
    }

    this.answer = ''

    if (this.attempts == this.MAX_ATTEMPTS) {
      this.actualMediaIndex++
    }
  }
}
