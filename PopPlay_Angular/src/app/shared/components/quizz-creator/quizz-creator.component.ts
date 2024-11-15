import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Answer, Question, Quiz, QuizCreate } from '../../../models/models';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { MinigameService } from '../../../services/minigame.service';

@Component({
  selector: 'app-quizz-creator',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule],
  templateUrl: './quizz-creator.component.html',
  styleUrl: './quizz-creator.component.css'
})
export class QuizzCreatorComponent implements OnInit {
  fb = inject(FormBuilder);
  minigameServ = inject(MinigameService)
  @Input() isVisible: boolean = false
  @Output() quizzCreatedEvent = new EventEmitter<Quiz[] | null>()
  questionsCreated: Question[] = []
  answersCreated: Answer[][] = []
  quizzForm: FormGroup = new FormGroup({})
  answers: string[][] = [[]]
  answersCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  responsesCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subscriptions: Subscription[] = []
  private _quizzSelected: Quiz[] = []
  @Input() set quizzSelected(quizzs: Quiz[]) {
    this._quizzSelected = quizzs;
    
    if (this._quizzSelected.length > 0) {
      for (let i = 0; i < this._quizzSelected.length; i++) { 
        if (i > 0) {
          this.addQuestion();
        }
        this.quizz.controls[i].get('question')?.setValue(this._quizzSelected[i].question.question);
        let answers = this._quizzSelected[i].answers.map(answer => answer.answer)
        this.quizz.controls[i].get('answers')?.setValue(answers.join(','));
        this.answers[i] = answers;
      }
    }
  }

  ngOnInit(): void {
    this.quizzForm = this.fb.group({
      quizz: this.fb.array([
        this.fb.group({
          question: ['', [Validators.required, Validators.minLength(3)]],
          answers: ['', [Validators.required, Validators.minLength(1)]]
        })
      ]),
    })
  }

  get quizz() {
    return this.quizzForm.get('quizz') as FormArray;
  }

  addQuestion(questionValue: string = '', answerValue: string = '') {
    const newQuestion = this.fb.group({
      question: [questionValue, [Validators.required, Validators.minLength(3)]],
      answers: [answerValue, [Validators.required, Validators.minLength(1)]]
    })

    this.answers.push([]);
    this.quizz.push(newQuestion);
  }

  removeQuestion(index: number) {
    this.answers.splice(index, 1);
    this.quizz.removeAt(index);
  }

  onAnswersChanged(event: any, index: number) {
    this.answers[index] = event.target.value.split(',');
  }

  dismiss() {
    this.quizzCreatedEvent.emit(null);
    this.resetForm();
  }

  submit() {
    this.createAllQuestions()
    this.createAllAnswers()
    this.createQuizz()
  }

  createAllQuestions() {
    const questionRequests: Observable<Question>[] = this.quizz.value.map((quizz: any) => this.minigameServ.create_question(quizz.question));

   this.subscriptions.push(forkJoin(questionRequests).subscribe({
      next: (responses: Question[]) => {
        console.log("questions", responses)
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


  // createAllAnswers() {
  //   this.subscriptions.push(this.responsesCreatedSubject.subscribe({
  //     next: (data) => {
  //       if (data) {
  //         this.answers.forEach((answer, index) => {
  //           const answerRequests: Observable<Answer>[] = answer.map(answer => this.minigameServ.create_answer(answer.trim()));
  //           // Use forkJoin to wait for all requests to complete
  //           this.subscriptions.push(forkJoin(answerRequests).subscribe({
  //             next: (responses: Answer[]) => {
  //               console.log("answers", responses)
  //               this.answersCreated.push(responses)
  //               if (index === this.answers.length - 1) {
  //                 console.log("EmittinganswersCreated")
  //                 this.answersCreatedSubject.next(true);  // Notify that all answers have been created
  //               }
  //             },
  //             error: (err) => {
  //               console.error("Error creating answers: ", err);
  //             },
  //             complete: () => {
                
  //             }
  //           }));
  //         })
  //       }
  //     }
  //   }))

  // }

  createAllAnswers() {
    this.subscriptions.push(this.responsesCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          // Create an array of observables for all answer groups
          const allAnswerRequests = this.answers.map(answerGroup => {
            const answerRequests: Observable<Answer>[] = answerGroup.map(answer =>
              this.minigameServ.create_answer(answer.trim())
            );
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

  createQuizz() {
    this.subscriptions.push(this.answersCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          console.log("answersCreated", this.answersCreated)
          console.log("questionsCreated", this.questionsCreated)
          let quizRequests: Observable<Quiz>[] = []
          console.log(quizRequests)
          for (let i = 0; i < this.quizz.value.length; i++) { 
            const quiz: QuizCreate = {
              question_id: this.questionsCreated[i].id!,
              answers_id: this.answersCreated[i].map((answer) => answer.id!)
            }
            console.log("quizToCreate", quiz)
            quizRequests.push(this.minigameServ.create_quizz(quiz));
          }


          this.subscriptions.push(forkJoin(quizRequests).subscribe({
            next: (responses: Quiz[]) => {
              console.log("quizz", responses)
              this.resetForm();
              this.quizzCreatedEvent.emit(responses)
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

  resetForm() {
    this.quizzForm.reset();
    this.quizz.clear();
    this.addQuestion();
    this.answers = [[]];
    this.questionsCreated = [];
    this.answersCreated = [];
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
    this.responsesCreatedSubject.next(false);
    this.answersCreatedSubject.next(false);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}


