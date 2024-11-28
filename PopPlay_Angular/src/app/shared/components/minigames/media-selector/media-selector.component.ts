import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { Media } from '../../../../models/models';
import { MediaCreatorComponent } from '../media-creator/media-creator.component';
import { ToastService } from '../../../../services/tools/toast.service';
import { ToastTypes } from '../../../../enums/ToastTypes';
import { ButtonComponent } from '../../tools/button/button.component';
import { BtnTypes } from '../../../../enums/BtnTypes';
import { MediaTypes } from '../../../../enums/MediaTypes';
import { MediaService } from '../../../../services/api/media.service';
import { UpperFirstPipe } from '../../../pipes/upper-first.pipe';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [MediaCreatorComponent, ButtonComponent, UpperFirstPipe],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css'
})
export class MediaSelectorComponent implements OnChanges {
  // declare services
  private toastService = inject(ToastService);
  private mediaService = inject(MediaService);

  // declare variables
  protected medias: Media[] = [];
  protected btnTypes = BtnTypes
  protected mediaTypes = MediaTypes;
  protected isCreatorVisible: boolean = false;
  protected onlyMine: boolean = true;
  private _mediaType: MediaTypes = MediaTypes.IMAGE;
  @Input() isVisible: boolean = false;
  @Input() selectedMedias: Media[] = [];
  @Output() selectedMediasEvent = new EventEmitter<Media[] | null>();
  @ViewChildren('CheckboxMedia') checkboxes!: ElementRef<HTMLInputElement>[];

  // getters and setters
  @Input() set mediaType(mediaType: MediaTypes) {
    this._mediaType = mediaType;
    setTimeout(() => {
      this.GetMedias(this.onlyMine);
    }, 100);
  }
  get mediaType(): MediaTypes {
    return this._mediaType;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMedias'] && changes['selectedMedias'].currentValue) {
      this.selectedMedias = changes['selectedMedias'].currentValue;
    }

    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      let interval = setInterval(() => {
        this.selectedMedias.forEach((media: Media) => this.ToggleCheckbox(media, true));
        clearInterval(interval);
      }, 50);
    }
  }


  toggleOnlyMine() {
    this.onlyMine = !this.onlyMine;
    this.GetMedias(this.onlyMine);
  }

  selectMedia(media: Media) {
    // add or remove the media
    if (!this.selectedMedias.includes(media)) {
      this.selectedMedias.push(media);
      this.ToggleCheckbox(media, true);
    } else {
      this.selectedMedias = this.selectedMedias.filter((m) => m.id != media.id);
      this.ToggleCheckbox(media, false);
    }
  }

  private GetMedias(onlyMine: boolean) {
    if (!onlyMine) {
      this.mediaService.getAll([this.mediaType]).subscribe({
        next: (medias) => {
          this.medias = medias;
        },
        error: (err) => { console.log(err); }
      });
    } else {
      this.mediaService.getAllByUser([this.mediaType]).subscribe({
        next: (medias) => {
          this.medias = medias;
        },
        error: (err) => { console.log(err); }
      });
    }
  }


  private ToggleCheckbox(media: Media, value: boolean) {
    // (un)check the checkbox mathcing the media id
    let box = this.checkboxes.find((checkbox: ElementRef<HTMLInputElement>) => checkbox.nativeElement.value == media.id.toString());
    if (box)
      box.nativeElement.checked = value;
  }

  private ResetCheckboxes() {
    this.checkboxes.forEach((checkbox: ElementRef<HTMLInputElement>) => checkbox.nativeElement.checked = false);
  }

  dismiss() {
    this.selectedMediasEvent.emit(null);
    this.ResetCheckboxes();
  }

  submit() {
    this.selectedMediasEvent.emit(this.selectedMedias);
    this.ResetCheckboxes();
  }

  openMediasCreator() {
    this.isCreatorVisible = true;
  }

  onMediaCreated(media: Media | null) {
    if (media) {
      this.medias.push(media);
      this.toastService.Show("Media Created", `Media ${media.name} created successfully`, ToastTypes.SUCCESS, 3000);
    }
    this.isCreatorVisible = false;
  }
}
