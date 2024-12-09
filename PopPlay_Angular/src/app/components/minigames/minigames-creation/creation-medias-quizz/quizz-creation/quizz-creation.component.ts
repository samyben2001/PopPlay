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
  
  @Input() quizzs!: Quiz[]
  @Output() quizzValidatedEvent = new EventEmitter<Quiz[]>()

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
  ngOnInit(): void {
    console.log(this.quizzs)
    if (this.quizzs.length > 0) {
      for (let i = 0; i < this.quizzs.length; i++) {
        if (i > 0) {
          this.addQuestion();
        }
        this.quizz.controls[i].get('question')?.setValue(this.quizzs[i].question);
        // let answers = this.quizzs[i].answers.map(answer => answer.answer)
        this.quizz.controls[i].get('answers')?.setValue(this.quizzs[i].answers);
      }
    }
  }

  get quizz() {
    return this.quizzForm.get('quizz') as FormArray;
  }

  addQuestion(questionValue: string = '', answerValue: string = '') {
    const newQuestion = this.fb.group({
      question: [questionValue, [Validators.required, Validators.minLength(3)]],
      answers: [answerValue, [Validators.required, Validators.minLength(1)]]
    })

    this.quizz.push(newQuestion);
  }

  removeQuestion(index: number) {
    this.quizz.removeAt(index);
  }

  onAnswersChanged(event: any, index: number) {
    this.quizz.controls[index].get('answers')?.setValue(event.target.value.split(','));
    this.quizzValidatedEvent.emit(this.quizzForm.value.quizz)
  }
}
