import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Minigame } from '../../../models/models';
import { MinigameService } from '../../../services/minigame.service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe } from '@angular/common';
import { NoRightClickDirective } from '../../../shared/directives/no-right-click.directive';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { GameTypes } from '../../../enums/GameTypes';

@Component({
  selector: 'app-minigame-player',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule, DatePipe, NoRightClickDirective],
  templateUrl: './minigame-player.component.html',
  styleUrl: './minigame-player.component.css',
  animations: [trigger('hiddenVisible', [
    state(
      'hidden',
      style({
        opacity: 0,
        top: 0
      }),
    ),
    state(
      'visible',
      style({
        opacity: 1,
        top: '-1.5rem'
      }),
    ),
    transition('hidden => visible', [animate('0.3s')]),
  ]),],
})
export class MinigamePlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router)
  private _ar = inject(ActivatedRoute)
  private _gameServ = inject(MinigameService)
  private _accountServ = inject(AccountService)
  private _authServ = inject(AuthService)
  protected MAX_ATTEMPTS: number = 3
  private BASE_BLUR: number = 25
  private MAX_TIMER: number = 30
  private TIME_BETWEEN_MEDIAS: number = 5
  private SCORE_PER_ERROR: number = -100

  minigame!: Minigame

  @ViewChildren('imgOverlay') imgsToFind!: QueryList<ElementRef>
  @ViewChild('scoreUp') scoreUp!: ElementRef
  @ViewChild('scoreDown') scoreDown!: ElementRef
  gameTypes = GameTypes
  imgToFind!: ElementRef
  blurIntervalId?: ReturnType<typeof setInterval>
  actualMediaIndex: number = 0
  maxMediaIndex: number = 0
  timer: number = this.MAX_TIMER
  timerBeforeNextMedia: number = this.TIME_BETWEEN_MEDIAS
  score: number = 0
  scoreGained: number = 0
  nbCorrectAnswers: number = 0
  attempts: number = 0
  userAnswer: string = ''
  blurAmount: number = this.BASE_BLUR
  isCorrectAnswerShown: boolean = false
  isGameEnded: boolean = false
  scoreAnimation: boolean | null = null

  ngOnInit(): void {
    this._gameServ.get_by_id(this._ar.snapshot.params['gameId']).subscribe({
      next: (data) => {
        this.minigame = data
        if(this.minigame.type.name == GameTypes.IMAGE_GUESSING){
          this.shuffle(this.minigame.medias)
          this.maxMediaIndex = this.minigame.medias.length
        }else if(this.minigame.type.name == GameTypes.QUIZZ){
          this.shuffle(this.minigame.quizz)
          this.maxMediaIndex = this.minigame.quizz.length
        }
        console.log(this.minigame)
      },
      error: (err) => {
        console.log(err)
        this._router.navigate(['/error'])
      }
    })
  }

  ngAfterViewInit(): void {
    this.imgsToFind.changes.subscribe((img: QueryList<ElementRef>) => {
      if(!img.first) return

      this.imgToFind = img.first
      this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.BASE_BLUR}px)`

      if(this.blurIntervalId != undefined)
        clearInterval(this.blurIntervalId)
      this.unBlur()
    })
  }


  try() {
    if (this.userAnswer == '') return // Check if user entered an answer
    let correctAnswers: any[] = []
    if (this.minigame.type.name == GameTypes.IMAGE_GUESSING) {
      correctAnswers = this.minigame.medias[this.actualMediaIndex].answers
    }else if (this.minigame.type.name == GameTypes.QUIZZ) {
      correctAnswers = this.minigame.quizz[this.actualMediaIndex].answers
    }

    this.attempts++

    this.checkUserAnswer(correctAnswers);

    if (this.attempts == this.MAX_ATTEMPTS) { // Check if user has used all attempts
      this.showCorrectAnswer();
    }
    this.checkIfGameEnded();
  }
  
  private checkIfGameEnded() {
    if (!this.isGameEnded && (this.actualMediaIndex == this.maxMediaIndex)) {
      this.isGameEnded = true
      clearInterval(this.blurIntervalId)
      if(this._authServ.isConnected()){
        this._accountServ.addScore(this.minigame.id, this.score).subscribe({
          next: (data) => {
            console.log(data)
           },
          error: (err) => {
            console.log(err)
            this._router.navigate(['/error'])
          }
        })
      }
    }
  }

  private unBlur() {
    this.blurIntervalId = setInterval(() => {
      this.blurAmount -= this.BASE_BLUR / this.MAX_TIMER
      this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.blurAmount}px)`
      this.timer--

      if (!this.isGameEnded && (this.blurAmount <= 0 || this.timer <= 0)) { // Check if time is elapsed for guessing image
        this.setAnimation(false);
        clearInterval(this.blurIntervalId)
        this.score += this.SCORE_PER_ERROR
        this.showCorrectAnswer()
      }
    }, 1000);
  }


  private setAnimation(state: boolean) {
    this.scoreAnimation = state;
    setTimeout(() => {
      this.scoreAnimation = null;
    }, 750);
  }

  private checkUserAnswer(correctAnswers: Answer[]) {
    for (let index = 0; index < correctAnswers.length; index++) {
      if (correctAnswers[index].answer.toLowerCase() == this.userAnswer.toLowerCase()) { // Check if answer is Correct among the correct answers
        this.scoreGained = Math.round(this.timer * this.blurAmount) + 100; // Calculate score based on time and blur and attempts
        this.score += this.scoreGained 
        this.nbCorrectAnswers++;
        this.setAnimation(true);
        this.nextMedias();
        break;
      } else if (index == correctAnswers.length - 1) { // Check if answer is incorrect
        this.setAnimation(false);
        this.score += this.SCORE_PER_ERROR;
      }
    }
    this.userAnswer = ''
  }

  
  private showCorrectAnswer() {
    this.isCorrectAnswerShown = true;
    clearInterval(this.blurIntervalId);

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
    clearInterval(this.blurIntervalId);
    this.actualMediaIndex++;
    this.checkIfGameEnded();
    this.userAnswer = '';
    if (this.isGameEnded) return;
    
    this.imgToFind.nativeElement.style.backdropFilter = `blur(${this.BASE_BLUR}px)`
    this.blurAmount = this.BASE_BLUR;
    this.timer = this.MAX_TIMER;
    this.attempts = 0;
    this.unBlur();
  }

  private shuffle(array: any[]) {
    let currentIndex: number = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex: number = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }


  ngOnDestroy(): void {
    // TODO: unsubscriptions
  }
}
