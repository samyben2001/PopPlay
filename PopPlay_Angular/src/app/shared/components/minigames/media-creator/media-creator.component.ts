import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MediaService } from '../../../../services/api/media.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Media, Answer, MediaCreate, MediaType } from '../../../../models/models';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MinigameService } from '../../../../services/api/minigame.service';
import { ButtonComponent } from '../../tools/button/button.component';
import { BtnTypes } from '../../../../enums/BtnTypes';

@Component({
  selector: 'app-media-creator',
  standalone: true,
  imports: [ ReactiveFormsModule, InputTextModule, DropdownModule, FloatLabelModule, ButtonComponent],
  templateUrl: './media-creator.component.html',
  styleUrl: './media-creator.component.css'
})
export class MediaCreatorComponent implements OnInit, OnDestroy {
  mediaServ = inject(MediaService);
  minigameServ = inject(MinigameService);
  router = inject(Router);
  fb = inject(FormBuilder);
  @Input() isVisible: boolean = false
  @Output() mediaCreatedEvent = new EventEmitter<Media | null>()

  mediaForm: FormGroup = new FormGroup({});
  mediaTypes: MediaType[] = []
  filteredMediaTypes: MediaType[] = []
  answers: string[] = []
  answersCreatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedFileName: string = ''
  mediaToCreate!: MediaCreate
  subscriptions: Subscription[] = []
  protected btnTypes = BtnTypes

  constructor() { }

  ngOnInit(): void {
    // Get all media types
    this.subscriptions.push(this.mediaServ.getAllTypes().subscribe({
      next: (data) => { 
        this.mediaTypes = data;
       },
      error: (err) => { console.log(err); }
    }));

    // Initialize the form
    this.mediaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      answers_id: [[]],
    })
    this.mediaToCreate = this.mediaForm.value
  }

  /**
   * Called when the user selects a media file
   * @param event - The event triggered when the user selects a media file
   */
  onMediaAdded(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.mediaForm.patchValue({ url: file });
      this.mediaForm.patchValue({ name: file.name.replace(/\.[^/.]+$/, "") });
    }
  }

  filterMediaTypes(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
    this.filteredMediaTypes = this.mediaTypes.filter((type) => {
      return type.name.toLowerCase().startsWith(event.query.toLowerCase())
    })
  }

  /**
   * Called when the user types in the answers input field
   * @param event - The event triggered when the user types in the answers input field
   */
  onAnswersChanged(event: any) {
    this.answers = event.target.value.split(',');
  }

  /**
   * Called when the user clicks the "Cancel" button
   */
  dismiss() {
    this.mediaCreatedEvent.emit(null);
  }

  /**
   * Called when the user clicks the "Create" button
   * Creates all the answers and then the media
   */
  submit() {
    this.createAllAnswers();
    this.createMedia();
  }

  /**
   * Creates all the answers and notifies the component when all answers have been created
   */
  createAllAnswers() {
    if (this.answers.length > 0) {
      // Create an array of observables for each answer creation
      const answerRequests: Observable<Answer>[] = this.answers.map(answer => this.minigameServ.create_answer(answer.trim()));

      // Use forkJoin to wait for all requests to complete
      this.subscriptions.push(forkJoin(answerRequests).subscribe({
          next: (responses: Answer[]) => {
              // Iterate over the responses to patch the form
              const createdIds = responses.map((response: Answer) => response.id!);
              this.mediaToCreate.answers_id = [...createdIds]

              this.answersCreatedSubject.next(true);  // Notify that all answers have been created
          },
          error: (err) => {
              console.error("Error creating answers: ", err);
          }
      }));
    }
  }

  /**
   * Creates the media and notifies the parent component when the media has been created
   */
  createMedia() {
    // Wait for all answers to be created before creating the media
    this.subscriptions.push(this.answersCreatedSubject.subscribe({
      next: (data) => { 
        if (data) { 
          // Create the media
          this.mediaToCreate.name = this.mediaForm.value.name
          this.mediaToCreate.url = this.mediaForm.value.url
          this.mediaToCreate.type_id = this.mediaForm.value.type_id

          this.subscriptions.push(this.mediaServ.create(this.mediaToCreate).subscribe({
            next: (data) => { 
              console.log(data); 
              this.mediaCreatedEvent.emit(data); 
            },
            error: (err) => { console.log(err); }
          }));
       } 
      },
      error: (err) => { console.log(err); }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
