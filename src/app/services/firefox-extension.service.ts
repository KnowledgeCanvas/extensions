import {Injectable} from '@angular/core';
import {FirefoxTab} from "../models/tab.model";

@Injectable({
  providedIn: 'root'
})
export class FirefoxExtensionService {

  constructor() {
  }

  async getCurrentTab() {
    let queryOptions = {active: true};
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
  }

  async getSelectedText(tab: FirefoxTab) {
    let result;
    try {
      // TODO: this is different from the Chrome version...
      // [{result}] = await chrome.scripting.executeScript({
      //   target: {tabId: tab.id},
      //   // @ts-ignore
      //   function: () => getSelection().toString(),
      // });
      //
      // const packet: ExtensionPacket = {
      //   favIconUrl: tab.favIconUrl,
      //   selectedText: result,
      //   title: tab.title,
      //   url: tab.url
      // }
      //
      // return packet;
    } catch (e) {
      // ignoring an unsupported page like chrome://extensions
    }
    return undefined;
  }
}
