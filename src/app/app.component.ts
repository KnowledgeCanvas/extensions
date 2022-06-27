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
import {Component} from '@angular/core';
import {ChromeExtensionService} from "./services/chrome-extension.service";
import {IpcService} from "./services/ipc.service";
import {ChromeTab} from "./models/tab.model";
import {KnowledgeSource} from "./models/knowledge.source.model";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  template: `
    <div class="kc-extension-popup">
      <app-card [ks]="ks"
                (onImport)="import($event)"
                [loading]="sending"
                [disabled]="kcUnavailable"
      ></app-card>
    </div>

    <!--    <p-card>-->
    <!--      <ng-template pTemplate="header">-->
    <!--        <div class="flex flex-row align-items-center justify-content-center">-->
    <!--          <input [(ngModel)]="packet.metadata.title"-->
    <!--                 pInputText-->
    <!--                 class="p-fluid w-full">-->
    <!--        </div>-->
    <!--      </ng-template>-->


    <!--      <div class="p-grid kc-extension-popup">-->
    <!--        <div class="col-12" *ngIf="packet?.selectedText">-->
    <!--          <p-checkbox [(ngModel)]="includeHighlightedText" class="mb-4" [binary]="true" label="Include Highlighted Text"></p-checkbox>-->
    <!--          <textarea class="w-full" id="selectedText" [disabled]="!includeHighlightedText" rows="5" [(ngModel)]="packet.selectedText"></textarea>-->
    <!--        </div>-->

    <!--    TODO: Eventually provide the ability to select a project directly from the extension-->

<!--    <div *ngIf="kcUnavailable" class="col-12">-->
<!--      <div class="flex justify-content-center align-items-center text-red-500">-->
<!--        Knowledge Canvas Unavailable<br>-->
<!--        Make sure "Browser Extensions" is enabled in the Import Settings menu-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="col-12 flex justify-content-center align-items-center">-->
<!--      <button pButton-->
<!--              icon="pi pi-plus"-->
<!--              class="w-full p-fluid shadow-5"-->
<!--              [disabled]="kcUnavailable"-->
<!--              [loading]="sending"-->
<!--              pTooltip="Import"-->
<!--              tooltipPosition="top"-->
<!--              (click)="import($event)"></button>-->
<!--    </div>-->

  `,
  styles: [
    `
      #medium-editor::-webkit-scrollbar {
        display: none;
      }
    `,
    `
      body {
        background-color: var(--surface-0);
        overflow: auto;
      }
    `,
    `
      .kc-extension-popup {
        width: 420px;
        background-color: var(--surface-0);
      }
    `
  ]
})
export class AppComponent {
  sending: boolean = false;
  kcUnavailable: boolean = false;
  includeHighlightedText: boolean = true;

  ks: KnowledgeSource = {
    metadata: [],
    title: '',
    description: '',
    icon: '',
    iconUrl: '',
    ingestType: '',
    snippet: '',
    rawText: '',
    flagged: false,
    topics: [],
    accessLink: '',
    thumbnail: ''
  }

  constructor(private chrome: ChromeExtensionService, private ipc: IpcService, private sanitizer: DomSanitizer) {
    // TODO: Automatically extract other tags like `article` and `code`, then display to the user as optional
    this.chrome.getCurrentTab()
      .then(this.chrome.getSelectedText)
      .then(this.chrome.getMetadata)
      .then((tab: ChromeTab) => {
        console.log('Got Chrome Tab: ', tab);

        this.ks = {
          thumbnail: '',
          title: tab.title,
          description: '',
          accessLink: tab.url,
          iconUrl: tab.favIconUrl,
          icon: tab.favIconUrl,
          rawText: tab.selectedText,
          topics: [],
          ingestType: 'website',
          metadata: []
        }

        if (tab.favIconUrl) {
          fetch(tab.favIconUrl).then((response) => {
            response.blob().then((iconBlob) => {
              let objectURL = URL.createObjectURL(iconBlob);
              let icon = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              console.log(`Got ks icon: ${icon} from iconURL: ${tab.favIconUrl}`);
              this.ks.icon = icon;
            })
          }).catch((reason) => {
            console.log('Failed to fetch icon because: ', reason);
          })
        } else {
          this.ks.iconUrl = tab.url
          this.ks.icon = 'assets/kc-icon-greyscale.png'
        }

        if (tab.metadata.meta) {
          this.ks.metadata = tab.metadata.meta;

          for (let m of tab.metadata.meta) {
            if (m.key == 'og:image') {
              this.ks.thumbnail = m.value ?? m.property ?? '';
            } else if (m.key == 'og:description') {
              this.ks.description = m.value ?? m.property ?? '';
            }

            if (m.key == 'keywords') {
              this.ks.topics = m.value?.split(',');
            }
          }
        }
      })
  }

  async import($event: any) {
    this.sending = true;

    // Remove selected text if the user does not want it included
    if (!this.includeHighlightedText) {
      this.ks.rawText = undefined;
    }

    // Send packet
    this.ipc.send(this.ks).then(() => {
      setTimeout(() => {
        this.sending = false;
      }, 1500);
    }).catch(() => {
      console.log('Unavailable...');
      this.sending = false;
      this.kcUnavailable = true;

      setTimeout(() => {
        this.kcUnavailable = false;
      }, 5000);

    })
  }
}
