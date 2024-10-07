import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { Media } from '../../../models/models';
import { MediaCreatorComponent } from '../media-creator/media-creator.component';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [MediaCreatorComponent],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css'
})
export class MediaSelectorComponent implements OnInit, AfterViewInit {
  @Input() medias: Media[] = [];
  @Input() isVisible: boolean = false;
  selectedMedias: Media[] = [];
  @Output() selectedMediasEvent = new EventEmitter<Media[]>();

  isCreatorVisible: boolean = false;

  @ViewChildren('CheckboxMedia') checkboxes!: ElementRef<HTMLInputElement>[];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.checkboxes);
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
    if (box)
      box.nativeElement.checked = value;
  }

  private ResetCheckboxes() {
    this.checkboxes.forEach((checkbox: ElementRef<HTMLInputElement>) => checkbox.nativeElement.checked = false);
  }

  openMediasCreator() {
    this.isCreatorVisible = true;
  }

  submit() {
    this.selectedMediasEvent.emit(this.selectedMedias);
    this.ResetCheckboxes();
    this.selectedMedias = [];
  }
}
