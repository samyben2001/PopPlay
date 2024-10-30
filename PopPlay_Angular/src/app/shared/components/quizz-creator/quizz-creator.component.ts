import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MediaAnswer, Question, QuestionCreate } from '../../../models/models';
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
  mediaServ = inject(MediaService)
  minigameServ = inject(MinigameService)
  @Input() isVisible: boolean = false
  @Output() quizzCreatedEvent = new EventEmitter<Question[] | null>()
  quizzForm: FormGroup = new FormGroup({})
  fullQuizzToCreate: QuestionCreate[] = []
  fullQuizz: Question[] = []
  answers: string[][] = [[]]
  answersCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


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
    this.quizzForm.reset();
  }

  submit() {
    this.createAllAnswers()
    this.createQuizz()
  }


  createAllAnswers() {
    this.answers.forEach((answer, index) => {
      console.log("answers", answer, index)
      const answerRequests: Observable<MediaAnswer>[] = answer.map(answer => this.mediaServ.createAnswer(answer.trim()));

      // Use forkJoin to wait for all requests to complete
      forkJoin(answerRequests).subscribe({
          next: (responses: MediaAnswer[]) => {
              // Iterate over the responses to patch the form
              const question = this.quizz.at(index).get('question')?.value;
              const createdIds = responses.map((response: MediaAnswer) => response.id!);

              this.fullQuizzToCreate.push({ question: question, answers_id:createdIds });
              
          },
          error: (err) => {
              console.error("Error creating answers: ", err);
          },
          complete: () => {
              console.log("finally")
              this.answersCreatedSubject.next(true);  // Notify that all answers have been created // FIXME: detect last 
              
          }
      });
    })
  }

  createQuizz() {
    this.answersCreatedSubject.subscribe({
      next: (data) => { 
        if (data) { 
          this.fullQuizzToCreate.forEach((quizz, index) => {
            this.minigameServ.create_quizz(quizz).subscribe({
              next: (data) => { 
                console.log(data); 
                this.fullQuizz.push(data);
                if (index === this.fullQuizzToCreate.length - 1) {
                  this.quizzCreatedEvent.emit(this.fullQuizz);
                }
              },
              error: (err) => { console.log(err); }
            })
          })
        }
      },
      error: (err) => { console.log(err); }
    })
  }

}
