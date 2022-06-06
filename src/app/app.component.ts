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
import {ExtensionPacket} from "./models/packet.model";
import {ChromeExtensionService} from "./services/chrome-extension.service";
import {IpcService} from "./services/ipc.service";
import {ChromeTab} from "./models/tab.model";

@Component({
  selector: 'app-root',
  template: `
    <app-thumbnail *ngIf="packet && packet.favIconUrl" [icon]="packet.favIconUrl"></app-thumbnail>
    <p-card>
      <ng-template pTemplate="header">
        <div class="flex flex-row align-items-center justify-content-center">
          <h4>{{packet.title | slice:0:42}}{{packet.title.length > 42 ? '...' : ''}}</h4>
        </div>
      </ng-template>

      <div class="p-grid kc-extension-popup">
        <div class="col-12" *ngIf="packet?.selectedText">
          <p-checkbox [(ngModel)]="includeHighlightedText" class="mb-4" [binary]="true" label="Include Highlighted Text"></p-checkbox>
          <textarea class="w-full" id="selectedText" [disabled]="!includeHighlightedText" rows="5" [(ngModel)]="packet.selectedText"></textarea>
        </div>

        <div class="col-12 p-fluid w-full">
          <b>Topics</b>
          <p-chips [(ngModel)]="packet.topics"></p-chips>
        </div>

        <div class="col-12 flex justify-content-center align-items-center">
          <button pButton [disabled]="kcUnavailable" [loading]="sending" pTooltip="Import" tooltipPosition="bottom" type="button" icon="pi pi-plus" class="p-button-rounded shadow-5" (click)="import($event)"></button>
        </div>

        <div class="col-12 flex justify-content-center align-items-center text-red-500">
          <div *ngIf="kcUnavailable">
            Knowledge Canvas Unavailable
          </div>
        </div>
      </div>
    </p-card>
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
  icon: string = 'assets/kc-logo-transparent.svg';
  thumbnail: string = '';
  sending: boolean = false;
  packet!: ExtensionPacket;
  kcUnavailable: boolean = false;
  includeHighlightedText: boolean = true;

  constructor(private chrome: ChromeExtensionService, private ipc: IpcService) {
    this.chrome.getCurrentTab()
      .then(this.chrome.getSelectedText)
      .then(this.chrome.getMetaTags)
      .then((tab: ChromeTab) => {
        const packet: ExtensionPacket = {
          favIconUrl: tab.favIconUrl,
          selectedText: tab.selectedText,
          title: tab.title,
          url: tab.url,
          metadata: tab.metadata
        }
        console.log('Packet: ', packet);
        this.packet = packet

        if (packet.metadata?.meta) {
          for (let m of packet.metadata?.meta) {
            if (m.key == 'og:image') {
              this.thumbnail = m.value ?? m.property ?? '';
            }
          }
        }
      })
  }

  async import($event: any) {
    if (!this.packet) {
      return;
    }
    this.sending = true;

    let packet: ExtensionPacket = {
      title: this.packet.title,
      url: this.packet.url,
      favIconUrl: this.packet.favIconUrl,
      selectedText: this.includeHighlightedText ? this.packet.selectedText : '',
      topics: this.packet.topics,
      metadata: this.packet.metadata
    }

    // Remove selected text if the user does not want it included
    if (!this.includeHighlightedText && this.packet) {
      packet.selectedText = '';
    }

    // Send packet
    this.ipc.send(packet).then(() => {
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
