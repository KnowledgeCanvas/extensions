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
import {WebsiteMetadataModel, WebsiteMetaTagsModel} from "../models/websource.model";

@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionService {
  constructor() {
  }

  async getCurrentTab() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('Chrome Tab retrieved: ', tab);
    return tab;
  }

  /**
   * @param tab
   */
  async getMetadata(tab: ChromeTab) {
    let metadata: WebsiteMetadataModel = {
      title: tab.title,
      meta: [],
    };

    try {
      let result, title;

      if (tab.title && tab.title.trim() != '') {
        title = tab.title;
      } else {
        [{result}] = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          function: () => {
            let titleTags = document.getElementsByTagName('title');
            return titleTags && titleTags.length > 0 ? titleTags[0].innerText : '';
          }
        });
        title = result;
      }

      console.log('Metadata title: ', title);
      metadata.title = title;
    } catch (e) {
      // TODO:
      console.log('Could not get title: ', e);
    }

    try {
      let result;
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => {
          let metatags: WebsiteMetaTagsModel[] = [];
          let meta = document.getElementsByTagName('meta');

          for (let i = 0; i < meta.length; i++) {
            console.log(`Meta[${i}] = `, meta[i]);

            let names = [
              meta[i].name,
              meta[i].attributes.getNamedItem('property')?.textContent,
            ].filter(n => n);

            const isTarget = names.some(n => n && (
              n.startsWith('og:') || /* OpenGraph */
              n.startsWith('dc:') || /* Dublin Core */
              (n.startsWith('twitter:') && !n.startsWith('twitter:app:')) || /* Twitter (but not app) */
              n.startsWith('description') || /* Description */
              n.startsWith('article:') || /* Articles */
              n.startsWith('keywords') /* Keywords */
            ));

            if (isTarget) {
              let contents = [
                meta[i].content,
              ].filter(c => c);

              for (let name of names) {
                for (let content of contents) {
                  metatags.push({
                    key: name,
                    value: content,
                    property: ''
                  });
                }
              }
            }
          }
          console.log('Returning metatags: ', metatags);
          return metatags
        }
      });
      console.log('Got metatags: ', result);
      metadata.meta = result;
    } catch (e) {
      // TODO:
      console.error('Unable to get metatags...: ', e);
    }

    tab.metadata = metadata;
    return tab;
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
