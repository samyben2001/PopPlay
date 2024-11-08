import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Answer, Question, Quiz, QuizCreate } from '../../../models/models';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { MediaService } from '../../../services/media.service';
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

  addQuestion() {
    const newQuestion = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      answers: ['', [Validators.required, Validators.minLength(3)]]
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

    forkJoin(questionRequests).subscribe({
      next: (responses: Question[]) => {
        this.questionsCreated = responses
      },
      error: (err) => {
        console.error("Error creating questions: ", err);
      },
      complete: () => {
        this.responsesCreatedSubject.next(true);
      }
    });
  }


  createAllAnswers() {
    this.responsesCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          this.answers.forEach((answer, index) => {
            const answerRequests: Observable<Answer>[] = answer.map(answer => this.minigameServ.create_answer(answer.trim()));
            // Use forkJoin to wait for all requests to complete
            forkJoin(answerRequests).subscribe({
              next: (responses: Answer[]) => {
                this.answersCreated.push(responses)
              },
              error: (err) => {
                console.error("Error creating answers: ", err);
              },
              complete: () => {
                if (index === this.answers.length - 1) {
                  this.answersCreatedSubject.next(true);  // Notify that all answers have been created
                }
              }
            });
          })
        }
      }
    })

  }

  createQuizz() {
    this.answersCreatedSubject.subscribe({
      next: (data) => {
        if (data) {
          let quizRequests: Observable<Quiz>[] = []
          for (let i = 0; i < this.quizz.value.length; i++) {
            const quiz: QuizCreate = {
              question_id: this.questionsCreated[i].id!,
              answers_id: this.answersCreated[i].map((answer) => answer.id!) // FIXME: sometimes error answerCreated undefined: 'TypeError: Cannot read properties of undefined (reading 'map')' on adding quiz
            }
            quizRequests.push(this.minigameServ.create_quizz(quiz));
          }
          
          
          forkJoin(quizRequests).subscribe({
            next: (responses: Quiz[]) => {
              this.quizzCreatedEvent.emit(responses)
              this.resetForm();
            },
            error: (err) => {
              console.error("Error creating quizz: ", err);
            }
          })
        }
      },
      error: (err) => { console.log(err); }
    })
  }

  resetForm() {
    this.quizzForm.reset();
    this.quizz.clear();
    this.addQuestion();
    this.answers = [[]];
    this.questionsCreated = [];
    this.answersCreated = [];
    this.responsesCreatedSubject.next(false);
    this.answersCreatedSubject.next(false);
  }

}


