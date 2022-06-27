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
import {WebsiteMetadataModel} from "./websource.model";


export type ChromeTab = {
  executeScript: (args: any, callback: (_: any) => any) => any
  favIconUrl: any
  query: (_: any) => any
  reload: () => any
  id: any
  title: string
  url: string
  selectedText: string
  accessLink: string
  metadata: WebsiteMetadataModel
  remove: () => any
  sendMessage: () => any
  setZoom: () => any
  setZoomSettings: () => any
  ungroup: () => any
  update: () => any
}

export type FirefoxTab = {
  query: any;
}
