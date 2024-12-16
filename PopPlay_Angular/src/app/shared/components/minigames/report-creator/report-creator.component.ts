import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GameTypes } from '../../../../enums/GameTypes';
import { Media, MediaQuizReport, Quiz, ReportType } from '../../../../models/models';
import { ReportService } from '../../../../services/api/report.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonComponent } from '../../tools/button/button.component';
import { BtnTypes } from '../../../../enums/BtnTypes';

@Component({
  selector: 'app-report-creator',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, DropdownModule, ButtonComponent, InputTextareaModule],
  templateUrl: './report-creator.component.html',
  styleUrl: './report-creator.component.css'
})
export class ReportCreatorComponent implements OnInit {
  private _reportServ = inject(ReportService)
  private fb = inject(FormBuilder);

  @Input() isVisible: boolean = false
  @Input() objectId?: number
  @Input() objectType?: GameTypes
  @Output() reportCreatedEvent = new EventEmitter<MediaQuizReport | null>()

  protected reportForm: FormGroup = new FormGroup({});
  protected reportQuizType: ReportType[] = []
  protected reportToSend!: MediaQuizReport
  protected GameTypes = GameTypes
  protected btnTypes = BtnTypes

  ngOnInit(): void {
    if (this.objectType == GameTypes.IMAGE_GUESSING || this.objectType == GameTypes.BLIND_TEST || this.objectType == GameTypes.QUIZZ) {
      this._reportServ.getMediaQuizReportType().subscribe({
        next: (data) => {
          this.reportQuizType = data
        }
      })
    }

    this.reportForm = this.fb.group({
      reportQuizType: ['', [Validators.required]],
      message: ['', []],
    });
  }

  protected dismiss() {
    this.reportCreatedEvent.emit(null);
    this.reportForm.reset();
  }

  protected submit() {
    this.reportToSend = {
      reportType: this.reportForm.value.reportQuizType,
      message: this.reportForm.value.message
    };

    this._reportServ.addReport(this.objectId!, this.objectType!, this.reportToSend).subscribe({
      next: (data) => {
        if (data) {
          this.reportCreatedEvent.emit(data);
        }
      },
      error: (err) => { console.log(err); }
    })
  }
}
