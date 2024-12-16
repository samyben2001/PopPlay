import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, WritableSignal } from '@angular/core';
import { Answer, MinigameCreate, Question, Quiz, QuizCreate } from '../../../../models/models';
import { ButtonComponent } from '../../../../shared/components/tools/button/button.component';
import { BtnTypes } from '../../../../enums/BtnTypes';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { GameTypes } from '../../../../enums/GameTypes';
import { MinigameService } from '../../../../services/api/minigame.service';
import { ToastService } from '../../../../services/tools/toast.service';
import { ToastTypes } from '../../../../enums/ToastTypes';
import { Router } from '@angular/router';
import { UpperFirstPipe } from '../../../../shared/pipes/upper-first.pipe';

@Component({
  selector: 'app-creation-validation',
  standalone: true,
  imports: [CommonModule, ButtonComponent, UpperFirstPipe],
  templateUrl: './creation-validation.component.html',
  styleUrl: './creation-validation.component.css'
})
export class CreationValidationComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private minigameServ = inject(MinigameService);
  private router = inject(Router);

  protected btnTypes = BtnTypes

  protected imageGuessId!: number;
  protected quizzId!: number
  protected blindTestId!: number
  protected coverString: string = ''

  private questionsCreated: Question[] = []
  private answersCreated: Answer[][] = []
  private answersCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private responsesCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private quizzCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected subscriptions: Subscription[] = []

  @Input() minigame!: WritableSignal<MinigameCreate>
  @Input() gameInfosText: any
  @Output() gameCreationCancelled = new EventEmitter<MinigameCreate>();

  ngOnInit(): void {
    if(typeof this.minigame().cover_url === 'object'){
      const cover = this.minigame().cover_url as File
      this.coverString = cover.name
    }else{
      this.coverString = this.minigame().cover_url as string
    }
    this.getTypesId();
  }

  protected isObject(val: any): boolean { return typeof val === 'object'; }

  private getTypesId() {
    this.subscriptions.push(this.minigameServ.get_types().subscribe({
      next: (data) => {
        this.imageGuessId = data.find(type => type.name == GameTypes.IMAGE_GUESSING)!.id;
        this.quizzId = data.find(type => type.name == GameTypes.QUIZZ)!.id;
        this.blindTestId = data.find(type => type.name == GameTypes.BLIND_TEST)!.id;
      },
      error: (err) => { console.log(err); }
    }));
  }

  protected back() {
    this.gameCreationCancelled.emit()
  }

  protected validateMinigame() {
    if (this.minigame().type_id == this.quizzId && this.minigame().quizz_id.length > 0) {
      this.createAllQuestions();
      this.createAllAnswers();
      this.createQuizz();
    } else {
      this.quizzCreatedSubject.next(true);
    }

    if(!this.minigame().id)
      this.createGame();
    else
      this.updateGame();
  }

  private createAllQuestions() {
    const questionRequests: Observable<Question>[] = this.minigame().quizz_id.map((quizz: any) => this.minigameServ.create_question(quizz.question));

    this.subscriptions.push(forkJoin(questionRequests).subscribe({
      next: (responses: Question[]) => {
        this.questionsCreated = responses
      },
      error: (err) => {
        console.error("Error creating questions: ", err);
      },
      complete: () => {
        this.responsesCreatedSubject.next(true);
      }
    }));
  }

  private createAllAnswers() {
    this.subscriptions.push(this.responsesCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          // Create an array of observables for all answer groups
          const allAnswerRequests = this.minigame().quizz_id.map(answerGroup => {
            const answerRequests: Observable<Answer>[] = answerGroup.answers.map(answer => {
              return this.minigameServ.create_answer(answer.toString().trim())
            });
            return forkJoin(answerRequests); // Each group is a forkJoin
          });

          // Wait for all groups to complete
          this.subscriptions.push(forkJoin(allAnswerRequests).subscribe({
            next: (allResponses) => {
              this.answersCreated = allResponses; // Assign all responses
              this.answersCreatedSubject.next(true); // Emit when everything is done
            },
            error: (err) => {
              console.error("Error creating answers: ", err);
            }
          }));
        }
      }
    }));
  }

  private createQuizz() {
    this.subscriptions.push(this.answersCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          let quizRequests: Observable<Quiz>[] = []
          for (let i = 0; i < this.minigame().quizz_id.length; i++) {
            const quiz: QuizCreate = {
              question_id: this.questionsCreated[i].id!,
              answers_id: this.answersCreated[i].map((answer) => answer.id!)
            }
            quizRequests.push(this.minigameServ.create_quizz(quiz));
          }


          this.subscriptions.push(forkJoin(quizRequests).subscribe({
            next: (responses: Quiz[]) => {
              this.minigame().quizz_id = responses
              this.quizzCreatedSubject.next(true);
            },
            error: (err) => {
              console.error("Error creating quizz: ", err);
            }
          }))
        }
      },
      error: (err) => { console.log(err); }
    }))
  }

  private createGame() {
    this.subscriptions.push(this.quizzCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          this.subscriptions.push(this.minigameServ.create(this.minigame()).subscribe({
            next: (data) => {
              this.toastService.Show("Minigame Créé", `Minigame ${data.name} créé avec succès`, ToastTypes.SUCCESS, 3000);
              this.router.navigate(['']);
            },
            error: (err) => { console.log(err); }
          }));
        }
      }
    }))
  }

  private updateGame() {
    this.subscriptions.push(this.minigameServ.update(this.minigame()).subscribe({
      next: (data) => {
        this.toastService.Show("Minigame Mis à jour", `Minigame ${data.name} mis à jour avec succès`, ToastTypes.SUCCESS, 3000);
        this.router.navigate(['']);
      },
      error: (err) => { console.log(err); }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
