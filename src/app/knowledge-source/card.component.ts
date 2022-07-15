/**
 Copyright 2022 Rob Royce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeSource} from "../models/knowledge.source.model";

@Component({
  selector: 'app-card',
  template: `
    <div style="border: 1px dotted var(--surface-400); border-radius: 5px;">
      <p-card>
        <ng-template pTemplate="content">
          <app-thumbnail [thumbnail]="ks.thumbnail" [icon]="ks.icon"></app-thumbnail>
          <p-tabView>
            <p-tabPanel header="Basic">
              <div class="flex-row-center-between">
                <label for="title">Title</label>
                <input class="w-full p-fluid" id="title" pInputText [(ngModel)]="ks.title" placeholder="Title">
              </div>

              <div class="mt-3">
                <label for="description">Description</label>
                <input class="w-full p-fluid" id="description" pInputText [(ngModel)]="ks.description" placeholder="Description">
              </div>

              <div [style]="{'height':'5rem', 'overflow-y': 'auto', 'overflow-x': 'hidden'}" class="mt-3">
                <label for="topics">Topics</label>
                <p-chips [(ngModel)]="ks.topics"
                         inputId="topics"
                         class="p-fluid w-full"
                         styleClass="ks-topic-chip"
                         [addOnTab]="true"
                         [addOnBlur]="true"
                         [allowDuplicate]="false"
                         placeholder="Topics">
                </p-chips>
              </div>
            </p-tabPanel>
            <p-tabPanel header="Advanced" *ngIf="ks.rawText">
              <div *ngIf="ks.rawText">
                <p-checkbox [(ngModel)]="includeHighlightedText" class="mb-4" [binary]="true" label="Include Highlighted Text"></p-checkbox>
                <textarea pInputTextarea class="w-full" id="selectedText" rows="6" [disabled]="!includeHighlightedText" [(ngModel)]="ks.rawText"></textarea>
              </div>
            </p-tabPanel>
          </p-tabView>

          <div class="flex flex-row justify-content-between align-items-center">
            <app-icon [icon]="ks.icon"></app-icon>
            <p-toggleButton [(ngModel)]="ks.flagged" onIcon="pi pi-flag" offIcon="pi pi-flag"></p-toggleButton>
          </div>
        </ng-template>

        <ng-template pTemplate="footer">
          <button pButton
                  id="importBtn"
                  icon="pi pi-plus"
                  class="w-full p-fluid shadow-5"
                  [disabled]="disabled"
                  [loading]="loading"
                  pTooltip="Import"
                  tooltipPosition="top">
          </button>
        </ng-template>
      </p-card>
    </div>

  `,
  styles: []
})
export class CardComponent implements OnInit {
  @Input() ks: Partial<KnowledgeSource> = {};

  @Input() disabled: boolean = false;

  @Input() loading: boolean = false;

  includeHighlightedText: boolean = true;

  constructor() {

  }

  ngOnInit(): void {
  }
}
