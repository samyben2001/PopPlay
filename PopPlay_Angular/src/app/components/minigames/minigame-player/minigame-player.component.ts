import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaAnswer, Minigame } from '../../../models/models';
import { MinigameService } from '../../../services/minigame.service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-minigame-player',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule, DatePipe],
  templateUrl: './minigame-player.component.html',
  styleUrl: './minigame-player.component.css'
})
export class MinigamePlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router)
  private _ar = inject(ActivatedRoute)
  private _gameServ = inject(MinigameService)
  protected MAX_ATTEMPTS: number = 3
  private BASE_BLUR: number = 30
  private MAX_TIMER: number = 30
  private TIME_BETWEEN_MEDIAS: number = 5
  private SCORE_PER_ERROR: number = -100

  minigame!: Minigame

  @ViewChildren('imgOverlay') imgsToFind!: QueryList<ElementRef>
  imgToFind!: ElementRef
  blurIntervalId?: ReturnType<typeof setInterval>
  actualMediaIndex: number = 0
  timer: number = this.MAX_TIMER
  timerBeforeNextMedia: number = this.TIME_BETWEEN_MEDIAS
  score: number = 0
  userAnswer: string = ''
  attempts: number = 0
  blurAmount: number = this.BASE_BLUR
  isCorrectAnswerShown: boolean = false

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

  ngAfterViewInit(): void {
    this.imgsToFind.changes.subscribe((img: QueryList<ElementRef>) => {
      this.imgToFind = img.first
      this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.blurAmount}px)`

      if(this.blurIntervalId)
        clearInterval(this.blurIntervalId)
      this.unBlur()
    })
  }


  try() {
    let correctAnswers = this.minigame.medias[this.actualMediaIndex].answers
    this.attempts++

    if (this.userAnswer != '') { // Check if user entered an answer
      this.checkUserAnswer(correctAnswers);
    }

    this.userAnswer = ''

    if (this.attempts == this.MAX_ATTEMPTS) { // Check if user has used all attempts
      this.showCorrectAnswer();
    }
    // TODO: check if last media, then Show Score + send score via API
  }


  private unBlur() {
    this.blurIntervalId = setInterval(() => {
      this.blurAmount -= this.BASE_BLUR / this.MAX_TIMER
      this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.blurAmount}px)`
      this.timer--

      if (this.blurAmount <= 0 || this.timer <= 0) {
        clearInterval(this.blurIntervalId)
        this.showCorrectAnswer()
      }
    }, 1000);
  }


  private checkUserAnswer(correctAnswers: MediaAnswer[]) {
    for (let index = 0; index < correctAnswers.length; index++) {
      if (correctAnswers[index].answer.toLowerCase() == this.userAnswer.toLowerCase()) { // Check if answer is Correct among the correct answers
        this.score += Math.round(this.timer * this.blurAmount); // Calculate score based on time and blur and attempts
        this.nextMedias();
        break;
      } else if (index == correctAnswers.length - 1) { // Check if answer is incorrect
        this.score += this.SCORE_PER_ERROR;
      }
    }
  }

  
  private showCorrectAnswer() {
    this.isCorrectAnswerShown = true;

    let i = setInterval(() => {
      this.timerBeforeNextMedia--;
    }, 1000);

    let interval = setInterval(() => {
      this.isCorrectAnswerShown = false;
      this.nextMedias();
      this.timerBeforeNextMedia = this.TIME_BETWEEN_MEDIAS;
      clearInterval(i);
      clearInterval(interval);
    }, 5000);
  }


  private nextMedias() {
    clearInterval(this.blurIntervalId);
    this.actualMediaIndex++;
    this.attempts = 0;
    this.blurAmount = this.BASE_BLUR;
    this.timer = this.MAX_TIMER;
    this.unBlur();
  }

  ngOnDestroy(): void {
    // TODO: unsubscriptions
  }
}
