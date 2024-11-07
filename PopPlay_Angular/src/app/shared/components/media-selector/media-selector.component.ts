import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { Media } from '../../../models/models';
import { MediaCreatorComponent } from '../media-creator/media-creator.component';
import { ToastService } from '../../../services/toast.service';
import { ToastTypes } from '../../../enums/ToastTypes';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [MediaCreatorComponent],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css'
})
export class MediaSelectorComponent implements OnChanges{
  toastService = inject(ToastService);
  @Input() medias: Media[] = [];
  @Input() isVisible: boolean = false;
  @Input() selectedMedias: Media[] = [];
  @Output() selectedMediasEvent = new EventEmitter<Media[] | null>();

  isCreatorVisible: boolean = false;

  @ViewChildren('CheckboxMedia') checkboxes!: ElementRef<HTMLInputElement>[];

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

  selectMedia(media: Media) {
    // add or remove the media
    if (!this.selectedMedias.includes(media)) {
      this.selectedMedias.push(media);
      this.ToggleCheckbox(media, true);
    } else {
      this.selectedMedias = this.selectedMedias.filter((m) => m.id != media.id);
      this.ToggleCheckbox(media, false);
    }
    // check the checkbox mathcing the media id
    console.log(this.selectedMedias); 
  }

  private ToggleCheckbox(media: Media, value: boolean) {
    let box = this.checkboxes.find((checkbox: ElementRef<HTMLInputElement>) => checkbox.nativeElement.value == media.id.toString());
    console.log(box, this.checkboxes, media)
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
    if (media){
      this.medias.push(media);
      this.toastService.Show("Media Created", `Media ${media.name} created successfully`, ToastTypes.SUCCESS, 3000);
    }
    this.isCreatorVisible = false;
  }
}
