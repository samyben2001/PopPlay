import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  protected currentPage: number = 1
  protected maxPages: number = 1
  protected pages: number[] = []
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>()

  @Input() onePageVisible: boolean = false
  @Input() itemsPerPage: number = 6
  private _nbItems: number = 0
  @Input() set nbItems(nbItems: number) {
    this._nbItems = nbItems
    this.maxPages = Math.ceil(nbItems / this.itemsPerPage)
    this.pages = []
    for (let i = 1; i <= this.maxPages; i++) {
      this.pages.push(i)
    }
  }

  get nbItems() {
    return this._nbItems
  }


  previous() {
    this.currentPage--;
    this.pageChanged.emit(this.currentPage)
  }
  goToPage(page: number) {
    this.currentPage = page
    this.pageChanged.emit(page)
  }
  next() {
    this.currentPage++;
    this.pageChanged.emit(this.currentPage)
  }
}
