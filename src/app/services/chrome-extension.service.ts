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


  getMetaTitle = () => {

  }



  /**
   * TODO: finish this, get title, charset, og: and dc: tags
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
      console.log('Trying to get metatags...');
      [{result}] = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => {
          let meta = document.getElementsByTagName('meta');

          console.log('meta tags: ', meta);

          if (!meta || meta.length <= 0) {
            return [];
          }

          let attr: (..._: any) => string | null = (i: number, j: number) => {
            return meta[i]?.attributes[j]?.textContent;
          }

          let matches: (..._: any) => boolean = (target: string, i: number, j: number) => {
            return attr(i, j)?.startsWith(target) ?? false;
          }

          let filterPermute: (..._: any) => string = (target: string, i: number) => {
            let val1 = attr(i, 1) ?? '';
            let val2 = attr(i, 2) ?? '';

            if (val1.startsWith(target)) {
              if (val2.startsWith(target)) {
                return '';
              } else {
                return val2
              }
            } else {
              return val1;
            }
          }

          let metatags: WebsiteMetaTagsModel[] = [];
          let targets: string[] = ['og:', 'dc:', 'keywords']

          // TODO: remove
          console.log('meta tags: ', meta);
          console.log('Targets: ', targets);

          for (let i = 0; i < meta.length; i++) {
            let name = meta[i]?.attributes[0]?.name;
            if (name && name === 'charset') { /* Charset tags */
              metatags.push({
                key: 'charset',
                value: attr(i, 0),
                property: ''
              });
            } else {
              for (let target of targets) {
                if (matches(target, i, 0)) {
                  let val = filterPermute(target, i);
                  if (val !== '' && !val.startsWith(target)) {
                    metatags.push({
                      key: attr(i, 0),
                      value: val,
                      property: ''
                    })
                  }
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
