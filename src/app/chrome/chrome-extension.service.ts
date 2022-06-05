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
import { Injectable } from '@angular/core';
import {ExtensionPacket} from "../models/packet.model";
import {ChromeTab} from "../models/tab.model";


@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionService {
  constructor() { }

  async getCurrentTab() {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  async getSelectedText(tab: ChromeTab) {
    let result;
    try {
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        // @ts-ignore
        function: () => getSelection().toString(),
      });

      const packet: ExtensionPacket = {
        favIconUrl: tab.favIconUrl,
        selectedText: result,
        title: tab.title,
        url: tab.url
      }

      return packet;
    } catch (e) {
      // ignoring an unsupported page like chrome://extensions
    }
    return undefined;
  }
}
