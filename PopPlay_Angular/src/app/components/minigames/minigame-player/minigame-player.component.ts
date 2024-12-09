import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Minigame, UserMinigameScore } from '../../../models/models';
import { MinigameService } from '../../../services/api/minigame.service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe } from '@angular/common';
import { NoRightClickDirective } from '../../../shared/directives/no-right-click.directive';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccountService } from '../../../services/api/account.service';
import { AuthService } from '../../../services/api/auth.service';
import { GameTypes } from '../../../enums/GameTypes';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/tools/button/button.component';
import { BtnTypes } from '../../../enums/BtnTypes';
import { AccountScoresComponent } from '../../../shared/components/account/account-scores/account-scores.component';

@Component({
  selector: 'app-minigame-player',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule, DatePipe, NoRightClickDirective, ButtonComponent, AccountScoresComponent],
  templateUrl: './minigame-player.component.html',
  styleUrl: './minigame-player.component.css',
  animations: [
    trigger('hiddenVisible', [
      state('hidden', style({ opacity: 0, top: 0 }),),
      state('visible', style({ opacity: 1, top: '-1.5rem' })),
      transition('hidden => visible', [animate('0.3s')]),
    ]),],
})
export class MinigamePlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router)
  private _ar = inject(ActivatedRoute)
  private _gameServ = inject(MinigameService)
  private _accountServ = inject(AccountService)
  private _authServ = inject(AuthService)

  protected readonly MAX_ATTEMPTS: number = 3
  private readonly BASE_BLUR: number = 25
  private readonly MAX_TIMER: number = 30
  private readonly TIME_BETWEEN_MEDIAS: number = 5
  private readonly SCORE_PER_ERROR: number = -100

  protected btnTypes = BtnTypes
  protected gameTypes = GameTypes

  protected minigame!: Minigame
  protected topScores: UserMinigameScore[] = []
  protected score: number = 0
  protected scoreGained: number = 0
  protected scoreAnimation: boolean | null = null
  protected timer: number = this.MAX_TIMER
  private timerIntervalId?: ReturnType<typeof setInterval>
  protected timerBeforeNextMedia: number = this.TIME_BETWEEN_MEDIAS
  protected userAnswer: string = ''
  protected nbCorrectAnswers: number = 0
  protected attempts: number = 0
  protected maxMediaIndex: number = 0
  protected actualMediaIndex: number = 0
  private audioToFind!: ElementRef
  private imgToFind!: ElementRef
  private blurAmount: number = this.BASE_BLUR
  protected isCorrectAnswerShown: boolean = false
  protected isGameEnded: boolean = false

  private subscriptions: Subscription[] = []

  @ViewChildren('question') questions!: QueryList<ElementRef>
  @ViewChild('scoreUp') scoreUp!: ElementRef
  @ViewChild('scoreDown') scoreDown!: ElementRef


  ngOnInit(): void {
    this.subscriptions.push(this._gameServ.get_by_id(this._ar.snapshot.params['gameId']).subscribe({
      next: (data) => {
        this.minigame = data

        if (this.minigame.type.name == GameTypes.IMAGE_GUESSING || this.minigame.type.name == GameTypes.BLIND_TEST) {
          this.shuffle(this.minigame.medias)
          this.maxMediaIndex = this.minigame.medias.length
        } else if (this.minigame.type.name == GameTypes.QUIZZ) {
          this.shuffle(this.minigame.quizz)
          this.maxMediaIndex = this.minigame.quizz.length
        }
      },
      error: (err) => {
        console.log(err)
        this._router.navigate(['/error'])
      }
    }))
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.questions.changes.subscribe((question: QueryList<ElementRef>) => {
      if (!question.first) return

      if (this.minigame.type.name == GameTypes.IMAGE_GUESSING) {
        this.imgToFind = question.first
        this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.BASE_BLUR}px)`
      } else if (this.minigame.type.name == GameTypes.BLIND_TEST) {
        this.audioToFind = question.first
        this.audioToFind.nativeElement.load()
        this.audioToFind.nativeElement.play()
      }

      if (this.timerIntervalId != undefined)
        clearInterval(this.timerIntervalId)

      this.activateTimer()
    }))
  }

  private shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
  }

  private activateTimer() {
    this.timerIntervalId = setInterval(() => {

      if (this.minigame.type.name == GameTypes.IMAGE_GUESSING) {
        this.unblur();
      }

      this.timer--

      if (!this.isGameEnded && this.timer <= 0) { // Check if time is elapsed for giving answer
        this.setScoreAnimation(false);
        clearInterval(this.timerIntervalId)
        this.score += this.SCORE_PER_ERROR
        this.showCorrectAnswer()
      }
    }, 1000);
  }

  private unblur() {
    this.blurAmount -= this.BASE_BLUR / this.MAX_TIMER;
    this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.blurAmount}px)`;
  }

  protected try() {
    if (this.userAnswer == '') return // Check if user entered an answer
    let correctAnswers: any[] = []
    if (this.minigame.type.name == GameTypes.IMAGE_GUESSING || this.minigame.type.name == GameTypes.BLIND_TEST) {
      correctAnswers = this.minigame.medias[this.actualMediaIndex].answers
    } else if (this.minigame.type.name == GameTypes.QUIZZ) {
      correctAnswers = this.minigame.quizz[this.actualMediaIndex].answers
    }

    this.attempts++

    this.checkUserAnswer(correctAnswers);

    if (this.attempts == this.MAX_ATTEMPTS) { // Check if user has used all attempts
      this.showCorrectAnswer();
    }
    this.checkIfGameEnded();
  }

  private checkUserAnswer(correctAnswers: Answer[]) {
    for (let index = 0; index < correctAnswers.length; index++) {
      if (correctAnswers[index].answer.toLowerCase() == this.userAnswer.toLowerCase()) { // Check if answer is Correct among the correct answers
        if (this.minigame.type.name == GameTypes.IMAGE_GUESSING) {
          this.scoreGained = Math.round(this.timer * this.blurAmount) + 100; // Calculate score based on time and blur and attempts
        } else {
          this.scoreGained = Math.round(this.timer * this.timer) + 100; // Calculate score based on time and attempts
        }
        this.score += this.scoreGained
        this.nbCorrectAnswers++;
        this.setScoreAnimation(true);
        // Check if it's the last media 
        if (this.actualMediaIndex == this.maxMediaIndex - 1) {
          setTimeout(() => {
            this.nextMedias();
          }, 1000);
        } else {
          this.nextMedias();
          if (this.minigame.type.name == GameTypes.BLIND_TEST) {
            this.audioToFind = this.questions.first
            this.audioToFind.nativeElement.load()
            this.audioToFind.nativeElement.play()
          }
        }
        break;
      } else if (index == correctAnswers.length - 1) { // Check if answer is incorrect
        this.setScoreAnimation(false);
        this.score += this.SCORE_PER_ERROR;
      }
    }
    this.userAnswer = ''
  }

  private setScoreAnimation(state: boolean) {
    this.scoreAnimation = state;
    setTimeout(() => {
      this.scoreAnimation = null;
    }, 750);
  }

  private showCorrectAnswer() {
    this.isCorrectAnswerShown = true;
    clearInterval(this.timerIntervalId);

    let interval = setInterval(() => {
      this.timerBeforeNextMedia--;
    }, 1000);

    setTimeout(() => {
      this.isCorrectAnswerShown = false;
      this.timerBeforeNextMedia = this.TIME_BETWEEN_MEDIAS;
      this.nextMedias();
      clearInterval(interval);
    }, 5000);
  }

  private nextMedias() {
    clearInterval(this.timerIntervalId);
    this.actualMediaIndex++;
    this.checkIfGameEnded();
    this.userAnswer = '';
    if (this.isGameEnded) return;

    if (this.minigame.type.name == GameTypes.IMAGE_GUESSING) {
      this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.BASE_BLUR}px)`
      this.blurAmount = this.BASE_BLUR;
    }

    this.timer = this.MAX_TIMER;
    this.attempts = 0;
    this.activateTimer();
  }

  protected restart() {
    this.score = 0
    this.attempts = 0
    this.userAnswer = ''
    this.isCorrectAnswerShown = false
    this.actualMediaIndex = 0
    this.scoreAnimation = null
    this.nbCorrectAnswers = 0
    this.timer = this.MAX_TIMER
    this.timerBeforeNextMedia = this.TIME_BETWEEN_MEDIAS
    this.isGameEnded = false

    switch (this.minigame.type.name) {
      case GameTypes.IMAGE_GUESSING:
        this.blurAmount = this.BASE_BLUR
        this.shuffle(this.minigame.medias)
        break;
      case GameTypes.QUIZZ:
        this.shuffle(this.minigame.quizz)
        break;
    }

    this.activateTimer()
  }

  private checkIfGameEnded() {
    if (!this.isGameEnded && (this.actualMediaIndex == this.maxMediaIndex)) {
      this.isGameEnded = true
      clearInterval(this.timerIntervalId)
      if (this._authServ.isConnected()) {
        this.sendScore();
      } else {
        this.getTopScore();
      }
    }
  }

  private sendScore() {
    this.subscriptions.push(this._accountServ.addScore(this.minigame.id, this.score).subscribe({
      next: (data) => {
        // TODO: get score position
        this._accountServ.account()?.games_score.push(data)
        this.getTopScore()
      },
      error: (err) => {
        console.log(err);
        this._router.navigate(['/error']);
      }
    }));
  }

  private getTopScore() {
    this.subscriptions.push(this._gameServ.get_top_scores(this.minigame.id).subscribe({
      next: (data) => {
        this.topScores = data.top_scores
      },
      error: (err) => {
        console.log(err);
        this._router.navigate(['/error']);
      }
    }));
  }

  protected back() {
    this._router.navigate(['/'])
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
