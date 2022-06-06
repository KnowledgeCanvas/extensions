import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <img [src]="icon"
         class="knowledge-source-icon shadow-3 bg-auto"
         width="24"
         alt="Knowledge Source Icon">
  `,
  styles: [`
    .knowledge-source-icon {
      min-width: 32px !important;
      min-height: 32px !important;
      max-width: 32px !important;
      max-height: 32px !important;
      border-radius: 50%;
      overflow: hidden;
    }
  `]
})
export class IconComponent implements OnInit {
  @Input() icon: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

}
