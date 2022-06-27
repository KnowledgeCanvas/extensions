import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  template: `
    <div *ngIf="!thumbnail"
         class="flex flex-column align-items-center justify-content-center"
         style="height: 128px; background-color: var(--surface-100); border-radius: 5px">
      <app-icon [icon]="icon ?? ''"></app-icon>
    </div>

    <div class="w-full p-fluid bg-auto">
      <p-image *ngIf="thumbnail" [src]="thumbnail"
               class="flex flex-row align-items-center justify-content-center"
               height="{{height}}px"
               [style]="{'border-radius': '5px', 'max-height': '128px'}"
               [preview]="false">
      </p-image>
    </div>
  `,
  styles: []
})
export class ThumbnailComponent implements OnInit {
  @Input() thumbnail?: string = '';

  @Input() icon?: string = '';

  @Input() height: number = 128;

  constructor() { }

  ngOnInit(): void {
  }

}
