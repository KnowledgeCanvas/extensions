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
import {Injectable} from '@angular/core';
import {ChromeTab} from "../models/tab.model";
import {WebsiteMetadataModel} from "../models/websource.model";


@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionService {
  constructor() {
  }

  async getCurrentTab() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  async getMetaTags(tab: ChromeTab) {
    let result;
    try {
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => {
          console.log('Attempting to get meta tags, document: ', document);
          let metadata: WebsiteMetadataModel = {};
          // Meta Tags
          let meta = document.getElementsByTagName('meta');
          if (meta && meta.length) {
            let extractedMeta = [];
            for (let i = 0; i < meta.length; i++) {
              // Charset tag
              if (meta[i].attributes && meta[i].attributes[0].name === 'charset') {
                extractedMeta.push({key: 'charset', value: meta[i].attributes[0].textContent, property: ''})
              }

              // Open Graph tags
              if (meta[i]?.attributes[0]?.textContent?.startsWith('og:')) {
                let val = '';
                if (!meta[i].attributes[1]?.textContent?.startsWith('og:')) {
                  val = meta[i].attributes[1].textContent ?? '';
                } else {
                  val = meta[i].attributes[2].textContent ?? '';
                }

                if (val !== '') {
                  let attr = {
                    key: meta[i].attributes[0]?.textContent,
                    value: val,
                    property: ''
                  };
                  extractedMeta.push(attr);
                  if (attr.key === 'og:title' && attr.value) {
                    metadata.title = attr.value;
                  }
                }
              }
            }
            metadata.meta = extractedMeta;
          }
          return metadata;
        }
      });
      tab.metadata = result;
      return tab;
    } catch (e) {
      return tab;
    }
  }

  async getSelectedText(tab: ChromeTab) {
    let result;
    try {
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        // @ts-ignore
        function: () => getSelection().toString()
      });
      tab.selectedText = result;
      return tab;
    } catch (e) {
      // ignoring an unsupported page like chrome://extensions
      return tab;
    }
  }
}
