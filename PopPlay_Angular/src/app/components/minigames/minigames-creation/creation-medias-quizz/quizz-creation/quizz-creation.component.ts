import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Quiz } from '../../../../../models/models';
import { ButtonComponent } from '../../../../../shared/components/tools/button/button.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BtnTypes } from '../../../../../enums/BtnTypes';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-quizz-creation',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputTextModule,
    FloatLabelModule],
  templateUrl: './quizz-creation.component.html',
  styleUrl: './quizz-creation.component.css'
})
export class QuizzCreationComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected btnTypes = BtnTypes
  protected quizzForm: FormGroup = new FormGroup({})
  protected answers: string[][] = [[]]

  @Output() quizzValidatedEvent = new EventEmitter<Quiz[]>()
  @Input() quizzs!: Quiz[];

  constructor() {
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

  ngOnInit(): void {
    if (this.quizzs.length > 0) {

      for (let i = 0; i < this.quizzs.length; i++) {
        if (i > 0) {
          this.addQuestion();
        }

        this.quizz.controls[i].get('question')?.setValue(this.quizzs[i].question.question);
        let answers = this.quizzs[i].answers.map(answer => answer.answer)
        this.quizz.controls[i].get('answers')?.setValue(answers);
        this.answers[i] = answers;
      }
    }
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
    this.quizz.controls[index].get('answers')?.setValue(event.target.value.split(','));

    let quizs: Quiz[] = []
    this.quizzForm.value.quizz.forEach((quizz: any) => {
      let q: Quiz = {
        question: { question: quizz.question },
        answers: []
      }
      quizz.answers.forEach((answer: any) => {
        q.answers.push({ answer: answer })
      })
      quizs.push(q)
    })
    this.quizzValidatedEvent.emit(quizs)
  }
}
