import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DataTablePagerComponent as SuperDataTablePagerComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-datatable-pager',
  template: `
    <ul class="pager">
      <li [class.disabled]="!canPrevious()">
        <a
          href="javascript:void(0)"
          (click)="selectPage(1)">
          <i class="{{pagerPreviousIcon}}"></i>
        </a>
      </li>
      <li [class.disabled]="!canPrevious()">
        <a
          href="javascript:void(0)"
          (click)="prevPage()">
          <i class="{{pagerLeftArrowIcon}}"></i>
        </a>
      </li>
      <li
        class="pages"
        *ngFor="let pg of pages"
        [class.active]="pg.number === page">
        <a
          href="javascript:void(0)"
          (click)="selectPage(pg.number)">
          {{pg.text}}
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a
          href="javascript:void(0)"
          (click)="nextPage()">
          <i class="{{pagerRightArrowIcon}}"></i>
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a
          href="javascript:void(0)"
          (click)="selectPage(totalPages)">
          <i class="{{pagerNextIcon}}"></i>
        </a>
      </li>
    </ul>
  `,
  host: {
    class: 'datatable-pager'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTablePagerComponent extends SuperDataTablePagerComponent {
  @Input() override pagerLeftArrowIcon: string = 'icon-left';
  @Input() override pagerRightArrowIcon: string = 'icon-right';
  @Input() override pagerPreviousIcon: string = 'icon-prev';
  @Input() overridepagerNextIcon: string = 'icon-skip';

  @Input()
  override set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  override get size(): number {
    return this._size;
  }

  @Input()
  override set count(val: number) {
    this._count = val;
    this.pages = this.calcPages();
  }

  override get count(): number {
    return this._count;
  }

  @Input()
  override set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();
  }

  override get page(): number {
    return this._page;
  }

  override get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  @Output() override change: EventEmitter<any> = new EventEmitter();

  public _visiblePagesCount: number = 3;

  @Input()
  set visiblePagesCount(val: number) {
    this._visiblePagesCount = val;
    this.pages = this.calcPages();
  }

  get visiblePagesCount(): number {
    return this._visiblePagesCount;
  }

  override _count: number = 0;
  override _page: number = 1;
  override _size: number = 0;
  override pages: any;

  override canPrevious(): boolean {
    return this.page > 1;
  }

  override canNext(): boolean {
    return this.page < this.totalPages;
  }

  override prevPage(): void {
    this.selectPage(this.page - 1);
  }

  override nextPage(): void {
    this.selectPage(this.page + 1);
  }

  override selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;

      this.change.emit({
        page
      });
    }
  }

  override calcPages(page?: number): any[] {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = this.visiblePagesCount;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: <string><any>num
      });
    }

    return pages;
  }
}
