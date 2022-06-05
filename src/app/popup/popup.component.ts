/**
 * Copyright 2022 Rob Royce
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, OnInit} from '@angular/core';
import {ChromeExtensionService} from "../chrome/chrome-extension.service";
import {IpcService} from "../ipc/ipc.service";
import {ExtensionPacket} from "../models/packet.model";

@Component({
  selector: 'app-popup',
  template: `
    <img [src]="icon" alt="Knowledge Canvas Logo">
    <div class="p-grid kc-extension-popup">
      <div class="col-12 flex justify-content-center align-items-center">
        <p-button [loading]="sending" icon="pi pi-download" label="Import" (onClick)="import($event)"></p-button>
      </div>
      <p-divider layout="horizontal"></p-divider>
      <div class="col-12">
        <p-checkbox [(ngModel)]="includeHighlightedText"
                    *ngIf="packet?.selectedText"
                    class="mb-4"
                    [binary]="true"
                    label="Include Highlighted Text">
        </p-checkbox>
        <textarea class="w-full" id="selectedText" [disabled]="!includeHighlightedText" rows="5" *ngIf="packet && packet.selectedText" [(ngModel)]="packet.selectedText"></textarea>
      </div>
    </div>`,
  styles: [
    `body {
      background-color: var(--surface-0);
      max-height: 600px;
      max-width: 800px;
    }

    .kc-header {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
    }

    .kc-extension-popup {
      width: 420px;
      background-color: var(--surface-0);
    }
    `
  ]
})

export class PopupComponent implements OnInit {
  icon: string = 'assets/kc-logo-transparent.svg'
  sending: boolean = false;
  packet?: ExtensionPacket;
  includeHighlightedText: boolean = true;

  constructor(private chrome: ChromeExtensionService, private ipc: IpcService) {
    console.log('Starting chrome extension...');

    this.chrome.getCurrentTab()
      .then(this.chrome.getSelectedText)
      .then((packet: ExtensionPacket | undefined) => {
        if (!packet) {
          return;
        }
        console.log('Selected text: ', packet);
        this.packet = packet
      })
  }

  ngOnInit(): void {
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
      selectedText: this.includeHighlightedText ? this.packet.selectedText : ''
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
    })
  }
}
