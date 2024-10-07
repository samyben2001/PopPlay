import { Component, inject, Input, OnInit } from '@angular/core';
import { MediaService } from '../../../services/media.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaType } from '../../../models/models';

@Component({
  selector: 'app-media-creator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './media-creator.component.html',
  styleUrl: './media-creator.component.css'
})
export class MediaCreatorComponent implements OnInit {
  mediaServ = inject(MediaService);
  router = inject(Router);
  fb = inject(FormBuilder);
  mediaForm: FormGroup = new FormGroup({});

  @Input() isVisible: boolean = false
  mediaTypes: MediaType[] = []


  constructor() { }

  ngOnInit(): void {
    this.mediaServ.getAllTypes().subscribe({
      next: (data) => { this.mediaTypes = data; },
      error: (err) => { console.log(err); }
    });

    this.mediaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      answers: [[]],
    })
  }

  onMediaAdded(event: any) {
    const file: File = event.target.files[0];
  }

  submit() {
    // this.mediaServ.create(this.mediaForm.value).subscribe({
    //   next: (data) => { console.log(data); },
    //   error: (err) => { console.log(err); }
    // })
  }
}
